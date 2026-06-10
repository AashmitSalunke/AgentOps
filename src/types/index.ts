// ===== Core Types =====

export type AgentStatus = 'online' | 'offline' | 'busy';
export type TaskStatus = 'running' | 'completed' | 'failed' | 'queued';
export type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success';
export type NotificationSeverity = 'info' | 'warning' | 'error' | 'success';
export type TimeRange = 'daily' | 'weekly' | 'monthly';

export interface Agent {
  id: string;
  name: string;
  model: string;
  status: AgentStatus;
  avatar: string;
  description: string;
  lastActive: string;
  successRate: number;
  tasksCompleted: number;
  tasksFailed: number;
  totalApiCalls: number;
  totalTokens: number;
  avgResponseTime: number;
  currentTask?: Task;
  tags: string[];
  version: string;
  region: string;
  cpuUsage: number;
  memoryUsage: number;
  uptime: number;
}

export interface Task {
  id: string;
  agentId: string;
  title: string;
  description: string;
  status: TaskStatus;
  startTime: string;
  endTime?: string;
  duration?: number;
  tokensUsed: number;
  apiCalls: number;
  errorMessage?: string;
}

export interface LogEntry {
  id: string;
  agentId: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface Notification {
  id: string;
  agentId?: string;
  agentName?: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  timestamp: string;
  read: boolean;
  type: 'failure' | 'warning' | 'completion' | 'info';
}

export interface MetricPoint {
  timestamp: string;
  value: number;
}

export interface AnalyticsData {
  date: string;
  tokens: number;
  apiCalls: number;
  tasksCompleted: number;
  tasksFailed: number;
  avgResponseTime: number;
  cost: number;
}

export interface WorkflowNode {
  id: string;
  agentId: string;
  x: number;
  y: number;
  label: string;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  animated: boolean;
  dataFlow: number;
}

export interface DashboardStats {
  totalActiveAgents: number;
  runningTasks: number;
  completedTasks: number;
  failedTasks: number;
  totalApiCalls: number;
  totalTokens: number;
  avgResponseTime: number;
}
