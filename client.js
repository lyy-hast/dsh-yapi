window.__ModuleLoader__.load({
  id: 'dsh-yapi',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const FIELDS = [
      {
        key: 'baseUrl', label: 'config.baseUrl', help: 'config.baseUrlHelp',
        kind: 'text', placeholder: 'https://yapi.example.com',
        group: 'service', required: true, mono: true,
      },
      {
        key: 'allowedHosts', label: 'config.allowedHosts', help: 'config.allowedHostsHelp',
        kind: 'list', placeholder: 'yapi.example.com, docs.example.com',
        group: 'service', mono: true,
      },
      {
        key: 'usernameRef', label: 'config.usernameRef', help: 'config.usernameRefHelp',
        kind: 'text', placeholder: 'yapi-username', group: 'credentials', mono: true,
      },
      {
        key: 'passwordRef', label: 'config.passwordRef', help: 'config.passwordRefHelp',
        kind: 'text', placeholder: 'yapi-password', group: 'credentials', mono: true,
      },
      {
        key: 'tokenRef', label: 'config.tokenRef', help: 'config.tokenRefHelp',
        kind: 'text', placeholder: 'yapi-project-token', group: 'credentials', mono: true,
      },
      {
        key: 'projects', label: 'config.projects', help: 'config.projectsHelp',
        kind: 'projects', group: 'projects',
      },
      {
        key: 'requireConfirmation', label: 'config.requireConfirmation',
        help: 'config.requireConfirmationHelp', kind: 'boolean', group: 'write',
      },
    ]

    // Visual groups; the order here decides the order on the page.
    const GROUPS = [
      { id: 'service', title: 'config.group.service', hint: 'config.group.serviceHint', step: '01' },
      { id: 'projects', title: 'config.group.projects', hint: 'config.group.projectsHelp', step: '02' },
      { id: 'credentials', title: 'config.group.credentials', hint: 'config.group.credentialsHint', step: '03' },
      { id: 'write', title: 'config.group.write', hint: 'config.group.writeHint', step: '04' },
    ]

    const styles = {
      form: {
        boxSizing: 'border-box', width: '100%', maxWidth: '680px',
        display: 'flex', flexDirection: 'column', gap: '18px',
        color: 'var(--dsw-alias-label-primary, inherit)',
        fontFamily: 'inherit', fontSize: '13px', lineHeight: '20px',
      },
      intro: {
        margin: 0, fontSize: '13px', lineHeight: '20px',
        color: 'var(--dsw-alias-label-secondary, inherit)',
      },
      requiredHint: {
        display: 'flex', alignItems: 'center', gap: '4px', margin: '-8px 0 0',
        fontSize: '12px', lineHeight: '18px',
        color: 'var(--dsw-alias-label-tertiary, inherit)',
      },
      section: {
        display: 'flex', flexDirection: 'column', gap: '14px', minWidth: 0,
        padding: '16px 18px',
        border: '0.5px solid var(--dsw-alias-border-l2, rgba(127,127,127,0.25))',
        borderRadius: 'var(--dsw-radius-md, 12px)',
        background: 'var(--dsw-alias-card-fill, transparent)',
      },
      sectionHead: {
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px',
      },
      groupTitle: {
        margin: 0, fontSize: '14px', lineHeight: '20px', fontWeight: 600,
        color: 'var(--dsw-alias-label-primary, inherit)',
      },
      groupHint: {
        margin: '3px 0 0', fontSize: '12px', lineHeight: '18px',
        color: 'var(--dsw-alias-label-tertiary, inherit)',
      },
      step: {
        flex: 'none', padding: '2px 8px', borderRadius: '999px',
        border: '0.5px solid var(--dsw-alias-border-l3, rgba(127,127,127,0.3))',
        color: 'var(--dsw-alias-label-tertiary, inherit)',
        fontSize: '11px', lineHeight: '16px', fontVariantNumeric: 'tabular-nums',
      },
      fields: { display: 'flex', flexDirection: 'column', gap: '14px' },
      field: { display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 },
      label: {
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '13px', lineHeight: '20px', fontWeight: 500,
        color: 'var(--dsw-alias-label-primary, inherit)',
      },
      required: { color: 'var(--dsw-alias-state-error-primary, #d92d20)', fontWeight: 700 },
      optional: {
        marginLeft: 'auto', fontSize: '11px', lineHeight: '16px',
        color: 'var(--dsw-alias-label-tertiary, inherit)',
      },
      input: {
        boxSizing: 'border-box', width: '100%', height: '34px', padding: '0 10px',
        border: '0.5px solid var(--dsw-alias-border-l4, rgba(127,127,127,0.35))',
        borderRadius: 'var(--dsw-radius-sm, 8px)',
        background: 'var(--dsw-alias-bg-layer-1, transparent)',
        color: 'var(--dsw-alias-label-primary, inherit)',
        fontFamily: 'inherit', fontSize: '13px', lineHeight: '20px',
      },
      mono: {
        fontFamily: 'var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
        fontSize: '12px',
      },
      help: {
        margin: 0, fontSize: '12px', lineHeight: '18px',
        color: 'var(--dsw-alias-label-tertiary, inherit)',
      },
      toggleRow: {
        display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '11px 12px',
        border: '0.5px solid var(--dsw-alias-border-l3, rgba(127,127,127,0.3))',
        borderRadius: 'var(--dsw-radius-sm, 8px)',
        background: 'var(--dsw-alias-bg-layer-1, transparent)',
        cursor: 'pointer',
      },
      toggleInput: {
        flex: 'none', width: '16px', height: '16px', margin: '2px 0 0',
        accentColor: 'var(--dsw-alias-state-business-primary, #4169e1)',
      },
      toggleText: { display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 },
      toggleTitle: {
        fontSize: '13px', lineHeight: '20px', fontWeight: 500,
        color: 'var(--dsw-alias-label-primary, inherit)',
      },
      warning: {
        display: 'flex', alignItems: 'flex-start', gap: '8px', margin: 0, padding: '9px 11px',
        border: '0.5px solid var(--dsw-alias-state-warn-primary, #d97706)',
        borderRadius: 'var(--dsw-radius-sm, 8px)',
        background: 'var(--dsw-alias-interactive-bg-hover-danger, rgba(236,19,19,0.05))',
        color: 'var(--dsw-alias-state-warn-label, var(--dsw-alias-state-warn-primary, inherit))',
        fontSize: '12px', lineHeight: '18px',
      },
      warningMark: { flex: 'none', fontWeight: 700 },
      controlDisabled: { opacity: 0.6, cursor: 'default' },
      error: {
        margin: 0, padding: '9px 11px',
        border: '0.5px solid var(--dsw-alias-state-error-primary, #d92d20)',
        borderRadius: 'var(--dsw-radius-sm, 8px)',
        background: 'var(--dsw-alias-interactive-bg-hover-danger, rgba(236,19,19,0.05))',
        color: 'var(--dsw-alias-state-error-primary, #d92d20)',
        fontSize: '12px', lineHeight: '18px',
      },
      footer: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '12px', flexWrap: 'wrap', paddingTop: '14px',
        borderTop: '0.5px solid var(--dsw-alias-border-l2, rgba(127,127,127,0.25))',
      },
      saveHint: {
        margin: 0, fontSize: '12px', lineHeight: '18px',
        color: 'var(--dsw-alias-label-tertiary, inherit)',
      },
      save: {
        flex: 'none', height: '34px', padding: '0 16px',
        border: '0.5px solid transparent',
        borderRadius: 'var(--dsw-radius-sm, 8px)',
        background: 'var(--dsw-alias-button-primary-fill, var(--dsw-alias-brand-primary, #1f1f1f))',
        color: 'var(--dsw-alias-label-primary-inverted, #ffffff)',
        fontFamily: 'inherit', fontSize: '13px', fontWeight: 500, lineHeight: '20px',
        cursor: 'pointer',
      },
      saveDisabled: { opacity: 0.5, cursor: 'default' },
      actionBtn: {
        flex: 'none', height: '30px', padding: '0 12px',
        border: '0.5px solid var(--dsw-alias-border-l3, rgba(127,127,127,0.3))',
        borderRadius: 'var(--dsw-radius-sm, 8px)',
        background: 'transparent', color: 'inherit', fontFamily: 'inherit',
        fontSize: '12px', cursor: 'pointer',
      },
      status: {
        margin: 0, fontSize: '13px', lineHeight: '20px',
        color: 'var(--dsw-alias-label-tertiary, inherit)',
      },
    }

    function toDraft(value) {
      const out = {}
      for (const f of FIELDS) {
        const v = value?.[f.key]
        if (f.kind === 'boolean') out[f.key] = v === true
        else if (f.kind === 'list') out[f.key] = Array.isArray(v) ? v.join(', ') : ''
        else if (f.kind === 'projects') {
          out[f.key] = Array.isArray(v)
            ? v.map(p => ({ id: String(p?.id ?? ''), name: String(p?.name ?? ''), token: String(p?.token ?? '') }))
            : []
        } else out[f.key] = typeof v === 'string' ? v : ''
      }
      return out
    }

    function toValue(f, draft) {
      if (f.kind === 'boolean') return draft[f.key] === true
      if (f.kind === 'list') {
        return String(draft[f.key] || '').split(',').map(s => s.trim()).filter(Boolean)
      }
      if (f.kind === 'projects') {
        return (Array.isArray(draft[f.key]) ? draft[f.key] : [])
          .map(p => ({
            id: String(p?.id ?? '').trim(),
            name: String(p?.name ?? '').trim(),
            token: String(p?.token ?? '').trim(),
          }))
          .filter(p => p.token !== '')
      }
      return String(draft[f.key] ?? '')
    }

    /**
     * YAPI connector configuration on the Plugins page. The host exposes its
     * Config through the generic settings namespace `dsh-yapi`; this slot is
     * what makes the row show a "Configure" control at all.
     */
    function YapiConfig({ view, form, t }) {
      const label = (key, fallback) => (t ? t(key) : fallback)
      if (view === 'summary') {
        return h('span', null, label('config.summary', 'Service address, credentials and write behavior'))
      }
      const state = form?.state
      const [draft, setDraft] = React.useState(() => toDraft(state?.value))
      React.useEffect(() => {
        if (state?.value !== undefined) setDraft(toDraft(state.value))
      }, [state?.value])
      const [busy, setBusy] = React.useState(false)
      const [error, setError] = React.useState(null)
      const uid = React.useId()

      if (state === undefined || state.status === 'loading') {
        return h('p', { style: styles.status }, label('config.loading', 'Loading configuration…'))
      }
      if (state.status === 'unavailable') {
        return h('p', { style: styles.status }, label('config.unavailable', 'Configuration is not available in this profile.'))
      }

      async function save(event) {
        event.preventDefault()
        if (!form || busy) return
        setBusy(true)
        setError(null)
        try {
          const ops = FIELDS
            .filter(f => JSON.stringify(toValue(f, draft)) !== JSON.stringify(state.value?.[f.key]))
            .map(f => ({ op: 'set', path: [f.key], value: toValue(f, draft) }))
          const ok = await form.mutate(ops)
          if (!ok) setError(label('config.saveFailed', 'Save was refused by the host.'))
        } catch (cause) {
          setError(String(cause?.message ?? cause))
        } finally {
          setBusy(false)
        }
      }

      function renderField(f) {
        const fieldId = `${uid}-${f.key}`
        const helpId = `${uid}-${f.key}-help`
        const disabled = busy || state.writable === false
        const value = draft[f.key]
        if (f.kind === 'projects') {
          const rows = Array.isArray(value) ? value : []
          const updateRow = (i, key, text) => setDraft(d => {
            const next = (Array.isArray(d[f.key]) ? d[f.key] : []).map(p => ({ ...p }))
            next[i] = { ...(next[i] || {}), [key]: text }
            return { ...d, [f.key]: next }
          })
          const removeRow = (i) => setDraft(d => ({
            ...d, [f.key]: (Array.isArray(d[f.key]) ? d[f.key] : []).filter((_, idx) => idx !== i),
          }))
          const addRow = () => setDraft(d => ({
            ...d, [f.key]: [...(Array.isArray(d[f.key]) ? d[f.key] : []), { id: '', name: '', token: '' }],
          }))
          return h('div', { key: f.key, style: styles.field },
            h('span', { style: styles.label }, label(f.label, f.key)),
            h('p', { id: helpId, style: styles.help }, label(f.help, '')),
            h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' } },
              rows.map((p, i) => h('div', {
                key: i,
                style: {
                  display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px',
                  border: '0.5px solid var(--dsw-alias-border-l3, rgba(127,127,127,0.3))',
                  borderRadius: 'var(--dsw-radius-sm, 8px)',
                  background: 'var(--dsw-alias-bg-layer-1, transparent)',
                },
              },
                h('div', { style: { display: 'flex', gap: '8px' } },
                  h('input', {
                    type: 'text', value: p.id, disabled,
                    placeholder: label('config.projectIdPh', 'id (e.g. test)'),
                    style: { ...styles.input, ...styles.mono, flex: 1 },
                    'aria-label': label('config.projectId', 'Project id'),
                    onChange: e => updateRow(i, 'id', e.target.value),
                  }),
                  h('input', {
                    type: 'text', value: p.name, disabled,
                    placeholder: label('config.projectNamePh', 'Display name'),
                    style: { ...styles.input, flex: 1 },
                    'aria-label': label('config.projectName', 'Display name'),
                    onChange: e => updateRow(i, 'name', e.target.value),
                  }),
                  h('button', {
                    type: 'button', disabled, onClick: () => removeRow(i),
                    style: { ...styles.actionBtn, padding: '0 10px', color: 'var(--dsw-alias-state-error-primary, #d92d20)' },
                  }, label('config.removeProject', 'Remove')),
                ),
                h('input', {
                  type: 'text', value: p.token, disabled,
                  placeholder: label('config.projectTokenPh', 'token (raw or YAPI_PROJECT_TOKEN)'),
                  style: { ...styles.input, ...styles.mono },
                  'aria-label': label('config.projectToken', 'Project token'),
                  onChange: e => updateRow(i, 'token', e.target.value),
                })
              )),
              rows.length === 0
                ? h('p', { style: styles.help }, label('config.noProjects', 'No projects yet. Add one below.'))
                : null,
              h('button', {
                type: 'button', disabled, onClick: addRow, style: styles.actionBtn,
              }, label('config.addProject', '+ Add project')),
            )
          )
        }
        if (f.kind === 'boolean') {
          return h('div', { key: f.key, style: styles.field },
            h('label', {
              htmlFor: fieldId,
              style: { ...styles.toggleRow, ...(disabled ? styles.controlDisabled : null) },
            },
              h('input', {
                id: fieldId, type: 'checkbox', checked: value === true, disabled,
                style: styles.toggleInput,
                'aria-describedby': helpId,
                onChange: e => setDraft(d => ({ ...d, [f.key]: e.target.checked })),
              }),
              h('span', { style: styles.toggleText },
                h('span', { style: styles.toggleTitle }, label(f.label, f.key)),
                h('span', { id: helpId, style: styles.help }, label(f.help, '')),
              ),
            ),
            value === true ? null : h('p', { role: 'note', style: styles.warning },
              h('span', { 'aria-hidden': true, style: styles.warningMark }, '!'),
              label('config.confirmationOff', 'Confirmations are off: writes to YAPI will not ask again.'),
            ),
          )
        }
        return h('div', { key: f.key, style: styles.field },
          h('label', { htmlFor: fieldId, style: styles.label },
            label(f.label, f.key),
            f.required
              ? h('span', { 'aria-hidden': true, style: styles.required }, '*')
              : h('span', { style: styles.optional }, label('config.optional', 'Optional')),
          ),
          h('input', {
            id: fieldId, type: 'text', value, placeholder: f.placeholder || '', disabled,
            style: {
              ...styles.input,
              ...(f.mono ? styles.mono : null),
              ...(disabled ? styles.controlDisabled : null),
            },
            'aria-required': f.required ? true : undefined,
            'aria-describedby': helpId,
            onChange: e => setDraft(d => ({ ...d, [f.key]: e.target.value })),
          }),
          h('p', { id: helpId, style: styles.help }, label(f.help, '')),
        )
      }

      const saveDisabled = busy || state.writable === false

      return h('form', { onSubmit: save, style: styles.form },
        h('p', { style: styles.intro },
          label('config.intro', 'Connect your YAPI service and choose how writes are confirmed.')
        ),
        h('p', { style: styles.requiredHint },
          h('span', { 'aria-hidden': true, style: styles.required }, '*'),
          label('config.requiredHint', 'Required field'),
        ),
        GROUPS.map(group => h('section', {
          key: group.id,
          'aria-label': label(group.title, group.id),
          style: styles.section,
        },
          h('div', { style: styles.sectionHead },
            h('div', { style: { minWidth: 0 } },
              h('h4', { style: styles.groupTitle }, label(group.title, group.id)),
              h('p', { style: styles.groupHint }, label(group.hint, '')),
            ),
            h('span', { 'aria-hidden': true, style: styles.step }, group.step),
          ),
          h('div', { style: styles.fields },
            FIELDS.filter(f => f.group === group.id).map(renderField),
          ),
        )),
        error ? h('p', { role: 'alert', style: styles.error }, error) : null,
        h('div', { style: styles.footer },
          h('p', { style: styles.saveHint },
            label(
              state.writable === false ? 'config.saveReadOnly' : 'config.saveHint',
              state.writable === false ? 'Read-only in this profile.' : 'Only changed fields are written.'
            ),
          ),
          h('button', {
            type: 'submit', disabled: saveDisabled,
            style: { ...styles.save, ...(saveDisabled ? styles.saveDisabled : null) },
          }, busy ? label('config.saving', 'Saving…') : label('config.save', 'Save')),
        ),
      )
    }

    const PLAN_TERTIARY = 'var(--dsw-alias-label-tertiary, inherit)'
    const PLAN_SUCCESS = 'var(--dsw-alias-state-success-primary, #12805c)'
    const PLAN_WARN = 'var(--dsw-alias-state-warn-primary, #d97706)'
    const PLAN_ERROR = 'var(--dsw-alias-state-error-primary, #d92d20)'

    /**
     * YAPI composer dock: badge + popover. The badge shows the write-plan
     * state first (review / progress / result), falling back to the selected
     * project name. The popover holds the plan review card, the project list
     * and a requirement box that starts generation via /yapi-doc. Every action
     * goes through session commands; no network calls and no credentials live
     * in this component.
     */
    function YapiPicker({ useProjection, t, yapiSelect, yapiDoc, yapiApprove, yapiCancel, yapiList }) {
      const yapi = useProjection('yapi') || {}
      // The catalog is per-picker UI state refreshed from `/yapi-select list`;
      // it does not round-trip the session log (plugins must not append
      // custom-typed events). Selection and plan still come from projection.
      const [projects, setProjects] = React.useState([])
      const plan = yapi.plan && typeof yapi.plan === 'object' ? yapi.plan : null
      const planItems = Array.isArray(plan?.items) ? plan.items : []
      const selectedId = yapi.selectedId
      const selectedName = yapi.selectedName
      const phase = plan?.phase

      const [open, setOpen] = React.useState(false)
      const [busy, setBusy] = React.useState(false)
      const [error, setError] = React.useState(null)
      const [notes, setNotes] = React.useState('')
      // null = derive the defaults for the current phase (below); once the user
      // toggles anything this becomes an explicit Set.
      const [checked, setChecked] = React.useState(null)
      const [expanded, setExpanded] = React.useState(() => new Set())

      // Auto-open the popover exactly once when a plan enters review.
      const prevPhase = React.useRef(null)
      React.useEffect(() => {
        if (phase === 'pending' && prevPhase.current !== 'pending') setOpen(true)
        prevPhase.current = phase
      }, [phase])
      // Reset per-plan interaction state when another plan appears.
      React.useEffect(() => {
        setChecked(null)
        setExpanded(new Set())
      }, [plan?.id])

      // fmt: t() plus simple {var} interpolation with a Chinese-first fallback.
      const fmt = (key, fallback, vars) => {
        let text = t ? t(key) : null
        if (typeof text !== 'string' || text === '') text = fallback
        for (const [k, v] of Object.entries(vars ?? {})) {
          text = text.replaceAll(`{${k}}`, String(v))
        }
        return text
      }

      const defaultChecked = () => {
        const set = new Set()
        if (!plan) return set
        for (const it of planItems) {
          if (phase === 'done') {
            if (it.status === 'failed') set.add(it.itemId)
          } else if (!it.conflict && it.status === 'pending') {
            set.add(it.itemId)
          }
        }
        return set
      }
      const currentChecked = checked ?? defaultChecked()
      const toggleItem = (itemId) => setChecked(prev => {
        const next = new Set(prev ?? defaultChecked())
        if (next.has(itemId)) next.delete(itemId)
        else next.add(itemId)
        return next
      })
      const toggleExpanded = (itemId) => setExpanded(prev => {
        const next = new Set(prev)
        if (next.has(itemId)) next.delete(itemId)
        else next.add(itemId)
        return next
      })

      const run = async (fn, closeOnSuccess = false) => {
        setBusy(true)
        setError(null)
        try {
          const text = await fn()
          if (text) setError(text)
          else if (closeOnSuccess) setOpen(false)
        } catch (cause) {
          setError(String(cause?.message ?? cause))
        } finally {
          setBusy(false)
        }
      }
      const pick = (projectId) => run(async () => yapiSelect(projectId), true)
      const refreshCatalog = () => {
        void yapiList().then(res => {
          if (!res.error && Array.isArray(res.projects)) setProjects(res.projects)
        }).catch(() => { /* silent, matches the old refresh behavior */ })
      }
      const onToggle = () => {
        const next = !open
        setOpen(next)
        if (next) refreshCatalog() // refresh catalog on open (silent)
      }
      const startGenerate = () => run(async () => {
        const clean = notes.trim().replace(/\s+/g, ' ').slice(0, 1000)
        const text = await yapiDoc(clean)
        setNotes('')
        return text
      })
      const approve = () => run(async () => {
        const ids = planItems.filter(it => currentChecked.has(it.itemId)).map(it => it.itemId)
        const text = await yapiApprove(plan.id, ids)
        setChecked(null)
        return text
      })
      const cancelPlan = () => run(async () => yapiCancel(plan.id))

      // Badge status pill: plan state wins over the plain project name.
      const badgeStatus = (() => {
        const count = s => planItems.filter(i => i.status === s).length
        switch (phase) {
          case 'pending':
            return { text: fmt('plan.badgePending', '⚠ {n} 条待确认', { n: count('pending') }), hint: fmt('plan.phase.pending', '待审查') }
          case 'approved':
            return { text: fmt('plan.badgeApproved', '已批准 {n} 条 · 待写入', { n: plan.approvedCount ?? count('pending') }), hint: fmt('plan.phase.approved', '已批准，等待写入…') }
          case 'writing':
            return { text: fmt('plan.badgeWriting', '⟳ 写入中 {done}/{total}', { done: count('written'), total: planItems.length }), hint: fmt('plan.phase.writing', '写入中…') }
          case 'done': {
            const w = plan.result?.writtenCount ?? count('written')
            const f = plan.result?.failedCount ?? count('failed')
            return {
              text: f > 0 ? fmt('plan.badgeDoneFailed', '已写入 {w} · 失败 {f}', { w, f }) : fmt('plan.badgeDone', '✓ 已写入 {n} 条', { n: w }),
              hint: fmt('plan.phase.done', '写入完成'),
            }
          }
          case 'cancelled': return { text: fmt('plan.badgeCancelled', '计划已取消'), hint: fmt('plan.phase.cancelled', '已取消') }
          case 'expired': return { text: fmt('plan.badgeExpired', '计划已过期'), hint: fmt('plan.phase.expired', '已过期') }
          default: return null
        }
      })()

      const menuStyle = {
        position: 'absolute', bottom: 'calc(100% + 6px)', left: 0, zIndex: 30,
        minWidth: '300px', width: 'min(440px, 76vw)', padding: '10px',
        display: 'flex', flexDirection: 'column', gap: '10px',
        borderRadius: 'var(--dsw-radius-md, 12px)',
        border: '0.5px solid var(--dsw-alias-border-l2, rgba(127,127,127,0.25))',
        background: 'var(--dsw-alias-bg-layer-1, var(--dsw-alias-card-fill, #fff))',
        boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
        color: 'var(--dsw-alias-label-primary, inherit)', fontSize: '13px',
      }
      const actionStyle = {
        display: 'block', width: '100%', textAlign: 'left',
        padding: '7px 10px', borderRadius: 'var(--dsw-radius-sm, 8px)',
        border: '0.5px solid var(--dsw-alias-border-l3, rgba(127,127,127,0.3))',
        background: 'transparent', color: 'inherit', fontFamily: 'inherit',
        fontSize: '13px', lineHeight: '18px', cursor: busy ? 'default' : 'pointer',
        opacity: busy ? 0.6 : 1,
      }
      const primaryAction = {
        ...actionStyle,
        display: 'inline-block', width: 'auto', textAlign: 'center',
        background: 'var(--dsw-alias-button-primary-fill, var(--dsw-alias-brand-primary, #1f1f1f))',
        color: 'var(--dsw-alias-label-primary-inverted, #fff)',
        borderColor: 'transparent', fontWeight: 500,
        opacity: busy ? 0.6 : 1,
      }
      const checkStyle = {
        flex: 'none', width: '14px', height: '14px', margin: 0,
        accentColor: 'var(--dsw-alias-state-business-primary, #4169e1)',
      }
      const markStyle = color => ({
        flex: 'none', width: '16px', textAlign: 'center', fontWeight: 700, color,
      })
      const modeBadgeStyle = mode => ({
        flex: 'none', padding: '0 6px', borderRadius: '4px', fontSize: '11px', lineHeight: '18px',
        color: mode === 'update' ? PLAN_WARN : PLAN_SUCCESS,
        border: '0.5px solid currentColor', whiteSpace: 'nowrap',
      })
      const methodStyle = {
        flex: 'none', fontSize: '11px', lineHeight: '18px', color: PLAN_TERTIARY,
        fontFamily: 'var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
      }
      const pathStyle = {
        flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        fontFamily: 'var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
        fontSize: '12px', lineHeight: '18px',
      }
      const expanderStyle = {
        flex: 'none', padding: '0 8px', height: '22px',
        border: '0.5px solid var(--dsw-alias-border-l3, rgba(127,127,127,0.3))',
        borderRadius: '999px', background: 'transparent', color: 'inherit',
        fontSize: '11px', cursor: 'pointer',
      }
      const hintStyle = { fontSize: '11px', lineHeight: '16px', color: PLAN_TERTIARY }
      const warnStyle = { fontSize: '11px', lineHeight: '16px', color: PLAN_WARN }
      const okStyle = { fontSize: '11px', lineHeight: '16px', color: PLAN_SUCCESS }
      const errorLineStyle = { fontSize: '11px', lineHeight: '16px', color: PLAN_ERROR }
      const preStyle = {
        margin: 0, padding: '6px 8px', maxHeight: '120px', overflow: 'auto',
        borderRadius: '6px',
        background: 'var(--dsw-alias-bg-layer-1, rgba(127,127,127,0.08))',
        fontFamily: 'var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
        fontSize: '11px', lineHeight: '16px', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
        color: 'var(--dsw-alias-label-secondary, inherit)',
      }
      const planCardStyle = {
        display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px',
        borderRadius: 'var(--dsw-radius-sm, 8px)',
        border: '0.5px solid var(--dsw-alias-border-l2, rgba(127,127,127,0.25))',
        background: 'var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,0.05))',
      }

      const renderPlanItem = (it) => {
        const selectable = (phase === 'pending' || phase === 'done')
          && (it.status === 'pending' || it.status === 'failed')
        const mark = it.status === 'written' ? '✓' : it.status === 'failed' ? '✗' : it.status === 'skipped' ? '−' : '·'
        const markColor = it.status === 'written' ? PLAN_SUCCESS : it.status === 'failed' ? PLAN_ERROR : PLAN_TERTIARY
        const hasDetails = Boolean(
          it.conflict
          || (Array.isArray(it.changed) && it.changed.length > 0)
          || it.descPreview || it.reqPreview || it.resPreview
        )
        const open = expanded.has(it.itemId)
        return h('div', {
          key: it.itemId,
          style: {
            display: 'flex', flexDirection: 'column', gap: '3px', padding: '5px 6px',
            borderRadius: '8px',
            border: it.conflict
              ? '0.5px solid var(--dsw-alias-state-warn-primary, #d97706)'
              : '0.5px solid var(--dsw-alias-border-l3, rgba(127,127,127,0.3))',
            opacity: it.status === 'skipped' ? 0.55 : 1,
          },
        },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 } },
            selectable
              ? h('input', {
                  type: 'checkbox', checked: currentChecked.has(it.itemId), disabled: busy,
                  style: checkStyle,
                  'aria-label': `${it.method} ${it.path} ${it.title}`,
                  onChange: () => toggleItem(it.itemId),
                })
              : h('span', { style: markStyle(markColor), 'aria-hidden': true }, mark),
            h('span', { style: modeBadgeStyle(it.mode) },
              it.mode === 'update' ? fmt('plan.mode.update', '✎ 更新') : fmt('plan.mode.add', '＋ 新增')),
            h('span', { style: methodStyle }, it.method),
            h('span', {
              style: pathStyle,
              title: `${it.path} · ${it.title}${it.category ? ` · ${it.category}` : ''}`,
            }, it.path),
            hasDetails
              ? h('button', {
                  type: 'button', style: expanderStyle, onClick: () => toggleExpanded(it.itemId),
                }, open ? fmt('plan.collapse', '收起') : fmt('plan.detail', '详情'))
              : null,
          ),
          it.conflict ? h('div', { style: warnStyle }, `⚠ ${it.conflict.existing}`) : null,
          !it.conflict && it.mode === 'update'
            ? h('div', { style: hintStyle },
                Array.isArray(it.changed) && it.changed.length > 0
                  ? fmt('plan.changed', '变更：{fields}', { fields: it.changed.join('、') })
                  : fmt('plan.noChange', '与线上无差异'))
            : null,
          it.status === 'written' && it.writtenId
            ? h('div', { style: okStyle }, fmt('plan.written', '已写入（接口 id {id}）', { id: it.writtenId }))
            : null,
          it.status === 'skipped' ? h('div', { style: hintStyle }, fmt('plan.skipped', '已跳过')) : null,
          it.status === 'failed' && it.error ? h('div', { style: errorLineStyle }, `✗ ${it.error}`) : null,
          open && hasDetails
            ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } },
                it.descPreview
                  ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px' } },
                      h('div', { style: hintStyle }, 'desc'),
                      h('pre', { style: preStyle }, it.descPreview))
                  : null,
                it.reqPreview
                  ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px' } },
                      h('div', { style: hintStyle }, 'req_body'),
                      h('pre', { style: preStyle }, it.reqPreview))
                  : null,
                it.resPreview
                  ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px' } },
                      h('div', { style: hintStyle }, 'res_body'),
                      h('pre', { style: preStyle }, it.resPreview))
                  : null,
              )
            : null,
        )
      }

      const renderPlan = () => {
        if (!plan) return null
        const checkedCount = currentChecked.size
        const failedCount = plan.result?.failedCount ?? planItems.filter(i => i.status === 'failed').length
        const reviewing = phase === 'pending'
        const retrying = phase === 'done' && failedCount > 0
        const summary = [
          reviewing || retrying
            ? fmt('plan.checked', '{checked}/{total} 已勾选', { checked: checkedCount, total: planItems.filter(i => i.status === 'pending' || i.status === 'failed').length })
            : null,
          plan.expiresAt && (phase === 'pending' || phase === 'approved')
            ? fmt('plan.expiresHint', '15 分钟内有效')
            : null,
        ].filter(Boolean).join(' · ')

        return h('div', { style: planCardStyle },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 } },
            h('strong', { style: { fontSize: '13px', whiteSpace: 'nowrap' } }, fmt('plan.title', '写入计划')),
            h('span', { style: { fontSize: '12px', color: PLAN_TERTIARY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
              `${plan.projectName ?? ''}（${plan.projectId ?? ''}）`),
            h('span', { style: { marginLeft: 'auto', flex: 'none', fontSize: '11px', color: PLAN_TERTIARY } },
              fmt(`plan.phase.${phase}`, phase)),
          ),
          phase === 'cancelled' || phase === 'expired'
            ? h('div', { style: hintStyle }, fmt(`plan.phase.${phase}`, phase))
            : h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '260px', overflow: 'auto' } },
                planItems.map(renderPlanItem)),
          summary ? h('div', { style: hintStyle }, summary) : null,
          reviewing
            ? h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
                h('button', {
                  type: 'button', disabled: busy || checkedCount === 0,
                  style: { ...primaryAction, ...(checkedCount === 0 ? { opacity: 0.5, cursor: 'default' } : null) },
                  onClick: approve,
                }, fmt('plan.approve', '批准并写入 {n} 条', { n: checkedCount })),
                h('button', {
                  type: 'button', disabled: busy,
                  style: { ...actionStyle, width: 'auto', flex: 'none', color: PLAN_ERROR },
                  onClick: cancelPlan,
                }, fmt('plan.cancelPlan', '取消计划')),
              )
            : retrying
              ? h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
                  h('button', {
                    type: 'button', disabled: busy || checkedCount === 0,
                    style: { ...primaryAction, ...(checkedCount === 0 ? { opacity: 0.5, cursor: 'default' } : null) },
                    onClick: approve,
                  }, fmt('plan.retry', '重试失败项 {n} 条', { n: checkedCount })),
                  h('button', {
                    type: 'button', style: { ...actionStyle, width: 'auto', flex: 'none' },
                    onClick: () => setOpen(false),
                  }, fmt('plan.close', '关闭')),
                )
              : phase === 'approved' || phase === 'writing'
                ? h('div', { style: hintStyle }, fmt(`plan.phase.${phase}`, phase))
                : null,
        )
      }

      return h('span', { style: { position: 'relative', display: 'inline-flex' } },
        h('button', {
          type: 'button',
          'aria-expanded': open,
          'aria-label': fmt('badge.title', '已选择的 YAPI 项目'),
          title: badgeStatus
            ? `${fmt('badge.title', '已选择的 YAPI 项目')} — ${badgeStatus.hint}${plan?.projectName ? ` · ${plan.projectName}` : ''}`
            : selectedName
              ? `${fmt('badge.title', '已选择的 YAPI 项目')} — ${selectedName}${selectedId ? ` (id ${selectedId})` : ''}`
              : fmt('badge.select', '选择 YAPI 项目'),
          onClick: onToggle,
          style: {
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '2px 9px', borderRadius: '999px', cursor: 'pointer',
            border: `0.5px solid ${badgeStatus && (phase === 'pending' || phase === 'done' && (plan.result?.failedCount ?? 0) > 0) ? PLAN_WARN : 'var(--dsw-alias-border-color, rgba(127,127,127,0.35))'}`,
            background: selectedName || badgeStatus
              ? 'var(--dsw-alias-fill-quaternary, rgba(127,127,127,0.08))'
              : 'var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,0.12))',
            color: 'var(--dsw-alias-text-secondary, inherit)',
            fontSize: '12px', lineHeight: '18px', whiteSpace: 'nowrap',
          },
        },
          h('span', { 'aria-hidden': true, style: { fontWeight: 700, color: 'var(--dsw-alias-state-business-primary, #4169e1)' } }, 'Y'),
          h('span', null, badgeStatus?.text ?? selectedName ?? fmt('badge.select', '选择 YAPI 项目'))
        ),
        open ? h('div', { style: menuStyle, role: 'dialog', 'aria-label': fmt('badge.title', '已选择的 YAPI 项目') },
          renderPlan(),
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
            h('div', { style: { fontSize: '12px', color: PLAN_TERTIARY } },
              fmt('plan.selectTitle', '项目')),
            h('button', {
              type: 'button', disabled: busy,
              style: { ...expanderStyle, marginLeft: 'auto' },
              onClick: refreshCatalog,
            }, fmt('badge.refresh', '刷新')),
          ),
          projects.length > 0
            ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } },
                projects.map(p => {
                  const active = String(p.id) === String(selectedId)
                  return h('button', {
                    key: String(p.id), type: 'button', disabled: busy,
                    onClick: () => pick(String(p.id)),
                    style: {
                      ...actionStyle,
                      ...(active ? {
                        borderColor: 'var(--dsw-alias-state-business-primary, #4169e1)',
                        background: 'var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,0.08))',
                        fontWeight: 600,
                      } : {}),
                    },
                  }, `${p.name || p.id}${p.error ? `  ·  ${p.error}` : ''}${active ? '  ✓' : ''}`)
                })
              )
            : h('div', { style: { padding: '2px 0 4px', color: PLAN_TERTIARY } },
                fmt('badge.none', '尚未选择项目，点“刷新”从 token 载入。')
              ),
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } },
            h('span', { style: { fontSize: '12px', color: PLAN_TERTIARY } }, fmt('plan.notesLabel', '生成需求')),
            h('textarea', {
              value: notes, disabled: busy,
              placeholder: fmt('plan.notesPh', '描述要生成的接口需求，如：补充登录和注册接口…'),
              style: {
                boxSizing: 'border-box', width: '100%', minHeight: '56px', padding: '7px 10px',
                border: '0.5px solid var(--dsw-alias-border-l4, rgba(127,127,127,0.35))',
                borderRadius: 'var(--dsw-radius-sm, 8px)',
                background: 'var(--dsw-alias-bg-layer-1, transparent)',
                color: 'var(--dsw-alias-label-primary, inherit)',
                fontFamily: 'inherit', fontSize: '12px', lineHeight: '18px', resize: 'vertical',
              },
              onChange: e => setNotes(e.target.value),
            }),
            h('button', {
              type: 'button', disabled: busy,
              style: { ...primaryAction, alignSelf: 'flex-end' },
              onClick: startGenerate,
            }, fmt('plan.start', '开始生成 (/yapi-doc)')),
          ),
          error ? h('div', { role: 'alert', style: { color: PLAN_ERROR, fontSize: '12px', lineHeight: '18px' } }, error) : null
        ) : null
      )
    }

    return {
      inject: ['slots', 'locale', 'remote', 'remote.commands'],
      apply(ctx) {
        const NS = 'dshYapi'
        const en = {
          'badge.title': 'Selected YAPI project',
          'badge.select': 'Select YAPI project',
          'badge.none': 'No project selected yet. Refresh to load it from the token.',
          'badge.refresh': 'Refresh',
          'plan.title': 'Write plan',
          'plan.badgePending': '⚠ {n} to confirm',
          'plan.badgeApproved': '{n} approved · ready to write',
          'plan.badgeWriting': '⟳ writing {done}/{total}',
          'plan.badgeDone': '✓ wrote {n}',
          'plan.badgeDoneFailed': 'wrote {w} · failed {f}',
          'plan.badgeCancelled': 'plan cancelled',
          'plan.badgeExpired': 'plan expired',
          'plan.phase.pending': 'awaiting review',
          'plan.phase.approved': 'approved, waiting to write…',
          'plan.phase.writing': 'writing…',
          'plan.phase.done': 'write finished',
          'plan.phase.cancelled': 'cancelled — nothing was written',
          'plan.phase.expired': 'expired — generate a new plan',
          'plan.approve': 'Approve & write {n}',
          'plan.retry': 'Retry {n} failed',
          'plan.cancelPlan': 'Cancel plan',
          'plan.close': 'Close',
          'plan.mode.add': '＋ add',
          'plan.mode.update': '✎ update',
          'plan.changed': 'changed: {fields}',
          'plan.noChange': 'no differences vs. live',
          'plan.written': 'written (interface id {id})',
          'plan.skipped': 'skipped',
          'plan.detail': 'details',
          'plan.collapse': 'collapse',
          'plan.checked': '{checked}/{total} selected',
          'plan.expiresHint': 'valid for 15 min',
          'plan.selectTitle': 'Projects',
          'plan.notesLabel': 'Requirement',
          'plan.notesPh': 'Describe the interfaces to generate, e.g. add login and register…',
          'plan.start': 'Start generation (/yapi-doc)',
          'config.summary': 'Service address, credentials and write behavior',
          'config.loading': 'Loading configuration…',
          'config.unavailable': 'Configuration is not available in this profile.',
          'config.intro': 'Set up the YAPI connection and how DSH writes to it.',
          'config.requiredHint': 'required',
          'config.optional': 'Optional',
          'config.group.service': 'Service address',
          'config.group.serviceHint': 'Where the connector reaches YAPI and which hosts it may call.',
          'config.group.projects': 'Projects',
          'config.group.projectsHelp': 'Configure one or more YAPI projects, each with its own token. The first one is used by default; switch from the composer picker.',
          'config.group.credentials': 'Credentials',
          'config.group.credentialsHint': 'Paste the raw value here, or use a DSH credential reference name (UPPER_SNAKE_CASE).',
          'config.group.write': 'Write behavior',
          'config.group.writeHint': 'Decide whether DSH asks before writing YAPI interfaces.',
          'config.baseUrl': 'Base URL',
          'config.baseUrlHelp': 'Full YAPI URL including the scheme. There is no default value.',
          'config.allowedHosts': 'Allowed hosts',
          'config.allowedHostsHelp': 'Comma-separated hostnames; leave empty to use the default policy.',
          'config.usernameRef': 'Username reference',
          'config.usernameRefHelp': 'Raw username, or a credential reference (YAPI_USERNAME).',
          'config.passwordRef': 'Password reference',
          'config.passwordRefHelp': 'Raw password, or a credential reference (YAPI_PASSWORD).',
          'config.tokenRef': 'Default project token',
          'config.tokenRefHelp': 'Legacy single-project token (raw or YAPI_PROJECT_TOKEN). Used only when no projects are listed above.',
          'config.projects': 'Project list',
          'config.projectsHelp': 'Add each project with an id, an optional display name and its token (raw value or credential ref).',
          'config.projectId': 'Project id',
          'config.projectIdPh': 'id (e.g. test)',
          'config.projectName': 'Display name',
          'config.projectNamePh': 'Display name (optional)',
          'config.projectToken': 'Project token',
          'config.projectTokenPh': 'raw token or YAPI_PROJECT_TOKEN',
          'config.addProject': '+ Add project',
          'config.removeProject': 'Remove',
          'config.noProjects': 'No projects yet. Add one below.',
          'config.requireConfirmation': 'Require review-card approval before writing',
          'config.requireConfirmationHelp': 'When on, generated interfaces appear as a review card and are written only after you approve it. When off, plans are auto-approved and written immediately.',
          'config.confirmationOff': 'Confirmations are off — plans are auto-approved and written without asking.',
          'config.save': 'Save',
          'config.saving': 'Saving…',
          'config.saveFailed': 'Save was refused by the host.',
          'config.saveHint': 'Only changed fields are written.',
          'config.saveReadOnly': 'This configuration is read-only in the current profile.',
        }
        const zh = {
          'badge.title': '已选择的 YAPI 项目',
          'badge.select': '选择 YAPI 项目',
          'badge.none': '尚未选择项目，点“刷新”从 token 载入。',
          'badge.refresh': '刷新',
          'plan.title': '写入计划',
          'plan.badgePending': '⚠ {n} 条待确认',
          'plan.badgeApproved': '已批准 {n} 条 · 待写入',
          'plan.badgeWriting': '⟳ 写入中 {done}/{total}',
          'plan.badgeDone': '✓ 已写入 {n} 条',
          'plan.badgeDoneFailed': '已写入 {w} · 失败 {f}',
          'plan.badgeCancelled': '计划已取消',
          'plan.badgeExpired': '计划已过期',
          'plan.phase.pending': '待审查',
          'plan.phase.approved': '已批准，等待写入…',
          'plan.phase.writing': '写入中…',
          'plan.phase.done': '写入完成',
          'plan.phase.cancelled': '已取消，未写入任何内容',
          'plan.phase.expired': '已过期，请重新生成',
          'plan.approve': '批准并写入 {n} 条',
          'plan.retry': '重试失败项 {n} 条',
          'plan.cancelPlan': '取消计划',
          'plan.close': '关闭',
          'plan.mode.add': '＋ 新增',
          'plan.mode.update': '✎ 更新',
          'plan.changed': '变更：{fields}',
          'plan.noChange': '与线上无差异',
          'plan.written': '已写入（接口 id {id}）',
          'plan.skipped': '已跳过',
          'plan.detail': '详情',
          'plan.collapse': '收起',
          'plan.checked': '{checked}/{total} 已勾选',
          'plan.expiresHint': '15 分钟内有效',
          'plan.selectTitle': '项目',
          'plan.notesLabel': '生成需求',
          'plan.notesPh': '描述要生成的接口需求，如：补充登录和注册接口…',
          'plan.start': '开始生成 (/yapi-doc)',
          'config.summary': '服务地址、凭据与写入行为',
          'config.loading': '正在加载配置…',
          'config.unavailable': '此配置中不可用',
          'config.intro': '设置 YAPI 连接地址以及 DSH 写入 YAPI 的方式。',
          'config.requiredHint': '为必填项',
          'config.optional': '可选',
          'config.group.service': '服务地址',
          'config.group.serviceHint': '连接器访问 YAPI 的地址，以及允许访问的主机。',
          'config.group.projects': '项目列表',
          'config.group.projectsHelp': '配置一个或多个 YAPI 项目，每个项目有独立 token。默认使用第一个；可用对话栏选择器切换。',
          'config.group.credentials': '凭据',
          'config.group.credentialsHint': '可直接粘贴明文值，也可填写 DSH 凭据引用名（全大写下划线，如 YAPI_PROJECT_TOKEN）。',
          'config.group.write': '写入行为',
          'config.group.writeHint': '控制 DSH 写入 YAPI 接口前是否需要你在审查卡片中批准。',
          'config.baseUrl': '服务地址 Base URL',
          'config.baseUrlHelp': '完整的 YAPI 地址，需包含协议；没有默认值。',
          'config.allowedHosts': '主机白名单',
          'config.allowedHostsHelp': '允许访问的主机名，多个用逗号分隔；留空则使用默认策略。',
          'config.usernameRef': '用户名凭据引用',
          'config.usernameRefHelp': '登录用户名明文，或凭据引用名（YAPI_USERNAME）。',
          'config.passwordRef': '密码凭据引用',
          'config.passwordRefHelp': '登录密码明文，或凭据引用名（YAPI_PASSWORD）。',
          'config.tokenRef': '默认项目 token',
          'config.tokenRefHelp': '旧版单项目 token（明文或 YAPI_PROJECT_TOKEN）。仅当上面未配置项目列表时使用。',
          'config.projects': '项目列表',
          'config.projectsHelp': '为每个项目填写 id、可选显示名和 token（明文或凭据引用名）。',
          'config.projectId': '项目 id',
          'config.projectIdPh': 'id（如 test）',
          'config.projectName': '显示名',
          'config.projectNamePh': '显示名（可选）',
          'config.projectToken': '项目 token',
          'config.projectTokenPh': '明文 token 或 YAPI_PROJECT_TOKEN',
          'config.addProject': '+ 添加项目',
          'config.removeProject': '删除',
          'config.noProjects': '暂无项目，请在下方添加。',
          'config.requireConfirmation': '写入前需要在审查卡片中批准',
          'config.requireConfirmationHelp': '开启后，生成的接口会以审查卡片呈现，经你批准才会写入；关闭后计划自动批准并立即写入。',
          'config.confirmationOff': '已关闭确认：计划会自动批准并直接写入，不再询问。',
          'config.save': '保存',
          'config.saving': '保存中…',
          'config.saveFailed': '保存被服务端拒绝',
          'config.saveHint': '仅提交发生变化的字段。',
          'config.saveReadOnly': '此配置在当前环境中为只读。',
        }
        if (ctx.locale?.register) {
          ctx.effect(() => ctx.locale.register(NS, { en, zh }), 'dsh-yapi: locale')
        }
        // The command result text is shown in chat; our callbacks surface
        // errors in the picker so the user sees failure without leaving the
        // dock (success feedback comes from the plan card / chat log).
        const runCommandRaw = async (sessionId, line) => {
          const result = await ctx.remote.commands.execute(sessionId, line, [])
          if (!result.ok) return { error: `${result.error?.message ?? 'command failed'} (${result.error?.code ?? ''})` }
          const value = result.value?.result
          if (!value) return {}
          if (value.kind === 'error') return { error: value.text }
          return { text: typeof value.text === 'string' ? value.text : '' }
        }
        const runCommand = async (sessionId, line) => (await runCommandRaw(sessionId, line)).error
        // Local ⟪yapi⟫ marker parser (kept in sync with index.js).
        const parseStateMarker = (text) => {
          const matches = [...String(text ?? '').matchAll(/⟪yapi([\s\S]*?)⟫/g)]
          const last = matches[matches.length - 1]
          if (!last) return null
          try { return JSON.parse(last[1]) } catch { return null }
        }
        ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
          name: 'conversation.composer.dock',
          id: 'dsh-yapi-picker',
          order: 8,
          locale: NS,
          inject: (sessionId) => ({
            yapiSelect: (id) => runCommand(sessionId, `/yapi-select${id ? ` ${id}` : ''}`),
            yapiList: async () => {
              const { error, text } = await runCommandRaw(sessionId, '/yapi-select list')
              const marker = text ? parseStateMarker(text) : null
              return {
                error,
                projects: marker?.op === 'catalog' && Array.isArray(marker.projects) ? marker.projects : [],
              }
            },
            yapiDoc: (notes) => runCommand(sessionId, `/yapi-doc${notes ? ` ${notes}` : ''}`),
            yapiApprove: (planId, itemIds) => runCommand(
              sessionId,
              `/yapi-approve ${planId}${Array.isArray(itemIds) && itemIds.length > 0 ? ` ${itemIds.join(' ')}` : ' all'}`,
            ),
            yapiCancel: (planId) => runCommand(sessionId, `/yapi-cancel ${planId}`),
          }),
        }, YapiPicker))
        // Register the row configuration page so the bundle's row on the
        // Plugins page gains a "Configure" control. Key must be
        // `${package}#${rowId}` and the settings namespace is the row id.
        ctx.slots.inject('plugins.row.config', () => ctx.slots.register({
          name: 'plugins.row.config',
          key: 'dsh-yapi#dsh-yapi',
          locale: NS,
        }, YapiConfig))
      },
    }
  },
})
