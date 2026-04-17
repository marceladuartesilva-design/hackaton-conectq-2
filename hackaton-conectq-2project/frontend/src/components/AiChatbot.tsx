import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickReplies = [
  '¿Cómo obtengo mi API Key?',
  '¿Qué APIs están disponibles?',
  '¿Cómo funciona el Sandbox?',
  '¿Cómo veo mi consumo?',
];

const botResponses: Record<string, string> = {
  'api key': '🔑 Para obtener tu API Key, ve a la sección de tu perfil o crea una nueva aplicación desde el Onboarding. Se generará automáticamente una API Key, Client ID y Client Secret. Recuerda guardarlas — solo se muestran una vez.',
  'apis disponibles': '📚 Tenemos APIs de Cotización, Emisión de Pólizas, Pagos, Consulta de Pólizas, Verificación SARLAFT y Modificaciones. Puedes explorarlas todas en el Catálogo con filtros por categoría y estado.',
  'sandbox': '🧪 El Sandbox te permite probar cualquier API sin afectar producción. Selecciona una API, elige el endpoint, edita el body JSON y ejecuta. Verás la respuesta completa con status, headers y body. Tienes un límite de 100 requests por hora.',
  'consumo': '📊 En el Dashboard de Consumo puedes ver métricas en tiempo real: total de llamadas, tasa de éxito/error, latencia promedio y estado de tu cuota mensual. También hay gráficos de tendencia por hora y por día.',
  'default': '🤖 Gracias por tu pregunta. Puedo ayudarte con temas sobre APIs, autenticación, sandbox, consumo y configuración de tu cuenta. ¿Podrías darme más detalles sobre lo que necesitas?',
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('api key') || lower.includes('credencial') || lower.includes('key')) return botResponses['api key'];
  if (lower.includes('disponible') || lower.includes('catálogo') || lower.includes('catalogo') || lower.includes('qué apis')) return botResponses['apis disponibles'];
  if (lower.includes('sandbox') || lower.includes('probar') || lower.includes('prueba')) return botResponses['sandbox'];
  if (lower.includes('consumo') || lower.includes('dashboard') || lower.includes('métrica') || lower.includes('cuota')) return botResponses['consumo'];
  return botResponses['default'];
}

export default function AiChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: '¡Hola! 👋 Soy el asistente de Conecta 2.0. ¿En qué puedo ayudarte hoy?', timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: getBotResponse(text), timestamp: new Date() };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* FAB button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all z-50',
          open ? 'bg-bolivar-text hover:bg-gray-700' : 'bg-primary hover:bg-primary-dark'
        )}
        aria-label={open ? 'Cerrar asistente' : 'Abrir asistente IA'}
      >
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-bolivar-border flex flex-col z-50" style={{ height: '500px' }}>
          {/* Header */}
          <div className="bg-primary text-white px-4 py-3 rounded-t-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-sm">Asistente Conecta IA</p>
              <p className="text-xs text-white/60">Soporte 24/7</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div className={cn(
                  'max-w-[75%] px-3 py-2 rounded-xl text-sm',
                  msg.role === 'user' ? 'bg-primary text-white rounded-br-sm' : 'bg-bolivar-bg text-bolivar-text rounded-bl-sm'
                )}>
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-bolivar-border flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-bolivar-muted" />
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div className="flex gap-2 items-start">
                <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-bolivar-bg px-4 py-2.5 rounded-xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-bolivar-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-bolivar-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-bolivar-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex gap-1.5 flex-wrap">
              {quickReplies.map((q) => (
                <button key={q} onClick={() => sendMessage(q)} className="text-xs px-2.5 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary-light transition-colors">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-bolivar-border flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              className="flex-1 px-3 py-2 border border-bolivar-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              disabled={typing}
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="w-10 h-10 bg-primary hover:bg-primary-dark text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
