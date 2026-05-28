import { CLIENTS, MODELS } from './data.js';

export const formatRub = (n) => new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₽';
export const formatHours = (n) => (n < 1 ? `${Math.round(n * 60)} мин` : `${n.toFixed(1)} ч`);
export const getClient = (id) => CLIENTS.find((c) => c.id === id);
export const getModel = (id) => MODELS.find((m) => m.id === id);
