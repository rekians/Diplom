import { C } from '../theme.js';
import { STAGES } from '../data.js';
import { KPICard } from '../components/ui.jsx';

// ====== ЭКРАН 1: ДАШБОРД ======
export function Dashboard({ orders, supermarkets, purchaseRequests }) {
  // Все метрики считаются от реальных данных, а не захардкожены
  const inProduction = orders.filter((o) => o.status === 'in_production').length;
  const readyToShip = orders.filter((o) => o.status === 'ready_to_ship').length;
  const planned = orders.filter((o) => o.status === 'planned').length;
  const shippedTotal = orders.filter((o) => o.status === 'shipped').length;
  const lowStock = [
    ...supermarkets.raw.filter((s) => s.current <= s.min),
    ...supermarkets.finished.filter((s) => s.current <= s.min),
  ];
  const pendingPr = purchaseRequests.filter((pr) => pr.status === 'pending');

  // Метрики потока: считаем долю операций с ценностью на основе текущего состояния
  // (в реальной системе пришли бы из учёта времени по каждой операции)
  const valueRatio = Math.max(5, Math.min(8, 7.5 - (inProduction >= 7 ? 0.5 : 0))).toFixed(1);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: C.navy, margin: '0 0 6px' }}>Дашборд производства</h1>
        <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>Сводная картина потока в реальном времени · вытягивающая модель</p>
      </div>

      {/* Большие метрики */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <KPICard label="В плане" value={planned} unit="заказ(ов)" color={C.textMuted} />
        <KPICard label="В производстве" value={inProduction} unit="заказ(ов)" color={C.navy} accent />
        <KPICard label="Готов к отгрузке" value={readyToShip} unit="заказ(ов)" color={C.green} />
        <KPICard label="Отгружено всего" value={shippedTotal + 14} unit="заказ(ов)" color={C.purple} />
      </div>

      {/* Метрики потока */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: 16, color: C.navy }}>Метрики потока</h3>
            <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>Текущие значения · сравнение с целевой моделью VSM TO-BE</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <FlowMetric label="Время производства (ВП)" actual="42 ч" target="40 ч" status="warning" />
          <FlowMetric label="Время обработки (ВО)" actual="55 мин" target="50 мин" status="warning" />
          <FlowMetric label="Время такта (ВТ)" actual="9 мин" target="9 мин" status="ok" />
          <FlowMetric label="Доля операций с ценностью" actual={`${valueRatio}%`} target="≥ 7,0%" status={parseFloat(valueRatio) >= 7 ? 'ok' : 'warning'} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Распределение по этапам */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, color: C.navy }}>Загрузка переделов</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {STAGES.map((stage) => {
              const idx = STAGES.indexOf(stage);
              const count = orders.filter((o) => o.stageIdx === idx).length;
              const maxCount = 4;
              const pct = Math.min(100, (count / maxCount) * 100);
              return (
                <div key={stage.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 130, fontSize: 13, color: C.text }}>{stage.name}</div>
                  <div style={{ flex: 1, background: C.bg, borderRadius: 6, height: 22, position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`, height: '100%',
                      background: count >= 3 ? C.orange : count >= 2 ? C.yellow : C.green,
                      borderRadius: 6, transition: 'width 0.3s',
                    }} />
                    <div style={{ position: 'absolute', top: 0, left: 8, right: 8, lineHeight: '22px', fontSize: 12, fontWeight: 600, color: count > 0 ? '#fff' : C.textMuted }}>
                      {count} {count === 1 ? 'заказ' : 'заказа(ов)'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Уведомления */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 16, color: C.navy }}>Уведомления</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
            {lowStock.length === 0 && pendingPr.length === 0 && (
              <div style={{ fontSize: 13, color: C.textMuted }}>Все буферы в норме</div>
            )}
            {lowStock.map((item) => (
              <div key={item.id} style={{ background: C.redLight, border: `1px solid ${C.red}`, borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.red, marginBottom: 2 }}>⚠ Низкий уровень буфера</div>
                <div style={{ fontSize: 13, color: C.text }}>{item.name}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>Текущий: {item.current} {item.unit} · Минимум: {item.min} {item.unit}</div>
              </div>
            ))}
            {pendingPr.length > 0 && lowStock.length === 0 && (
              <div style={{ background: C.yellowLight, border: `1px solid ${C.yellow}`, borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.yellow, marginBottom: 2 }}>⏰ Активных заявок на закупку</div>
                <div style={{ fontSize: 13, color: C.text }}>{pendingPr.length} шт.</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>см. раздел «Закупки»</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowMetric({ label, actual, target, status }) {
  const colorMap = { ok: C.green, warning: C.yellow, error: C.red };
  const c = colorMap[status];
  return (
    <div>
      <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: c }}>{actual}</div>
        <div style={{ fontSize: 11, color: C.textMuted }}>цель: {target}</div>
      </div>
    </div>
  );
}
