import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { CommandPalette, useCommandPalette } from '../CommandPalette';
import { useRealTimeUpdates } from '../../hooks/useRealTimeUpdates';

export default function Layout() {
  const { agents, notifications, unreadCount, markNotificationRead, markAllRead, clearAll } = useRealTimeUpdates();
  const { open, setOpen } = useCommandPalette();

  return (
    <div className="flex h-screen overflow-hidden dark">
      <Sidebar unreadCount={unreadCount} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header unreadCount={unreadCount} onSearchClick={() => setOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet context={{ agents, notifications, unreadCount, markNotificationRead, markAllRead, clearAll }} />
        </main>
      </div>
      {open && <CommandPalette onClose={() => setOpen(false)} />}
    </div>
  );
}
