import { C, smallBtnStyle } from '../theme.js';
import { STAGES } from '../data.js';
import { formatHours, getClient, getModel } from '../utils.js';

// ====== ЭКРАН 3: КАНБАН-ДОСКА ======
export function KanbanBoard({ orders, onMove }) {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: C.navy, margin: '0 0 6px' }}>Канбан-доска производства</h1>
        <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>Визуализация потока · перемещайте карточки между колонками для имитации канбан-сигнала</p>
      </div>

      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
        {STAGES.map((stage, idx) => {
          const ordersOnStage = orders.filter((o) => o.stageIdx === idx);
          const isOverloaded = ordersOnStage.length >= 3;
          return (
            <div key={stage.id} style={{ minWidth: 220, background: C.bg, borderRadius: 10, border: `1px solid ${isOverloaded ? C.orange : C.border}`, padding: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: C.navy }}>{stage.name}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>Цель: {formatHours(stage.target)}</div>
                </div>
                <div style={{ background: isOverloaded ? C.orange : C.navy, color: '#fff', padding: '3px 9px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
                  {ordersOnStage.length}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ordersOnStage.length === 0 && <div style={{ fontSize: 12, color: C.textMuted, fontStyle: 'italic', padding: '12px 0', textAlign: 'center' }}>пусто</div>}
                {ordersOnStage.map((o) => {
                  const model = getModel(o.modelId);
                  const client = getClient(o.clientId);
                  const overTime = o.timeOnStage > stage.target;
                  return (
                    <div key={o.id} style={{ background: '#fff', border: `1px solid ${overTime ? C.orange : C.border}`, borderLeft: `4px solid ${overTime ? C.orange : C.green}`, borderRadius: 8, padding: 10 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: C.navy, marginBottom: 4 }}>{o.id}</div>
                      <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>{model.name.replace('Кроватка ', '')}</div>
                      <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>{client.name} · {o.qty} шт.</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 10, color: overTime ? C.orange : C.textMuted, fontWeight: overTime ? 600 : 400 }}>
                          {overTime ? '⚠ ' : '⏱ '}{formatHours(o.timeOnStage)} / {formatHours(stage.target)}
                        </span>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {idx > 0 && <button onClick={() => onMove(o.id, -1)} style={smallBtnStyle}>◀</button>}
                          <button onClick={() => onMove(o.id, 1)} style={{ ...smallBtnStyle, background: C.green, color: '#fff', borderColor: C.green }}>▶</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Колонка planned: добавим карточки из «В плане», чтобы можно было их запустить в производство */}
      <PlannedQueue orders={orders} onMove={onMove} />

      <div style={{ marginTop: 16, padding: 12, background: C.purpleLight, border: `1px solid ${C.purple}`, borderRadius: 8, fontSize: 12, color: C.purple }}>
        <strong>Принцип работы:</strong> когда заказ переходит на следующий передел (▶), это автоматический сигнал канбан для предыдущего: «можно запускать новую партию». При переходе через раскрой и ЛКП автоматически списываются материалы со склада сырья. Когда заказ доходит до конца, система помечает его «готов к отгрузке». Перегруженные колонки выделены оранжевым — это признак узкого места.
      </div>
    </div>
  );
}

function PlannedQueue({ orders, onMove }) {
  const planned = orders.filter((o) => o.status === 'planned');
  if (planned.length === 0) return null;

  return (
    <div style={{ marginTop: 16, padding: 14, background: '#fff', border: `1px dashed ${C.textMuted}`, borderRadius: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <h3 style={{ margin: 0, fontSize: 14, color: C.navy }}>Очередь запуска · {planned.length} заказ(ов) в плане</h3>
        <span style={{ fontSize: 11, color: C.textMuted }}>Нажмите ▶ чтобы запустить в производство</span>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {planned.map((o) => {
          const model = getModel(o.modelId);
          const client = getClient(o.clientId);
          return (
            <div key={o.id} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, minWidth: 200 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: C.navy, marginBottom: 3 }}>{o.id}</div>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>{model.name.replace('Кроватка ', '')}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>{client.name} · {o.qty} шт. · до {o.deadline}</div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => onMove(o.id, 1)} style={{ ...smallBtnStyle, background: C.green, color: '#fff', borderColor: C.green }}>▶ Запустить</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
