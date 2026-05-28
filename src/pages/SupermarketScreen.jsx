import { C } from '../theme.js';

// ====== ЭКРАН 4: СУПЕРМАРКЕТЫ ======
export function SupermarketScreen({ supermarkets, purchaseRequests }) {
  const pendingPr = purchaseRequests.filter((pr) => pr.status === 'pending');

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: C.navy, margin: '0 0 6px' }}>Супермаркеты</h1>
        <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>Уровни буферов сырья и готовой продукции · автогенерация заявок при достижении минимума</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <SupermarketBlock title="Супермаркет сырья и материалов" subtitle="Pull-сигнал на закупку при достижении мин. уровня" items={supermarkets.raw} pendingPr={pendingPr} />
        <SupermarketBlock title="Супермаркет готовой продукции" subtitle="Pull-сигнал на производство при опускании ниже мин." items={supermarkets.finished} />
      </div>

      <div style={{ marginTop: 24, padding: 16, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12 }}>
        <h3 style={{ margin: '0 0 10px', fontSize: 15, color: C.navy }}>Как это работает</h3>
        <ol style={{ margin: 0, paddingLeft: 20, color: C.text, fontSize: 13, lineHeight: 1.6 }}>
          <li><strong>Зелёная зона</strong> — буфер выше точки заказа, всё в норме.</li>
          <li><strong>Жёлтая зона</strong> — буфер приближается к минимуму, подготовка к пополнению.</li>
          <li><strong>Красная зона</strong> — буфер ниже минимума, система автоматически создаёт заявку поставщику в разделе «Закупки».</li>
        </ol>
      </div>
    </div>
  );
}

function SupermarketBlock({ title, subtitle, items, pendingPr }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
      <h3 style={{ margin: '0 0 4px', fontSize: 16, color: C.navy }}>{title}</h3>
      <p style={{ margin: '0 0 16px', fontSize: 12, color: C.textMuted }}>{subtitle}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {items.map((item) => {
          const pct = (item.current / item.max) * 100;
          const minPct = (item.min / item.max) * 100;
          const isLow = item.current <= item.min;
          const isMedium = item.current <= item.min * 1.5;
          const color = isLow ? C.red : isMedium ? C.yellow : C.green;
          const hasPendingPr = pendingPr?.some((pr) => pr.materialId === item.id);
          return (
            <div key={item.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                <span style={{ fontWeight: 500 }}>{item.name}</span>
                <span style={{ fontWeight: 600, color }}>{item.current} / {item.max} {item.unit}</span>
              </div>
              <div style={{ position: 'relative', background: C.bg, borderRadius: 6, height: 18, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 6, transition: 'all 0.3s' }} />
                <div style={{ position: 'absolute', left: `${minPct}%`, top: 0, width: 2, height: '100%', background: '#000', opacity: 0.4 }} title={`Минимум: ${item.min}`} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3, fontSize: 10, color: C.textMuted }}>
                <span>0</span>
                <span>min: {item.min}</span>
                <span>max: {item.max}</span>
              </div>
              {isLow && hasPendingPr && (
                <div style={{ marginTop: 6, padding: '6px 10px', background: C.redLight, color: C.red, borderRadius: 6, fontSize: 11, fontWeight: 500 }}>
                  ⚠ Сгенерирована автозаявка на пополнение (см. «Закупки»)
                </div>
              )}
              {isLow && !hasPendingPr && (
                <div style={{ marginTop: 6, padding: '6px 10px', background: C.yellowLight, color: '#7A5A00', borderRadius: 6, fontSize: 11, fontWeight: 500 }}>
                  ⚠ Уровень ниже минимума — требуется пополнение
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
