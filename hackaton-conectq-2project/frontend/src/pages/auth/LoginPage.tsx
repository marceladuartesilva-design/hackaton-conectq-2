import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff, BookOpen, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';
import LogoBolivar from '../../components/LogoBolivar';

type AuthStep = 'credentials' | 'mfa';

export default function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<AuthStep>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mfaCode, setMfaCode] = useState(['', '', '', '', '', '']);
  const [mfaMethod, setMfaMethod] = useState<'totp' | 'email'>('totp');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('mfa'); }, 800);
  };

  const handleMfaChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...mfaCode];
    newCode[index] = value;
    setMfaCode(newCode);
    if (value && index < 5) document.getElementById(`mfa-${index + 1}`)?.focus();
  };

  const handleMfaKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !mfaCode[index] && index > 0) document.getElementById(`mfa-${index - 1}`)?.focus();
  };

  const handleVerifyMfa = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.join('').length < 6) { setError('Ingresa el código completo de 6 dígitos.'); return; }
    setLoading(true);
    setError('');
    setTimeout(() => { setLoading(false); navigate('/home'); }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex">
      {/* Left panel - Branding + Catalog CTA */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white">
        <div>
          <div className="flex items-center gap-2 mb-16">
            <LogoBolivar variant="full" theme="light" />
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            El ecosistema de APIs<br />de Seguros Bolívar
          </h1>
          <p className="text-white/70 text-lg max-w-md mb-8">
            Integra seguros en tu plataforma con APIs de grado empresarial. Cotización, emisión, pagos y más.
          </p>

          {/* Catalog CTA - prominent */}
          <Link
            to="/"
            className="inline-flex items-center gap-3 bg-white text-primary font-semibold px-6 py-4 rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl group"
          >
            <div className="w-11 h-11 rounded-lg bg-primary-light flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-base">Explorar catálogo de APIs</p>
              <p className="text-xs text-bolivar-muted font-normal">Conoce nuestros servicios sin necesidad de cuenta</p>
            </div>
            <ExternalLink className="w-5 h-5 text-bolivar-muted group-hover:text-primary ml-2" />
          </Link>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-white/80">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-sm">Seguridad empresarial</p>
              <p className="text-xs text-white/50">OAuth 2.0, MFA, tokens httpOnly</p>
            </div>
          </div>
        </div>

        <p className="text-white/30 text-xs">© 2025 Seguros Bolívar — Open Insurance</p>
      </div>

      {/* Right panel - Auth form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-bolivar-bg">
        <div className="w-full max-w-md">
          {/* Mobile logo + catalog link */}
          <div className="lg:hidden flex flex-col items-center gap-4 mb-8">
            <LogoBolivar variant="full" theme="dark" />
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary font-medium bg-primary-light px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors">
              <BookOpen className="w-4 h-4" /> Ver catálogo de APIs
            </Link>
          </div>

          {step === 'credentials' && (
            <div className="bg-white rounded-2xl shadow-lg border border-bolivar-border p-8">
              <h2 className="text-2xl font-bold mb-1">Iniciar sesión</h2>
              <p className="text-bolivar-muted text-sm mb-6">Ingresa a tu cuenta de aliado</p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1.5">Correo corporativo</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bolivar-muted" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@empresa.com" className="w-full pl-10 pr-4 py-2.5 border border-bolivar-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" autoComplete="email" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium">Contraseña</label>
                    <button type="button" className="text-xs text-primary hover:underline">¿Olvidaste tu contraseña?</button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bolivar-muted" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" className="w-full pl-10 pr-10 py-2.5 border border-bolivar-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" autoComplete="current-password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-bolivar-muted hover:text-bolivar-text">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Continuar <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              <p className="text-center text-sm text-bolivar-muted mt-6">
                ¿No tienes cuenta?{' '}
                <Link to="/onboarding" className="text-primary font-medium hover:underline">Registra tu organización</Link>
              </p>
            </div>
          )}

          {step === 'mfa' && (
            <div className="bg-white rounded-2xl shadow-lg border border-bolivar-border p-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-1">Verificación en dos pasos</h2>
                <p className="text-bolivar-muted text-sm">Ingresa el código de 6 dígitos para continuar</p>
              </div>

              <div className="flex gap-2 mb-6">
                <button onClick={() => setMfaMethod('totp')} className={cn('flex-1 py-2 text-sm rounded-lg border transition-colors', mfaMethod === 'totp' ? 'border-primary bg-primary-light text-primary font-medium' : 'border-bolivar-border hover:bg-bolivar-bg')}>
                  App autenticadora
                </button>
                <button onClick={() => setMfaMethod('email')} className={cn('flex-1 py-2 text-sm rounded-lg border transition-colors', mfaMethod === 'email' ? 'border-primary bg-primary-light text-primary font-medium' : 'border-bolivar-border hover:bg-bolivar-bg')}>
                  Código por correo
                </button>
              </div>

              <p className="text-xs text-bolivar-muted text-center mb-4">
                {mfaMethod === 'totp' ? 'Abre tu aplicación autenticadora (Google Authenticator, Authy) e ingresa el código.' : `Enviamos un código a ${email || 'tu@empresa.com'}.`}
              </p>

              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>}

              <form onSubmit={handleVerifyMfa}>
                <div className="flex gap-2 justify-center mb-6">
                  {mfaCode.map((digit, i) => (
                    <input key={i} id={`mfa-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handleMfaChange(i, e.target.value.replace(/\D/g, ''))} onKeyDown={(e) => handleMfaKeyDown(i, e)} className="w-12 h-14 text-center text-xl font-bold border border-bolivar-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" autoFocus={i === 0} />
                  ))}
                </div>
                <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Verificar <ShieldCheck className="w-4 h-4" /></>}
                </button>
              </form>

              <div className="flex items-center justify-between mt-4">
                <button onClick={() => { setStep('credentials'); setMfaCode(['', '', '', '', '', '']); setError(''); }} className="text-xs text-bolivar-muted hover:text-bolivar-text">← Volver al login</button>
                {mfaMethod === 'email' && <button className="text-xs text-primary hover:underline">Reenviar código</button>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
