import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Bot, GitBranch, BarChart2,
  Bell, Settings, User, Zap, ChevronRight,
} from 'lucide-react';
import clsx from 'clsx';

const nav = [
  { label: 'Overview', path: '/', icon: LayoutDashboard },
  { label: 'Agents', path: '/agents', icon: Bot },
  { label: 'Workflow', path: '/workflow', icon: GitBranch },
  { label: 'Analytics', path: '/analytics', icon: BarChart2 },
  { label: 'Notifications', path: '/notifications', icon: Bell },
];

const secondary = [
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'Profile', path: '/profile', icon: User },
];

export default function Sidebar({ unreadCount }: { unreadCount: number }) {
  return (
    <aside className="w-60 shrink-0 flex flex-col h-screen sticky top-0 border-r border-white/5 bg-surface-800/40 backdrop-blur-xl">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow-sm">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">AgentOps</p>
            <p className="text-[10px] text-gray-500 leading-none mt-0.5">Monitoring Suite</p>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold px-3 mb-3">Navigation</p>
        {nav.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              clsx('sidebar-link relative', isActive && 'active')
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={clsx('icon', isActive ? 'text-brand-400' : 'text-gray-500')} />
                <span className="flex-1">{label}</span>
                {label === 'Notifications' && unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-brand-600 text-white text-[10px] font-bold leading-none">
                    {unreadCount}
                  </span>
                )}
                {isActive && (
                  <ChevronRight className="w-3 h-3 text-brand-400 opacity-60" />
                )}
              </>
            )}
          </NavLink>
        ))}

        <div className="pt-4">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold px-3 mb-3">Account</p>
          {secondary.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                clsx('sidebar-link', isActive && 'active')
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={clsx('icon', isActive ? 'text-brand-400' : 'text-gray-500')} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Status Footer */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="glass-card px-3 py-2.5 flex items-center gap-2.5">
          <div className="dot-online" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">System Healthy</p>
            <p className="text-[10px] text-gray-500 truncate">All services operational</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
