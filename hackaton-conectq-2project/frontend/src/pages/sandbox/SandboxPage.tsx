import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Play, Clock, RotateCcw, Zap } from 'lucide-react';
import { mockApis } from '../../data/mock-apis';
import { cn, methodColor } from '../../lib/utils';

export default function SandboxPage() {
  const [searchParams] = useSearchParams();
  const preselectedApiId = searchParams.get('apiId') || mockApis[0].id;

  const [selectedApiId, setSelectedApiId] = useState(preselectedApiId);
  const [selectedEndpointIdx, setSelectedEndpointIdx] = useState(0);
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState<{ status: number; body: string; time: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ endpoint: string; method: string; status: number; time: number; timestamp: string }[]>([]);

  const api = mockApis.find((a) => a.id === selectedApiId) || mockApis[0];
  const endpoint = api.endpoints[selectedEndpointIdx];

  const handleApiChange = (id: string) => {
    setSelectedApiId(id);
    setSelectedEndpointIdx(0);
    setResponse(null);
    const ep = mockApis.find((a) => a.id === id)?.endpoints[0];
    setRequestBody(ep?.requestBody ? JSON.stringify(ep.requestBody, null, 2) : '');
  };

  const handleEndpointChange = (idx: number) => {
    setSelectedEndpointIdx(idx);
    setResponse(null);
    const ep = api.endpoints[idx];
    setRequestBody(ep?.requestBody ? JSON.stringify(ep.requestBody, null, 2) : '');
  };

  useState(() => {
    if (endpoint?.requestBody) {
      setRequestBody(JSON.stringify(endpoint.requestBody, null, 2));
    }
  });

  const handleExecute = () => {
    setLoading(true);
    const latency = Math.floor(Math.random() * 400) + 80;
    setTimeout(() => {
      setResponse({
        status: 200,
        body: JSON.stringify(endpoint.responseExample || { message: 'OK' }, null, 2),
        time: latency,
      });
      setHistory((prev) => [
        { endpoint: endpoint.path, method: endpoint.method, status: 200, time: latency, timestamp: new Date().toLocaleTimeString('es-CO') },
        ...prev.slice(0, 19),
      ]);
      setLoading(false);
    }, latency);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Sandbox de Pruebas</h1>
      <p className="text-bolivar-muted mb-6">Prueba las APIs en un ambiente aislado sin afectar producción.</p>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-bolivar-border p-4 space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-bolivar-muted mb-1 block">API</label>
                <select value={selectedApiId} onChange={(e) => handleApiChange(e.target.value)} className="w-full border border-bolivar-border rounded-lg px-3 py-2 text-sm">
                  {mockApis.filter((a) => a.status === 'active').map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-bolivar-muted mb-1 block">Endpoint</label>
                <select value={selectedEndpointIdx} onChange={(e) => handleEndpointChange(Number(e.target.value))} className="w-full border border-bolivar-border rounded-lg px-3 py-2 text-sm">
                  {api.endpoints.map((ep, i) => (
                    <option key={i} value={i}>{ep.method} {ep.path}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn('text-xs font-bold px-2 py-1 rounded', methodColor(endpoint.method))}>{endpoint.method}</span>
              <code className="text-sm font-mono text-bolivar-muted">{endpoint.path}</code>
            </div>
          </div>

          {endpoint.requestBody && (
            <div className="bg-white rounded-xl border border-bolivar-border p-4">
              <label className="text-xs font-medium text-bolivar-muted mb-2 block">Request Body (JSON)</label>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                rows={10}
                className="w-full font-mono text-sm bg-gray-50 border border-bolivar-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          )}

          <button
            onClick={handleExecute}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            {loading ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {loading ? 'Ejecutando...' : 'Ejecutar Request'}
          </button>

          {response && (
            <div className="bg-white rounded-xl border border-bolivar-border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Respuesta</h3>
                <div className="flex items-center gap-3 text-sm">
                  <span className={cn('font-mono font-bold', response.status < 300 ? 'text-green-600' : 'text-red-600')}>{response.status}</span>
                  <span className="text-bolivar-muted flex items-center gap-1"><Clock className="w-3 h-3" />{response.time}ms</span>
                </div>
              </div>
              <pre className="bg-gray-900 text-green-400 text-xs p-4 rounded-lg overflow-x-auto">{response.body}</pre>

              {response.status < 300 && (
                <div className="mt-4 pt-4 border-t border-bolivar-border">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 text-center sm:text-left">
                      <p className="font-semibold text-green-800 text-sm">¿Listo para integrar esta API?</p>
                      <p className="text-xs text-green-700 mt-0.5">Obtén el código listo para copiar y pegar en tu proyecto.</p>
                    </div>
                    <Link
                      to={`/explore/${selectedApiId}/integrate`}
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap"
                    >
                      <Zap className="w-4 h-4" /> Integración rápida
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-bolivar-border p-4">
          <h3 className="font-semibold mb-3">Historial de pruebas</h3>
          {history.length === 0 ? (
            <p className="text-sm text-bolivar-muted">Aún no has ejecutado pruebas.</p>
          ) : (
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="text-xs border-b border-bolivar-border/50 pb-2">
                  <div className="flex items-center gap-2">
                    <span className={cn('font-bold px-1.5 py-0.5 rounded', methodColor(h.method))}>{h.method}</span>
                    <span className={h.status < 300 ? 'text-green-600' : 'text-red-600'}>{h.status}</span>
                    <span className="text-bolivar-muted ml-auto">{h.time}ms</span>
                  </div>
                  <code className="text-bolivar-muted block mt-1 truncate">{h.endpoint}</code>
                  <span className="text-bolivar-muted">{h.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
