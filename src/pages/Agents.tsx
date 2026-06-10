import { useState, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Search, Filter, LayoutGrid, List, ArrowRight, Clock, CheckCircle2, XCircle, Zap } from 'lucide-react';
import type { Agent } from '../types';
import clsx from 'clsx';

type OutletCtx = { agents: Agent[] };

function formatTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

function AgentCard({ agent }: { agent: Agent }) {
  const navigate = useNavigate();
  return (
    <div
      className="glass-card-hover p-5 cursor-pointer animate-fade-in"
      onClick={() => navigate(`/agents/${agent.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-surface-700 flex items-center justify-center text-2xl shadow-inner">
            {agent.avatar}
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{agent.name}</p>
            <p className="text-xs text-gray-500">{agent.model}</p>
          </div>
        </div>
        <span className={`badge-${agent.status}`}>
          <span className={`dot-${agent.status}`} />
          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
        </span>
      </div>

      <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed">{agent.description}</p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Success', value: `${agent.successRate}%`, color: 'text-emerald-400' },
          { label: 'Tasks Done', value: agent.tasksCompleted.toLocaleString(), color: 'text-white' },
          { label: 'API Calls', value: agent.totalApiCalls >= 1000 ? `${(agent.totalApiCalls/1000).toFixed(1)}K` : agent.totalApiCalls.toString(), color: 'text-white' },
          { label: 'Resp Time', value: `${agent.avgResponseTime}s`, color: 'text-white' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-surface-700/40 rounded-xl p-2.5">
            <p className="text-[10px] text-gray-500 mb-0.5">{label}</p>
            <p className={clsx('text-sm font-semibold', color)}>{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {agent.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 text-[10px] font-medium border border-brand-500/10">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{formatTime(agent.lastActive)}</span>
        </div>
        <div className="flex items-center gap-1 text-brand-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Details <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
}

function AgentRow({ agent }: { agent: Agent }) {
  const navigate = useNavigate();
  return (
    <tr
      className="hover:bg-white/2 transition-colors cursor-pointer group border-b border-white/3"
      onClick={() => navigate(`/agents/${agent.id}`)}
    >
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">{agent.avatar}</span>
          <div>
            <p className="text-sm font-medium text-white group-hover:text-brand-300 transition-colors">{agent.name}</p>
            <p className="text-xs text-gray-500">{agent.model} · {agent.version}</p>
          </div>
        </div>
      </td>
      <td className="py-3.5 px-4">
        <span className={`badge-${agent.status}`}>
          <span className={`dot-${agent.status}`} />
          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
        </span>
      </td>
      <td className="py-3.5 px-4 text-xs text-gray-400">{formatTime(agent.lastActive)}</td>
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 bg-surface-600 rounded-full">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${agent.successRate}%` }} />
          </div>
          <span className="text-xs text-emerald-400 font-medium">{agent.successRate}%</span>
        </div>
      </td>
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="w-3 h-3" />{agent.tasksCompleted.toLocaleString()}</span>
          <span className="flex items-center gap-1 text-red-400"><XCircle className="w-3 h-3" />{agent.tasksFailed}</span>
        </div>
      </td>
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-1 text-xs text-amber-400">
          <Zap className="w-3 h-3" />{agent.totalApiCalls >= 1000 ? `${(agent.totalApiCalls/1000).toFixed(1)}K` : agent.totalApiCalls}
        </div>
      </td>
      <td className="py-3.5 px-4 text-xs text-gray-400">{agent.region}</td>
      <td className="py-3.5 px-4">
        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-brand-400 transition-colors" />
      </td>
    </tr>
  );
}

export default function Agents() {
  const { agents } = useOutletContext<OutletCtx>();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() =>
    agents.filter(a => {
      const matchQ = a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.model.toLowerCase().includes(query.toLowerCase()) ||
        a.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));
      const matchS = statusFilter === 'all' || a.status === statusFilter;
      return matchQ && matchS;
    }), [agents, query, statusFilter]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Toolbar */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            className="input-field pl-9"
            placeholder="Search agents by name, model, or tag..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-4 h-4 text-gray-500" />
          {['all', 'online', 'busy', 'offline'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
                statusFilter === s
                  ? 'bg-brand-600 text-white shadow-glow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              {s}
            </button>
          ))}
          <div className="w-px h-5 bg-white/10" />
          <button onClick={() => setView('grid')} className={clsx('p-1.5 rounded-lg transition-colors', view === 'grid' ? 'text-white bg-white/10' : 'text-gray-500 hover:text-white')}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button onClick={() => setView('list')} className={clsx('p-1.5 rounded-lg transition-colors', view === 'list' ? 'text-white bg-white/10' : 'text-gray-500 hover:text-white')}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Showing <span className="text-white font-medium">{filtered.length}</span> of {agents.length} agents
        </p>
        <div className="flex gap-4 text-xs text-gray-500">
          <span><span className="text-emerald-400 font-semibold">{agents.filter(a=>a.status==='online').length}</span> Online</span>
          <span><span className="text-amber-400 font-semibold">{agents.filter(a=>a.status==='busy').length}</span> Busy</span>
          <span><span className="text-gray-400 font-semibold">{agents.filter(a=>a.status==='offline').length}</span> Offline</span>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(a => <AgentCard key={a.id} agent={a} />)}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-700/30">
              <tr>
                {['Agent', 'Status', 'Last Active', 'Success Rate', 'Tasks', 'API Calls', 'Region', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => <AgentRow key={a.id} agent={a} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
