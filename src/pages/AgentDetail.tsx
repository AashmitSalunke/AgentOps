import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';
import {
  ArrowLeft, Activity, CheckCircle2, XCircle, Clock, Cpu, HardDrive,
  Zap, Globe, Tag, ChevronRight, Terminal,
} from 'lucide-react';
import { mockLogs, mockTasks } from '../data/mockData';
import type { Agent } from '../types';
import clsx from 'clsx';

type OutletCtx = { agents: Agent[] };

function formatTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  if (m < 1440) return `${Math.floor(m / 60)}h ago`;
  return `${Math.floor(m / 1440)}d ago`;
}

const LOG_COLORS: Record<string, string> = {
  info: 'text-blue-400',
  debug: 'text-gray-500',
  warn: 'text-amber-400',
  error: 'text-red-400',
  success: 'text-emerald-400',
};

const LOG_BG: Record<string, string> = {
  info: 'bg-blue-500/10',
  debug: 'bg-gray-500/10',
  warn: 'bg-amber-500/10',
  error: 'bg-red-500/10',
  success: 'bg-emerald-500/10',
};

export default function AgentDetail() {
  const { id } = useParams<{ id: string }>();
  const { agents } = useOutletContext<OutletCtx>();
  const navigate = useNavigate();

  const agent = agents.find(a => a.id === id);
  if (!agent) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Agent not found.</p>
      </div>
    );
  }

  const agentLogs = mockLogs.filter(l => l.agentId === agent.id).slice(0, 30);
  const agentTasks = mockTasks.filter(t => t.agentId === agent.id).slice(0, 12);

  // Fake response-time chart
  const responseData = Array.from({ length: 20 }, (_, i) => ({
    t: i,
    ms: parseFloat((agent.avgResponseTime + (Math.random() - 0.5) * agent.avgResponseTime * 0.6).toFixed(2)),
  }));

  const cpuData = Array.from({ length: 20 }, (_, i) => ({
    t: i,
    cpu: Math.max(5, Math.min(99, agent.cpuUsage + (Math.random() - 0.5) * 20)),
    mem: Math.max(10, Math.min(99, agent.memoryUsage + (Math.random() - 0.5) * 15)),
  }));

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/agents')} className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-gray-600">/</span>
        <span className="text-gray-400 text-sm">Agents</span>
        <ChevronRight className="w-3 h-3 text-gray-600" />
        <span className="text-white text-sm font-medium">{agent.name}</span>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-6 animated-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-surface-700 flex items-center justify-center text-4xl shadow-inner shrink-0">
            {agent.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{agent.name}</h2>
                <p className="text-gray-400 text-sm mt-0.5">{agent.description}</p>
              </div>
              <span className={`badge-${agent.status} text-sm px-3 py-1`}>
                <span className={`dot-${agent.status}`} />
                {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {[
                { icon: Globe, label: agent.region },
                { icon: Tag, label: agent.version },
                { icon: Clock, label: `Last active ${formatTime(agent.lastActive)}` },
                { icon: Activity, label: `${agent.uptime}% uptime` },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Icon className="w-3.5 h-3.5 text-gray-600" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tasks Completed', value: agent.tasksCompleted.toLocaleString(), icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Tasks Failed', value: agent.tasksFailed.toString(), icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Total API Calls', value: agent.totalApiCalls >= 1000 ? `${(agent.totalApiCalls/1000).toFixed(1)}K` : agent.totalApiCalls.toString(), icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Avg Response', value: `${agent.avgResponseTime}s`, icon: Clock, color: 'text-brand-400', bg: 'bg-brand-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass-card p-4">
            <div className={clsx('w-8 h-8 rounded-xl flex items-center justify-center mb-3', bg)}>
              <Icon className={clsx('w-4 h-4', color)} />
            </div>
            <p className="text-xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Current Task */}
      {agent.currentTask && (
        <div className="glass-card p-5 border-l-2 border-brand-500">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Currently Running</p>
          </div>
          <p className="font-semibold text-white mb-1">{agent.currentTask.title}</p>
          <p className="text-sm text-gray-400 mb-4">{agent.currentTask.description}</p>
          <div className="flex flex-wrap gap-4 text-xs">
            <span className="text-gray-400">Started: <span className="text-white">{formatTime(agent.currentTask.startTime)}</span></span>
            <span className="text-gray-400">Tokens: <span className="text-white">{agent.currentTask.tokensUsed.toLocaleString()}</span></span>
            <span className="text-gray-400">API Calls: <span className="text-white">{agent.currentTask.apiCalls}</span></span>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Response Time */}
        <div className="glass-card p-5">
          <p className="section-title mb-0.5">Response Time</p>
          <p className="section-subtitle mb-4">Last 20 requests (seconds)</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={responseData}>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="t" hide />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1a1a27', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, fontSize: 12 }}
                formatter={(v: number) => [`${v}s`, 'Response Time']}
              />
              <Line type="monotone" dataKey="ms" stroke="#6366f1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Resource Usage */}
        <div className="glass-card p-5">
          <p className="section-title mb-0.5">Resource Usage</p>
          <p className="section-subtitle mb-4">CPU & Memory over time</p>
          <div className="flex gap-4 mb-3">
            <div className="flex-1 bg-surface-700/40 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-3.5 h-3.5 text-brand-400" />
                <span className="text-xs text-gray-400">CPU</span>
              </div>
              <p className="text-2xl font-bold text-white">{Math.round(agent.cpuUsage)}%</p>
              <div className="mt-2 h-1.5 bg-surface-600 rounded-full">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${agent.cpuUsage}%`, backgroundColor: agent.cpuUsage > 80 ? '#ef4444' : agent.cpuUsage > 60 ? '#f59e0b' : '#10b981' }}
                />
              </div>
            </div>
            <div className="flex-1 bg-surface-700/40 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-3.5 h-3.5 text-accent-purple" />
                <span className="text-xs text-gray-400">Memory</span>
              </div>
              <p className="text-2xl font-bold text-white">{Math.round(agent.memoryUsage)}%</p>
              <div className="mt-2 h-1.5 bg-surface-600 rounded-full">
                <div
                  className="h-full rounded-full bg-purple-500 transition-all"
                  style={{ width: `${agent.memoryUsage}%` }}
                />
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={cpuData}>
              <defs>
                <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="cpu" stroke="#6366f1" strokeWidth={1.5} fill="url(#cpuGrad)" dot={false} />
              <Area type="monotone" dataKey="mem" stroke="#8b5cf6" strokeWidth={1.5} fill="none" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Task History + Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Task History */}
        <div className="glass-card p-5">
          <p className="section-title mb-4">Task History</p>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {agentTasks.map(task => (
              <div key={task.id} className="flex items-start gap-3 p-3 bg-surface-700/30 rounded-xl">
                <div className={clsx('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', {
                  'bg-emerald-400': task.status === 'completed',
                  'bg-red-400': task.status === 'failed',
                  'bg-brand-400 animate-pulse': task.status === 'running',
                  'bg-gray-500': task.status === 'queued',
                })} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{task.title}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-[10px] text-gray-500">{formatTime(task.startTime)}</span>
                    {task.duration && <span className="text-[10px] text-gray-500">{task.duration}s</span>}
                    <span className="text-[10px] text-gray-500">{task.tokensUsed.toLocaleString()} tokens</span>
                  </div>
                </div>
                <span className={clsx('text-[10px] font-medium capitalize px-1.5 py-0.5 rounded-full', {
                  'text-emerald-400 bg-emerald-500/10': task.status === 'completed',
                  'text-red-400 bg-red-500/10': task.status === 'failed',
                  'text-brand-400 bg-brand-500/10': task.status === 'running',
                  'text-gray-400 bg-gray-500/10': task.status === 'queued',
                })}>{task.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Execution Logs */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-4 h-4 text-gray-500" />
            <p className="section-title">Execution Logs</p>
          </div>
          <div className="space-y-1.5 max-h-80 overflow-y-auto font-mono text-xs">
            {agentLogs.map(log => (
              <div key={log.id} className={clsx('flex gap-2.5 p-2 rounded-lg', LOG_BG[log.level])}>
                <span className="text-gray-600 shrink-0 tabular-nums">
                  {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className={clsx('uppercase font-bold shrink-0 w-12', LOG_COLORS[log.level])}>{log.level}</span>
                <span className="text-gray-300 break-all">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
