import { Link } from 'react-router-dom';
import {
  ArrowRight, ShieldCheck, Clock, Code2, Headphones, Zap, BarChart3,
  Globe, Users, CheckCircle, CreditCard, Repeat, BookOpen, FlaskConical,
  LayoutDashboard, Bot, Star, Building2
} from 'lucide-react';
import LogoBolivar from '../../components/LogoBolivar';

const stats = [
  { value: '6+', label: 'APIs disponibles' },
  { value: '99.9%', label: 'Uptime garantizado' },
  { value: '<250ms', label: 'Latencia promedio' },
  { value: '24/7', label: 'Soporte técnico' },
];

const benefits = [
  { icon: Clock, title: 'Integración en minutos', desc: 'APIs listas para usar con documentación clara, snippets en JS, Python y cURL. Reduce semanas de desarrollo a horas.' },
  { icon: ShieldCheck, title: 'Seguridad empresarial', desc: 'OAuth 2.0, autenticación de doble factor, tokens httpOnly y cumplimiento SARLAFT. Protección desde el día uno.' },
  { icon: Code2, title: 'Documentación interactiva', desc: 'Especificaciones OpenAPI renderizadas, ejemplos de código copiables y sandbox para probar sin riesgo.' },
  { icon: BarChart3, title: 'Monitoreo en tiempo real', desc: 'Dashboard con métricas de consumo, alertas de cuota y gráficos de tendencia por hora y por día.' },
  { icon: Bot, title: 'Preparado para IA', desc: 'Endpoint MCP para que tus agentes de IA descubran y consuman APIs de seguros de forma autónoma.' },
  { icon: Headphones, title: 'Soporte dedicado', desc: 'Equipo técnico de Seguros Bolívar disponible para acompañarte. Asistente IA 24/7 en el portal.' },
];

const apis = [
  { name: 'Cotización', desc: 'Cotiza seguros de vida, hogar, auto y SOAT en tiempo real.', icon: '💰' },
  { name: 'Emisión', desc: 'Emite pólizas a partir de cotizaciones aprobadas.', icon: '📄' },
  { name: 'Pagos', desc: 'Procesa pagos con PSE, tarjeta y débito automático.', icon: '💳' },
  { name: 'Consulta', desc: 'Consulta estado y coberturas de pólizas vigentes.', icon: '🔍' },
  { name: 'SARLAFT', desc: 'Verificación de identidad contra listas restrictivas.', icon: '🛡️' },
  { name: 'Modificaciones', desc: 'Modifica coberturas y beneficiarios sin re-emisión.', icon: '✏️' },
];

const features = [
  { icon: BookOpen, title: 'Catálogo de APIs', desc: 'Explora todas las APIs con filtros, documentación y descarga de specs.' },
  { icon: FlaskConical, title: 'Sandbox de pruebas', desc: 'Ejecuta llamadas reales en ambiente aislado con datos mock.' },
  { icon: LayoutDashboard, title: 'Dashboard de consumo', desc: 'Métricas, alertas de cuota y gráficos de tendencia.' },
  { icon: Globe, title: 'Portal público', desc: 'Explora el catálogo sin necesidad de cuenta.' },
];

const testimonials = [
  { name: 'Rappi Colombia', role: 'E-commerce', quote: 'Integramos seguros en nuestro checkout en menos de una semana. La documentación y el sandbox fueron clave.', stars: 5 },
  { name: 'Nequi S.A.', role: 'Fintech', quote: 'El dashboard de consumo nos permite monitorear en tiempo real. El soporte técnico es excelente.', stars: 5 },
  { name: 'Lulo Bank', role: 'Banco digital', quote: 'La seguridad empresarial y el cumplimiento SARLAFT nos dieron confianza para integrar rápidamente.', stars: 5 },
];

const plans = [
  {
    id: 'monthly',
    icon: Repeat,
    name: 'Plan Mensual',
    price: '$350.000',
    period: '/mes',
    desc: 'Ideal para integraciones con volumen constante.',
    features: [
      'Hasta 10.000 llamadas/mes incluidas',
      'Soporte prioritario',
      'Dashboard de consumo en tiempo real',
      'Sin costo por llamada dentro del límite',
      'Excedente: $45/llamada adicional',
    ],
    badge: 'Recomendado',
    highlight: true,
  },
  {
    id: 'transactional',
    icon: CreditCard,
    name: 'Plan Transaccional',
    price: '$65',
    period: '/llamada',
    desc: 'Ideal para volumen variable o etapa inicial.',
    features: [
      'Pago por uso — solo pagas lo que consumes',
      'Sin compromiso mensual mínimo',
      'Dashboard de consumo en tiempo real',
      'Soporte estándar incluido',
      'Facturación mensual consolidada',
    ],
    badge: null,
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-bolivar-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoBolivar variant="full" theme="dark" />
            <div className="w-px h-6 bg-bolivar-border ml-2" />
            <span className="text-sm font-semibold text-primary">Conecta 2.0</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="#planes" className="text-sm text-bolivar-muted hover:text-primary px-3 py-1.5 transition-colors">Planes</a>
            <Link to="/explore" className="text-sm text-bolivar-muted hover:text-primary px-3 py-1.5 transition-colors">Catálogo</Link>
            <Link to="/login" className="text-sm px-4 py-1.5 border border-bolivar-border rounded-full hover:bg-bolivar-bg transition-colors">Iniciar sesión</Link>
            <Link to="/onboarding" className="text-sm px-4 py-1.5 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors">Registrarse</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-[#034a2d] text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-5xl mx-auto px-4 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
            <Zap className="w-4 h-4" /> Open Insurance — Seguros Bolívar
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Integra seguros en<br />tu plataforma
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
            APIs de grado empresarial para cotización, emisión, pagos y más. Todo en un portal de autoservicio con sandbox, documentación interactiva y soporte 24/7.
          </p>
          <div className="flex gap-3 justify-center flex-wrap mb-12">
            <Link to="/onboarding" className="inline-flex items-center gap-2 bg-secondary text-bolivar-text font-semibold px-7 py-3.5 rounded-full hover:bg-yellow-300 transition-colors text-lg">
              Comenzar gratis <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/explore" className="inline-flex items-center gap-2 bg-white/10 text-white px-7 py-3.5 rounded-full hover:bg-white/20 transition-colors text-lg">
              <BookOpen className="w-5 h-5" /> Ver catálogo
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold">{s.value}</p>
                <p className="text-sm text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APIs available */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">APIs disponibles</h2>
            <p className="text-bolivar-muted max-w-xl mx-auto">Cubre todo el ciclo de vida del seguro con nuestras APIs especializadas.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {apis.map((api) => (
              <div key={api.name} className="flex items-start gap-3 p-5 rounded-xl border border-bolivar-border hover:shadow-md transition-shadow">
                <span className="text-2xl">{api.icon}</span>
                <div>
                  <h3 className="font-semibold mb-0.5">{api.name}</h3>
                  <p className="text-sm text-bolivar-muted">{api.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/explore" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
              Ver documentación completa <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-bolivar-bg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">¿Por qué Conecta 2.0?</h2>
            <p className="text-bolivar-muted max-w-xl mx-auto">Más que un catálogo de APIs — una plataforma completa para que tu negocio ofrezca seguros sin fricción.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white rounded-xl p-6 border border-bolivar-border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center mb-4">
                  <b.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{b.title}</h3>
                <p className="text-sm text-bolivar-muted">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Todo incluido en el portal</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="text-center p-5">
                <div className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center mx-auto mb-3">
                  <f.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-bolivar-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="planes" className="py-20 bg-bolivar-bg scroll-mt-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Planes de consumo</h2>
            <p className="text-bolivar-muted max-w-xl mx-auto">Elige el plan que mejor se adapte a tu volumen de integración. Puedes cambiar en cualquier momento.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className={`relative bg-white rounded-2xl p-7 border-2 transition-shadow hover:shadow-lg ${plan.highlight ? 'border-primary shadow-md' : 'border-bolivar-border'}`}>
                {plan.badge && (
                  <span className="absolute -top-3 left-6 bg-secondary text-bolivar-text text-xs font-semibold px-3 py-1 rounded-full">{plan.badge}</span>
                )}
                <plan.icon className={`w-10 h-10 mb-4 ${plan.highlight ? 'text-primary' : 'text-bolivar-muted'}`} />
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
                <Link
                  to="/onboarding"
                  className={`block text-center py-3 rounded-xl font-medium transition-colors ${plan.highlight ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-bolivar-bg text-bolivar-text hover:bg-bolivar-border'}`}
                >
                  Elegir plan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Aliados que confían en nosotros</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-bolivar-bg rounded-xl p-6 border border-bolivar-border">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-bolivar-text mb-4 italic">"{t.quote}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-bolivar-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">¿Listo para integrar seguros?</h2>
          <p className="text-white/70 mb-8">Registra tu organización y comienza a usar las APIs en minutos.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/onboarding" className="inline-flex items-center gap-2 bg-secondary text-bolivar-text font-semibold px-7 py-3.5 rounded-full hover:bg-yellow-300 transition-colors">
              Registrar mi organización <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 bg-white/10 text-white px-7 py-3.5 rounded-full hover:bg-white/20 transition-colors">
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bolivar-text text-white/50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <LogoBolivar variant="icon" theme="light" />
              <span className="text-white/70 text-sm font-medium">Conecta 2.0</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="/explore" className="hover:text-white transition-colors">Catálogo</Link>
              <a href="#planes" className="hover:text-white transition-colors">Planes</a>
              <Link to="/login" className="hover:text-white transition-colors">Iniciar sesión</Link>
              <Link to="/onboarding" className="hover:text-white transition-colors">Registrarse</Link>
            </div>
            <p className="text-xs">© 2025 Seguros Bolívar — Open Insurance</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
