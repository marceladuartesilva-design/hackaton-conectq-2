import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Key, Code2, Play, CheckCircle, Copy, Check,
  Loader2, ChevronDown, Lightbulb, Terminal, Zap, ShieldCheck, BookOpen,
} from 'lucide-react';
import { mockApis } from '../../data/mock-apis';
import { cn, methodColor } from '../../lib/utils';
import type { ApiEndpoint } from '../../types';

/* ------------------------------------------------------------------ */
/*  Types & constants                                                  */
/* ------------------------------------------------------------------ */
type WizardStep = 0 | 1 | 2 | 3;
type Lang = 'javascript' | 'python' | 'curl';

const stepsMeta = [
  { label: 'API Key', icon: Key, desc: 'Obtén tus credenciales' },
  { label: 'Configurar', icon: Code2, desc: 'Elige endpoint y parámetros' },
  { label: 'Código', icon: Terminal, desc: 'Copia el snippet listo' },
  { label: 'Probar', icon: Play, desc: 'Ejecuta en sandbox' },
];

const DEMO_KEY = 'sk-demo-XXXXXXXXXXXXXXXXXXXX';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function buildSnippet(
  endpoint: ApiEndpoint,
  lang: Lang,
  apiKey: string,
  paramValues: Record<string, string>,
  bodyValues: Record<string, unknown>,
): string {
  const baseUrl = 'https://sandbox.conecta.segurosbolivar.com';
  let path = endpoint.path;
  // Replace path params
  for (const [k, v] of Object.entries(paramValues)) {
    path = path.replace(`{${k}}`, v || `{${k}}`);
  }
  const url = `${baseUrl}${path}`;
  const hasBody = endpoint.requestBody && ['POST', 'PUT', 'PATCH'].includes(endpoint.method);
  const body = hasBody ? bodyValues : null;

  if (lang === 'curl') {
    let cmd = `curl -X ${endpoint.method} '${url}'`;
    cmd += ` \\\n  -H 'Authorization: Bearer ${apiKey}'`;
    cmd += ` \\\n  -H 'Content-Type: application/json'`;
    if (body) cmd += ` \\\n  -d '${JSON.stringify(body, null, 2)}'`;
    return cmd;
  }

  if (lang === 'python') {
    let c = `import requests\n\n`;
    c += `url = "${url}"\n`;
    c += `headers = {\n    "Authorization": "Bearer ${apiKey}",\n    "Content-Type": "application/json"\n}\n`;
    if (body) {
      c += `payload = ${JSON.stringify(body, null, 4)}\n\n`;
      c += `response = requests.${endpoint.method.toLowerCase()}(url, json=payload, headers=headers)\n`;
    } else {
      c += `\nresponse = requests.${endpoint.method.toLowerCase()}(url, headers=headers)\n`;
    }
    c += `print(response.status_code)\nprint(response.json())`;
    return c;
  }

  // javascript (fetch)
  let c = `const response = await fetch('${url}', {\n`;
  c += `  method: '${endpoint.method}',\n`;
  c += `  headers: {\n    'Authorization': 'Bearer ${apiKey}',\n    'Content-Type': 'application/json',\n  },\n`;
  if (body) c += `  body: JSON.stringify(${JSON.stringify(body, null, 4)}),\n`;
  c += `});\n\nconst data = await response.json();\nconsole.log(data);`;
  return c;
}

function flattenObj(obj: Record<string, unknown>, prefix = ''): { key: string; value: unknown }[] {
  const result: { key: string; value: unknown }[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      result.push(...flattenObj(v as Record<string, unknown>, fullKey));
    } else {
      result.push({ key: fullKey, value: v });
    }
  }
  return result;
}

function setNestedValue(obj: Record<string, unknown>, path: string, value: string): Record<string, unknown> {
  const clone = JSON.parse(JSON.stringify(obj));
  const parts = path.split('.');
  let current: Record<string, unknown> = clone;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]] || typeof current[parts[i]] !== 'object') {
      current[parts[i]] = {};
    }
    current = current[parts[i]] as Record<string, unknown>;
  }
  // Try to preserve type
  const last = parts[parts.length - 1];
  const num = Number(value);
  if (!isNaN(num) && value.trim() !== '') current[last] = num;
  else if (value === 'true') current[last] = true;
  else if (value === 'false') current[last] = false;
  else current[last] = value;
  return clone;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function IntegrationWizardPage() {
  const { id } = useParams();
  const api = mockApis.find((a) => a.id === id);

  const [step, setStep] = useState<WizardStep>(0);
  const [apiKey, setApiKey] = useState('');
  const [keyGenerated, setKeyGenerated] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<number>(0);
  const [lang, setLang] = useState<Lang>('javascript');
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ status: number; body: unknown } | null>(null);

  // Param & body state
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [bodyValues, setBodyValues] = useState<Record<string, unknown>>({});

  if (!api) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-bolivar-muted">
        <p className="text-lg mb-4">API no encontrada</p>
        <Link to="/explore" className="text-primary hover:underline">Volver al catálogo</Link>
      </div>
    );
  }

  const endpoint = api.endpoints[selectedEndpoint];

  const handleGenerateKey = () => {
    setApiKey(DEMO_KEY);
    setKeyGenerated(true);
  };

  const handleSelectEndpoint = (idx: number) => {
    setSelectedEndpoint(idx);
    setParamValues({});
    setBodyValues(api.endpoints[idx].requestBody ? JSON.parse(JSON.stringify(api.endpoints[idx].requestBody)) : {});
    setTestResult(null);
  };

  // Initialize body on first render of step 1
  if (step === 1 && Object.keys(bodyValues).length === 0 && endpoint.requestBody) {
    setBodyValues(JSON.parse(JSON.stringify(endpoint.requestBody)));
  }

  const snippet = useMemo(
    () => buildSnippet(endpoint, lang, apiKey || 'YOUR_API_KEY', paramValues, bodyValues),
    [endpoint, lang, apiKey, paramValues, bodyValues],
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTest = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult({
        status: 200,
        body: endpoint.responseExample ?? { message: 'OK' },
      });
    }, 1800);
  };

  const canNext = (): boolean => {
    if (step === 0) return keyGenerated;
    if (step === 1) return true;
    if (step === 2) return true;
    return false;
  };

  const bodyFields = endpoint.requestBody ? flattenObj(endpoint.requestBody as Record<string, unknown>) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to={`/explore/${api.id}`} className="text-bolivar-muted hover:text-bolivar-text transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Integración rápida — {api.name}
          </h1>
          <p className="text-sm text-bolivar-muted">Conecta esta API en minutos, sin descargar documentación.</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {stepsMeta.map((s, i) => (
          <button
            key={i}
            onClick={() => { if (i <= step || (i === step + 1 && canNext())) setStep(i as WizardStep); }}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all border-2',
              i === step
                ? 'border-primary bg-primary-light/40 text-primary font-medium shadow-sm'
                : i < step
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-bolivar-border bg-white text-bolivar-muted',
            )}
          >
            {i < step ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <s.icon className="w-4 h-4" />
            )}
            <span className="hidden md:inline">{s.label}</span>
            <span className="md:hidden">{i + 1}</span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main panel */}
        <div className="lg:col-span-2">
          {/* Step 0: API Key */}
          {step === 0 && (
            <div className="bg-white rounded-xl border border-bolivar-border p-6">
              <h2 className="text-xl font-semibold mb-1">1. Obtén tu API Key</h2>
              <p className="text-sm text-bolivar-muted mb-6">
                Necesitas una clave para autenticarte. En producción la obtienes desde tu dashboard; aquí te generamos una de sandbox.
              </p>

              {!keyGenerated ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
                    <Key className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-bolivar-muted mb-4">Genera una API Key de prueba para el sandbox.</p>
                  <button
                    onClick={handleGenerateKey}
                    className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors"
                  >
                    Generar API Key de sandbox
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">API Key generada</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-lg border border-green-200 px-3 py-2">
                      <code className="flex-1 text-sm font-mono text-gray-700 select-all">{apiKey}</code>
                      <button
                        onClick={() => { navigator.clipboard.writeText(apiKey); }}
                        className="p-1.5 rounded hover:bg-green-100 transition-colors"
                        title="Copiar"
                      >
                        <Copy className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">
                      Esta es una key de sandbox. En producción, guárdala en variables de entorno — nunca en el código fuente.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 1: Configure */}
          {step === 1 && (
            <div className="bg-white rounded-xl border border-bolivar-border p-6">
              <h2 className="text-xl font-semibold mb-1">2. Configura tu llamada</h2>
              <p className="text-sm text-bolivar-muted mb-6">Elige el endpoint y ajusta los parámetros.</p>

              {/* Endpoint selector */}
              <div className="mb-6">
                <label className="text-sm font-medium block mb-2">Endpoint</label>
                <div className="space-y-2">
                  {api.endpoints.map((ep, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectEndpoint(i)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all',
                        selectedEndpoint === i
                          ? 'border-primary bg-primary-light/30'
                          : 'border-bolivar-border hover:border-primary/40',
                      )}
                    >
                      <span className={cn('text-xs font-bold px-2 py-0.5 rounded', methodColor(ep.method))}>{ep.method}</span>
                      <code className="text-sm font-mono flex-1">{ep.path}</code>
                      <span className="text-xs text-bolivar-muted hidden md:inline">{ep.summary}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Path params */}
              {endpoint.parameters && endpoint.parameters.length > 0 && (
                <div className="mb-6">
                  <label className="text-sm font-medium block mb-2">Parámetros de ruta</label>
                  <div className="space-y-3">
                    {endpoint.parameters.map((p) => (
                      <div key={p.name}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-mono">{p.name}</span>
                          {p.required && <span className="text-xs text-red-500">*</span>}
                          <span className="text-xs text-bolivar-muted">({p.type})</span>
                        </div>
                        <input
                          value={paramValues[p.name] ?? ''}
                          onChange={(e) => setParamValues((prev) => ({ ...prev, [p.name]: e.target.value }))}
                          placeholder={p.description}
                          className="w-full border border-bolivar-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Request body */}
              {bodyFields.length > 0 && (
                <div>
                  <label className="text-sm font-medium block mb-2">Cuerpo de la petición (JSON)</label>
                  <div className="space-y-3 bg-bolivar-bg rounded-lg p-4">
                    {bodyFields.map((f) => (
                      <div key={f.key} className="flex items-center gap-3">
                        <label className="text-xs font-mono text-bolivar-muted w-48 flex-shrink-0 text-right">{f.key}</label>
                        <input
                          value={String(f.value ?? '')}
                          onChange={(e) => setBodyValues((prev) => setNestedValue(prev as Record<string, unknown>, f.key, e.target.value))}
                          className="flex-1 border border-bolivar-border rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-bolivar-muted mt-2">Modifica los valores para personalizar tu petición.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Code */}
          {step === 2 && (
            <div className="bg-white rounded-xl border border-bolivar-border p-6">
              <h2 className="text-xl font-semibold mb-1">3. Copia el código</h2>
              <p className="text-sm text-bolivar-muted mb-4">Snippet listo para pegar en tu proyecto.</p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-1">
                  {(['javascript', 'python', 'curl'] as Lang[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={cn(
                        'px-3 py-1.5 text-sm rounded-lg transition-colors',
                        lang === l ? 'bg-primary text-white' : 'bg-bolivar-bg hover:bg-bolivar-border',
                      )}
                    >
                      {l === 'javascript' ? 'JavaScript' : l === 'python' ? 'Python' : 'cURL'}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-bolivar-bg hover:bg-bolivar-border transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
              </div>

              <pre className="bg-gray-900 text-gray-100 text-sm p-4 rounded-xl overflow-x-auto leading-relaxed">
                {snippet}
              </pre>

              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Siguiente paso</p>
                  <p>Pega este código en tu proyecto y ejecútalo. O pasa al paso 4 para probarlo aquí mismo en el sandbox.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Test */}
          {step === 3 && (
            <div className="bg-white rounded-xl border border-bolivar-border p-6">
              <h2 className="text-xl font-semibold mb-1">4. Prueba en sandbox</h2>
              <p className="text-sm text-bolivar-muted mb-6">Ejecuta la llamada y ve la respuesta en tiempo real.</p>

              {/* Request preview */}
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Petición</h3>
                <div className="bg-bolivar-bg rounded-lg p-3 flex items-center gap-3">
                  <span className={cn('text-xs font-bold px-2 py-0.5 rounded', methodColor(endpoint.method))}>{endpoint.method}</span>
                  <code className="text-sm font-mono flex-1 text-bolivar-muted">
                    {(() => {
                      let p = endpoint.path;
                      for (const [k, v] of Object.entries(paramValues)) p = p.replace(`{${k}}`, v || `{${k}}`);
                      return `sandbox.conecta.segurosbolivar.com${p}`;
                    })()}
                  </code>
                </div>
              </div>

              {/* Execute button */}
              <button
                onClick={handleTest}
                disabled={testing}
                className="w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mb-6"
              >
                {testing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Ejecutando...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Ejecutar petición
                  </>
                )}
              </button>

              {/* Response */}
              {testResult && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-medium">Respuesta</h3>
                    <span className={cn(
                      'text-xs font-bold px-2 py-0.5 rounded',
                      testResult.status < 300 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                    )}>
                      {testResult.status} {testResult.status < 300 ? 'OK' : 'Error'}
                    </span>
                    <span className="text-xs text-bolivar-muted">· 142ms</span>
                  </div>
                  <pre className="bg-gray-900 text-green-400 text-sm p-4 rounded-xl overflow-x-auto leading-relaxed">
                    {JSON.stringify(testResult.body, null, 2)}
                  </pre>

                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold text-green-800 mb-1">¡Integración exitosa!</p>
                    <p className="text-sm text-green-700 mb-4">Tu llamada al sandbox funcionó correctamente. Continúa probando en el Sandbox completo.</p>
                    <div className="flex gap-3 justify-center">
                      <Link
                        to={`/sandbox?apiId=${api.id}`}
                        className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" /> Ir al Sandbox
                      </Link>
                      <button
                        onClick={() => { setTestResult(null); }}
                        className="px-5 py-2.5 border border-bolivar-border rounded-lg text-sm hover:bg-bolivar-bg transition-colors"
                      >
                        Probar de nuevo
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          {step < 3 && (
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1) as WizardStep)}
                disabled={step === 0}
                className="px-4 py-2 text-sm rounded-lg border border-bolivar-border hover:bg-white disabled:opacity-40 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 inline mr-1" /> Anterior
              </button>
              <button
                onClick={() => setStep((s) => Math.min(3, s + 1) as WizardStep)}
                disabled={!canNext()}
                className="px-6 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-40"
              >
                Siguiente <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* API info card */}
          <div className="bg-white rounded-xl border border-bolivar-border p-5">
            <h3 className="font-semibold mb-3">{api.name}</h3>
            <p className="text-sm text-bolivar-muted mb-3">{api.description}</p>
            <div className="flex gap-2 flex-wrap mb-3">
              {api.tags.slice(0, 4).map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-bolivar-bg text-bolivar-muted">#{t}</span>
              ))}
            </div>
            <div className="text-xs text-bolivar-muted space-y-1">
              <p>{api.endpoints.length} endpoint{api.endpoints.length !== 1 ? 's' : ''}</p>
              <p>Versión: {api.currentVersion}</p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-primary-light/40 rounded-xl border border-primary/20 p-5">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-primary" /> Tips de integración
            </h3>
            <ul className="space-y-2 text-xs text-bolivar-muted">
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                Usa siempre HTTPS y Bearer token en el header Authorization.
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                Implementa reintentos con backoff exponencial para errores 5xx.
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                Incluye un Correlation-ID en cada petición para trazabilidad.
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                Nunca expongas tu API Key en el frontend — úsala solo desde el backend.
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div className="bg-white rounded-xl border border-bolivar-border p-5">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Enlaces rápidos
            </h3>
            <div className="space-y-2">
              <Link to={`/explore/${api.id}`} className="block text-sm text-primary hover:underline">
                Ver documentación completa
              </Link>
              <Link to="/onboarding" className="block text-sm text-primary hover:underline">
                Registrar mi organización
              </Link>
              <Link to="/explore" className="block text-sm text-primary hover:underline">
                Explorar otras APIs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
