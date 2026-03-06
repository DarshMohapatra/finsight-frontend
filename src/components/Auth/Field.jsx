// Shared input field — must live outside parent components to prevent remount on keystroke
export default function Field({ icon: Icon, label, type, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 10, fontFamily: "'DM Mono',monospace",
        color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5,
        display: 'block', marginBottom: 6 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <Icon size={14} style={{ position: 'absolute', left: 13, top: '50%',
          transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.22)', pointerEvents: 'none' }} />
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ width: '100%', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10,
            padding: '11px 14px 11px 38px', color: '#e8eaf0', fontSize: 14,
            fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
          onFocus={e => e.target.style.borderColor = 'rgba(0,245,160,0.5)'}
          onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.09)'} />
      </div>
    </div>
  )
}