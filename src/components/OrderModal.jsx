import { C } from '../theme.js';
import { STAGES } from '../data.js';
import { STATUS_LABELS } from '../theme.js';
import { formatRub, getClient, getModel } from '../utils.js';

// ====== МОДАЛКА ПРОСМОТРА ЗАКАЗА ======
export function OrderModal({ order, onClose }) {
  const client = getClient(order.clientId);
  const model = getModel(order.modelId);
  const sum = model.price * order.qty;
  const st = STATUS_LABELS[order.status];

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 24, maxWidth: 600, width: '90%', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: C.navy }}>{order.id}</div>
            <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 500, marginTop: 6, display: 'inline-block' }}>{st.label}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: C.textMuted }}>×</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <Field label="Клиент" value={client.name} sub={client.type} />
          <Field label="Модель" value={model.name} sub={`${formatRub(model.price)} / шт.`} />
          <Field label="Количество" value={`${order.qty} шт.`} />
          <Field label="Срок" value={order.deadline} />
          <Field label="Сумма заказа" value={formatRub(sum)} highlight />
          <Field label="Дата запуска" value={order.startedAt || '—'} />
        </div>

        {order.stageIdx >= 0 && order.stageIdx < STAGES.length && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Прогресс по производственному потоку</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {STAGES.map((stage, idx) => (
                <div key={stage.id} style={{ flex: 1, position: 'relative' }}>
                  <div style={{
                    height: 6, borderRadius: 3,
                    background: idx < order.stageIdx ? C.green : idx === order.stageIdx ? C.accent : C.border,
                  }} />
                  <div style={{ fontSize: 9, color: idx === order.stageIdx ? C.accent : C.textMuted, marginTop: 4, textAlign: 'center', fontWeight: idx === order.stageIdx ? 600 : 400 }}>
                    {stage.short}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ paddingTop: 14, borderTop: `1px solid ${C.border}`, fontSize: 12, color: C.textMuted }}>
          <strong>Примечание:</strong> в промышленной системе на 1С:ERP здесь будут история событий, накладные, плановые/фактические сроки по каждому переделу, привязка к канбан-карточкам.
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, sub, highlight }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: highlight ? 16 : 14, fontWeight: highlight ? 700 : 500, color: highlight ? C.navy : C.text }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}
