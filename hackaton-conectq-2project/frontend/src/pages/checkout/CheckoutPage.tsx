import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  Building2,
  RefreshCw,
  ShieldCheck,
  Lock,
  CheckCircle,
  Loader2,
  AlertCircle,
  Repeat,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type PaymentMethod = 'pse' | 'credit_card' | 'debit_card' | 'auto_debit';
type CheckoutStep = 'method' | 'details' | 'processing' | 'result';

interface PlanInfo {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
}

const plans: Record<string, PlanInfo> = {
  monthly: {
    id: 'monthly',
    name: 'Plan Mensual',
    price: '$350.000',
    period: '/mes',
    description: 'Hasta 10.000 llamadas/mes incluidas. Soporte prioritario.',
  },
  transactional: {
    id: 'transactional',
    name: 'Plan Transaccional',
    price: '$65',
    period: '/llamada',
    description: 'Pago por uso. Sin compromiso mínimo.',
  },
};

const paymentMethods: { id: PaymentMethod; label: string; icon: typeof CreditCard; desc: string }[] = [
  { id: 'pse', label: 'PSE — Débito bancario', icon: Building2, desc: 'Pago directo desde tu cuenta bancaria.' },
  { id: 'credit_card', label: 'Tarjeta de crédito', icon: CreditCard, desc: 'Visa, Mastercard, Amex.' },
  { id: 'debit_card', label: 'Tarjeta débito', icon: CreditCard, desc: 'Visa Débito, Mastercard Débito.' },
  { id: 'auto_debit', label: 'Débito automático', icon: RefreshCw, desc: 'Cargo recurrente mensual a tu cuenta.' },
];

const pseBanks = [
  'Bancolombia', 'Banco de Bogotá', 'Davivienda', 'BBVA Colombia',
  'Banco de Occidente', 'Banco Popular', 'Banco AV Villas', 'Scotiabank Colpatria',
  'Banco Caja Social', 'Banco Falabella', 'Nequi', 'Daviplata',
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function CheckoutPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const planId = params.get('plan') ?? 'monthly';
  const plan = plans[planId] ?? plans.monthly;
  const fromOnboarding = params.get('from') === 'onboarding';

  const [step, setStep] = useState<CheckoutStep>('method');
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(true);

  // PSE fields
  const [pseBank, setPseBank] = useState('');
  const [psePersonType, setPsePersonType] = useState<'natural' | 'juridica'>('juridica');

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Auto-debit fields
  const [autoBank, setAutoBank] = useState('');
  const [autoAccountType, setAutoAccountType] = useState<'ahorros' | 'corriente'>('ahorros');
  const [autoAccountNumber, setAutoAccountNumber] = useState('');
  const [autoAuthAccepted, setAutoAuthAccepted] = useState(false);

  // Transaction result
  const [txRef, setTxRef] = useState('');

  const formatCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const canProceed = (): boolean => {
    if (!method) return false;
    if (method === 'pse') return !!pseBank;
    if (method === 'credit_card' || method === 'debit_card') {
      return cardNumber.replace(/\s/g, '').length >= 15 && !!cardName && cardExpiry.length === 5 && cardCvv.length >= 3;
    }
    if (method === 'auto_debit') return !!autoBank && !!autoAccountNumber && autoAuthAccepted;
    return false;
  };

  const processPayment = () => {
    setStep('processing');
    const ref = `TX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setTxRef(ref);
    // Simulate processing delay
    setTimeout(() => {
      setPaymentSuccess(true);
      setStep('result');
    }, 2500);
  };

  const methodLabel = method ? paymentMethods.find((m) => m.id === method)?.label : '';

  return (
    <div className="min-h-screen bg-bolivar-bg">
      {/* Header */}
      <header className="bg-white border-b border-bolivar-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={fromOnboarding ? '/onboarding' : '/#planes'} className="text-bolivar-muted hover:text-bolivar-text transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Pasarela de Pagos</h1>
              <p className="text-xs text-bolivar-muted">Conecta 2.0 — Seguros Bolívar</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
            <Lock className="w-3.5 h-3.5" />
            Conexión segura
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Step: Select method */}
            {step === 'method' && (
              <div className="bg-white rounded-xl border border-bolivar-border p-6">
                <h2 className="text-xl font-semibold mb-1">Selecciona tu método de pago</h2>
                <p className="text-sm text-bolivar-muted mb-6">Todos los pagos son procesados de forma segura.</p>
                <div className="space-y-3">
                  {paymentMethods.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setMethod(pm.id)}
                      className={cn(
                        'w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all',
                        method === pm.id
                          ? 'border-primary bg-primary-light/30 shadow-sm'
                          : 'border-bolivar-border hover:border-primary/40'
                      )}
                    >
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        method === pm.id ? 'bg-primary text-white' : 'bg-bolivar-bg text-bolivar-muted'
                      )}>
                        <pm.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{pm.label}</p>
                        <p className="text-xs text-bolivar-muted">{pm.desc}</p>
                      </div>
                      <div className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                        method === pm.id ? 'border-primary bg-primary' : 'border-bolivar-border'
                      )}>
                        {method === pm.id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => method && setStep('details')}
                  disabled={!method}
                  className="mt-6 w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  Continuar <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step: Payment details */}
            {step === 'details' && (
              <div className="bg-white rounded-xl border border-bolivar-border p-6">
                <button onClick={() => setStep('method')} className="flex items-center gap-1 text-sm text-primary hover:underline mb-4">
                  <ArrowLeft className="w-4 h-4" /> Cambiar método
                </button>

                {/* PSE */}
                {method === 'pse' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Pago con PSE</h2>
                    <p className="text-sm text-bolivar-muted mb-6">Serás redirigido al portal de tu banco para autorizar el pago.</p>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium block mb-1">Tipo de persona *</label>
                        <div className="flex gap-3">
                          {(['natural', 'juridica'] as const).map((t) => (
                            <button
                              key={t}
                              onClick={() => setPsePersonType(t)}
                              className={cn(
                                'flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-all',
                                psePersonType === t ? 'border-primary bg-primary-light/30 text-primary' : 'border-bolivar-border hover:border-primary/40'
                              )}
                            >
                              {t === 'natural' ? 'Persona Natural' : 'Persona Jurídica'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-1">Banco *</label>
                        <select
                          value={pseBank}
                          onChange={(e) => setPseBank(e.target.value)}
                          className="w-full border border-bolivar-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          <option value="">Selecciona tu banco</option>
                          {pseBanks.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Credit / Debit Card */}
                {(method === 'credit_card' || method === 'debit_card') && (
                  <div>
                    <h2 className="text-xl font-semibold mb-1">
                      {method === 'credit_card' ? 'Tarjeta de crédito' : 'Tarjeta débito'}
                    </h2>
                    <p className="text-sm text-bolivar-muted mb-6">Ingresa los datos de tu tarjeta.</p>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium block mb-1">Número de tarjeta *</label>
                        <input
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          className="w-full border border-bolivar-border rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-1">Nombre del titular *</label>
                        <input
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Como aparece en la tarjeta"
                          className="w-full border border-bolivar-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium block mb-1">Vencimiento *</label>
                          <input
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            placeholder="MM/AA"
                            maxLength={5}
                            className="w-full border border-bolivar-border rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">CVV *</label>
                          <input
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            placeholder="***"
                            maxLength={4}
                            type="password"
                            className="w-full border border-bolivar-border rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Auto Debit */}
                {method === 'auto_debit' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Débito automático</h2>
                    <p className="text-sm text-bolivar-muted mb-6">Autoriza un cargo recurrente mensual desde tu cuenta bancaria.</p>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium block mb-1">Banco *</label>
                        <select
                          value={autoBank}
                          onChange={(e) => setAutoBank(e.target.value)}
                          className="w-full border border-bolivar-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          <option value="">Selecciona tu banco</option>
                          {pseBanks.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-1">Tipo de cuenta *</label>
                        <div className="flex gap-3">
                          {(['ahorros', 'corriente'] as const).map((t) => (
                            <button
                              key={t}
                              onClick={() => setAutoAccountType(t)}
                              className={cn(
                                'flex-1 py-2.5 rounded-lg border-2 text-sm font-medium capitalize transition-all',
                                autoAccountType === t ? 'border-primary bg-primary-light/30 text-primary' : 'border-bolivar-border hover:border-primary/40'
                              )}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-1">Número de cuenta *</label>
                        <input
                          value={autoAccountNumber}
                          onChange={(e) => setAutoAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 20))}
                          placeholder="Número de cuenta bancaria"
                          className="w-full border border-bolivar-border rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <label className="flex items-start gap-2 text-sm cursor-pointer pt-2">
                        <input
                          type="checkbox"
                          checked={autoAuthAccepted}
                          onChange={(e) => setAutoAuthAccepted(e.target.checked)}
                          className="mt-0.5 accent-primary"
                        />
                        <span>
                          Autorizo a Seguros Bolívar a realizar débitos automáticos mensuales de mi cuenta para el pago del plan seleccionado. *
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                <button
                  onClick={processPayment}
                  disabled={!canProceed()}
                  className="mt-6 w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Pagar {plan.price}
                </button>

                <p className="text-xs text-bolivar-muted text-center mt-3 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Transacción protegida con encriptación TLS 1.3
                </p>
              </div>
            )}

            {/* Step: Processing */}
            {step === 'processing' && (
              <div className="bg-white rounded-xl border border-bolivar-border p-10 text-center">
                <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
                <h2 className="text-xl font-semibold mb-2">Procesando tu pago...</h2>
                <p className="text-bolivar-muted text-sm mb-4">
                  {method === 'pse'
                    ? 'Conectando con tu banco para autorizar la transacción.'
                    : method === 'auto_debit'
                      ? 'Registrando la autorización de débito automático.'
                      : 'Validando los datos de tu tarjeta con la red de pagos.'}
                </p>
                <p className="text-xs text-bolivar-muted">No cierres esta ventana.</p>
              </div>
            )}

            {/* Step: Result */}
            {step === 'result' && (
              <div className="bg-white rounded-xl border border-bolivar-border p-8 text-center">
                {paymentSuccess ? (
                  <>
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">¡Pago exitoso!</h2>
                    <p className="text-bolivar-muted mb-6">Tu suscripción al {plan.name} ha sido activada.</p>

                    <div className="bg-bolivar-bg rounded-lg p-5 text-left max-w-md mx-auto mb-6">
                      <h3 className="font-semibold mb-3 text-sm">Comprobante de pago</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-bolivar-muted">Referencia</span>
                          <span className="font-mono font-medium">{txRef}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-bolivar-muted">Plan</span>
                          <span className="font-medium">{plan.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-bolivar-muted">Monto</span>
                          <span className="font-medium">{plan.price} COP</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-bolivar-muted">Método</span>
                          <span className="font-medium">{methodLabel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-bolivar-muted">Fecha</span>
                          <span className="font-medium">{new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-bolivar-muted">Estado</span>
                          <span className="text-green-700 font-medium">Aprobado</span>
                        </div>
                      </div>
                    </div>

                    {method === 'auto_debit' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-md mx-auto mb-6">
                        <p className="text-blue-700 text-sm flex items-center gap-2">
                          <Repeat className="w-4 h-4 flex-shrink-0" />
                          El débito automático se ejecutará el día 1 de cada mes.
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3 justify-center">
                      {fromOnboarding ? (
                        <Link to="/onboarding?step=4" className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors">
                          Continuar registro
                        </Link>
                      ) : (
                        <Link to="/home" className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors">
                          Ir al portal
                        </Link>
                      )}
                      <Link to="/" className="px-6 py-2.5 border border-bolivar-border rounded-lg text-sm hover:bg-bolivar-bg transition-colors">
                        Volver al catálogo
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Pago rechazado</h2>
                    <p className="text-bolivar-muted mb-6">No pudimos procesar tu pago. Verifica los datos e intenta de nuevo.</p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-w-md mx-auto mb-6">
                      <p className="text-red-700 text-sm">Referencia: {txRef}</p>
                    </div>
                    <button
                      onClick={() => setStep('details')}
                      className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors"
                    >
                      Reintentar pago
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Sidebar: Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-bolivar-border p-5 sticky top-6">
              <h3 className="font-semibold mb-4">Resumen de compra</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-bolivar-muted">Plan</span>
                  <span className="font-medium">{plan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bolivar-muted">Precio</span>
                  <span className="font-medium">{plan.price} {plan.period}</span>
                </div>
                <hr className="border-bolivar-border" />
                <p className="text-xs text-bolivar-muted">{plan.description}</p>
                {method && step !== 'method' && (
                  <>
                    <hr className="border-bolivar-border" />
                    <div className="flex justify-between">
                      <span className="text-bolivar-muted">Método</span>
                      <span className="font-medium text-xs">{methodLabel}</span>
                    </div>
                  </>
                )}
                <hr className="border-bolivar-border" />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">{plan.price} COP</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-bolivar-border space-y-2">
                <div className="flex items-center gap-2 text-xs text-bolivar-muted">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                  Pago seguro con encriptación
                </div>
                <div className="flex items-center gap-2 text-xs text-bolivar-muted">
                  <Lock className="w-3.5 h-3.5 text-green-600" />
                  Datos protegidos — PCI DSS
                </div>
                <div className="flex items-center gap-2 text-xs text-bolivar-muted">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                  Cancelación en cualquier momento
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
