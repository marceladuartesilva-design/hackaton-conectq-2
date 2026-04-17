import { useState } from 'react';
import { X, ArrowRight, ArrowLeft, BookOpen, FlaskConical, LayoutDashboard, MessageCircle, Zap, Rocket } from 'lucide-react';
import { cn } from '../lib/utils';
import LogoBolivar from './LogoBolivar';

interface OnboardingTourProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Zap,
    title: '¡Bienvenido a Conecta 2.0!',
    subtitle: 'Tu portal de APIs de Seguros Bolívar',
    description: 'Te guiaremos en un recorrido rápido para que conozcas las herramientas disponibles y puedas comenzar a integrar seguros en tu plataforma.',
    image: '🚀',
    tip: null,
  },
  {
    icon: BookOpen,
    title: 'Catálogo de APIs',
    subtitle: 'Explora y documenta',
    description: 'Encuentra todas las APIs disponibles organizadas por categoría: Cotización, Emisión, Pagos, Consulta e Identidad. Cada API incluye documentación interactiva, parámetros detallados y ejemplos de código en JavaScript, Python y cURL.',
    image: '📚',
    tip: 'Usa los filtros por categoría y la barra de búsqueda para encontrar rápidamente la API que necesitas.',
  },
  {
    icon: FlaskConical,
    title: 'Sandbox de Pruebas',
    subtitle: 'Prueba sin riesgo',
    description: 'Ejecuta llamadas reales a las APIs en un ambiente aislado con datos de prueba. Selecciona un endpoint, edita el body JSON y observa la respuesta completa con status, headers y tiempo de respuesta.',
    image: '🧪',
    tip: 'El historial lateral guarda tus últimas 20 pruebas para que puedas compararlas fácilmente.',
  },
  {
    icon: LayoutDashboard,
    title: 'Dashboard de Consumo',
    subtitle: 'Monitorea en tiempo real',
    description: 'Visualiza métricas clave de tu integración: total de llamadas, tasa de éxito/error, latencia promedio y estado de tu cuota mensual. Los gráficos muestran tendencias por hora (24h) o por día (30 días).',
    image: '📊',
    tip: 'Recibirás una alerta visual cuando tu consumo supere el 80% de la cuota asignada.',
  },
  {
    icon: MessageCircle,
    title: 'Asistente IA',
    subtitle: 'Soporte 24/7',
    description: 'En cualquier momento puedes hacer clic en el botón verde de la esquina inferior derecha para abrir el asistente de IA. Pregunta sobre APIs, autenticación, sandbox o cualquier duda técnica.',
    image: '🤖',
    tip: 'Prueba con preguntas como "¿Cómo obtengo mi API Key?" o "¿Qué APIs están disponibles?".',
  },
  {
    icon: Rocket,
    title: '¡Todo listo!',
    subtitle: 'Comienza a integrar',
    description: 'Ya conoces las herramientas principales. Te recomendamos empezar explorando el Catálogo para elegir las APIs que necesitas, luego probarlas en el Sandbox antes de integrarlas en tu aplicación.',
    image: '🎉',
    tip: null,
  },
];

export default function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];
  const isLast = current === slides.length - 1;
  const isFirst = current === 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-primary to-primary-dark px-6 pt-6 pb-10 text-white relative">
          <button
            onClick={onComplete}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Cerrar tour"
          >
            <X className="w-4 h-4" />
          </button>

          {isFirst && (
            <div className="flex justify-center mb-4">
              <LogoBolivar variant="full" theme="light" />
            </div>
          )}

          <div className="text-center">
            <span className="text-5xl mb-3 block">{slide.image}</span>
            <h2 className="text-2xl font-bold mb-1">{slide.title}</h2>
            <p className="text-white/70 text-sm">{slide.subtitle}</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-sm text-bolivar-text leading-relaxed mb-4">{slide.description}</p>

          {slide.tip && (
            <div className="bg-primary-light rounded-lg p-3 flex items-start gap-2 mb-4">
              <span className="text-primary text-sm mt-0.5">💡</span>
              <p className="text-xs text-primary">{slide.tip}</p>
            </div>
          )}

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mb-5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  'h-2 rounded-full transition-all',
                  i === current ? 'w-6 bg-primary' : 'w-2 bg-bolivar-border hover:bg-bolivar-muted'
                )}
                aria-label={`Ir al paso ${i + 1}`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrent((c) => c - 1)}
              disabled={isFirst}
              className="flex items-center gap-1 text-sm text-bolivar-muted hover:text-bolivar-text disabled:opacity-0 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Anterior
            </button>

            <div className="flex gap-2">
              {!isLast && (
                <button
                  onClick={onComplete}
                  className="px-4 py-2 text-sm text-bolivar-muted hover:text-bolivar-text transition-colors"
                >
                  Omitir tour
                </button>
              )}
              <button
                onClick={() => isLast ? onComplete() : setCurrent((c) => c + 1)}
                className="flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors"
              >
                {isLast ? 'Comenzar' : 'Siguiente'}
                {!isLast && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
