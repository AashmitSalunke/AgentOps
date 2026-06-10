import { useNavigate } from 'react-router-dom';
import {
  BarChart2, Bot, CheckCircle2, Clock, Globe,
  Mail, Shield, Activity, ArrowRight, Edit3,
} from 'lucide-react';
import { mockAgents } from '../data/mockData';

const user = {
  name: 'Aashmit Salunke',
  role: 'Platform Administrator',
  email: 'admin@agentops.io',
  location: 'Mumbai, India',
  joined: 'January 2025',
  avatar: 'A',
  plan: 'Enterprise',
};

export default function Profile() {
  const navigate = useNavigate();
  const totalTasks = mockAgents.reduce((s, a) => s + a.tasksCompleted, 0);
  const totalAgents = mockAgents.length;
  const avgSuccess = (mockAgents.reduce((s, a) => s + a.successRate, 0) / mockAgents.length).toFixed(1);

  const activity = [
    { action: 'Deployed NeuralCore GPT-4o agent', time: '2 hours ago', icon: Bot },
    { action: 'Updated alert thresholds for CPU usage', time: '5 hours ago', icon: Shield },
    { action: 'Exported analytics report (PDF)', time: 'Yesterday', icon: BarChart2 },
    { action: 'Added Slack notification integration', time: '2 days ago', icon: CheckCircle2 },
    { action: 'Reviewed CodexPilot task history', time: '3 days ago', icon: Activity },
  ];

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="glass-card p-6 animated-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-brand flex items-center justify-center text-3xl font-bold text-white shadow-glow-md">
              {user.avatar}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-surface-800" />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                <p className="text-gray-400 text-sm mt-0.5">{user.role}</p>
                <div className="flex flex-wrap gap-4 mt-3">
                  {[
                    { icon: Mail, label: user.email },
                    { icon: Globe, label: user.location },
                    { icon: Clock, label: `Joined ${user.joined}` },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Icon className="w-3.5 h-3.5 text-gray-600" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="badge bg-brand-500/15 text-brand-300 border border-brand-500/20 px-3 py-1">
                  {user.plan}
                </span>
                <button className="btn-ghost flex items-center gap-1.5 text-xs">
                  <Edit3 className="w-3 h-3" /> Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Agents Managed', value: totalAgents.toString(), icon: Bot, color: 'text-brand-400', bg: 'bg-brand-500/10' },
          { label: 'Tasks Processed', value: totalTasks.toLocaleString(), icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Avg Success Rate', value: `${avgSuccess}%`, icon: BarChart2, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Uptime SLA', value: '99.7%', icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass-card p-4">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${bg}`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <div className="glass-card p-5">
          <p className="section-title mb-4">Recent Activity</p>
          <div className="space-y-3">
            {activity.map(({ action, time, icon: Icon }) => (
              <div key={action} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-surface-700 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-white">{action}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="glass-card p-5">
          <p className="section-title mb-4">Quick Links</p>
          <div className="space-y-2">
            {[
              { label: 'View All Agents', path: '/agents', desc: '10 agents configured' },
              { label: 'Analytics Dashboard', path: '/analytics', desc: '30 days of data' },
              { label: 'Workflow Graph', path: '/workflow', desc: '8 nodes, 10 edges' },
              { label: 'Notification Settings', path: '/settings', desc: 'Configure alerts' },
            ].map(({ label, path, desc }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-white group-hover:text-brand-300 transition-colors">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-brand-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
