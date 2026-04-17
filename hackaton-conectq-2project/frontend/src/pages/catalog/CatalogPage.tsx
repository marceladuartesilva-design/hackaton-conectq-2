import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { mockApis } from '../../data/mock-apis';
import { cn, statusColor, statusLabel } from '../../lib/utils';

const categories = ['Todas', 'Cotización', 'Emisión', 'Pagos', 'Consulta', 'Identidad/SARLAFT', 'Modificaciones', 'Renovaciones'];

export default function CatalogPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = mockApis.filter((api) => {
    const matchSearch = !search || api.name.toLowerCase().includes(search.toLowerCase()) || api.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = category === 'Todas' || api.category === category;
    const matchStatus = statusFilter === 'all' || api.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Catálogo de APIs</h1>
        <p className="text-bolivar-muted">Explora las APIs disponibles para integrar seguros en tu plataforma.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bolivar-muted" />
          <input
            type="text"
            placeholder="Buscar APIs por nombre o tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-bolivar-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-bolivar-muted" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-bolivar-border rounded-lg px-3 py-2.5 text-sm">
            <option value="all">Todos los estados</option>
            <option value="active">Activa</option>
            <option value="deprecated">Deprecada</option>
            <option value="retired">Retirada</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm transition-colors',
              category === cat ? 'bg-primary text-white' : 'bg-white border border-bolivar-border hover:bg-primary-light'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((api) => (
          <Link
            key={api.id}
            to={`/catalog/${api.id}`}
            className="bg-white rounded-xl border border-bolivar-border p-5 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-light text-primary">{api.category}</span>
              <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', statusColor(api.status))}>{statusLabel(api.status)}</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{api.name}</h3>
            <p className="text-sm text-bolivar-muted mb-3 line-clamp-2">{api.description}</p>
            <div className="flex items-center justify-between text-xs text-bolivar-muted">
              <span>{api.endpoints.length} endpoint{api.endpoints.length !== 1 ? 's' : ''}</span>
              <span className="font-mono">{api.currentVersion}</span>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-bolivar-muted">
          <p className="text-lg">No se encontraron APIs con esos filtros.</p>
        </div>
      )}
    </div>
  );
}
