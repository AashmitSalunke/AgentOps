import { Bell, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard Overview', subtitle: 'Real-time system health and performance' },
  '/agents': { title: 'Agent Management', subtitle: 'Monitor and manage all AI agents' },
  '/workflow': { title: 'Workflow Visualization', subtitle: 'Live agent communication graph' },
  '/analytics': { title: 'Analytics', subtitle: 'Performance trends and usage statistics' },
  '/notifications': { title: 'Notifications', subtitle: 'Alerts, warnings, and system events' },
  '/settings': { title: 'Settings', subtitle: 'Configure your dashboard preferences' },
  '/profile': { title: 'User Profile', subtitle: 'Your account and activity' },
};

export default function Header({
  unreadCount,
  onSearchClick,
}: {
  unreadCount: number;
  onSearchClick: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathKey = Object.keys(pageTitles).find(k =>
    k === '/' ? location.pathname === '/' : location.pathname.startsWith(k)
  ) ?? '/';
  const { title, subtitle } = pageTitles[pathKey] ?? pageTitles['/'];

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-white/5 bg-surface-800/30 backdrop-blur-xl sticky top-0 z-30">
      <div>
        <h1 className="text-base font-semibold text-white leading-none">{title}</h1>
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-2">
        {/* Search Trigger */}
        <button
          onClick={onSearchClick}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/8 border border-white/5 text-gray-400 text-xs transition-all duration-200 hover:text-gray-300"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-gray-600 font-mono">⌘K</kbd>
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-600 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/5 transition-all duration-200 group"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-brand flex items-center justify-center text-[11px] font-bold text-white">
            A
          </div>
          <span className="text-xs font-medium text-gray-300 group-hover:text-white hidden sm:inline">Admin</span>
        </button>
      </div>
    </header>
  );
}
