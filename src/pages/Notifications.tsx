import { useOutletContext } from 'react-router-dom';
import { Bell, CheckCheck, Trash2, AlertTriangle, CheckCircle2, XCircle, Info } from 'lucide-react';
import type { Notification } from '../types';
import clsx from 'clsx';

type OutletCtx = {
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
};

function formatTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

const ICONS = {
  error: XCircle,
  warning: AlertTriangle,
  success: CheckCircle2,
  info: Info,
};

const STYLES = {
  error: {
    icon: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    dot: 'bg-red-400',
  },
  warning: {
    icon: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    dot: 'bg-amber-400',
  },
  success: {
    icon: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  info: {
    icon: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    dot: 'bg-blue-400',
  },
};

export default function Notifications() {
  const { notifications, markNotificationRead, markAllRead, clearAll } =
    useOutletContext<OutletCtx>();

  const unread = notifications.filter(n => !n.read).length;
  const groups = [
    { label: 'Unread', items: notifications.filter(n => !n.read) },
    { label: 'Earlier', items: notifications.filter(n => n.read) },
  ].filter(g => g.items.length > 0);

  return (
    <div className="space-y-5 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="glass-card p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <p className="font-semibold text-white">Notification Center</p>
            <p className="text-xs text-gray-400">
              {unread > 0 ? `${unread} unread alert${unread > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button onClick={markAllRead} className="btn-ghost flex items-center gap-2">
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
          <button onClick={clearAll} className="btn-danger flex items-center gap-2">
            <Trash2 className="w-3.5 h-3.5" /> Clear all
          </button>
        </div>
      </div>

      {notifications.length === 0 && (
        <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
          <Bell className="w-12 h-12 text-gray-700 mb-4" />
          <p className="text-gray-400 font-medium">No notifications</p>
          <p className="text-gray-600 text-sm mt-1">You're all caught up! Alerts will appear here.</p>
        </div>
      )}

      {groups.map(group => (
        <div key={group.label}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            {group.label}
          </p>
          <div className="space-y-2">
            {group.items.map(notification => {
              const s = STYLES[notification.severity];
              const Icon = ICONS[notification.severity];
              return (
                <div
                  key={notification.id}
                  className={clsx(
                    'glass-card p-4 cursor-pointer transition-all duration-200 hover:border-white/10',
                    !notification.read && 'border-l-2',
                    !notification.read && s.border
                  )}
                  onClick={() => markNotificationRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={clsx('w-8 h-8 rounded-xl flex items-center justify-center shrink-0', s.bg)}>
                      <Icon className={clsx('w-4 h-4', s.icon)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={clsx('text-sm font-semibold', notification.read ? 'text-gray-300' : 'text-white')}>
                          {notification.title}
                        </p>
                        <div className="flex items-center gap-2 shrink-0">
                          {!notification.read && (
                            <div className={clsx('w-2 h-2 rounded-full', s.dot)} />
                          )}
                          <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{notification.message}</p>
                      {notification.agentName && (
                        <p className="text-[10px] text-gray-600 mt-1.5">
                          Agent: <span className="text-gray-500">{notification.agentName}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
