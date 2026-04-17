import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, FlaskConical, LayoutDashboard, LogOut, HelpCircle, Megaphone } from 'lucide-react';
import { cn } from '../lib/utils';
import AiChatbot from './AiChatbot';
import LogoBolivar from './LogoBolivar';
import OnboardingTour from './OnboardingTour';

const navItems = [
  { to: '/catalog', label: 'Catálogo', icon: BookOpen },
  { to: '/sandbox', label: 'Sandbox', icon: FlaskConical },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/announcements', label: 'Novedades', icon: Megaphone },
];

const TOUR_KEY = 'conecta2_tour_completed';

export default function Layout() {
  const { pathname } = useLocation();
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(TOUR_KEY);
    if (!completed) setShowTour(true);
  }, []);

  const completeTour = () => {
    setShowTour(false);
    localStorage.setItem(TOUR_KEY, 'true');
  };

  const replayTour = () => {
    setShowTour(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showTour && <OnboardingTour onComplete={completeTour} />}
      <header className="bg-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-3">
            <LogoBolivar variant="icon" theme="light" />
            <span className="font-bold text-lg">Conecta 2.0</span>
          </Link>
          <nav className="flex gap-1 items-center">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors',
                  pathname.startsWith(item.to)
                    ? 'bg-white/20 font-medium'
                    : 'hover:bg-white/10'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
            <button
              onClick={replayTour}
              className="flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-full text-sm hover:bg-white/10 transition-colors"
              title="Ver tour de la aplicación"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <Link to="/login" className="flex items-center gap-1.5 ml-1 px-3 py-1.5 rounded-full text-sm bg-white/10 hover:bg-white/20 transition-colors">
              <LogOut className="w-4 h-4" /> Cerrar sesión
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <AiChatbot />
      <footer className="bg-bolivar-text text-white/60 text-center text-xs py-3">
        © 2025 Seguros Bolívar — Conecta 2.0 API Ecosystem — Prototipo Hackathon
      </footer>
    </div>
  );
}
