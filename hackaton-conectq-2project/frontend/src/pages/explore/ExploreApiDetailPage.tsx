import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, LogIn, Zap } from 'lucide-react';
import { mockApis } from '../../data/mock-apis';
import { cn, methodColor, statusColor, statusLabel } from '../../lib/utils';
import { generateSnippet } from '../../lib/code-generator';
import ApiDownloadButton from '../../components/ApiDownloadButton';
import type { ApiEndpoint } from '../../types';

const langs = ['javascript', 'python', 'curl'] as const;

function EndpointCard({ endpoint }: { endpoint: ApiEndpoint }) {
  const [lang, setLang] = useState<(typeof langs)[number]>('javascript');
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const snippet = generateSnippet(endpoint, lang);
  const handleCopy = () => { navigator.clipboard.writeText(snippet); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="bg-white border border-bolivar-border rounded-xl overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-3 p-4 hover:bg-bolivar-bg transition-colors text-left">
        <span className={cn('text-xs font-bold px-2 py-1 rounded', methodColor(endpoint.method))}>{endpoint.method}</span>
        <code className="text-sm font-mono flex-1">{endpoint.path}</code>
        <span className="text-sm text-bolivar-muted">{endpoint.summary}</span>
      </button>
      {expanded && (
        <div className="border-t border-bolivar-border p-4 space-y-4">
          <p className="text-sm text-bolivar-muted">{endpoint.description}</p>
          {endpoint.parameters && endpoint.parameters.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Parámetros</h4>
              <table className="w-full text-sm">
                <thead><tr className="text-left text-bolivar-muted border-b"><th className="pb-1">Nombre</th><th className="pb-1">Ubicación</th><th className="pb-1">Tipo</th><th className="pb-1">Requerido</th></tr></thead>
                <tbody>
                  {endpoint.parameters.map((p) => (
                    <tr key={p.name} className="border-b border-bolivar-border/50">
                      <td className="py-1.5 font-mono text-xs">{p.name}</td><td className="py-1.5">{p.in}</td><td className="py-1.5">{p.type}</td><td className="py-1.5">{p.required ? '✓' : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {endpoint.responseExample && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Ejemplo de respuesta</h4>
              <pre className="bg-gray-900 text-green-400 text-xs p-3 rounded-lg overflow-x-auto">{JSON.stringify(endpoint.responseExample, null, 2)}</pre>
            </div>
          )}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold">Código de ejemplo</h4>
              <div className="flex gap-1">
                {langs.map((l) => (
                  <button key={l} onClick={() => setLang(l)} className={cn('px-2 py-1 text-xs rounded', lang === l ? 'bg-primary text-white' : 'bg-bolivar-bg hover:bg-bolivar-border')}>
                    {l === 'javascript' ? 'JS' : l === 'python' ? 'Python' : 'cURL'}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 text-xs p-3 rounded-lg overflow-x-auto">{snippet}</pre>
              <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors" title="Copiar">
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-white/60" />}
              </button>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
            <LogIn className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              <Link to="/onboarding" className="font-medium underline">Regístrate</Link> para probar esta API en el Sandbox con datos reales.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExploreApiDetailPage() {
  const { id } = useParams();
  const api = mockApis.find((a) => a.id === id);

  if (!api) return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-bolivar-muted">API no encontrada</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/explore" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" /> Volver al catálogo
      </Link>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">{api.name}</h1>
          <p className="text-bolivar-muted">{api.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`/explore/${api.id}/integrate`}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Zap className="w-4 h-4" /> Integración rápida
          </Link>
          <ApiDownloadButton api={api} />
          <div className="flex gap-2">
            <span className={cn('text-xs font-medium px-2 py-1 rounded-full', statusColor(api.status))}>{statusLabel(api.status)}</span>
            <span className="text-xs font-mono px-2 py-1 rounded-full bg-bolivar-bg">{api.currentVersion}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        {api.tags.map((tag) => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-bolivar-bg text-bolivar-muted">#{tag}</span>
        ))}
      </div>
      <h2 className="text-xl font-semibold mb-4">Endpoints ({api.endpoints.length})</h2>
      <div className="space-y-3">
        {api.endpoints.map((ep, i) => <EndpointCard key={i} endpoint={ep} />)}
      </div>
    </div>
  );
}
