import React, { useState } from 'react';
import { C, inputStyle } from '../theme.js';
import { CLIENTS, MODELS } from '../data.js';
import { formatRub, getModel } from '../utils.js';

// ====== МОДАЛКА СОЗДАНИЯ НОВОГО ЗАКАЗА ======
export function NewOrderModal({ onClose, onCreate }) {
  const [clientId, setClientId] = useState(CLIENTS[0].id);
  const [modelId, setModelId] = useState(MODELS[0].id);
  const [qty, setQty] = useState(1);
  const [deadline, setDeadline] = useState('');
  const [errors, setErrors] = useState({});

  const model = getModel(modelId);
  const totalSum = model.price * (qty || 0);

  // По умолчанию дата сдачи — через 2 недели от сегодня
  React.useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    setDeadline(d.toISOString().slice(0, 10));
  }, []);

  const handleSubmit = () => {
    const errs = {};
    if (!clientId) errs.clientId = 'Выберите клиента';
    if (!modelId) errs.modelId = 'Выберите модель';
    if (!qty || qty < 1) errs.qty = 'Количество должно быть ≥ 1';
    if (!deadline) errs.deadline = 'Укажите срок';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onCreate({ clientId, modelId, qty: parseInt(qty, 10), deadline });
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 28, maxWidth: 540, width: '90%', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: C.navy }}>Новый заказ</h2>
            <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>Заполните поля — заказ появится в плане и может быть запущен в производство</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: C.textMuted }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormField label="Клиент" error={errors.clientId}>
            <select value={clientId} onChange={(e) => setClientId(e.target.value)} style={inputStyle}>
              {CLIENTS.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
            </select>
          </FormField>

          <FormField label="Модель" error={errors.modelId}>
            <select value={modelId} onChange={(e) => setModelId(e.target.value)} style={inputStyle}>
              {MODELS.map((m) => <option key={m.id} value={m.id}>{m.name} — {formatRub(m.price)}</option>)}
            </select>
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FormField label="Количество, шт." error={errors.qty}>
              <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} style={inputStyle} />
            </FormField>
            <FormField label="Срок сдачи" error={errors.deadline}>
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={inputStyle} />
            </FormField>
          </div>

          {/* Расчёт суммы */}
          <div style={{ padding: 14, background: C.ice, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: C.navy }}>Сумма заказа</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: C.navy }}>{formatRub(totalSum)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22, paddingTop: 18, borderTop: `1px solid ${C.border}` }}>
          <button onClick={onClose} style={{
            padding: '10px 18px', background: '#fff', color: C.text, border: `1px solid ${C.border}`,
            borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}>Отмена</button>
          <button onClick={handleSubmit} style={{
            padding: '10px 22px', background: C.accent, color: '#fff', border: 'none',
            borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(224,122,95,0.3)',
          }}>Создать заказ</button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
      {children}
      {error && <div style={{ fontSize: 11, color: C.red, marginTop: 4 }}>{error}</div>}
    </div>
  );
}
