import type { DashboardMetrics, HourlyUsage } from '../types';

export const mockMetrics: DashboardMetrics = {
  totalCalls: 12847,
  successRate: 97.3,
  errorRate: 2.7,
  avgLatency: 234,
  quotaUsed: 8500,
  quotaLimit: 10000,
};

export const mockHourlyUsage: HourlyUsage[] = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  calls: Math.floor(Math.random() * 800) + 100,
  errors: Math.floor(Math.random() * 30),
}));

export const mockDailyUsage = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    day: date.toLocaleDateString('es-CO', { month: 'short', day: 'numeric' }),
    calls: Math.floor(Math.random() * 2000) + 500,
    errors: Math.floor(Math.random() * 80),
  };
});
