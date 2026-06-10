import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAgents } from '../data/mockData';
import { Search, X, Bot, BarChart2, GitBranch, Bell, Settings, User } from 'lucide-react';

const routes = [
  { label: 'Dashboard', path: '/', icon: BarChart2 },
  { label: 'Agent Management', path: '/agents', icon: Bot },
  { label: 'Workflow', path: '/workflow', icon: GitBranch },
  { label: 'Analytics', path: '/analytics', icon: BarChart2 },
  { label: 'Notifications', path: '/notifications', icon: Bell },
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'Profile', path: '/profile', icon: User },
];

interface SearchResult {
  id: string;
  label: string;
  subtitle: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results: SearchResult[] = query.length === 0 ? [] : [
    ...routes
      .filter(r => r.label.toLowerCase().includes(query.toLowerCase()))
      .map(r => ({ id: r.path, label: r.label, subtitle: 'Navigate', path: r.path, icon: r.icon })),
    ...mockAgents
      .filter(a => a.name.toLowerCase().includes(query.toLowerCase()) || a.model.toLowerCase().includes(query.toLowerCase()))
      .map(a => ({ id: a.id, label: a.name, subtitle: `Agent · ${a.model} · ${a.status}`, path: `/agents/${a.id}`, icon: Bot })),
  ];

  const go = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4" onClick={onClose}>
      <div
        className="glass-card w-full max-w-xl overflow-hidden animate-fade-in"
        style={{ border: '1px solid rgba(99,102,241,0.3)', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search agents, pages, tasks..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm outline-none"
          />
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg text-gray-500 hover:text-gray-300 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {results.length > 0 ? (
          <ul className="py-2 max-h-72 overflow-y-auto">
            {results.map(r => (
              <li key={r.id}>
                <button
                  onClick={() => go(r.path)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-brand-600/20 flex items-center justify-center shrink-0">
                    <r.icon className="w-3.5 h-3.5 text-brand-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{r.label}</p>
                    <p className="text-xs text-gray-500">{r.subtitle}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : query.length > 0 ? (
          <div className="py-8 text-center text-gray-500 text-sm">No results for "{query}"</div>
        ) : (
          <div className="py-6 px-4">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">Quick Navigation</p>
            <div className="grid grid-cols-2 gap-1.5">
              {routes.map(r => (
                <button key={r.path} onClick={() => go(r.path)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-left transition-colors">
                  <r.icon className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-sm text-gray-300">{r.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 py-2 border-t border-white/5 flex items-center gap-4">
          <span className="text-xs text-gray-600">↵ Select</span>
          <span className="text-xs text-gray-600">Esc Close</span>
        </div>
      </div>
    </div>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(v => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return { open, setOpen };
}
