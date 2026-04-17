import { useState } from 'react';
import {
  Search, Shield, Users, FileText, Download, AppWindow, GitBranch,
  BarChart3, AlertTriangle, CheckCircle, Clock, TrendingUp, Eye,
  Ban, UserCheck, KeyRound, Megaphone, PlusCircle, Ticket,
  MessageSquare, Tag, CircleDot
} from 'lucide-react';
import { mockOrganizations, mockAuditLogs, mockAdminApps, mockApiVersions } from '../../data/mock-admin';
import { cn, statusColor, statusLabel, formatNumber } from '../../lib/utils';
import LogoBolivar from '../../components/LogoBolivar';

type Tab = 'overview' | 'allies' | 'apps' | 'apis' | 'audit' | 'comms' | 'tickets';

const stats = {
  totalAllies: mockOrganizations.length,
  activeAllies: mockOrganizations.filter((o) => o.status === 'active').length,
  pendingAllies: mockOrganizations.filter((o) => o.status === 'pending_approval').length,
  totalApps: mockAdminApps.length,
  totalCalls: 847320,
  errorRate: 2.1,
  revenue: 12450000,
};

interface TicketItem {
  id: string; key: string; title: string;
  type: 'bug' | 'feature' | 'task' | 'improvement';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
  assignee: string; reporter: string; createdAt: string; updatedAt: string;
  labels: string[]; comments: number; ally?: string;
}

const mockTickets: TicketItem[] = [
  { id: '1', key: 'CON-101', title: 'Error 500 al cotizar seguro de hogar con datos incompletos', type: 'bug', priority: 'critical', status: 'in_progress', assignee: 'Carlos Rodríguez', reporter: 'Rappi Colombia', createdAt: '2026-04-16', updatedAt: '2026-04-17', labels: ['cotización', 'producción'], comments: 5, ally: 'Rappi Colombia' },
  { id: '2', key: 'CON-102', title: 'Agregar endpoint de renovación automática de pólizas', type: 'feature', priority: 'high', status: 'review', assignee: 'Ana Martínez', reporter: 'Nequi S.A.', createdAt: '2026-04-14', updatedAt: '2026-04-17', labels: ['renovaciones', 'api-v2'], comments: 8, ally: 'Nequi S.A.' },
  { id: '3', key: 'CON-103', title: 'Latencia alta en endpoint de verificación SARLAFT', type: 'bug', priority: 'high', status: 'in_progress', assignee: 'Diego López', reporter: 'Bancolombia', createdAt: '2026-04-15', updatedAt: '2026-04-16', labels: ['sarlaft', 'performance'], comments: 3, ally: 'Bancolombia' },
  { id: '4', key: 'CON-104', title: 'Implementar webhook de notificación de cambio de estado de póliza', type: 'feature', priority: 'medium', status: 'todo', assignee: 'Ana Martínez', reporter: 'Lulo Bank', createdAt: '2026-04-13', updatedAt: '2026-04-13', labels: ['webhooks', 'notificaciones'], comments: 2, ally: 'Lulo Bank' },
  { id: '5', key: 'CON-105', title: 'Documentar flujo de pagos con PSE en sandbox', type: 'task', priority: 'medium', status: 'done', assignee: 'Laura García', reporter: 'Equipo interno', createdAt: '2026-04-10', updatedAt: '2026-04-15', labels: ['documentación', 'sandbox'], comments: 1 },
  { id: '6', key: 'CON-106', title: 'Mejorar validación de NIT en onboarding', type: 'improvement', priority: 'low', status: 'backlog', assignee: 'Sin asignar', reporter: 'Equipo interno', createdAt: '2026-04-12', updatedAt: '2026-04-12', labels: ['onboarding', 'validación'], comments: 0 },
  { id: '7', key: 'CON-107', title: 'Rate limiting no aplica correctamente en plan transaccional', type: 'bug', priority: 'high', status: 'todo', assignee: 'Diego López', reporter: 'Addi S.A.S.', createdAt: '2026-04-16', updatedAt: '2026-04-16', labels: ['rate-limiting', 'billing'], comments: 4, ally: 'Addi S.A.S.' },
  { id: '8', key: 'CON-108', title: 'Agregar soporte MCP para agentes de IA', type: 'feature', priority: 'medium', status: 'in_progress', assignee: 'Carlos Rodríguez', reporter: 'Equipo interno', createdAt: '2026-04-08', updatedAt: '2026-04-17', labels: ['mcp', 'ia', 'innovación'], comments: 12 },
  { id: '9', key: 'CON-109', title: 'Migrar aliados de API Modificaciones v1 a v2', type: 'task', priority: 'high', status: 'in_progress', assignee: 'Laura García', reporter: 'Equipo interno', createdAt: '2026-04-05', updatedAt: '2026-04-16', labels: ['migración', 'deprecación'], comments: 6 },
  { id: '10', key: 'CON-110', title: 'Dashboard: agregar filtro por aplicación individual', type: 'improvement', priority: 'low', status: 'done', assignee: 'Ana Martínez', reporter: 'Falabella CO', createdAt: '2026-04-01', updatedAt: '2026-04-14', labels: ['dashboard', 'ux'], comments: 3, ally: 'Falabella CO' },
  { id: '11', key: 'CON-111', title: 'Timeout en emisión de póliza cuando el servicio legacy no responde', type: 'bug', priority: 'critical', status: 'todo', assignee: 'Diego López', reporter: 'Rappi Colombia', createdAt: '2026-04-17', updatedAt: '2026-04-17', labels: ['emisión', 'legacy', 'timeout'], comments: 2, ally: 'Rappi Colombia' },
  { id: '12', key: 'CON-112', title: 'Exportar métricas de consumo en formato CSV', type: 'task', priority: 'medium', status: 'done', assignee: 'Laura García', reporter: 'Equipo interno', createdAt: '2026-04-03', updatedAt: '2026-04-11', labels: ['dashboard', 'exportación'], comments: 1 },
];

const typeConf: Record<string, { label: string; color: string; bg: string }> = {
  bug: { label: 'Bug', color: 'text-red-700', bg: 'bg-red-100' },
  feature: { label: 'Feature', color: 'text-purple-700', bg: 'bg-purple-100' },
  task: { label: 'Tarea', color: 'text-blue-700', bg: 'bg-blue-100' },
  improvement: { label: 'Mejora', color: 'text-teal-700', bg: 'bg-teal-100' },
};
const prioConf: Record<string, { label: string; icon: string }> = {
  critical: { label: 'Crítica', icon: '🔴' },
  high: { label: 'Alta', icon: '🟠' },
  medium: { label: 'Media', icon: '🟡' },
  low: { label: 'Baja', icon: '🔵' },
};
const statusConf: Record<string, { label: string; color: string; bg: string }> = {
  backlog: { label: 'Backlog', color: 'text-gray-700', bg: 'bg-gray-100' },
  todo: { label: 'Por hacer', color: 'text-blue-700', bg: 'bg-blue-100' },
  in_progress: { label: 'En progreso', color: 'text-primary', bg: 'bg-primary-light' },
  review: { label: 'En revisión', color: 'text-purple-700', bg: 'bg-purple-100' },
  done: { label: 'Completado', color: 'text-green-700', bg: 'bg-green-100' },
};


/* ── inline mock: communications ── */
const mockComms = [
  { id: 'c1', type: 'banner' as const, title: 'Mantenimiento programado API Cotización — 20 Abr 02:00-04:00', date: '2026-04-17', pinned: true },
  { id: 'c2', type: 'email' as const, title: 'Nuevas tarifas de plan transaccional vigentes desde mayo', date: '2026-04-15', pinned: false },
  { id: 'c3', type: 'changelog' as const, title: 'API Emisión v1.3 — soporte de pólizas colectivas', date: '2026-04-12', pinned: false },
  { id: 'c4', type: 'banner' as const, title: 'Bienvenidos a Conecta 2.0 — nuevo portal de aliados', date: '2026-04-01', pinned: true },
];

const commTypeLabel: Record<string, string> = { banner: 'Banner', email: 'Email', changelog: 'Changelog' };

/* ================================================================== */
/*  COMPONENT                                                         */
/* ================================================================== */

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const [allySearch, setAllySearch] = useState('');
  const [allyStatusFilter, setAllyStatusFilter] = useState('all');
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketTypeFilter, setTicketTypeFilter] = useState('all');
  const [ticketPrioFilter, setTicketPrioFilter] = useState('all');
  const [ticketStatusFilter, setTicketStatusFilter] = useState('all');
  const [ticketView, setTicketView] = useState<'list' | 'board'>('list');

  /* ── derived data ── */
  const filteredAllies = mockOrganizations.filter((o) => {
    const matchSearch = o.name.toLowerCase().includes(allySearch.toLowerCase()) || o.nit.includes(allySearch);
    const matchStatus = allyStatusFilter === 'all' || o.status === allyStatusFilter;
    return matchSearch && matchStatus;
  });

  const filteredTickets = mockTickets.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(ticketSearch.toLowerCase()) || t.key.toLowerCase().includes(ticketSearch.toLowerCase());
    const matchType = ticketTypeFilter === 'all' || t.type === ticketTypeFilter;
    const matchPrio = ticketPrioFilter === 'all' || t.priority === ticketPrioFilter;
    const matchStatus = ticketStatusFilter === 'all' || t.status === ticketStatusFilter;
    return matchSearch && matchType && matchPrio && matchStatus;
  });

  const ticketStats = {
    total: mockTickets.length,
    criticalOpen: mockTickets.filter((t) => t.priority === 'critical' && t.status !== 'done').length,
    inProgress: mockTickets.filter((t) => t.status === 'in_progress').length,
    inReview: mockTickets.filter((t) => t.status === 'review').length,
    doneThisWeek: mockTickets.filter((t) => t.status === 'done').length,
  };

  const boardColumns: { key: TicketItem['status']; label: string }[] = [
    { key: 'backlog', label: 'Backlog' },
    { key: 'todo', label: 'Por hacer' },
    { key: 'in_progress', label: 'En progreso' },
    { key: 'review', label: 'En revisión' },
    { key: 'done', label: 'Completado' },
  ];

  const pendingOrgs = mockOrganizations.filter((o) => o.status === 'pending_approval');
  const topConsumers = [...mockAdminApps].sort((a, b) => b.quotaUsed - a.quotaUsed).slice(0, 5);

  /* ── tabs config ── */
  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Resumen', icon: <BarChart3 size={16} /> },
    { key: 'allies', label: 'Aliados', icon: <Users size={16} /> },
    { key: 'apps', label: 'Aplicaciones', icon: <AppWindow size={16} /> },
    { key: 'apis', label: 'APIs', icon: <GitBranch size={16} /> },
    { key: 'audit', label: 'Auditoría', icon: <FileText size={16} /> },
    { key: 'comms', label: 'Comunicaciones', icon: <Megaphone size={16} /> },
    { key: 'tickets', label: 'Tickets', icon: <Ticket size={16} /> },
  ];

  /* ================================================================ */
  /*  RENDER                                                          */
  /* ================================================================ */
  return (
    <div className="min-h-screen bg-bolivar-bg">
      {/* ── Header ── */}
      <header className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoBolivar variant="icon" theme="light" />
            <div>
              <h1 className="text-xl font-bold leading-tight">Panel de Administración</h1>
              <p className="text-sm text-white/70">Conecta 2.0 — Ecosistema de APIs</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={20} />
            <span className="text-sm font-medium">Super Admin</span>
          </div>
        </div>
      </header>

      {/* ── Tabs ── */}
      <nav className="bg-white border-b border-bolivar-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                tab === t.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-bolivar-muted hover:text-bolivar-text hover:border-bolivar-border',
              )}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ============================================================ */}
        {/*  TAB: OVERVIEW                                               */}
        {/* ============================================================ */}
        {tab === 'overview' && (
          <>
            {/* Metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Aliados activos', value: stats.activeAllies, icon: <Users size={20} className="text-primary" />, sub: `de ${stats.totalAllies} registrados` },
                { label: 'Pendientes aprobación', value: stats.pendingAllies, icon: <Clock size={20} className="text-orange-500" />, sub: 'requieren revisión' },
                { label: 'Llamadas este mes', value: stats.totalCalls, icon: <TrendingUp size={20} className="text-blue-500" />, sub: `${stats.errorRate}% tasa de error` },
                { label: 'Ingresos estimados', value: stats.revenue, icon: <BarChart3 size={20} className="text-primary-dark" />, sub: 'COP este mes', prefix: '$' },
              ].map((m) => (
                <div key={m.label} className="bg-white rounded-lg border border-bolivar-border p-5 flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-bolivar-bg">{m.icon}</div>
                  <div>
                    <p className="text-sm text-bolivar-muted">{m.label}</p>
                    <p className="text-2xl font-bold text-bolivar-text">{m.prefix ?? ''}{formatNumber(m.value)}</p>
                    <p className="text-xs text-bolivar-muted mt-0.5">{m.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending approvals */}
              <div className="bg-white rounded-lg border border-bolivar-border p-5">
                <h2 className="text-base font-semibold text-bolivar-text mb-4 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-orange-500" /> Pendientes de aprobación
                </h2>
                {pendingOrgs.length === 0 ? (
                  <p className="text-sm text-bolivar-muted">No hay aliados pendientes.</p>
                ) : (
                  <ul className="divide-y divide-bolivar-border">
                    {pendingOrgs.map((o) => (
                      <li key={o.id} className="py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-bolivar-text">{o.name}</p>
                          <p className="text-xs text-bolivar-muted">NIT {o.nit} · {o.companyType}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-xs px-3 py-1 rounded bg-primary text-white hover:bg-primary-dark transition-colors">Aprobar</button>
                          <button className="text-xs px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors">Rechazar</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Top consumers */}
              <div className="bg-white rounded-lg border border-bolivar-border p-5">
                <h2 className="text-base font-semibold text-bolivar-text mb-4 flex items-center gap-2">
                  <TrendingUp size={18} className="text-primary" /> Top consumidores
                </h2>
                <ul className="divide-y divide-bolivar-border">
                  {topConsumers.map((a) => (
                    <li key={a.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-bolivar-text">{a.name}</p>
                        <p className="text-xs text-bolivar-muted">{a.organizationName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-bolivar-text">{formatNumber(a.quotaUsed)}</p>
                        <div className="w-24 h-1.5 bg-bolivar-border rounded-full mt-1">
                          <div
                            className={cn('h-full rounded-full', a.quotaUsed / a.quotaLimit > 0.9 ? 'bg-red-500' : 'bg-primary')}
                            style={{ width: `${Math.min((a.quotaUsed / a.quotaLimit) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {/* ============================================================ */}
        {/*  TAB: ALLIES                                                 */}
        {/* ============================================================ */}
        {tab === 'allies' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-bolivar-muted" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o NIT…"
                  value={allySearch}
                  onChange={(e) => setAllySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-bolivar-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <select
                value={allyStatusFilter}
                onChange={(e) => setAllyStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-bolivar-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="pending_approval">Pendientes</option>
                <option value="suspended">Suspendidos</option>
                <option value="rejected">Rechazados</option>
              </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-bolivar-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-bolivar-bg text-left text-bolivar-muted">
                      <th className="px-4 py-3 font-medium">Organización</th>
                      <th className="px-4 py-3 font-medium">NIT</th>
                      <th className="px-4 py-3 font-medium">Tipo</th>
                      <th className="px-4 py-3 font-medium">Estado</th>
                      <th className="px-4 py-3 font-medium">Apps</th>
                      <th className="px-4 py-3 font-medium">Registro</th>
                      <th className="px-4 py-3 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bolivar-border">
                    {filteredAllies.map((o) => (
                      <tr key={o.id} className="hover:bg-bolivar-bg/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-bolivar-text">{o.name}</td>
                        <td className="px-4 py-3 text-bolivar-muted">{o.nit}</td>
                        <td className="px-4 py-3 text-bolivar-muted capitalize">{o.companyType}</td>
                        <td className="px-4 py-3">
                          <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', statusColor(o.status))}>
                            {statusLabel(o.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-bolivar-muted">{o.appsCount}</td>
                        <td className="px-4 py-3 text-bolivar-muted">{o.createdAt}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5">
                            {o.status === 'pending_approval' && (
                              <>
                                <button className="p-1 rounded hover:bg-green-100 text-green-700" title="Aprobar"><UserCheck size={16} /></button>
                                <button className="p-1 rounded hover:bg-red-100 text-red-700" title="Rechazar"><Ban size={16} /></button>
                              </>
                            )}
                            {o.status === 'active' && (
                              <button className="p-1 rounded hover:bg-red-100 text-red-700" title="Suspender"><Ban size={16} /></button>
                            )}
                            <button className="p-1 rounded hover:bg-bolivar-bg text-bolivar-muted" title="Ver detalle"><Eye size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredAllies.length === 0 && (
                <p className="text-center text-sm text-bolivar-muted py-8">No se encontraron aliados.</p>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB: APPS                                                   */}
        {/* ============================================================ */}
        {tab === 'apps' && (
          <div className="space-y-4">
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Total aplicaciones', value: stats.totalApps, icon: <AppWindow size={18} className="text-primary" /> },
                { label: 'Activas', value: mockAdminApps.filter((a) => a.status === 'active').length, icon: <CheckCircle size={18} className="text-green-600" /> },
                { label: 'Suspendidas', value: mockAdminApps.filter((a) => a.status === 'suspended').length, icon: <Ban size={18} className="text-red-500" /> },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-lg border border-bolivar-border p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-bolivar-bg">{s.icon}</div>
                  <div>
                    <p className="text-xs text-bolivar-muted">{s.label}</p>
                    <p className="text-xl font-bold text-bolivar-text">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-bolivar-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-bolivar-bg text-left text-bolivar-muted">
                      <th className="px-4 py-3 font-medium">Aplicación</th>
                      <th className="px-4 py-3 font-medium">Organización</th>
                      <th className="px-4 py-3 font-medium">Plan</th>
                      <th className="px-4 py-3 font-medium">Estado</th>
                      <th className="px-4 py-3 font-medium">Consumo</th>
                      <th className="px-4 py-3 font-medium">API Key</th>
                      <th className="px-4 py-3 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bolivar-border">
                    {mockAdminApps.map((a) => (
                      <tr key={a.id} className="hover:bg-bolivar-bg/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-bolivar-text">{a.name}</td>
                        <td className="px-4 py-3 text-bolivar-muted">{a.organizationName}</td>
                        <td className="px-4 py-3">
                          <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', a.plan === 'monthly' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700')}>
                            {a.plan === 'monthly' ? 'Mensual' : 'Transaccional'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', statusColor(a.status))}>
                            {statusLabel(a.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-bolivar-border rounded-full">
                              <div
                                className={cn('h-full rounded-full', a.quotaUsed / a.quotaLimit > 0.9 ? 'bg-red-500' : 'bg-primary')}
                                style={{ width: `${Math.min((a.quotaUsed / a.quotaLimit) * 100, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-bolivar-muted">{formatNumber(a.quotaUsed)}/{formatNumber(a.quotaLimit)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-bolivar-muted">{a.apiKeySuffix}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5">
                            <button className="p-1 rounded hover:bg-bolivar-bg text-bolivar-muted" title="Rotar API Key"><KeyRound size={16} /></button>
                            {a.status === 'active' ? (
                              <button className="p-1 rounded hover:bg-red-100 text-red-700" title="Suspender"><Ban size={16} /></button>
                            ) : (
                              <button className="p-1 rounded hover:bg-green-100 text-green-700" title="Reactivar"><CheckCircle size={16} /></button>
                            )}
                            <button className="p-1 rounded hover:bg-bolivar-bg text-bolivar-muted" title="Ver detalle"><Eye size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB: APIS                                                   */}
        {/* ============================================================ */}
        {tab === 'apis' && (
          <div className="bg-white rounded-lg border border-bolivar-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-bolivar-bg text-left text-bolivar-muted">
                    <th className="px-4 py-3 font-medium">API</th>
                    <th className="px-4 py-3 font-medium">Versión</th>
                    <th className="px-4 py-3 font-medium">Estado</th>
                    <th className="px-4 py-3 font-medium">Publicada</th>
                    <th className="px-4 py-3 font-medium">Retiro</th>
                    <th className="px-4 py-3 font-medium">Consumidores</th>
                    <th className="px-4 py-3 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bolivar-border">
                  {mockApiVersions.map((v) => (
                    <tr key={v.id} className="hover:bg-bolivar-bg/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-bolivar-text">{v.apiName}</td>
                      <td className="px-4 py-3 font-mono text-bolivar-muted">{v.version}</td>
                      <td className="px-4 py-3">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', statusColor(v.status))}>
                          {statusLabel(v.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-bolivar-muted">{v.publishedAt}</td>
                      <td className="px-4 py-3 text-bolivar-muted">{v.retirementDate ?? '—'}</td>
                      <td className="px-4 py-3 text-bolivar-muted">{v.consumers}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          {v.status === 'active' && (
                            <button className="text-xs px-2.5 py-1 rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors">Deprecar</button>
                          )}
                          {v.status === 'deprecated' && (
                            <button className="text-xs px-2.5 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors">Retirar</button>
                          )}
                          <button className="p-1 rounded hover:bg-bolivar-bg text-bolivar-muted" title="Ver detalle"><Eye size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB: AUDIT                                                  */}
        {/* ============================================================ */}
        {tab === 'audit' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors">
                <Download size={16} /> Exportar CSV
              </button>
            </div>
            <div className="bg-white rounded-lg border border-bolivar-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-bolivar-bg text-left text-bolivar-muted">
                      <th className="px-4 py-3 font-medium">Correlation ID</th>
                      <th className="px-4 py-3 font-medium">Acción</th>
                      <th className="px-4 py-3 font-medium">Endpoint</th>
                      <th className="px-4 py-3 font-medium">Método</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Latencia</th>
                      <th className="px-4 py-3 font-medium">Organización</th>
                      <th className="px-4 py-3 font-medium">IP</th>
                      <th className="px-4 py-3 font-medium">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bolivar-border">
                    {mockAuditLogs.slice(0, 20).map((log) => (
                      <tr key={log.id} className="hover:bg-bolivar-bg/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-bolivar-muted">{log.correlationId}</td>
                        <td className="px-4 py-3 text-bolivar-text">{log.action}</td>
                        <td className="px-4 py-3 font-mono text-xs text-bolivar-muted">{log.endpoint}</td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            'text-xs px-2 py-0.5 rounded font-medium',
                            log.method === 'GET' ? 'bg-blue-100 text-blue-700' : log.method === 'POST' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700',
                          )}>
                            {log.method}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            'text-xs px-2 py-0.5 rounded font-medium',
                            log.statusCode < 300 ? 'bg-green-100 text-green-700' : log.statusCode < 500 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700',
                          )}>
                            {log.statusCode}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-bolivar-muted">{log.responseTimeMs} ms</td>
                        <td className="px-4 py-3 text-bolivar-muted">{log.organizationName}</td>
                        <td className="px-4 py-3 font-mono text-xs text-bolivar-muted">{log.ipAddress}</td>
                        <td className="px-4 py-3 text-bolivar-muted text-xs">{new Date(log.createdAt).toLocaleString('es-CO')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB: COMMS                                                  */}
        {/* ============================================================ */}
        {tab === 'comms' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors">
                <PlusCircle size={16} /> Nueva comunicación
              </button>
            </div>
            <div className="bg-white rounded-lg border border-bolivar-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-bolivar-bg text-left text-bolivar-muted">
                      <th className="px-4 py-3 font-medium">Tipo</th>
                      <th className="px-4 py-3 font-medium">Título</th>
                      <th className="px-4 py-3 font-medium">Fecha</th>
                      <th className="px-4 py-3 font-medium">Fijado</th>
                      <th className="px-4 py-3 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bolivar-border">
                    {mockComms.map((c) => (
                      <tr key={c.id} className="hover:bg-bolivar-bg/50 transition-colors">
                        <td className="px-4 py-3">
                          <span className={cn(
                            'text-xs px-2 py-0.5 rounded-full font-medium',
                            c.type === 'banner' ? 'bg-secondary text-bolivar-text' : c.type === 'email' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700',
                          )}>
                            {commTypeLabel[c.type]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-bolivar-text">{c.title}</td>
                        <td className="px-4 py-3 text-bolivar-muted">{c.date}</td>
                        <td className="px-4 py-3">{c.pinned ? <span className="text-primary font-medium text-xs">📌 Sí</span> : <span className="text-bolivar-muted text-xs">No</span>}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5">
                            <button className="text-xs px-2.5 py-1 rounded bg-bolivar-bg text-bolivar-text hover:bg-bolivar-border transition-colors">Editar</button>
                            <button className="text-xs px-2.5 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors">Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB: TICKETS                                                */}
        {/* ============================================================ */}
        {tab === 'tickets' && (
          <div className="space-y-5">
            {/* Metric cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { label: 'Total tickets', value: ticketStats.total, icon: <Ticket size={18} className="text-primary" /> },
                { label: 'Críticos abiertos', value: ticketStats.criticalOpen, icon: <AlertTriangle size={18} className="text-red-500" /> },
                { label: 'En progreso', value: ticketStats.inProgress, icon: <Clock size={18} className="text-orange-500" /> },
                { label: 'En revisión', value: ticketStats.inReview, icon: <Eye size={18} className="text-purple-500" /> },
                { label: 'Completados semana', value: ticketStats.doneThisWeek, icon: <CheckCircle size={18} className="text-green-600" /> },
              ].map((m) => (
                <div key={m.label} className="bg-white rounded-lg border border-bolivar-border p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-bolivar-bg">{m.icon}</div>
                  <div>
                    <p className="text-xs text-bolivar-muted">{m.label}</p>
                    <p className="text-xl font-bold text-bolivar-text">{m.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters + view toggle */}
            <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-bolivar-muted" />
                  <input
                    type="text"
                    placeholder="Buscar por título o key…"
                    value={ticketSearch}
                    onChange={(e) => setTicketSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-bolivar-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <select value={ticketTypeFilter} onChange={(e) => setTicketTypeFilter(e.target.value)} className="px-3 py-2 text-sm border border-bolivar-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="all">Todos los tipos</option>
                  <option value="bug">Bug</option>
                  <option value="feature">Feature</option>
                  <option value="task">Tarea</option>
                  <option value="improvement">Mejora</option>
                </select>
                <select value={ticketPrioFilter} onChange={(e) => setTicketPrioFilter(e.target.value)} className="px-3 py-2 text-sm border border-bolivar-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="all">Todas las prioridades</option>
                  <option value="critical">Crítica</option>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
                <select value={ticketStatusFilter} onChange={(e) => setTicketStatusFilter(e.target.value)} className="px-3 py-2 text-sm border border-bolivar-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="all">Todos los estados</option>
                  <option value="backlog">Backlog</option>
                  <option value="todo">Por hacer</option>
                  <option value="in_progress">En progreso</option>
                  <option value="review">En revisión</option>
                  <option value="done">Completado</option>
                </select>
              </div>

              {/* View toggle */}
              <div className="flex rounded-lg border border-bolivar-border overflow-hidden">
                <button
                  onClick={() => setTicketView('list')}
                  className={cn('px-4 py-2 text-sm font-medium transition-colors', ticketView === 'list' ? 'bg-primary text-white' : 'bg-white text-bolivar-muted hover:bg-bolivar-bg')}
                >
                  Lista
                </button>
                <button
                  onClick={() => setTicketView('board')}
                  className={cn('px-4 py-2 text-sm font-medium transition-colors', ticketView === 'board' ? 'bg-primary text-white' : 'bg-white text-bolivar-muted hover:bg-bolivar-bg')}
                >
                  Board
                </button>
              </div>
            </div>

            {/* ── List view ── */}
            {ticketView === 'list' && (
              <div className="bg-white rounded-lg border border-bolivar-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-bolivar-bg text-left text-bolivar-muted">
                        <th className="px-4 py-3 font-medium">Key</th>
                        <th className="px-4 py-3 font-medium">Tipo</th>
                        <th className="px-4 py-3 font-medium">Prioridad</th>
                        <th className="px-4 py-3 font-medium">Título</th>
                        <th className="px-4 py-3 font-medium">Estado</th>
                        <th className="px-4 py-3 font-medium">Asignado</th>
                        <th className="px-4 py-3 font-medium">Aliado</th>
                        <th className="px-4 py-3 font-medium">Labels</th>
                        <th className="px-4 py-3 font-medium"><MessageSquare size={14} /></th>
                        <th className="px-4 py-3 font-medium">Actualizado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-bolivar-border">
                      {filteredTickets.map((t) => {
                        const tc = typeConf[t.type];
                        const pc = prioConf[t.priority];
                        const sc = statusConf[t.status];
                        return (
                          <tr key={t.id} className="hover:bg-bolivar-bg/50 transition-colors cursor-pointer">
                            <td className="px-4 py-3 font-mono text-xs font-semibold text-primary">{t.key}</td>
                            <td className="px-4 py-3">
                              <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', tc.bg, tc.color)}>{tc.label}</span>
                            </td>
                            <td className="px-4 py-3 text-center" title={pc.label}>{pc.icon}</td>
                            <td className="px-4 py-3 text-bolivar-text max-w-xs truncate">{t.title}</td>
                            <td className="px-4 py-3">
                              <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', sc.bg, sc.color)}>{sc.label}</span>
                            </td>
                            <td className="px-4 py-3 text-bolivar-muted text-xs">{t.assignee}</td>
                            <td className="px-4 py-3 text-bolivar-muted text-xs">{t.ally ?? '—'}</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {t.labels.map((l) => (
                                  <span key={l} className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-bolivar-bg text-bolivar-muted border border-bolivar-border">
                                    <Tag size={10} />{l}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-bolivar-muted text-xs">
                              <span className="inline-flex items-center gap-1"><MessageSquare size={12} />{t.comments}</span>
                            </td>
                            <td className="px-4 py-3 text-bolivar-muted text-xs">{t.updatedAt}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {filteredTickets.length === 0 && (
                  <p className="text-center text-sm text-bolivar-muted py-8">No se encontraron tickets.</p>
                )}
              </div>
            )}

            {/* ── Board (Kanban) view ── */}
            {ticketView === 'board' && (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {boardColumns.map((col) => {
                  const colTickets = filteredTickets.filter((t) => t.status === col.key);
                  const sc = statusConf[col.key];
                  return (
                    <div key={col.key} className="flex-shrink-0 w-72 bg-bolivar-bg rounded-lg border border-bolivar-border">
                      {/* Column header */}
                      <div className="px-3 py-2.5 border-b border-bolivar-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CircleDot size={14} className={sc.color} />
                          <span className="text-sm font-semibold text-bolivar-text">{col.label}</span>
                        </div>
                        <span className="text-xs font-medium text-bolivar-muted bg-white px-2 py-0.5 rounded-full border border-bolivar-border">{colTickets.length}</span>
                      </div>
                      {/* Cards */}
                      <div className="p-2 space-y-2 min-h-[120px]">
                        {colTickets.length === 0 && (
                          <p className="text-xs text-bolivar-muted text-center py-6">Sin tickets</p>
                        )}
                        {colTickets.map((t) => {
                          const tc = typeConf[t.type];
                          const pc = prioConf[t.priority];
                          return (
                            <div key={t.id} className="bg-white rounded-lg border border-bolivar-border p-3 hover:shadow-sm transition-shadow cursor-pointer">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-mono text-xs font-semibold text-primary">{t.key}</span>
                                <span title={pc.label}>{pc.icon}</span>
                              </div>
                              <p className="text-sm text-bolivar-text leading-snug mb-2 line-clamp-2">{t.title}</p>
                              <div className="flex items-center justify-between">
                                <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', tc.bg, tc.color)}>{tc.label}</span>
                                <div className="flex items-center gap-2 text-bolivar-muted">
                                  {t.comments > 0 && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px]"><MessageSquare size={10} />{t.comments}</span>
                                  )}
                                  <span className="text-[10px] truncate max-w-[80px]">{t.assignee}</span>
                                </div>
                              </div>
                              {t.labels.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {t.labels.slice(0, 2).map((l) => (
                                    <span key={l} className="text-[9px] px-1 py-0.5 rounded bg-bolivar-bg text-bolivar-muted border border-bolivar-border">{l}</span>
                                  ))}
                                  {t.labels.length > 2 && <span className="text-[9px] text-bolivar-muted">+{t.labels.length - 2}</span>}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}