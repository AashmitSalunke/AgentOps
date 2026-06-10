import { useState } from 'react';
import {
  Bell, Shield, Key, Moon, Monitor, Sliders,
  Save, RotateCcw, ChevronRight, Eye, EyeOff,
} from 'lucide-react';
import clsx from 'clsx';

type SettingSection = 'notifications' | 'appearance' | 'api' | 'thresholds';

export default function Settings() {
  const [section, setSection] = useState<SettingSection>('notifications');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const [notifSettings, setNotifSettings] = useState({
    agentFailure: true,
    highTokenUsage: true,
    taskCompletion: false,
    systemUpdates: true,
    emailAlerts: false,
    slackAlerts: false,
  });

  const [thresholds, setThresholds] = useState({
    cpuWarning: 80,
    memoryWarning: 85,
    tokenBudget: 60000,
    responseTimeAlert: 5,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections: { id: SettingSection; label: string; icon: React.ComponentType<{className?: string}> }[] = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Monitor },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'thresholds', label: 'Alert Thresholds', icon: Sliders },
  ];

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl mx-auto">
      <div className="glass-card p-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-brand-400" />
        </div>
        <div>
          <p className="font-semibold text-white">Settings</p>
          <p className="text-xs text-gray-400">Configure your AgentOps dashboard preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sidebar */}
        <div className="glass-card p-3 space-y-1">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                section === id
                  ? 'bg-brand-600/20 text-white border border-brand-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
              {section === id && <ChevronRight className="w-3.5 h-3.5 ml-auto text-brand-400" />}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-4">
          {section === 'notifications' && (
            <div className="glass-card p-5">
              <p className="section-title mb-1">Notification Preferences</p>
              <p className="section-subtitle mb-5">Choose which events trigger notifications</p>
              <div className="space-y-4">
                {Object.entries(notifSettings).map(([key, val]) => {
                  const labels: Record<string, { label: string; desc: string }> = {
                    agentFailure: { label: 'Agent Failure Alerts', desc: 'Get notified when an agent goes offline or errors out' },
                    highTokenUsage: { label: 'High Token Usage Warnings', desc: 'Alert when token usage exceeds 80% of daily budget' },
                    taskCompletion: { label: 'Task Completion Notifications', desc: 'Notify on every successful task completion' },
                    systemUpdates: { label: 'System Update Notices', desc: 'Dashboard updates and feature announcements' },
                    emailAlerts: { label: 'Email Alerts', desc: 'Send critical alerts to your registered email address' },
                    slackAlerts: { label: 'Slack Integration', desc: 'Post notifications to your configured Slack channel' },
                  };
                  const { label, desc } = labels[key] ?? { label: key, desc: '' };
                  return (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-white">{label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifSettings(s => ({ ...s, [key]: !val }))}
                        className={clsx(
                          'relative w-10 h-5.5 rounded-full transition-colors duration-200 shrink-0',
                          val ? 'bg-brand-600' : 'bg-surface-500'
                        )}
                        style={{ height: 22, width: 40 }}
                      >
                        <span
                          className={clsx(
                            'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
                            val ? 'translate-x-5' : 'translate-x-0.5'
                          )}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {section === 'appearance' && (
            <div className="glass-card p-5">
              <p className="section-title mb-1">Appearance</p>
              <p className="section-subtitle mb-5">Customize how the dashboard looks</p>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-white mb-3">Theme</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'dark', label: 'Dark', desc: 'Default' },
                      { id: 'darker', label: 'OLED', desc: 'Pure black' },
                      { id: 'dim', label: 'Dim', desc: 'Softer dark' },
                    ].map(t => (
                      <div
                        key={t.id}
                        className={clsx(
                          'p-3 rounded-xl border cursor-pointer transition-all',
                          t.id === 'dark' ? 'border-brand-500/40 bg-brand-500/10' : 'border-white/5 hover:border-white/10'
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Moon className="w-3.5 h-3.5 text-gray-400" />
                          <p className="text-sm font-medium text-white">{t.label}</p>
                        </div>
                        <p className="text-xs text-gray-500">{t.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-sm font-medium text-white mb-3">Accent Color</p>
                  <div className="flex gap-2">
                    {['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'].map(c => (
                      <button
                        key={c}
                        className={clsx('w-7 h-7 rounded-full transition-all hover:scale-110', c === '#6366f1' && 'ring-2 ring-offset-2 ring-offset-surface-800 ring-white/30')}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {section === 'api' && (
            <div className="glass-card p-5">
              <p className="section-title mb-1">API Configuration</p>
              <p className="section-subtitle mb-5">Manage API keys and endpoints</p>
              <div className="space-y-4">
                {[
                  { label: 'OpenAI API Key', placeholder: 'sk-...', value: 'sk-proj-abc123xyz456def789ghi012' },
                  { label: 'Anthropic API Key', placeholder: 'sk-ant-...', value: 'sk-ant-api03-secretkey789' },
                  { label: 'Google AI API Key', placeholder: 'AIza...', value: 'AIzaSyBsomething123secret' },
                ].map(({ label, placeholder, value }) => (
                  <div key={label}>
                    <label className="block text-xs font-medium text-gray-400 mb-2">{label}</label>
                    <div className="relative">
                      <input
                        type={showKey ? 'text' : 'password'}
                        defaultValue={value}
                        placeholder={placeholder}
                        className="input-field pr-10"
                      />
                      <button
                        onClick={() => setShowKey(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'thresholds' && (
            <div className="glass-card p-5">
              <p className="section-title mb-1">Alert Thresholds</p>
              <p className="section-subtitle mb-5">Set limits that trigger alerts</p>
              <div className="space-y-5">
                {[
                  { key: 'cpuWarning', label: 'CPU Warning Threshold', min: 50, max: 100, unit: '%' },
                  { key: 'memoryWarning', label: 'Memory Warning Threshold', min: 50, max: 100, unit: '%' },
                  { key: 'responseTimeAlert', label: 'Response Time Alert', min: 1, max: 30, unit: 's' },
                ].map(({ key, label, min, max, unit }) => (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-white">{label}</label>
                      <span className="text-sm text-brand-400 font-semibold">
                        {thresholds[key as keyof typeof thresholds]}{unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      value={thresholds[key as keyof typeof thresholds]}
                      onChange={e => setThresholds(t => ({ ...t, [key]: parseInt(e.target.value) }))}
                      className="w-full accent-brand-500"
                    />
                    <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                      <span>{min}{unit}</span>
                      <span>{max}{unit}</span>
                    </div>
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Daily Token Budget</label>
                  <input
                    type="number"
                    value={thresholds.tokenBudget}
                    onChange={e => setThresholds(t => ({ ...t, tokenBudget: parseInt(e.target.value) }))}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <button className="btn-ghost flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button onClick={handleSave} className={clsx('btn-primary flex items-center gap-2', saved && 'bg-emerald-600 hover:bg-emerald-500')}>
              <Save className="w-3.5 h-3.5" />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
