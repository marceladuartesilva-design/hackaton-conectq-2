import { useState } from 'react';
import { X, CreditCard, Repeat, Check, Zap, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface PlanSelectorProps {
  apiName: string;
  onConfirm: (plan: 'monthly' | 'transactional') => void;
  onCancel: () => void;
}

const plans = [
  {
    id: 'monthly' as const,
    icon: Repeat,
    name: 'Plan Mensual',
    price: '$350.000',
    period: '/mes',
    description: 'Ideal para integraciones con volumen constante de llamadas.',
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
    id: 'transactional' as const,
    icon: CreditCard,
    name: 'Plan Transaccional',
    price: '$65',
    period: '/llamada',
    description: 'Ideal para integraciones con volumen variable o en etapa inicial.',
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

export default function PlanSelector({ apiName, onConfirm, onCancel }: PlanSelectorProps) {
  const [selected, setSelected] = useState<'monthly' | 'transactional' | null>(null);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-5 text-white relative">
          <button onClick={onCancel} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Cerrar">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5" />
            <h2 className="text-xl font-bold">Selecciona tu plan de consumo</h2>
          </div>
          <p className="text-white/70 text-sm">Elige cómo deseas pagar el uso de <span className="font-medium text-white">{apiName}</span></p>
        </div>

        {/* Plans */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className={cn(
                  'relative text-left rounded-xl border-2 p-5 transition-all',
                  selected === plan.id
                    ? 'border-primary bg-primary-light/30 shadow-md'
                    : 'border-bolivar-border hover:border-primary/40 hover:shadow-sm'
                )}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 left-4 bg-secondary text-bolivar-text text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {plan.badge}
                  </span>
                )}

                {/* Check indicator */}
                <div className={cn(
                  'absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                  selected === plan.id ? 'border-primary bg-primary' : 'border-bolivar-border'
                )}>
                  {selected === plan.id && <Check className="w-4 h-4 text-white" />}
                </div>

                <plan.icon className={cn('w-8 h-8 mb-3', selected === plan.id ? 'text-primary' : 'text-bolivar-muted')} />

                <h3 className="font-semibold text-lg mb-0.5">{plan.name}</h3>
                <div className="flex items-baseline gap-0.5 mb-2">
                  <span className="text-2xl font-bold text-primary">{plan.price}</span>
                  <span className="text-sm text-bolivar-muted">{plan.period}</span>
                </div>
                <p className="text-xs text-bolivar-muted mb-3">{plan.description}</p>

                <ul className="space-y-1.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs">
                      <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-bolivar-text">{f}</span>
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          <div className="bg-bolivar-bg rounded-lg p-3 mb-5">
            <p className="text-xs text-bolivar-muted text-center">
              Puedes cambiar de plan en cualquier momento desde la configuración de tu cuenta. Los cambios aplican en el siguiente ciclo de facturación.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button onClick={onCancel} className="px-4 py-2 text-sm text-bolivar-muted hover:text-bolivar-text transition-colors">
              Cancelar
            </button>
            <button
              onClick={() => selected && onConfirm(selected)}
              disabled={!selected}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirmar plan y continuar <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
