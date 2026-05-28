import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { C } from '../theme.js';
import { MODELS } from '../data.js';
import { formatRub, getModel } from '../utils.js';
import { KPICard } from '../components/ui.jsx';

// ====== ЭКРАН 6: АНАЛИТИКА ======
export function AnalyticsScreen({ orders, shippedHistory }) {
  // Метрики считаются от реальных данных
  const shippedOrders = orders.filter((o) => o.status === 'shipped');
  const totalRevenue = shippedOrders.reduce((sum, o) => sum + getModel(o.modelId).price * o.qty, 0);
  const inFlightOrders = orders.filter((o) => o.status === 'in_production').length;
  const readyOrders = orders.filter((o) => o.status === 'ready_to_ship').length;

  // Распределение продаж по моделям
  const salesByModel = MODELS.map((m) => {
    const qty = orders.filter((o) => o.modelId === m.id && (o.status === 'shipped' || o.status === 'ready_to_ship')).reduce((s, o) => s + o.qty, 0);
    return { name: m.name.replace('Кроватка ', ''), qty };
  });

  // Реализация: переводим shippedHistory в формат для графика метрик потока
  const flowMetricsHistory = shippedHistory.map((d) => ({
    day: d.day, vp_target: 40, vp_actual: d.leadTimeAvg,
  }));

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: C.navy, margin: '0 0 6px' }}>Аналитика</h1>
        <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>Динамика метрик потока · последняя неделя · {orders.length} заказов в системе</p>
      </div>

      {/* Сводка по выполнению */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        <KPICard label="Отгружено" value={shippedOrders.length} unit="заказов" color={C.purple} />
        <KPICard label="К отгрузке" value={readyOrders} unit="заказов" color={C.green} />
        <KPICard label="В производстве" value={inFlightOrders} unit="заказов" color={C.navy} />
        <KPICard label="Выручка отгруженных" value={formatRub(totalRevenue).replace(' ₽', '')} unit="₽" color={C.accent} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <ChartCard title="Время производства (ВП)" subtitle="Фактическое vs целевое значение, часов">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={flowMetricsHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="day" stroke={C.textMuted} style={{ fontSize: 12 }} />
              <YAxis stroke={C.textMuted} style={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="vp_actual" stroke={C.accent} strokeWidth={3} name="Фактическое" dot={{ r: 5 }} />
              <Line type="monotone" dataKey="vp_target" stroke={C.green} strokeWidth={2} strokeDasharray="5 5" name="Целевое" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Распределение продаж по моделям" subtitle="Отгружено + готово к отгрузке, шт.">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesByModel}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="name" stroke={C.textMuted} style={{ fontSize: 11 }} />
              <YAxis stroke={C.textMuted} style={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="qty" name="Количество, шт." fill={C.navy} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, color: C.navy }}>Сводка по экономическому эффекту (целевой год)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <BigStat value="+4 500 000 ₽" label="Прирост выручки от роста продаж (+25%)" color={C.green} sub="Постоянный" />
          <BigStat value="−350 000 ₽" label="Снижение себестоимости (−22% на единицу)" color={C.green} sub="Постоянный" />
          <BigStat value="−3 304 000 ₽" label="Высвобождение производственных активов" color={C.navy} sub="Разовый" />
          <BigStat value="−167 300 ₽" label="Высвобождение оборотных активов" color={C.navy} sub="Разовый" />
        </div>
        <div style={{ marginTop: 18, padding: 14, background: C.ice, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: C.navy, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Совокупный годовой эффект</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: C.navy }}>8 321 300 ₽</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>при инвестициях 1,5–2,0 млн ₽ · срок окупаемости 4–5 мес.</div>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
      <h3 style={{ margin: '0 0 4px', fontSize: 15, color: C.navy }}>{title}</h3>
      <p style={{ margin: '0 0 14px', fontSize: 11, color: C.textMuted }}>{subtitle}</p>
      {children}
    </div>
  );
}

function BigStat({ value, label, color, sub }) {
  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.4 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4, fontStyle: 'italic' }}>{sub}</div>}
    </div>
  );
}
