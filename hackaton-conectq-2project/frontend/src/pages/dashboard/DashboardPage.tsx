import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, CheckCircle, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { mockMetrics, mockHourlyUsage, mockDailyUsage } from '../../data/mock-dashboard';
import { cn, formatNumber } from '../../lib/utils';

const metricCards = [
  { label: 'Total llamadas', value: formatNumber(mockMetrics.totalCalls), icon: Activity, color: 'text-primary' },
  { label: 'Tasa de éxito', value: `${mockMetrics.successRate}%`, icon: CheckCircle, color: 'text-green-600' },
  { label: 'Tasa de error', value: `${mockMetrics.errorRate}%`, icon: AlertTriangle, color: 'text-red-500' },
  { label: 'Latencia promedio', value: `${mockMetrics.avgLatency}ms`, icon: Clock, color: 'text-blue-600' },
];

export default function DashboardPage() {
  const [view, setView] = useState<'hourly' | 'daily'>('hourly');
  const quotaPercent = (mockMetrics.quotaUsed / mockMetrics.quotaLimit) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Dashboard de Consumo</h1>
      <p className="text-bolivar-muted mb-6">Monitorea el uso de tus APIs en tiempo real.</p>

      {/* Metric cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metricCards.map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-bolivar-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-bolivar-muted">{m.label}</span>
              <m.icon className={cn('w-5 h-5', m.color)} />
            </div>
            <p className="text-2xl font-bold">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Quota alert */}
      {quotaPercent > 80 && (
        <div className={cn(
          'rounded-xl p-4 mb-6 flex items-center gap-3',
          quotaPercent >= 100 ? 'bg-red-50 border border-red-200' : 'bg-orange-50 border border-orange-200'
        )}>
          <AlertTriangle className={cn('w-5 h-5', quotaPercent >= 100 ? 'text-red-500' : 'text-orange-500')} />
          <div>
            <p className="font-medium text-sm">
              {quotaPercent >= 100
                ? 'Has alcanzado el 100% de tu cuota. Las llamadas adicionales serán rechazadas.'
                : `Has consumido el ${quotaPercent.toFixed(0)}% de tu cuota mensual.`}
            </p>
            <p className="text-xs text-bolivar-muted mt-0.5">{formatNumber(mockMetrics.quotaUsed)} / {formatNumber(mockMetrics.quotaLimit)} llamadas</p>
          </div>
        </div>
      )}

      {/* Quota bar */}
      <div className="bg-white rounded-xl border border-bolivar-border p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Cuota mensual</span>
          <span className="text-sm text-bolivar-muted">{formatNumber(mockMetrics.quotaUsed)} / {formatNumber(mockMetrics.quotaLimit)}</span>
        </div>
        <div className="w-full bg-bolivar-bg rounded-full h-3">
          <div
            className={cn('h-3 rounded-full transition-all', quotaPercent >= 100 ? 'bg-red-500' : quotaPercent > 80 ? 'bg-orange-400' : 'bg-primary')}
            style={{ width: `${Math.min(quotaPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white rounded-xl border border-bolivar-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Tendencia de consumo</h2>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setView('hourly')} className={cn('px-3 py-1 text-sm rounded-full', view === 'hourly' ? 'bg-primary text-white' : 'bg-bolivar-bg hover:bg-bolivar-border')}>
              Últimas 24h
            </button>
            <button onClick={() => setView('daily')} className={cn('px-3 py-1 text-sm rounded-full', view === 'daily' ? 'bg-primary text-white' : 'bg-bolivar-bg hover:bg-bolivar-border')}>
              Últimos 30d
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          {view === 'hourly' ? (
            <BarChart data={mockHourlyUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E1E1E1" />
              <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="calls" fill="#009056" radius={[4, 4, 0, 0]} name="Llamadas" />
              <Bar dataKey="errors" fill="#ef4444" radius={[4, 4, 0, 0]} name="Errores" />
            </BarChart>
          ) : (
            <AreaChart data={mockDailyUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E1E1E1" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="calls" stroke="#009056" fill="#E5F4EE" name="Llamadas" />
              <Area type="monotone" dataKey="errors" stroke="#ef4444" fill="#fee2e2" name="Errores" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
