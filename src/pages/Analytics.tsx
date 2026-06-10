import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
} from 'recharts';
import { Download, FileText, TrendingUp } from 'lucide-react';
import { mockAnalytics, mockAgents } from '../data/mockData';
import { useExport } from '../hooks/useExport';
import clsx from 'clsx';
import type { TimeRange } from '../types';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

export default function Analytics() {
  const [range, setRange] = useState<TimeRange>('weekly');
  const { exportCSV, exportPDF } = useExport();

  const sliced = range === 'daily' ? mockAnalytics.slice(-7)
    : range === 'weekly' ? mockAnalytics.slice(-14)
    : mockAnalytics;

  const totalTokens = sliced.reduce((s, d) => s + d.tokens, 0);
  const totalCalls = sliced.reduce((s, d) => s + d.apiCalls, 0);
  const totalCompleted = sliced.reduce((s, d) => s + d.tasksCompleted, 0);
  const totalFailed = sliced.reduce((s, d) => s + d.tasksFailed, 0);
  const totalCost = sliced.reduce((s, d) => s + d.cost, 0);

  const pieData = [
    { name: 'Completed', value: totalCompleted },
    { name: 'Failed', value: totalFailed },
  ];

  const rankedAgents = [...mockAgents]
    .sort((a, b) => b.successRate - a.successRate);

  return (
    <div className="space-y-5 animate-fade-in" id="analytics-export">
      {/* Controls */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {(['daily', 'weekly', 'monthly'] as TimeRange[]).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={clsx(
                'px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all',
                range === r ? 'bg-brand-600 text-white shadow-glow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportCSV(sliced, 'analytics')}
            className="btn-ghost flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <button
            onClick={() => exportPDF('analytics-export', 'analytics-report')}
            className="btn-primary flex items-center gap-2"
          >
            <FileText className="w-3.5 h-3.5" /> PDF Report
          </button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Tokens', value: `${(totalTokens/1000000).toFixed(1)}M`, color: 'text-brand-400' },
          { label: 'API Calls', value: `${(totalCalls/1000).toFixed(1)}K`, color: 'text-cyan-400' },
          { label: 'Completed', value: totalCompleted.toLocaleString(), color: 'text-emerald-400' },
          { label: 'Failed', value: totalFailed.toString(), color: 'text-red-400' },
          { label: 'Est. Cost', value: `$${totalCost.toFixed(0)}`, color: 'text-amber-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card p-4 text-center">
            <p className={clsx('text-2xl font-bold', color)}>{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Token Consumption Area Chart */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="section-title">Token Consumption</p>
            <p className="section-subtitle">Daily token usage across all agents</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" /> +12.4% vs prior period
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={sliced}>
            <defs>
              <linearGradient id="tokenArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
            <Tooltip
              contentStyle={{ background: '#1a1a27', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, fontSize: 12 }}
              formatter={(v: number) => [`${(v/1000).toFixed(0)}K`, 'Tokens']}
            />
            <Area type="monotone" dataKey="tokens" stroke="#6366f1" strokeWidth={2} fill="url(#tokenArea)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* API + Success/Fail Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* API Usage Bar */}
        <div className="lg:col-span-2 glass-card p-5">
          <p className="section-title mb-1">API Usage</p>
          <p className="section-subtitle mb-4">Daily API call volume</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sliced}>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1a1a27', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, fontSize: 12 }}
                formatter={(v: number) => [v.toLocaleString(), 'API Calls']}
              />
              <Bar dataKey="apiCalls" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut */}
        <div className="glass-card p-5">
          <p className="section-title mb-1">Task Outcomes</p>
          <p className="section-subtitle mb-4">Success vs Failure</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                paddingAngle={4} dataKey="value">
                <Cell fill="#10b981" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1a1a27', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: i === 0 ? '#10b981' : '#ef4444' }} />
                <span className="text-gray-400">{d.name}: <span className="text-white font-medium">{d.value.toLocaleString()}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Efficiency Rankings */}
      <div className="glass-card p-5">
        <p className="section-title mb-1">Agent Efficiency Rankings</p>
        <p className="section-subtitle mb-4">Ranked by success rate across all tasks</p>
        <div className="space-y-3">
          {rankedAgents.map((agent, idx) => (
            <div key={agent.id} className="flex items-center gap-4">
              <div className={clsx(
                'w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0',
                idx === 0 ? 'bg-amber-500/20 text-amber-400' :
                idx === 1 ? 'bg-gray-400/20 text-gray-300' :
                idx === 2 ? 'bg-orange-600/20 text-orange-400' : 'bg-surface-600 text-gray-500'
              )}>
                {idx + 1}
              </div>
              <span className="text-xl shrink-0">{agent.avatar}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-white truncate">{agent.name}</p>
                  <span className="text-sm font-bold text-white ml-4">{agent.successRate}%</span>
                </div>
                <div className="h-1.5 bg-surface-600 rounded-full">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${agent.successRate}%`,
                      backgroundColor: agent.successRate >= 98 ? '#10b981' :
                        agent.successRate >= 94 ? '#6366f1' : '#f59e0b'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
