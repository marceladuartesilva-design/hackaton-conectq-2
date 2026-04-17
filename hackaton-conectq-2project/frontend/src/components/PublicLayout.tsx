import { Link, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, LogIn, UserPlus } from 'lucide-react';
import { cn } from '../lib/utils';
import AiChatbot from './AiChatbot';
import LogoBolivar from './LogoBolivar';

export default function PublicLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-bolivar-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <LogoBolivar variant="full" theme="dark" />
            <div className="flex items-center gap-2 ml-2">
              <div className="w-px h-6 bg-bolivar-border" />
              <span className="text-sm font-semibold text-primary">Conecta 2.0</span>
              <span className="text-xs font-normal text-bolivar-muted bg-bolivar-bg px-2 py-0.5 rounded-full">Público</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/explore"
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors',
                (pathname === '/' || pathname === '/explore') ? 'bg-primary-light text-primary font-medium' : 'text-bolivar-muted hover:bg-bolivar-bg'
              )}
            >
              <BookOpen className="w-4 h-4" /> Catálogo
            </Link>
            <div className="w-px h-6 bg-bolivar-border mx-1" />
            <Link to="/login" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-bolivar-muted hover:bg-bolivar-bg transition-colors">
              <LogIn className="w-4 h-4" /> Iniciar sesión
            </Link>
            <Link to="/onboarding" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-primary text-white hover:bg-primary-dark transition-colors">
              <UserPlus className="w-4 h-4" /> Registrarse
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <AiChatbot />
      <footer className="bg-bolivar-text text-white/60 text-center text-xs py-3">
        © 2025 Seguros Bolívar — Conecta 2.0 API Ecosystem
      </footer>
    </div>
  );
}
