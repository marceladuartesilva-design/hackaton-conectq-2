import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowRight, ShieldCheck, Clock, Code2, Headphones, CheckCircle, Repeat, CreditCard } from 'lucide-react';
import { mockApis } from '../../data/mock-apis';
import { cn, statusColor, statusLabel } from '../../lib/utils';

const categories = ['Todas', 'Cotización', 'Emisión', 'Pagos', 'Consulta', 'Identidad/SARLAFT', 'Modificaciones', 'Renovaciones'];

const benefits = [
  { icon: Clock, title: 'Integración en minutos', desc: 'APIs listas para usar con documentación clara y snippets de código.' },
  { icon: ShieldCheck, title: 'Seguridad empresarial', desc: 'OAuth 2.0, MFA y cumplimiento SARLAFT desde el día uno.' },
  { icon: Code2, title: 'Documentación interactiva', desc: 'OpenAPI specs, ejemplos en JS, Python y cURL.' },
  { icon: Headphones, title: 'Soporte dedicado', desc: 'Equipo técnico disponible para acompañarte.' },
];

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');

  const filtered = mockApis.filter((api) => {
    const matchSearch = !search || api.name.toLowerCase().includes(search.toLowerCase()) || api.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = category === 'Todas' || api.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-14">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Catálogo de APIs de Seguros</h1>
          <p className="text-white/70 max-w-2xl mx-auto mb-6">
            Conoce las APIs disponibles para integrar seguros en tu plataforma. Cotización, emisión, pagos, consultas y más.
          </p>
          <Link to="/onboarding" className="inline-flex items-center gap-2 bg-secondary text-bolivar-text font-semibold px-6 py-3 rounded-full hover:bg-yellow-300 transition-colors">
            Comenzar integración <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Benefits strip */}
      <section className="bg-white border-b border-bolivar-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map((b) => (
              <div key={b.title} className="flex items-center gap-3">
                <b.icon className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{b.title}</p>
                  <p className="text-xs text-bolivar-muted hidden md:block">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="max-w-7xl mx-auto px-4 py-10">
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
            <span className="text-sm text-bolivar-muted">{filtered.length} APIs</span>
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
            <div
              key={api.id}
              className="bg-white rounded-xl border border-bolivar-border p-5 hover:shadow-lg transition-shadow group"
            >
              <Link to={`/explore/${api.id}`}>
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
              <div className="mt-3 pt-3 border-t border-bolivar-border flex gap-2">
                <Link
                  to={`/explore/${api.id}/integrate`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" /> Integrar ahora
                </Link>
                <Link
                  to={`/explore/${api.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-bolivar-border text-xs rounded-lg hover:bg-bolivar-bg transition-colors"
                >
                  Ver docs
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-bolivar-muted">
            <p className="text-lg">No se encontraron APIs con esos filtros.</p>
          </div>
        )}
      </section>

      {/* Plans */}
      <section id="planes" className="bg-white py-16 scroll-mt-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Planes de consumo</h2>
            <p className="text-bolivar-muted max-w-xl mx-auto">Elige el plan que mejor se adapte a tu volumen. Puedes cambiar en cualquier momento.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {([
              {
                id: 'monthly', icon: Repeat, name: 'Plan Mensual', price: '$350.000', period: '/mes',
                desc: 'Ideal para integraciones con volumen constante de llamadas.',
                features: ['Hasta 10.000 llamadas/mes incluidas', 'Soporte prioritario', 'Dashboard de consumo en tiempo real', 'Sin costo por llamada dentro del límite', 'Excedente: $45/llamada adicional'],
                badge: 'Recomendado', highlight: true,
              },
              {
                id: 'transactional', icon: CreditCard, name: 'Plan Transaccional', price: '$65', period: '/llamada',
                desc: 'Ideal para volumen variable o etapa inicial.',
                features: ['Pago por uso — solo pagas lo que consumes', 'Sin compromiso mensual mínimo', 'Dashboard de consumo en tiempo real', 'Soporte estándar incluido', 'Facturación mensual consolidada'],
                badge: null, highlight: false,
              },
            ]).map((plan) => (
              <div key={plan.id} className={cn('relative bg-white rounded-2xl p-7 border-2 transition-shadow hover:shadow-lg', plan.highlight ? 'border-primary shadow-md' : 'border-bolivar-border')}>
                {plan.badge && <span className="absolute -top-3 left-6 bg-secondary text-bolivar-text text-xs font-semibold px-3 py-1 rounded-full">{plan.badge}</span>}
                <plan.icon className={cn('w-10 h-10 mb-4', plan.highlight ? 'text-primary' : 'text-bolivar-muted')} />
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-primary">{plan.price}</span>
                  <span className="text-bolivar-muted">{plan.period}</span>
                </div>
                <p className="text-sm text-bolivar-muted mb-5">{plan.desc}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to={`/checkout?plan=${plan.id}`} className={cn('block text-center py-3 rounded-xl font-medium transition-colors', plan.highlight ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-bolivar-bg text-bolivar-text hover:bg-bolivar-border')}>
                  Elegir plan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-light py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">¿Listo para integrar?</h2>
          <p className="text-bolivar-muted mb-6">Registra tu organización y accede al sandbox, dashboard y documentación completa.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/onboarding" className="px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary-dark transition-colors">
              Registrar mi organización
            </Link>
            <Link to="/login" className="px-6 py-3 border border-bolivar-border bg-white rounded-full hover:bg-bolivar-bg transition-colors">
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
