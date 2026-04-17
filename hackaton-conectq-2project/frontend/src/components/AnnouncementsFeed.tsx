import { useState } from 'react';
import { Megaphone, Rocket, RefreshCw, Wrench, AlertTriangle, Newspaper, Pin, ChevronDown, ChevronUp, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { mockAnnouncements, type Announcement } from '../data/mock-announcements';

const typeConfig: Record<Announcement['type'], { icon: typeof Megaphone; label: string; color: string; bg: string }> = {
  new_api: { icon: Rocket, label: 'Nueva API', color: 'text-green-700', bg: 'bg-green-100' },
  update: { icon: RefreshCw, label: 'Actualización', color: 'text-blue-700', bg: 'bg-blue-100' },
  maintenance: { icon: Wrench, label: 'Mantenimiento', color: 'text-orange-700', bg: 'bg-orange-100' },
  deprecation: { icon: AlertTriangle, label: 'Deprecación', color: 'text-red-700', bg: 'bg-red-100' },
  news: { icon: Newspaper, label: 'Novedad', color: 'text-purple-700', bg: 'bg-purple-100' },
};

const filters: { value: string; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'new_api', label: 'Nuevas APIs' },
  { value: 'update', label: 'Actualizaciones' },
  { value: 'maintenance', label: 'Mantenimiento' },
  { value: 'deprecation', label: 'Deprecaciones' },
  { value: 'news', label: 'Novedades' },
];

function AnnouncementCard({ item }: { item: Announcement }) {
  const [expanded, setExpanded] = useState(false);
  const config = typeConfig[item.type];
  const Icon = config.icon;

  return (
    <div className={cn('bg-white rounded-xl border border-bolivar-border p-4 transition-shadow hover:shadow-md', item.pinned && 'ring-1 ring-primary/20')}>
      <div className="flex items-start gap-3">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', config.bg)}>
          <Icon className={cn('w-5 h-5', config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', config.bg, config.color)}>{config.label}</span>
            {item.pinned && (
              <span className="flex items-center gap-0.5 text-xs text-primary">
                <Pin className="w-3 h-3" /> Fijado
              </span>
            )}
            <span className="text-xs text-bolivar-muted ml-auto">{new Date(item.date).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
          <p className="text-xs text-bolivar-muted">{item.summary}</p>

          {expanded && (
            <div className="mt-3 pt-3 border-t border-bolivar-border">
              <p className="text-sm text-bolivar-text leading-relaxed">{item.content}</p>
            </div>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-primary hover:underline mt-2"
          >
            {expanded ? <><ChevronUp className="w-3 h-3" /> Ver menos</> : <><ChevronDown className="w-3 h-3" /> Leer más</>}
          </button>
        </div>
      </div>
    </div>
  );
}

interface AnnouncementsFeedProps {
  compact?: boolean;
}

export default function AnnouncementsFeed({ compact = false }: AnnouncementsFeedProps) {
  const [filter, setFilter] = useState('all');
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const filtered = mockAnnouncements
    .filter((a) => !dismissed.has(a.id))
    .filter((a) => filter === 'all' || a.type === filter)
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const displayItems = compact ? filtered.slice(0, 3) : filtered;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Novedades y comunicaciones</h2>
        </div>
      </div>

      {!compact && (
        <div className="flex gap-1.5 flex-wrap mb-4">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'px-3 py-1 rounded-full text-xs transition-colors',
                filter === f.value ? 'bg-primary text-white' : 'bg-white border border-bolivar-border hover:bg-primary-light'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {displayItems.map((item) => (
          <AnnouncementCard key={item.id} item={item} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-bolivar-muted text-sm">No hay comunicaciones con ese filtro.</div>
      )}
    </div>
  );
}
