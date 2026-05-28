import { C } from '../theme.js';

export function KPICard({ label, value, unit, color, accent }) {
  return (
    <div style={{ background: accent ? color : '#fff', color: accent ? '#fff' : C.text, border: `1px solid ${accent ? color : C.border}`, borderRadius: 12, padding: 18 }}>
      <div style={{ fontSize: 12, color: accent ? 'rgba(255,255,255,0.85)' : C.textMuted, marginBottom: 6, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: accent ? '#fff' : color }}>{value}</div>
        <div style={{ fontSize: 12, color: accent ? 'rgba(255,255,255,0.85)' : C.textMuted }}>{unit}</div>
      </div>
    </div>
  );
}

export const Th = ({ children }) => <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{children}</th>;
export const Td = ({ children }) => <td style={{ padding: '12px 16px' }}>{children}</td>;
