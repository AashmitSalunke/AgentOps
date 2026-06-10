import { useState, useEffect, useCallback } from 'react';
import { mockAgents, mockNotifications, mockAnalytics } from '../data/mockData';
import type { Agent, Notification } from '../types';

export function useRealTimeUpdates() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const tick = useCallback(() => {
    setAgents(prev => prev.map(agent => {
      if (agent.status === 'offline') return agent;
      const delta = (Math.random() - 0.5) * 4;
      const memDelta = (Math.random() - 0.5) * 3;
      return {
        ...agent,
        cpuUsage: Math.max(5, Math.min(99, agent.cpuUsage + delta)),
        memoryUsage: Math.max(10, Math.min(99, agent.memoryUsage + memDelta)),
        totalApiCalls: agent.totalApiCalls + Math.floor(Math.random() * 3),
        totalTokens: agent.totalTokens + Math.floor(Math.random() * 2000),
        lastActive: agent.status !== 'offline'
          ? new Date().toISOString()
          : agent.lastActive,
      };
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(tick, 2000);
    return () => clearInterval(interval);
  }, [tick]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return { agents, notifications, unreadCount, markNotificationRead, markAllRead, clearAll };
}

export function useDashboardStats(agents: Agent[]) {
  const totalActiveAgents = agents.filter(a => a.status !== 'offline').length;
  const runningTasks = agents.filter(a => a.currentTask?.status === 'running').length;
  const completedTasks = agents.reduce((s, a) => s + a.tasksCompleted, 0);
  const failedTasks = agents.reduce((s, a) => s + a.tasksFailed, 0);
  const totalApiCalls = agents.reduce((s, a) => s + a.totalApiCalls, 0);
  const totalTokens = agents.reduce((s, a) => s + a.totalTokens, 0);
  const avgResponseTime = parseFloat(
    (agents.filter(a => a.status !== 'offline').reduce((s, a) => s + a.avgResponseTime, 0) /
    Math.max(1, agents.filter(a => a.status !== 'offline').length)).toFixed(2)
  );
  return { totalActiveAgents, runningTasks, completedTasks, failedTasks, totalApiCalls, totalTokens, avgResponseTime };
}

export function useSparklineData(baseValue: number, points = 10) {
  const [data, setData] = useState(() =>
    Array.from({ length: points }, (_, i) => ({
      i,
      v: baseValue + (Math.random() - 0.5) * baseValue * 0.3,
    }))
  );

  useEffect(() => {
    const iv = setInterval(() => {
      setData(prev => [
        ...prev.slice(1),
        { i: prev[prev.length - 1].i + 1, v: baseValue + (Math.random() - 0.5) * baseValue * 0.3 },
      ]);
    }, 3000);
    return () => clearInterval(iv);
  }, [baseValue]);

  return data;
}

export { mockAnalytics };
