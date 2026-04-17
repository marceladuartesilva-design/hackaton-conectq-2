import { useState } from 'react';
import { Download, FileText, FileJson, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { generateApiDocMarkdown, generateApiDocJson, downloadFile } from '../lib/api-doc-generator';
import type { ApiDefinition } from '../types';

interface ApiDownloadButtonProps {
  api: ApiDefinition;
}

export default function ApiDownloadButton({ api }: ApiDownloadButtonProps) {
  const [open, setOpen] = useState(false);

  const slug = api.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleDownloadMd = () => {
    const content = generateApiDocMarkdown(api);
    downloadFile(content, `${slug}-documentacion.md`, 'text/markdown');
    setOpen(false);
  };

  const handleDownloadJson = () => {
    const content = generateApiDocJson(api);
    downloadFile(content, `${slug}-openapi-spec.json`, 'application/json');
    setOpen(false);
  };

  const handleDownloadAll = () => {
    handleDownloadMd();
    setTimeout(() => {
      const content = generateApiDocJson(api);
      downloadFile(content, `${slug}-openapi-spec.json`, 'application/json');
    }, 300);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors"
      >
        <Download className="w-4 h-4" />
        Descargar documentación
        <ChevronDown className={cn('w-4 h-4 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-white rounded-xl border border-bolivar-border shadow-lg z-20 w-72 overflow-hidden">
            <div className="p-3 border-b border-bolivar-border bg-bolivar-bg">
              <p className="text-xs text-bolivar-muted">Descarga la documentación y especificación técnica de esta API.</p>
            </div>
            <button onClick={handleDownloadAll} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bolivar-bg transition-colors text-left border-b border-bolivar-border">
              <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Descargar todo</p>
                <p className="text-xs text-bolivar-muted">Documentación + OpenAPI Spec</p>
              </div>
            </button>
            <button onClick={handleDownloadMd} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bolivar-bg transition-colors text-left">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Documentación (.md)</p>
                <p className="text-xs text-bolivar-muted">Endpoints, ejemplos, soporte y autenticación</p>
              </div>
            </button>
            <button onClick={handleDownloadJson} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bolivar-bg transition-colors text-left">
              <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
                <FileJson className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium">OpenAPI Spec (.json)</p>
                <p className="text-xs text-bolivar-muted">Especificación técnica importable</p>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
