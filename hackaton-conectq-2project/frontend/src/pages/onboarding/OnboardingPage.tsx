import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Building2, Mail, UserCircle, CreditCard, CheckCircle, ArrowLeft, Clock, Repeat } from 'lucide-react';
import { cn } from '../../lib/utils';

const steps = [
  { label: 'Empresa', icon: Building2 },
  { label: 'Verificación', icon: Mail },
  { label: 'Cuenta', icon: UserCircle },
  { label: 'Plan', icon: CreditCard },
  { label: 'Confirmación', icon: CheckCircle },
];

const planLabels: Record<string, string> = { monthly: 'Mensual', transactional: 'Transaccional' };

export default function OnboardingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialStep = Number(searchParams.get('step') ?? 0);
  const [step, setStep] = useState(initialStep);
  const [form, setForm] = useState({
    companyName: '', nit: '', companyType: 'fintech', legalRep: '', email: '', phone: '',
    fullName: '', position: '', password: '', termsAccepted: false, habeasAccepted: false,
    plan: '' as '' | 'monthly' | 'transactional',
  });

  const update = (field: string, value: string | boolean) => setForm((prev) => ({ ...prev, [field]: value }));
  const next = () => setStep((s) => Math.min(s + 1, 4));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen bg-bolivar-bg flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center">Registro de Aliado</h1>
        <p className="text-bolivar-muted text-center mb-4">Registra tu organización para acceder al ecosistema de APIs.</p>

        <div className="text-center mb-6">
          <Link to="/login" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-10 px-4">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center relative">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
                i < step ? 'bg-primary text-white' : i === step ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-bolivar-border text-bolivar-muted'
              )}>
                {i < step ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
              </div>
              <span className={cn('text-xs mt-1.5', i <= step ? 'text-primary font-medium' : 'text-bolivar-muted')}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-bolivar-border p-6">
          {/* Step 1: Company Info */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Datos de la empresa</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Razón social *</label>
                  <input value={form.companyName} onChange={(e) => update('companyName', e.target.value)} className="w-full border border-bolivar-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Mi Empresa S.A.S." />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">NIT *</label>
                  <input value={form.nit} onChange={(e) => update('nit', e.target.value)} className="w-full border border-bolivar-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="901234567-1" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Tipo de empresa *</label>
                  <select value={form.companyType} onChange={(e) => update('companyType', e.target.value)} className="w-full border border-bolivar-border rounded-lg px-3 py-2.5 text-sm">
                    <option value="fintech">Fintech</option>
                    <option value="e-commerce">E-commerce</option>
                    <option value="banco">Banco</option>
                    <option value="marketplace">Marketplace</option>
                    <option value="intermediario">Intermediario</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Representante legal *</label>
                  <input value={form.legalRep} onChange={(e) => update('legalRep', e.target.value)} className="w-full border border-bolivar-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Nombre completo" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Correo corporativo *</label>
                  <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full border border-bolivar-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="contacto@empresa.com" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Teléfono</label>
                  <input value={form.phone} onChange={(e) => update('phone', e.target.value)} className="w-full border border-bolivar-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="+57 300 123 4567" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Email Verification */}
          {step === 1 && (
            <div className="text-center py-8">
              <Mail className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Verifica tu correo</h2>
              <p className="text-bolivar-muted mb-4">Hemos enviado un enlace de verificación a:</p>
              <p className="font-medium text-lg mb-6">{form.email || 'contacto@empresa.com'}</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 inline-block">
                <p className="text-green-700 text-sm flex items-center gap-2"><Check className="w-4 h-4" /> Correo verificado (simulado para demo)</p>
              </div>
            </div>
          )}

          {/* Step 3: Account Creation */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Crea tu cuenta</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Nombre completo *</label>
                  <input value={form.fullName} onChange={(e) => update('fullName', e.target.value)} className="w-full border border-bolivar-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Cargo *</label>
                  <input value={form.position} onChange={(e) => update('position', e.target.value)} className="w-full border border-bolivar-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Contraseña * (mínimo 12 caracteres)</label>
                <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} className="w-full border border-bolivar-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                {form.password.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-bolivar-border overflow-hidden">
                      <div className={cn('h-full rounded-full transition-all', form.password.length < 12 ? 'w-1/3 bg-red-400' : form.password.length < 20 ? 'w-2/3 bg-yellow-400' : 'w-full bg-green-500')} />
                    </div>
                    <span className="text-xs text-bolivar-muted">{form.password.length < 12 ? 'Débil' : form.password.length < 20 ? 'Aceptable' : 'Fuerte'}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2 pt-2">
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.termsAccepted} onChange={(e) => update('termsAccepted', e.target.checked)} className="mt-0.5 accent-primary" />
                  Acepto los términos y condiciones de uso *
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.habeasAccepted} onChange={(e) => update('habeasAccepted', e.target.checked)} className="mt-0.5 accent-primary" />
                  Acepto la política de tratamiento de datos personales (Habeas Data) *
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Plan Selection */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Elige tu plan de consumo</h2>
              <p className="text-sm text-bolivar-muted mb-6">Selecciona cómo deseas pagar el uso de las APIs. Puedes cambiar de plan en cualquier momento.</p>
              <div className="grid md:grid-cols-2 gap-4">
                {([
                  {
                    id: 'monthly' as const, icon: Repeat, name: 'Plan Mensual', price: '$350.000', period: '/mes',
                    desc: 'Volumen constante de llamadas.',
                    features: ['10.000 llamadas/mes incluidas', 'Soporte prioritario', 'Excedente: $45/llamada'],
                    badge: 'Recomendado',
                  },
                  {
                    id: 'transactional' as const, icon: CreditCard, name: 'Plan Transaccional', price: '$65', period: '/llamada',
                    desc: 'Volumen variable o etapa inicial.',
                    features: ['Pago por uso', 'Sin compromiso mínimo', 'Facturación mensual'],
                    badge: null,
                  },
                ]).map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => update('plan', plan.id)}
                    className={cn(
                      'relative text-left rounded-xl border-2 p-5 transition-all',
                      form.plan === plan.id ? 'border-primary bg-primary-light/30 shadow-md' : 'border-bolivar-border hover:border-primary/40'
                    )}
                  >
                    {plan.badge && <span className="absolute -top-2.5 left-4 bg-secondary text-bolivar-text text-xs font-semibold px-2.5 py-0.5 rounded-full">{plan.badge}</span>}
                    <div className={cn('absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center', form.plan === plan.id ? 'border-primary bg-primary' : 'border-bolivar-border')}>
                      {form.plan === plan.id && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <plan.icon className={cn('w-7 h-7 mb-2', form.plan === plan.id ? 'text-primary' : 'text-bolivar-muted')} />
                    <h3 className="font-semibold mb-0.5">{plan.name}</h3>
                    <div className="flex items-baseline gap-0.5 mb-1">
                      <span className="text-xl font-bold text-primary">{plan.price}</span>
                      <span className="text-xs text-bolivar-muted">{plan.period}</span>
                    </div>
                    <p className="text-xs text-bolivar-muted mb-3">{plan.desc}</p>
                    <ul className="space-y-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-1.5 text-xs"><Check className="w-3 h-3 text-primary" /> {f}</li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {step === 4 && (
            <div className="text-center py-6">
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">¡Registro enviado!</h2>
              <p className="text-bolivar-muted mb-6 max-w-md mx-auto">
                Tu solicitud está siendo verificada. Recibirás un correo cuando tu organización sea aprobada.
              </p>
              <div className="bg-bolivar-bg rounded-lg p-4 text-left max-w-md mx-auto mb-6">
                <h3 className="font-semibold mb-3">Resumen del registro</h3>
                <div className="space-y-1.5 text-sm">
                  <p><span className="text-bolivar-muted">Empresa:</span> {form.companyName || 'Mi Empresa S.A.S.'}</p>
                  <p><span className="text-bolivar-muted">NIT:</span> {form.nit || '901234567-1'}</p>
                  <p><span className="text-bolivar-muted">Tipo:</span> {form.companyType}</p>
                  <p><span className="text-bolivar-muted">Contacto:</span> {form.email || 'contacto@empresa.com'}</p>
                  <p><span className="text-bolivar-muted">Responsable:</span> {form.fullName || 'Nombre del usuario'}</p>
                  <p><span className="text-bolivar-muted">Plan:</span> {planLabels[form.plan] || 'No seleccionado'}</p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto mb-6">
                <div className="flex items-center gap-2 text-blue-700 text-sm">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <p>Verificación en 24-48 horas hábiles. Una vez aprobado, podrás acceder al catálogo y configurar tus integraciones.</p>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <Link to="/login" className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors">Ir al inicio de sesión</Link>
                <Link to="/" className="px-5 py-2.5 border border-bolivar-border rounded-lg text-sm hover:bg-bolivar-bg transition-colors">Explorar catálogo</Link>
              </div>
            </div>
          )}

          {/* Navigation */}
          {step < 4 && (
            <div className="flex justify-between mt-6 pt-4 border-t border-bolivar-border">
              <button onClick={prev} disabled={step === 0} className="px-4 py-2 text-sm rounded-lg border border-bolivar-border hover:bg-bolivar-bg disabled:opacity-40 transition-colors">
                Anterior
              </button>
              <button
                onClick={() => {
                  if (step === 3 && form.plan) {
                    navigate(`/checkout?plan=${form.plan}&from=onboarding`);
                  } else {
                    next();
                  }
                }}
                disabled={step === 3 && !form.plan}
                className="px-6 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-40"
              >
                {step === 3 ? 'Ir a pagar' : 'Siguiente'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
