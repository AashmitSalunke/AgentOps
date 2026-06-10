import { useOutletContext } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  Bot, Activity, CheckCircle2, XCircle, Zap, Cpu, Clock, TrendingUp,
  TrendingDown, ArrowRight,
} from 'lucide-react';
import { useDashboardStats, useSparklineData } from '../hooks/useRealTimeUpdates';
import { mockAnalytics } from '../data/mockData';
import type { Agent, Notification } from '../types';
import clsx from 'clsx';

type OutletCtx = {
  agents: Agent[];
  notifications: Notification[];
  unreadCount: number;
};

function formatNumber(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function Sparkline({ color, value }: { color: string; value: number }) {
  const data = useSparklineData(value);
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2}
          fill={`url(#sg-${color})`} dot={false} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const statCards = [
  {
    key: 'totalActiveAgents', label: 'Active Agents', icon: Bot,
    color: '#6366f1', colorClass: 'text-brand-400', bgClass: 'bg-brand-500/10',
    suffix: '', trend: +2,
  },
  {
    key: 'runningTasks', label: 'Running Tasks', icon: Activity,
    color: '#06b6d4', colorClass: 'text-accent-cyan', bgClass: 'bg-cyan-500/10',
    suffix: '', trend: 0,
  },
  {
    key: 'completedTasks', label: 'Completed Tasks', icon: CheckCircle2,
    color: '#10b981', colorClass: 'text-accent-green', bgClass: 'bg-emerald-500/10',
    suffix: '', trend: +340,
  },
  {
    key: 'failedTasks', label: 'Failed Tasks', icon: XCircle,
    color: '#ef4444', colorClass: 'text-red-400', bgClass: 'bg-red-500/10',
    suffix: '', trend: -12,
  },
  {
    key: 'totalApiCalls', label: 'Total API Calls', icon: Zap,
    color: '#f59e0b', colorClass: 'text-amber-400', bgClass: 'bg-amber-500/10',
    suffix: '', trend: +1200,
  },
  {
    key: 'totalTokens', label: 'Token Usage', icon: Cpu,
    color: '#8b5cf6', colorClass: 'text-accent-purple', bgClass: 'bg-purple-500/10',
    suffix: '', trend: +850000,
  },
  {
    key: 'avgResponseTime', label: 'Avg Response', icon: Clock,
    color: '#ec4899', colorClass: 'text-accent-pink', bgClass: 'bg-pink-500/10',
    suffix: 's', trend: -0.1,
  },
];

export default function Dashboard() {
  const { agents } = useOutletContext<OutletCtx>();
  const stats = useDashboardStats(agents);
  const navigate = useNavigate();
  const recentData = mockAnalytics.slice(-14);

  return (
    <div className="space-y-6 animate-fade-in" id="dashboard-export">
      {/* Hero Banner */}
      <div className="glass-card p-6 animated-border overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-surface opacity-60 pointer-events-none" />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-brand-400 font-semibold uppercase tracking-widest mb-1">AgentOps Suite · v2.4.1</p>
              <h2 className="text-2xl font-bold text-white mb-1">
                Welcome back, <span className="gradient-text">Admin</span>
              </h2>
              <p className="text-gray-400 text-sm">System is operating normally. {stats.totalActiveAgents} agents active across {stats.runningTasks} running tasks.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="dot-online" />
              <span className="text-xs text-emerald-400 font-medium">All Systems Nominal</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards.map(({ key, label, icon: Icon, color, colorClass, bgClass, suffix, trend }) => {
          const val = stats[key as keyof typeof stats];
          const positive = trend >= 0;
          return (
            <div key={key} className="metric-card group hover:border-white/10 transition-all duration-300 cursor-default">
              <div className="absolute inset-0 bg-gradient-radial from-brand-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className={clsx('w-8 h-8 rounded-xl flex items-center justify-center', bgClass)}>
                    <Icon className={clsx('w-4 h-4', colorClass)} />
                  </div>
                  <div className={clsx('flex items-center gap-1 text-xs font-medium', positive ? 'text-emerald-400' : 'text-red-400')}>
                    {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {positive ? '+' : ''}{formatNumber(Math.abs(trend))}
                  </div>
                </div>
                <p className="text-2xl font-bold text-white mb-0.5">
                  {formatNumber(typeof val === 'number' ? val : 0)}{suffix}
                </p>
                <p className="text-xs text-gray-500">{label}</p>
                <div className="mt-3 -mx-2">
                  <Sparkline color={color} value={typeof val === 'number' ? val : 100} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Token Trend */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="section-title">Token Consumption</p>
              <p className="section-subtitle">Last 14 days · All agents</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={recentData}>
              <defs>
                <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: '#1a1a27', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, color: '#fff', fontSize: 12 }}
                formatter={(v: number) => [formatNumber(v), 'Tokens']}
              />
              <Area type="monotone" dataKey="tokens" stroke="#6366f1" strokeWidth={2}
                fill="url(#tokenGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Agent Status */}
        <div className="glass-card p-5">
          <p className="section-title mb-1">Agent Status</p>
          <p className="section-subtitle mb-4">Live status breakdown</p>
          {['online', 'busy', 'offline'].map(status => {
            const count = agents.filter(a => a.status === status).length;
            const pct = Math.round((count / agents.length) * 100);
            const colors: Record<string, string> = { online: '#10b981', busy: '#f59e0b', offline: '#6b7280' };
            const labels: Record<string, string> = { online: 'Online', busy: 'Busy', offline: 'Offline' };
            return (
              <div key={status} className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-300 font-medium">{labels[status]}</span>
                  <span className="text-gray-400">{count} agents · {pct}%</span>
                </div>
                <div className="h-1.5 bg-surface-600 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${pct}%`, backgroundColor: colors[status] }}
                  />
                </div>
              </div>
            );
          })}

          <div className="mt-5 pt-4 border-t border-white/5">
            <p className="text-xs text-gray-500 mb-3 font-medium">Top Performers</p>
            <div className="space-y-2">
              {agents
                .filter(a => a.status !== 'offline')
                .sort((a, b) => b.successRate - a.successRate)
                .slice(0, 3)
                .map(a => (
                  <button
                    key={a.id}
                    onClick={() => navigate(`/agents/${a.id}`)}
                    className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <span className="text-lg">{a.avatar}</span>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-xs font-medium text-white truncate">{a.name}</p>
                      <p className="text-[10px] text-gray-500">{a.successRate}% success</p>
                    </div>
                    <ArrowRight className="w-3 h-3 text-gray-600 group-hover:text-brand-400 transition-colors" />
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="section-title">Active Agents</p>
            <p className="section-subtitle">Currently running agents</p>
          </div>
          <button onClick={() => navigate('/agents')} className="btn-ghost flex items-center gap-1.5">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                {['Agent', 'Status', 'Tasks Done', 'Success Rate', 'Tokens', 'Resp Time', 'CPU'].map(h => (
                  <th key={h} className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider pr-4 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/3">
              {agents.filter(a => a.status !== 'offline').slice(0, 6).map(a => (
                <tr key={a.id} className="hover:bg-white/2 transition-colors cursor-pointer group" onClick={() => navigate(`/agents/${a.id}`)}>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{a.avatar}</span>
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-brand-300 transition-colors">{a.name}</p>
                        <p className="text-xs text-gray-500">{a.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`badge-${a.status}`}>
                      <span className={`dot-${a.status}`} />
                      {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-300">{a.tasksCompleted.toLocaleString()}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-surface-600 rounded-full">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${a.successRate}%` }} />
                      </div>
                      <span className="text-xs text-gray-400">{a.successRate}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-300">{formatNumber(a.totalTokens)}</td>
                  <td className="py-3 pr-4 text-sm text-gray-300">{a.avgResponseTime}s</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-surface-600 rounded-full">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${a.cpuUsage}%`, backgroundColor: a.cpuUsage > 80 ? '#ef4444' : a.cpuUsage > 60 ? '#f59e0b' : '#10b981' }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{Math.round(a.cpuUsage)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
