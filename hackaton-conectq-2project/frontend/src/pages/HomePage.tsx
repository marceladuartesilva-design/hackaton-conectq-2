import { Link } from 'react-router-dom';
import { BookOpen, FlaskConical, LayoutDashboard, ArrowRight, ShieldCheck, Clock, Code2, Headphones } from 'lucide-react';
import LogoBolivar from '../components/LogoBolivar';
import AnnouncementsFeed from '../components/AnnouncementsFeed';

const features = [
  { icon: BookOpen, title: 'Catálogo de APIs', desc: 'Explora APIs con documentación interactiva, ejemplos de código y especificaciones OpenAPI.', to: '/catalog' },
  { icon: FlaskConical, title: 'Sandbox de Pruebas', desc: 'Prueba APIs en un ambiente aislado con datos mock. Sin afectar producción.', to: '/sandbox' },
  { icon: LayoutDashboard, title: 'Dashboard de Consumo', desc: 'Monitorea métricas en tiempo real: llamadas, errores, latencia y cuota.', to: '/dashboard' },
];

const benefits = [
  { icon: Clock, title: 'Integración en minutos', desc: 'APIs listas para usar con documentación clara, snippets de código y sandbox. Reduce semanas de desarrollo a horas.' },
  { icon: ShieldCheck, title: 'Seguridad de grado empresarial', desc: 'OAuth 2.0, MFA, tokens httpOnly y cumplimiento SARLAFT. Tu integración protegida desde el día uno.' },
  { icon: Code2, title: 'Documentación interactiva', desc: 'Especificaciones OpenAPI, ejemplos en JavaScript, Python y cURL. Prueba antes de escribir una línea de código.' },
  { icon: Headphones, title: 'Soporte dedicado', desc: 'Equipo técnico de Seguros Bolívar disponible para acompañarte en cada paso de tu integración.' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <LogoBolivar variant="icon" theme="light" />
            <h1 className="text-4xl md:text-5xl font-bold">Conecta 2.0</h1>
          </div>
          <p className="text-xl text-white/80 mb-2">API Ecosystem — Seguros Bolívar</p>
          <p className="text-white/60 max-w-2xl mx-auto mb-8">
            Integra seguros en tu plataforma con nuestras APIs de grado empresarial. Cotización, emisión, pagos, consultas y más — todo en un solo portal de autoservicio.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/catalog" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors">
              Explorar APIs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">Todo lo que necesitas para integrar</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <Link key={f.to} to={f.to} className="bg-white rounded-xl border border-bolivar-border p-6 hover:shadow-lg transition-shadow group">
              <f.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">{f.title}</h3>
              <p className="text-sm text-bolivar-muted">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Announcements */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <AnnouncementsFeed compact />
      </section>

      {/* Benefits */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-3">¿Por qué Conecta 2.0?</h2>
          <p className="text-bolivar-muted text-center mb-10 max-w-2xl mx-auto">Más que un catálogo de APIs — una plataforma completa para que tu negocio ofrezca seguros sin fricción.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="flex gap-4 p-5 rounded-xl border border-bolivar-border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                  <b.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{b.title}</h3>
                  <p className="text-sm text-bolivar-muted">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
