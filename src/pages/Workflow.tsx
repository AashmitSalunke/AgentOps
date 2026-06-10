import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { workflowNodes, workflowEdges } from '../data/mockData';
import type { Agent } from '../types';
import clsx from 'clsx';

type OutletCtx = { agents: Agent[] };

const STATUS_COLORS: Record<string, string> = {
  online: '#10b981',
  busy: '#f59e0b',
  offline: '#6b7280',
};

const STATUS_GLOW: Record<string, string> = {
  online: 'drop-shadow(0 0 8px rgba(16,185,129,0.8))',
  busy: 'drop-shadow(0 0 8px rgba(245,158,11,0.8))',
  offline: 'none',
};

export default function Workflow() {
  const { agents } = useOutletContext<OutletCtx>();
  const [tick, setTick] = useState(0);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [activeEdge, setActiveEdge] = useState<string | null>(null);

  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 100);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    // Randomly highlight edges
    const iv = setInterval(() => {
      const animEdges = workflowEdges.filter(e => e.animated);
      setActiveEdge(animEdges[Math.floor(Math.random() * animEdges.length)].id);
    }, 1500);
    return () => clearInterval(iv);
  }, []);

  const getAgent = (agentId: string) => agents.find(a => a.id === agentId);

  const getNodePos = (nodeId: string) => {
    const n = workflowNodes.find(n => n.id === nodeId);
    return n ? { x: n.x, y: n.y } : { x: 0, y: 0 };
  };

  const selectedAgent = selectedNode
    ? getAgent(workflowNodes.find(n => n.id === selectedNode)?.agentId ?? '')
    : null;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Graph */}
        <div className="lg:col-span-3 glass-card p-4 overflow-hidden" style={{ minHeight: 580 }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="section-title">Agent Communication Graph</p>
              <p className="section-subtitle">Real-time task flow visualization</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              {[{ color: '#10b981', label: 'Online' }, { color: '#f59e0b', label: 'Busy' }, { color: '#6b7280', label: 'Offline' }].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <svg
            width="100%"
            viewBox="0 0 800 580"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="rgba(99,102,241,0.6)" />
              </marker>
              <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#6366f1" />
              </marker>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Edges */}
            {workflowEdges.map(edge => {
              const src = getNodePos(edge.source);
              const tgt = getNodePos(edge.target);
              const isActive = activeEdge === edge.id;
              const mx = (src.x + tgt.x) / 2;
              const my = (src.y + tgt.y) / 2 - 20;
              return (
                <g key={edge.id}>
                  <path
                    d={`M ${src.x} ${src.y + 30} Q ${mx} ${my} ${tgt.x} ${tgt.y - 30}`}
                    fill="none"
                    stroke={isActive ? '#6366f1' : 'rgba(99,102,241,0.2)'}
                    strokeWidth={isActive ? 2 : 1}
                    strokeDasharray={edge.animated ? '8 4' : 'none'}
                    markerEnd={isActive ? 'url(#arrow-active)' : 'url(#arrow)'}
                    style={edge.animated ? { animation: 'flowDash 2s linear infinite' } : {}}
                    filter={isActive ? 'url(#glow)' : 'none'}
                  />
                  {isActive && (
                    <text x={mx} y={my - 5} textAnchor="middle" fill="rgba(99,102,241,0.8)" fontSize={9}>
                      {edge.dataFlow.toLocaleString()} tok/s
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {workflowNodes.map(node => {
              const agent = getAgent(node.agentId);
              const color = STATUS_COLORS[agent?.status ?? 'offline'];
              const isSelected = selectedNode === node.id;
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNode(isSelected ? null : node.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer glow ring */}
                  <circle
                    r={isSelected ? 40 : 34}
                    fill="none"
                    stroke={color}
                    strokeWidth={isSelected ? 2 : 1}
                    opacity={0.3 + (agent?.status !== 'offline' ? 0.2 : 0)}
                    style={{ filter: `drop-shadow(0 0 ${isSelected ? 12 : 6}px ${color})` }}
                  />
                  {/* Node body */}
                  <circle
                    r={28}
                    fill={isSelected ? 'rgba(99,102,241,0.3)' : 'rgba(26,26,39,0.9)'}
                    stroke={color}
                    strokeWidth={2}
                    style={{ filter: agent?.status !== 'offline' ? STATUS_GLOW[agent?.status ?? 'offline'] : 'none' }}
                  />
                  {/* Avatar */}
                  <text textAnchor="middle" dominantBaseline="central" fontSize={18} y={-2}>
                    {agent?.avatar ?? '🤖'}
                  </text>
                  {/* Label */}
                  <text y={42} textAnchor="middle" fill="#e5e7eb" fontSize={11} fontFamily="Inter" fontWeight={600}>
                    {node.label}
                  </text>
                  <text y={56} textAnchor="middle" fill="#6b7280" fontSize={9} fontFamily="Inter">
                    {agent?.model ?? 'Unknown'}
                  </text>
                  {/* Status dot */}
                  <circle cx={20} cy={-20} r={5} fill={color}
                    style={{ filter: agent?.status !== 'offline' ? `drop-shadow(0 0 4px ${color})` : 'none' }} />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          <div className="glass-card p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Flow Stats</p>
            <div className="space-y-3">
              {[
                { label: 'Active Flows', value: workflowEdges.filter(e => e.animated).length.toString() },
                { label: 'Total Nodes', value: workflowNodes.length.toString() },
                { label: 'Connections', value: workflowEdges.length.toString() },
                { label: 'Avg Throughput', value: `${Math.round(workflowEdges.reduce((s,e)=>s+e.dataFlow,0)/workflowEdges.length).toLocaleString()} tok/s` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-sm font-semibold text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {selectedAgent ? (
            <div className="glass-card p-4 border border-brand-500/20">
              <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-3">Selected Agent</p>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{selectedAgent.avatar}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{selectedAgent.name}</p>
                  <p className="text-xs text-gray-500">{selectedAgent.model}</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Status', value: selectedAgent.status },
                  { label: 'CPU', value: `${Math.round(selectedAgent.cpuUsage)}%` },
                  { label: 'Memory', value: `${Math.round(selectedAgent.memoryUsage)}%` },
                  { label: 'Success', value: `${selectedAgent.successRate}%` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-xs font-medium text-white capitalize">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card p-4">
              <p className="text-xs text-gray-500 text-center py-4">Click a node to inspect agent details</p>
            </div>
          )}

          <div className="glass-card p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Agents</p>
            <div className="space-y-2">
              {workflowNodes.map(node => {
                const agent = getAgent(node.agentId);
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                    className={clsx(
                      'w-full flex items-center gap-2.5 p-2 rounded-lg transition-colors text-left',
                      selectedNode === node.id ? 'bg-brand-600/20 border border-brand-500/20' : 'hover:bg-white/5'
                    )}
                  >
                    <span>{agent?.avatar ?? '🤖'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{node.label}</p>
                      <p className="text-[10px] text-gray-500 capitalize">{agent?.status ?? 'unknown'}</p>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[agent?.status ?? 'offline'] }} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
