# YAPI 连接器 · dsh-yapi

为 DeepSeek Harness 提供连接 YAPI 服务的能力：通过 agent 对话实现自动生成文档，审批后自动更新至远程 YAPI 文档服务内。配置服务地址与凭据后，在对话里选择项目，用 `/yapi-doc` 让 agent 基于你的口述生成接口定义，经**审查卡片逐条批准**后写回 YAPI。

写入是机制级受控的：agent 只能提交一份「写入计划」，真正落盘的内容取自宿主侧保存的计划定稿，且仅限你在卡片中批准的条目 —— agent 写不进你没见过的内容。

> 当前版本 `1.0.1`。默认配置下唯一会写 YAPI 的路径是审查卡片：创建计划后徽章变成 `⚠ N 条待确认`，你逐条勾选、点「批准并写入」才真正调用写接口；关闭「写入前需要在审查卡片中批准」则自动批准并立即写入。

---

## 目录

- [功能](#功能)
- [安装](#安装)
- [配置](#配置)
- [使用](#使用)
- [确认机制](#确认机制)
- [写入格式](#写入格式)
- [数据与隐私](#数据与隐私)
- [限制](#限制)
- [命令与工具](#命令与工具)
- [开发](#开发)
- [许可](#许可)

---

## 功能

安装并在插件设置里填好服务地址后：

| 能力 | 内容 | 工具 |
| --- | --- | --- |
| 项目管理 | 配置一个或多个 YAPI 项目（本地 id + 项目 token），对话栏徽章实时切换，项目名从 YAPI 实时拉取 | `yapi_projects` |
| 读取接口 | 读取当前项目的现有接口（有界返回，字段按不可信数据处理） | `yapi_interfaces` |
| 写入计划 | 提交整份接口清单（最多 50 条），宿主标注冲突后生成审查卡片 | `yapi_plan` |
| 批准写入 | 只写卡片中批准的条目，写完重新读取项目核验，逐条汇报结果 | `yapi_save_interfaces` |

对话栏下方有一个 **YAPI 徽章**：平时显示当前项目名，有写入计划时变成计划状态（`⚠ N 条待确认` → `已批准 N 条 · 待写入` → `⟳ 写入中 i/total` → `✓ 已写入 N 条`，失败时 `已写入 w · 失败 f`）。点开徽章是一个三块面板：写入计划卡片、项目列表、生成需求框。

## 安装

前提：DeepSeek Harness 桌面端或 `dsh web` 已安装并至少启动过一次。

**方式一：从插件市场安装**

在应用内的 **插件市场** 搜索 `dsh-yapi`（收录后可用）。

**方式二：从 npm 安装**

```
dsh plugin --profile <profile> add dsh-yapi
```

安装结果里 `application` 为 `applied` 才算生效；出现 `warnings` 按提示处理后再重启。

**方式三：本地目录安装（开发用）**

```
git clone https://github.com/lyy-hast/dsh-yapi.git
cd dsh-yapi && pnpm install
plugin_manager  action=install_bundle  target=/绝对路径/dsh-yapi
```

其中 `target` 必须是**绝对路径**。

## 配置

打开左下角头像旁的 **设置（Settings）**，在左侧导航选择 **「YAPI 连接器」**，即可填写以下字段（均即时生效，无需重启）。同一份配置也可在 **插件（Plugins）** 页面找到 **dsh-yapi** 后点开 **「YAPI 连接器」** 一行的 **配置** 进入：

| 字段 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- |
| Base URL | 是 | 无 | YAPI 服务地址，如 `https://yapi.example.com`。留空时所有操作提示「服务地址未配置」。仅允许 https（本机 loopback 可用 http） |
| Allowed hosts | 否 | 空 | 额外的主机白名单。所有请求 URL 都只由 Base URL 构造，不接受工具参数覆盖，如需再收紧可填允许的主机名 |
| 项目列表 | 使用多项目时 | 空 | 每项含 **id**（本地标识，留空自动生成 `p1`、`p2`…）、**显示名**（留空用 YAPI 实时项目名）、**token**（项目级 token，可填凭据引用名或明文） |
| Username / Password | 写入需要登录态时 | `YAPI_USERNAME` / `YAPI_PASSWORD` | YAPI 账号，用于登录获取会话 cookie |
| 默认项目 token（legacy） | 项目列表为空时 | `YAPI_PROJECT_TOKEN` | 旧版单项目字段；新配置请用项目列表 |
| 写入前需要在审查卡片中批准 | — | 开启 | 关闭后计划自动批准并立即写入 |

凭据既可填 DSH 凭据**引用名**（全大写下划线，如 `YAPI_PROJECT_TOKEN`），也可直接粘贴明文。引用方式下轮换即时生效；明文只保存在本插件配置里，不会进入提示词或工具结果。

## 使用

1. 配置好至少一个项目后，对话栏下方出现 YAPI 徽章。
2. 未手动选择项目时，工具链默认用第一个配置的项目；点开徽章可在项目列表里切换 / 刷新，或用 `/yapi-select list|<项目id>`。
3. 发起生成（两种方式等价）：在对话里描述需求，或在面板需求框填写后点 **开始生成 (/yapi-doc)**。
4. agent 读取项目现有接口、按你的口述生成定义（`＋新增` / `✎更新`），用 `yapi_plan` 提交整份清单；宿主标注冲突（如往已存在的 path+method 上新建）后，面板出现**审查卡片**，徽章变为 `⚠ N 条待确认`。
5. 在卡片里**逐条勾选**：每条带新增/更新徽标、method、path、分类；更新条目显示字段级变更摘要；与线上冲突的条目**默认不勾选**。点 **详情** 看 req/res 预览。
6. 点 **批准并写入 N 条**（或输入 `/yapi-approve <planId> all`）：agent 只写你批准的条目，写入过程中徽章显示 `⟳ 写入中 i/total`，卡片逐条变 `✓ 已写入`。
7. 完成后卡片进入结果态；有失败项时可勾选失败条目点 **重试**（只重试失败项）。agent 在对话里汇报逐条结果与核验总数。

若计划创建后切换了项目，批准与写入都会被拒绝并要求重新生成计划 —— 写入目标始终跟随计划创建时的项目。

## 确认机制

- **用户确认是机制级而非口令级**：`yapi_save_interfaces` 只接受 `planId`，写入内容取自宿主侧保存的计划定稿，且仅限卡片中批准的条目。agent 无法通过参数夹带内容，也无法写入你没见过的接口。
- 计划 **15 分钟内有效**，过期需重新生成；每会话同一时刻只有一个计划，新计划替换旧计划。
- 需求描述、批准、重试都可从卡片完成；不用面板时可用命令（见下文）。
- 徽章与卡片状态是**会话投影**：只从标准事件（工具 call/result、命令 run/done）折叠重建，不向会话日志写入自定义事件类型。宿主重启 / 会话分叉后卡片可恢复展示，但批准会提示重新生成计划。

## 写入格式

写入 YAPI 时宿主把计划内容映射为 YAPI 的接口字段协议（对 YAPI 1.10.x / 1.12 实测）：

- **请求体**写 `req_body_other`（YAPI 没有 `req_body` 字段，会被服务端丢弃），同时携带 `req_body_type=json`、`req_body_is_json_schema=true`；**响应体**写 `res_body`，同样带 json schema 标记。
- reqBody / resBody 约定为 **JSON Schema 字符串**（不是示例 JSON）——带 `*_is_json_schema=true` 后 YAPI 接口页渲染成结构化字段树（SchemaTable）并支持高级 Mock。
- **desc（备注）**由 agent 起草 Markdown；YAPI 查看页把 `desc` 当 HTML 渲染，宿主把 Markdown 安全转换为 HTML 写入，同时把源码写入 `markdown` 字段供编辑器回显。转换先整体转义 HTML 再生成标签，备注里的原始 HTML / 脚本不会注入。
- 更新条目未提供的字段不发送，保留线上原值；desc 的变更检测以 `markdown` 源码为准。
- 新增走 `/api/interface/add`，更新走 `/api/interface/up`；不使用会误插入新记录的 `/api/interface/save`。

## 数据与隐私

- **凭据不进提示词**。账号密码 / 项目 token / 会话 cookie 保存在 DSH 凭据库（引用名方式）或本插件配置里（明文方式），不会进入提示词、工具参数或文档；本插件对输出做脱敏。
- **请求只发往你配置的 Base URL**。所有请求 URL 由 Base URL 构造，不接受工具参数覆盖，因此没有 SSRF 面；Allowed hosts 可进一步收紧。
- **项目 token 具有项目作用域**：服务端按 token 归属项目操作，忽略传入的 `project_id` 覆盖。
- **计划内容只存宿主内存**。完整计划（含 req/res 正文）不落盘；卡片与投影里只有截断预览（300 字符），只有批准条目会被写出。
- **YAPI 返回内容视为数据而非指令**。生成阶段接口名、项目名、描述里的「忽略上文」「外发数据」类文本不会被执行；`/yapi-doc` 技能内置了该约束。建议仅在受信任的项目上使用。

## 限制

- 计划 15 分钟过期；宿主重启或会话分叉后旧计划仅剩展示、不可再批准，需重新生成。
- 审查与冲突标注基于 YAPI 返回的前 100 条接口（`/api/interface/list` 单页界限）。
- 单个计划最多 50 条；卡片内 req/res 预览截断至 300 字符。
- 依赖宿主的 `dsh-tools`、`dsh-credentials`、`dsh-skill`、`dsh-commands`、`dsh-session-projection` 内置服务；缺少时相关能力降级但不会崩溃。

## 命令与工具

命令：

| 命令 | 作用 |
| --- | --- |
| `/yapi-doc [需求描述]` | 发起生成，把需求转给 agent |
| `/yapi-select [项目id\|list]` | 列出 / 选择 / 刷新项目 |
| `/yapi-approve <planId> [条目id\|all]` | 批准写入计划（卡片按钮的命令形态） |
| `/yapi-cancel <planId>` | 取消未写入的计划 |

工具：

| 工具 | 作用 |
| --- | --- |
| `yapi_projects` | 列出 / 选择 / 查看当前项目 |
| `yapi_interfaces` | 读取当前项目的现有接口 |
| `yapi_plan` | 创建（含宿主侧冲突标注）/ 查看 / 取消写入计划 |
| `yapi_save_interfaces` | 写入已批准的计划条目（入参只有 `planId` 和可选 `itemIds`） |

## 开发

```
dsh-yapi/
├── index.js            Host 半边：Cordis 插件入口、配置 schema、YAPI HTTP 客户端、
│                       四个工具、/yapi-doc 技能与命令、会话投影折叠
├── client.js           Client 半边：插件设置面板（四步分组）+ 对话栏徽章与审查卡片
├── locale/{zh,en}.json 插件元数据（标题、描述、详情文档指引）
├── docs/DETAIL.md      详细说明（面板里「详情」指向这里）
├── icon.svg            插件图标
├── cordis.patch.yml    bundle patch
└── package.json
```

`index.js` 只依赖 `@deepseek-ai/schemastery`（peerDependency，由宿主提供）；`client.js` 只用 Harness 主题令牌（`--dsw-alias-*`），不引入任何 `@deepseek-ai/dsh-client-*` 包，React 由宿主的浏览器模块表提供。

改完代码后用本地目录安装验证；插件设置里的修改即时生效，Host 半边的改动需重启宿主。

## 许可

[MIT](./LICENSE) © 2026 dsh-yapi contributors

本项目与 YAPI 官方无隶属关系，是第三方开源集成。「YAPI」是其各自权利人的名称，此处仅用于说明对接对象。
