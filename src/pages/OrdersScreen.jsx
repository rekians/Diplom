import { useMemo, useState } from 'react';
import { C, STATUS_LABELS } from '../theme.js';
import { STAGES } from '../data.js';
import { formatRub, getClient, getModel } from '../utils.js';
import { Th, Td } from '../components/ui.jsx';

// ====== ЭКРАН 2: ЗАКАЗЫ ======
export function OrdersScreen({ orders, onSelect, onNewOrder, onShip }) {
  const [filter, setFilter] = useState('all');
  const filtered = useMemo(() => (filter === 'all' ? orders : orders.filter((o) => o.status === filter)), [orders, filter]);

  return (
    <div>
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: C.navy, margin: '0 0 6px' }}>Заказы</h1>
          <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>Все заказы клиентов · {orders.length} шт.</p>
        </div>
        <button onClick={onNewOrder} style={{
          background: C.accent, color: '#fff', border: 'none',
          padding: '12px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 2px 6px rgba(224,122,95,0.3)',
        }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
          <span>Новый заказ</span>
        </button>
      </div>

      {/* Фильтры */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: `Все (${orders.length})` },
          { id: 'planned', label: `В плане (${orders.filter((o) => o.status === 'planned').length})` },
          { id: 'in_production', label: `В производстве (${orders.filter((o) => o.status === 'in_production').length})` },
          { id: 'ready_to_ship', label: `К отгрузке (${orders.filter((o) => o.status === 'ready_to_ship').length})` },
          { id: 'shipped', label: `Отгружены (${orders.filter((o) => o.status === 'shipped').length})` },
        ].map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            padding: '8px 14px', border: `1px solid ${filter === f.id ? C.navy : C.border}`,
            background: filter === f.id ? C.navy : '#fff',
            color: filter === f.id ? '#fff' : C.text,
            borderRadius: 8, fontSize: 13, cursor: 'pointer', fontWeight: 500,
          }}>{f.label}</button>
        ))}
      </div>

      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
              <Th>Номер</Th>
              <Th>Клиент</Th>
              <Th>Модель</Th>
              <Th>Кол-во</Th>
              <Th>Срок</Th>
              <Th>Статус</Th>
              <Th>Текущий этап</Th>
              <Th>Сумма</Th>
              <Th>Действия</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => {
              const client = getClient(o.clientId);
              const model = getModel(o.modelId);
              const sum = model.price * o.qty;
              const stage = o.stageIdx >= 0 && o.stageIdx < STAGES.length ? STAGES[o.stageIdx] : null;
              const st = STATUS_LABELS[o.status];
              return (
                <tr key={o.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <Td><span onClick={() => onSelect(o)} style={{ fontFamily: 'monospace', fontWeight: 600, color: C.navy, cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'rgba(31,78,121,0.3)' }}>{o.id}</span></Td>
                  <Td>
                    <div style={{ fontWeight: 500 }}>{client.name}</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>{client.type}</div>
                  </Td>
                  <Td>{model.name}</Td>
                  <Td><span style={{ fontWeight: 600 }}>{o.qty}</span> шт.</Td>
                  <Td>{o.deadline}</Td>
                  <Td>
                    <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>{st.label}</span>
                  </Td>
                  <Td>{stage ? stage.name : (o.status === 'shipped' ? '—' : o.status === 'ready_to_ship' ? 'Склад ГП' : '—')}</Td>
                  <Td><span style={{ fontWeight: 600, color: C.navy }}>{formatRub(sum)}</span></Td>
                  <Td>
                    {o.status === 'ready_to_ship' && (
                      <button onClick={() => onShip(o.id)} style={{
                        padding: '5px 10px', background: C.green, color: '#fff', border: 'none',
                        borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      }}>Отгрузить</button>
                    )}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 14, fontSize: 12, color: C.textMuted, textAlign: 'right' }}>
        💡 Кликните на номер заказа, чтобы увидеть подробности
      </div>
    </div>
  );
}
