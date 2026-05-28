// ====== ПАЛИТРА ======
export const C = {
  navy: '#1F4E79',
  navyLight: '#2E75B6',
  ice: '#DEEAF6',
  cream: '#F7F7F2',
  bg: '#FAFAFA',
  cardBg: '#FFFFFF',
  border: '#E5E7EB',
  text: '#1A1A2E',
  textMuted: '#6B7280',
  green: '#70AD47',
  greenLight: '#E2EFD9',
  yellow: '#BF9000',
  yellowLight: '#FFF2CC',
  orange: '#ED7D31',
  orangeLight: '#FCE4D6',
  red: '#C0504D',
  redLight: '#F4DCDA',
  purple: '#7030A0',
  purpleLight: '#E4DFEC',
  accent: '#E07A5F',
};

export const STATUS_LABELS = {
  planned: { label: 'В плане', color: C.textMuted, bg: '#F3F4F6' },
  in_production: { label: 'В производстве', color: C.navy, bg: C.ice },
  ready_to_ship: { label: 'Готов к отгрузке', color: C.green, bg: C.greenLight },
  shipped: { label: 'Отгружен', color: C.purple, bg: C.purpleLight },
};

export const smallBtnStyle = {
  padding: '3px 8px', fontSize: 11, border: `1px solid ${C.border}`,
  background: '#fff', borderRadius: 4, cursor: 'pointer', fontWeight: 600,
};

export const inputStyle = {
  width: '100%', padding: '9px 12px', fontSize: 14, border: `1px solid ${C.border}`,
  borderRadius: 8, background: '#fff', color: C.text, boxSizing: 'border-box',
  fontFamily: 'inherit',
};
