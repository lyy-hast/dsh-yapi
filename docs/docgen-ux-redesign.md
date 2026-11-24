# 方案：YAPI 生成文档交互重设计

> **状态：P1–P3 已实现**（机制级确认、审查卡片、逐条进度与失败重试）；P4（转录区卡片、
> 卡片上选分类）为后续可选项。实现见 `index.js` / `client.js`，用户文档见 `docs/DETAIL.md`。
>
> **2026-11 追加（按类注释分文件夹）**：接口文档不再平铺在项目根目录。`yapi-doc` 技能要求 agent 从每个接口对应类的 Javadoc 首行提取文件夹名填入 `category`；宿主在 `annotatePlan` 按名称（忽略大小写/空白）匹配已有分类、未命中标记 `newCategory`，在 `yapi_save_interfaces` 写接口前先建文件夹（重名复用、失败逐条上报）再回填 `catid`。审查卡片按文件夹分组并标注「将新建」，结果态列出新建/复用文件夹；未提供 `category`/`catid` 时回落到默认/根分类。详见 `docs/DETAIL.md`。
>
> **2026-11 修订（投影重建）**：初版通过 `session.append('yapi/…')` 推送自定义事件，违反
> 宿主约束（未知非 ignorable 事件会让会话日志拒绝加载）。现已改为 projection 投影
> `stateVersion: 4`，只折叠标准事件（`tool/call`+`tool/result`、`command/run`+`command/done`），
> 宿主侧状态经工具/命令输出里的 `⟪yapi{…}⟫` 标记行进入折叠；picker 项目列表改为本地状态。
> 代价：写入过程中的逐条进度改为结果一次性更新（命令结果会渲染为 flow node，不能用轮询）；
> approve/cancel 改用 `recordInput: true` 记录参数供折叠。已污染的历史日志在
> `~/.dsh/yapi-event-repair-backup-*` 备份后为 `yapi/*` 事件补了 `ignorable: true`。
>
> 目标：把「生成接口文档」从**散落在设置页 / 徽章菜单 / 聊天文本的松散流程**，收敛为
> **「发起 → 生成 → 结构化审查 → 机制级确认 → 写入反馈」**的一条闭环，并把写入确认
> 从提示词约束升级为工具协议约束。

---

## 1. 现状与问题

### 1.1 现状链路

```
插件设置页            输入栏徽章菜单              聊天流
┌──────────┐   ┌──────────────────┐   ┌──────────────────────────┐
│ Base URL │   │ [Y 项目名 ▾]      │   │ (合成用户消息唤醒 agent)   │
│ 项目+token│──▶│  · 项目列表       │──▶│ agent: 文本列出 新增/更新清单 │
│ 凭据     │   │  · 刷新/选择项目   │   │ 用户: 在聊天里打字"确认"     │
└──────────┘   │  · 生成接口文档    │   │ agent: yapi_save_interfaces│
               └──────────────────┘   │ (confirmToken=生成前已签发)  │
                                      └──────────────────────────┘
```

### 1.2 问题清单

| # | 问题 | 严重度 | 现状代码位置 |
|---|------|--------|--------------|
| P1 | **确认是软约束**：`/yapi-doc` 在生成前就签发令牌并置 `plan.confirmed=true`；`yapi_save_interfaces` 只校验令牌存在，写入内容完全由 agent 传参决定，用户确认过的清单和实际写入之间没有机制绑定 | 高（安全/一致性） | `index.js:684-723`、`index.js:781-783` |
| P2 | **审查走纯文本**：清单在聊天里展示，无法逐条勾选/排除、看不到字段级变更、几十条时不可审 | 高（可用性） | skill 流程第 4 步（`index.js:742`） |
| P3 | **无进度反馈**：读取接口 → 生成 → 写入全程，徽章与聊天均无阶段提示 | 中 | — |
| P4 | **plan 只存内存**：`stateBySession` 里的 plan 不走 session projection，resume/fork 后丢失（selection 已可重建，plan 不行） | 中 | `index.js:532-536` |
| P5 | **入口分散且时机尴尬**：点「生成接口文档」若无需求上下文，agent 还要反问一句；需求描述入口（聊天）与发起入口（按钮）割裂 | 中 | `index.js:793` |
| P6 | **误操作无兜底**：agent 把已存在接口标成 `add` 会建重复条目，无 host 侧校验 | 中 | `index.js:716-719` |
| P7 | **失败恢复弱**：批量写入中途失败无逐条结果，只能整批重来 | 低 | `index.js:700-720` |

---

## 2. 设计目标与原则

1. **确认即机制**：用户批准什么，就只能写什么——写入内容取自 host 侧定稿的计划，而非 agent 写入时的传参。
2. **审查结构化**：清单以卡片呈现，逐条勾选、模式徽章、冲突高亮、变更摘要。
3. **一屏闭环**：从发起、审查到结果在同一块 UI（输入栏面板）内完成，聊天只做需求描述与结果叙述。
4. **状态可恢复**：plan 全量走 session projection，fork/resume 不丢。
5. **不改底层写通道**：YAPI API 调用（add/up、脱敏、SSRF 防护）保持不变，只换交互与协议层。

---

## 3. 新交互总览

### 3.1 After 流程

```
┌────────┐   ┌────────────┐   ┌──────────────────┐   ┌────────────┐
│ 1 发起  │   │ 2 生成中    │   │ 3 审查卡片        │   │ 4 写入+结果 │
│ 聊天描述 │──▶│ 徽章显示阶段 │──▶│ 逐条勾选/看冲突    │──▶│ 逐条状态     │
│ 或面板输入│   │ reading…   │   │ [批准 N 条] [取消] │   │ 失败可重试   │
└────────┘   └────────────┘   └──────────────────┘   └────────────┘
     ▲                                                    │
     └────────────── 需求补充 / 重试 / 换项目重来 ────────────┘
```

时序（关键变化加粗）：

1. **发起**：用户在聊天里描述需求（"把登录和注册接口补到 test 项目"），或在徽章面板的需求框里填写后点「开始生成」→ 执行 `/yapi-doc <notes>` 唤醒 agent。
2. agent 调 `yapi_interfaces` 读取现有接口，生成定义后调**新工具 `yapi_plan`（action=create）**。
3. host 创建计划：**重新拉取接口列表做 host 侧冲突标注**（path+method 已存在却标 add 的条目标记 `conflict` 并建议改为 update），plan 置为 `pending`，通过 projection 推送 `yapi/plan` 快照。
4. **审查卡片出现**（输入栏徽章变为「⚠ N 条待确认」并自动展开一次面板）：逐条勾选、看冲突与变更摘要。
5. 用户点「批准并写入 N 条」→ 客户端执行 **`/yapi-approve <planId> [itemIds|all]`** → host 校验 plan 未过期、项目未切换后置 `approved`，followup 唤醒 agent。
6. agent 调 **`yapi_save_interfaces` v2：`{ planId, itemIds }`**——不再传接口内容，host 只写 plan 中**被批准的条目**，内容取自 plan 定稿；逐条写入并推送进度快照；写完核验总数。
7. 卡片进入结果态：每条 `已写入/失败`，失败项可勾选重试（再次 approve 仅含失败 id）。

### 3.2 Before / After 对比

| 维度 | 现状 | 新方案 |
|------|------|--------|
| 确认强度 | 令牌在生成前签发，写入内容不绑定用户所见 | **写入内容 = plan 定稿 ∩ 用户批准的 itemIds** |
| 清单审查 | 聊天纯文本 | 结构化卡片：勾选、冲突高亮、预览 |
| 需求入口 | 按钮和聊天割裂，常被反问一轮 | 聊天直接说，或面板需求框一键发起 |
| 进度 | 无 | 徽章 + 卡片显示阶段与计数 |
| resume/fork | plan 丢失 | plan 走 projection 重建 |
| 失败恢复 | 整批重来 | 逐条状态 + 仅重试失败项 |
| 误建重复 | 无兜底 | host 侧冲突标注 + 卡片高亮 |

---

## 4. 详细设计

### 4.1 入口与发起

- **主路径（聊天）**：用户直接描述需求，agent 自主走 `yapi_interfaces → yapi_plan`，卡片随之出现。`/yapi-doc` 不再是必经入口。
- **辅助路径（面板需求框）**：徽章菜单底部提供需求输入框 + 「开始生成」按钮，等价执行 `/yapi-doc <notes>`（notes 语义沿用现有 `rawInput`，截断 1000 字）。用于冷启动 / 明确想走一遍流程的场景。
- **`/yapi-doc` 语义收缩**：从"签发写入令牌"变为"发起生成 + 携带需求"，不再签发任何令牌；文本结果指引后续审查卡片。

### 4.2 项目选择（徽章简化）

- 徽章保留：显示当前项目名；有 plan 时显示状态优先（`⚠ 3 条待确认` / `⟳ 写入中 2/5` / `✓ 已写入 5 条`），项目名退居 secondary。
- 菜单精简为三块：项目列表（切换）、需求输入框（发起）、无 plan 时的帮助文案。原「刷新 / 选择项目」合并进项目列表的刷新图标。

### 4.3 审查卡片（核心 UI）

渲染位置：**输入栏 dock 面板**（沿用现有 `conversation.composer.dock` slot，已验证可行）；若后续 harness 提供转录区 slot，可升级为聊天内卡片（见 §7 P4）。

```
┌─ YAPI 文档写入计划 · 项目: 测试服务 (test) ─────────── [×] ─┐
│                                                            │
│ ☑ ＋新增  GET  /api/login        用户登录        [详情 ▾]   │
│ ☑ ＋新增  POST /api/register     用户注册        [详情 ▾]   │
│ ☑ ✎更新  PUT  /api/user/{id}     更新用户信息 ⚠与线上重叠   │
│           └ 变更: title、req_body 变更；path/method 未变     │
│ ☐ ＋新增  POST /api/login        用户登录2 ⚠与已有接口重复    │
│           └ 已存在 GET /api/login，建议改用「更新」或移除     │
│                                                            │
│ 已选 3 / 4 条 · 1 条冲突默认未勾选                           │
│ [ 批准并写入 3 条 ]                              [ 取消 ]    │
└────────────────────────────────────────────────────────────┘
```

要点：

- **每条**：勾选框 + 模式徽章（＋新增 / ✎更新）+ method chip + path + title + [详情▾]（展开 `req_body/res_body` 截断预览，上限 300 字符/项）。
- **冲突高亮**：host 标注的 `conflict` 条目默认**不勾选**并显式说明；`update` 条目显示字段级变更摘要（title/path/req/res 哪些变了，未变字段不展示）。
- **勾选默认值**：新增默认勾选、更新默认勾选、冲突默认不勾选。
- **自动展开**：plan 进入 `pending` 时面板自动展开一次（可在配置里关），此后徽章 pill 常驻可点。
- **边界控制**：单 plan ≤ 50 条（与现有单次写入上限一致）；预览超限截断。

### 4.4 确认与写入（机制级）

**plan 生命周期**：

```
draft ──create──▶ pending ──approve──▶ approved ──写入──▶ done
   ▲                 │                    │                  │
   └──── cancel ─────┴──── 项目切换/过期 ────┴── 失败项重试 ────┘
```

- 每会话至多一个 active plan；新建 plan 自动 cancel 旧的。
- TTL 15 分钟（从 create 起算），过期后 approve 报错并要求重新生成。
- `requireConfirmation=false` 时：create 直接进入 `approved`（自动批准），agent 可立即写入；卡片变为只读结果态。

**工具协议变更**：

```
yapi_plan（新增）
  action=create   items: SAVE_ITEM[]
                  → host 冲突标注、存 plan、推 yapi/plan 事件
                  → 返回 { planId, total, conflicts, summaryText }
  action=get      → 当前 plan 快照
  action=cancel   → 置 cancelled

yapi_save_interfaces（v2）
  入参: { planId: string, itemIds?: string[] }        ← 不再接受接口内容！
  校验: plan 存在 && phase=approved && planId 项目=当前选中项目 && 未过期
        itemIds ⊆ approvedItemIds（缺省 = 全部已批准项）
  写入: 内容取自 plan.items 定稿；逐条 try/catch；每条完成推快照
  返回: { written:[{itemId, id, mode, ok}], failed:[{itemId, error}],
          verifiedCount }
```

安全收益：写入内容由 host 侧存储的计划决定，agent 无法在写入时夹带用户未审过的字段；令牌机制整体移除。

**命令变更**：

| 命令 | 变化 |
|------|------|
| `/yapi-doc [notes]` | 只发起，不发令牌；文本结果引导审查卡片 |
| `/yapi-approve <planId> [itemIds\|all]` | **新增**，卡片按钮调用；校验后置 approved 并 followup agent |
| `/yapi-cancel <planId>` | **新增**，卡片「取消」/超时兜底 |
| `/yapi-select` | 保持不变 |

approve 后的 followup 提示词只包含"已批准条目摘要（模式/路径/title），请调用 yapi_save_interfaces 写入"，不含可被注入的接口内容（内容已在 plan 里）。

### 4.5 进度与结果反馈

- 阶段枚举：`reading → drafting → pending → approved → writing → done/failed`。
- 写入期间每完成一条推送一次 plan 快照（≤50 条，快照体量可控），徽章显示 `⟳ 写入中 i/total`。
- 结果态：每条 `✓已写入`（新增条目附回读到的 YAPI id）/ `✗失败 + 原因`，底部 `核验：项目现有 N 条接口`；「仅重试失败项」按钮复用 approve 通道。
- agent 最后在聊天里做一句话叙述（写给谁、几条成功、失败原因），卡片负责结构化呈现。

### 4.6 异常与边界

| 场景 | 行为 |
|------|------|
| 审查期间切换了项目 | 卡片置灰并提示"目标项目已切换"；approve 被拒绝（沿用现有 projectId 比对，`index.js:694`） |
| plan 过期（>15min） | approve 报错，卡片提供「重新生成」 |
| 批量中途失败 | 已写入的保留，失败项单独列出；approve 失败项 id 即可重试 |
| YAPI 离线 / token 失效 | create 阶段就失败，卡片显示错误与「检查插件设置」指引 |
| resume / fork | plan 走 projection 重建（内存 + 事件双写，`stateVersion` 升到 3） |
| 用户在聊天里口头说"确认" | agent 不再据此写入；回复引导点卡片按钮（保证确认一定来自用户操作） |

---

## 5. 技术实现映射

### 5.1 宿主端 `index.js`

| 改动点 | 内容 |
|--------|------|
| `ai` 状态 | `setPlan/getPlan` 扩展为完整 plan store：`{id, phase, projectId, items[], approvedItemIds, createdAt, expiresAt}` |
| projection 注册 | `stateVersion: 3`；新增 `yapi/plan` 事件（全量快照，JSON-safe，previews 截断）；`view()` 增加 `plan` 字段 |
| 新工具 `yapi_plan` | create（含冲突标注：create 时拉一次接口列表，path+method 匹配则标 `conflict` + 建议改 update）/ get / cancel |
| `yapi_save_interfaces` v2 | 入参改为 `{planId, itemIds}`；内容取自 plan；逐条进度事件；返回逐条结果；旧 `confirmToken` 调用返回迁移指引错误 |
| 命令 | `/yapi-doc` 去令牌化；新增 `/yapi-approve`、`/yapi-cancel` |
| skill 内容 | 流程改为：读接口 → `yapi_plan` create → 等卡片批准 → 收到批准 followup 后带 `{planId}` 写入 |

### 5.2 客户端 `client.js`

| 改动点 | 内容 |
|--------|------|
| `YapiPicker` | 徽章状态优先级（plan 状态 > 项目名）；菜单加需求输入框；移除「生成接口文档」直发按钮 |
| 新组件 `YapiPlanCard` | 从 projection 读 plan；渲染 §4.3 卡片；按钮执行 `/yapi-approve`、`/yapi-cancel`（复用现有 `remote.commands.execute` 通道） |
| 自动展开 | 监听 plan phase `pending` 首次出现时展开面板一次 |
| locale | 新增 `plan.*` 文案（en/zh） |

### 5.3 projection 事件 schema（草案）

```jsonc
// yapi/plan 快照（每次状态变化全量推）
{
  "id": "pl_01HX…",
  "phase": "pending",            // draft|pending|approved|writing|done|failed|cancelled|expired
  "projectId": "test",
  "projectName": "测试服务",
  "createdAt": 1763692800000,
  "expiresAt": 1763693700000,
  "items": [{
    "itemId": "it_1", "mode": "update", "ifaceId": "1234",
    "title": "更新用户信息", "path": "/api/user/{id}", "method": "PUT",
    "category": "用户",
    "conflict": null,             // {reason, existing:"GET /api/login"} 表示冲突
    "changed": ["title", "req_body"],
    "reqPreview": "…≤300字符…", "resPreview": "…≤300字符…",
    "status": "pending"           // pending|written|failed|skipped
  }],
  "result": { "writtenCount": 0, "failedCount": 0, "verifiedCount": 0 }
}
```

---

## 6. 兼容与迁移

- **旧 `confirmToken`**：保留参数位但不再接受，返回错误文案指引新流程（一个版本的过渡期后移除）。
- **projection 升版**：`stateVersion 2 → 3`，旧会话回放无 plan 字段时按 `null` 处理。
- **`requireConfirmation=false`**：语义不变（免确认直接写入），映射为 plan 自动批准。
- **配置项**：新增 `autoOpenReview`（默认 true，控制卡片自动展开）；其余配置不动。

---

## 7. 分期落地

| 阶段 | 内容 | 交付判据 |
|------|------|----------|
| **P1 机制** | plan store + `yapi_plan` 工具 + save v2（协议级强制批准）+ projection v3 + 三个命令 | 不点卡片批准就无法写入任何内容 |
| **P2 卡片** | `YapiPlanCard` 审查/结果态 + 徽章状态 + 需求框发起 | 完整走通 发起→审查→写入→结果 |
| **P3 体验** | 写入进度逐条推送、失败项重试、字段级变更摘要、冲突标注打磨 | 中途失败可只重试失败项 |
| **P4 可选** | 转录区聊天内卡片（需 harness 提供对应 slot）、分类（catid）在卡片上可选、移动端适配 | — |

---

## 8. 备选与取舍

| 决策 | 选择 | 理由 / 放弃项 |
|------|------|---------------|
| 卡片位置 | 输入栏 dock 面板 | 现有 slot 已验证；转录区卡片待 harness 支持后升级（P4） |
| approve 后谁执行写入 | followup agent → agent 调 save 工具 | 保持 agent 在环、由它叙述结果；放弃"命令直写"（更快但绕过 agent，结果叙述与后续对话脱节） |
| plan 内容存 host 内存 | 是（配合 projection 重建） | 换取"写入=审查所见"的强绑定；代价是大 req/res 只能截断进 projection，详情查看走预览 |
| 冲突标注时机 | plan create 时 host 拉一次列表 | 比信任 agent 自查可靠；代价是 create 多一次 YAPI 读请求（有界，可接受） |
