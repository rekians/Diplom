// ====== СПРАВОЧНИКИ ======
// Эти данные не меняются от действий пользователя — клиенты, модели, этапы производства.

export const CLIENTS = [
  { id: 'C1', name: 'ООО «Детский мир-НН»', type: 'Розничная сеть' },
  { id: 'C2', name: 'МБДОУ «Солнышко» №42', type: 'Детский сад' },
  { id: 'C3', name: 'Перинатальный центр НН', type: 'Медучреждение' },
  { id: 'C4', name: 'Иванова А. С.', type: 'Физлицо' },
  { id: 'C5', name: 'Wildberries (агрегатор)', type: 'Маркетплейс' },
  { id: 'C6', name: 'Петров В. И.', type: 'Физлицо' },
];

export const MODELS = [
  { id: 'M1', name: 'Кроватка «Овальная Премиум»', price: 12000 },
  { id: 'M2', name: 'Кроватка «Прямоугольная Стандарт»', price: 9000 },
  { id: 'M3', name: 'Кроватка «Эко-малыш»', price: 11500 },
];

// Этапы производства целевой системы (по карте VSM TO-BE и архитектуре прототипа)
export const STAGES = [
  { id: 's1', name: 'Раскрой', short: 'Раскрой', target: 0.15 },
  { id: 's2', name: 'Мех. обработка', short: 'Обработка', target: 0.15 },
  { id: 's3', name: 'Шлифовка', short: 'Шлифовка', target: 0.10 },
  { id: 's4', name: 'ЛКП', short: 'ЛКП', target: 6.15 },
  { id: 's5', name: 'Сборка', short: 'Сборка', target: 0.12 },
  { id: 's6', name: 'Контроль', short: 'Контроль', target: 0.08 },
  { id: 's7', name: 'Упаковка', short: 'Упаковка', target: 0.08 },
];

// Нормы расхода материалов на единицу продукции (упрощённо для MVP)
// При переходе заказа на соответствующий передел происходит списание из супермаркета:
// Раскрой → ЛДСП, МДФ (зависит от модели); Шлифовка → шурупы; ЛКП → клей, лак.
export const STAGE_CONSUMPTION = {
  0: { // Раскрой (индекс 0) → списываем ЛДСП, МДФ, брус
    M1: { r1: 0.6, r2: 0.3, r3: 0.4 }, // Овальная Премиум: больше берёзы (r3)
    M2: { r1: 0.5, r2: 0.4, r3: 0.0 }, // Прямоугольная Стандарт: ЛДСП+МДФ, без массива
    M3: { r1: 0.4, r2: 0.3, r3: 0.5 }, // Эко-малыш: берёза + ЛДСП
  },
  2: { // Шлифовка (индекс 2) → списываем шурупы (для последующей сборки)
    M1: { r5: 0.5 },
    M2: { r5: 0.4 },
    M3: { r5: 0.4 },
  },
  3: { // ЛКП (индекс 3) → списываем клей и лак
    M1: { r4: 0.3, r6: 0.2 },
    M2: { r4: 0.25, r6: 0.15 },
    M3: { r4: 0.3, r6: 0.25 },
  },
};

// ====== НАЧАЛЬНЫЕ ДАННЫЕ ======

export const initialOrders = [
  { id: 'ORD-2026-0142', clientId: 'C1', modelId: 'M2', qty: 50, deadline: '2026-05-04', status: 'in_production', stageIdx: 4, startedAt: '2026-04-26 09:00', timeOnStage: 0.05, consumed: { s0: true, s2: true, s3: true } },
  { id: 'ORD-2026-0143', clientId: 'C2', modelId: 'M3', qty: 25, deadline: '2026-05-06', status: 'in_production', stageIdx: 3, startedAt: '2026-04-26 11:30', timeOnStage: 2.4, consumed: { s0: true, s2: true, s3: true } },
  { id: 'ORD-2026-0144', clientId: 'C3', modelId: 'M1', qty: 12, deadline: '2026-05-02', status: 'in_production', stageIdx: 6, startedAt: '2026-04-25 14:00', timeOnStage: 0.04, consumed: { s0: true, s2: true, s3: true } },
  { id: 'ORD-2026-0145', clientId: 'C4', modelId: 'M1', qty: 1, deadline: '2026-05-08', status: 'in_production', stageIdx: 0, startedAt: '2026-04-26 13:00', timeOnStage: 0.08, consumed: { s0: true } },
  { id: 'ORD-2026-0146', clientId: 'C5', modelId: 'M2', qty: 80, deadline: '2026-05-12', status: 'in_production', stageIdx: 1, startedAt: '2026-04-26 12:00', timeOnStage: 0.10, consumed: { s0: true } },
  { id: 'ORD-2026-0147', clientId: 'C6', modelId: 'M3', qty: 1, deadline: '2026-05-09', status: 'in_production', stageIdx: 5, startedAt: '2026-04-26 08:30', timeOnStage: 0.03, consumed: { s0: true, s2: true, s3: true } },
  { id: 'ORD-2026-0148', clientId: 'C1', modelId: 'M2', qty: 30, deadline: '2026-05-15', status: 'planned', stageIdx: -1, startedAt: null, timeOnStage: 0, consumed: {} },
  { id: 'ORD-2026-0149', clientId: 'C2', modelId: 'M1', qty: 6, deadline: '2026-05-18', status: 'planned', stageIdx: -1, startedAt: null, timeOnStage: 0, consumed: {} },
  { id: 'ORD-2026-0140', clientId: 'C5', modelId: 'M2', qty: 45, deadline: '2026-04-30', status: 'ready_to_ship', stageIdx: 7, startedAt: '2026-04-22 09:00', timeOnStage: 0, consumed: { s0: true, s2: true, s3: true } },
  { id: 'ORD-2026-0141', clientId: 'C4', modelId: 'M3', qty: 1, deadline: '2026-05-01', status: 'ready_to_ship', stageIdx: 7, startedAt: '2026-04-23 10:00', timeOnStage: 0, consumed: { s0: true, s2: true, s3: true } },
  { id: 'ORD-2026-0138', clientId: 'C3', modelId: 'M1', qty: 8, deadline: '2026-04-28', status: 'shipped', stageIdx: 7, startedAt: '2026-04-20 09:00', timeOnStage: 0, consumed: { s0: true, s2: true, s3: true }, shippedAt: '2026-04-26' },
];

// Супермаркеты — целевые объёмы по карте «Как должно быть» из xlsx
export const initialSupermarkets = {
  raw: [
    { id: 'r1', name: 'ЛДСП (лист 2750×1830)', current: 92, max: 115, min: 45, unit: 'лист', price: 2500 },
    { id: 'r2', name: 'МДФ (лист 2440×1220)', current: 38, max: 65, min: 25, unit: 'лист', price: 1800 },
    { id: 'r3', name: 'Брус берёзовый', current: 18, max: 80, min: 30, unit: 'м³', price: 15000 },
    { id: 'r4', name: 'Клей ПВА D3', current: 145, max: 160, min: 60, unit: 'кг', price: 400 },
    { id: 'r5', name: 'Шурупы (упак. 50 шт.)', current: 31, max: 38, min: 15, unit: 'упак.', price: 600 },
    { id: 'r6', name: 'Лак на водной основе', current: 19, max: 23, min: 8, unit: 'кан.', price: 800 },
  ],
  finished: [
    { id: 'f1', modelId: 'M1', name: 'Кроватка «Овальная Премиум»', current: 7, max: 12, min: 4, unit: 'шт.' },
    { id: 'f2', modelId: 'M2', name: 'Кроватка «Прямоугольная Стандарт»', current: 14, max: 18, min: 6, unit: 'шт.' },
    { id: 'f3', modelId: 'M3', name: 'Кроватка «Эко-малыш»', current: 3, max: 10, min: 4, unit: 'шт.' },
  ],
};

export const initialPurchaseRequests = [
  { id: 'PR-2026-0007', materialId: 'r3', qty: 62, status: 'pending', createdAt: '2026-04-26 10:15', autoGenerated: true },
];

// История за последние 7 дней — будет дополняться от действий пользователя
export const initialShippedHistory = [
  { day: 'Пн', shipped: 6, leadTimeAvg: 58 },
  { day: 'Вт', shipped: 8, leadTimeAvg: 52 },
  { day: 'Ср', shipped: 7, leadTimeAvg: 49 },
  { day: 'Чт', shipped: 9, leadTimeAvg: 45 },
  { day: 'Пт', shipped: 10, leadTimeAvg: 43 },
  { day: 'Сб', shipped: 4, leadTimeAvg: 41 },
  { day: 'Вс', shipped: 0, leadTimeAvg: 40 },
];

// Генератор последовательных ID для новых заказов и заявок
let nextOrderNum = 150;
export const nextOrderId = () => {
  const id = `ORD-2026-${String(nextOrderNum).padStart(4, '0')}`;
  nextOrderNum += 1;
  return id;
};
let nextPrNum = 8;
export const nextPurchaseRequestId = () => {
  const id = `PR-2026-${String(nextPrNum).padStart(4, '0')}`;
  nextPrNum += 1;
  return id;
};
