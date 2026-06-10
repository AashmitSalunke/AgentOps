import { useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { AnalyticsData } from '../types';

export function useExport() {
  const exportPDF = useCallback(async (elementId: string, filename = 'dashboard-report') => {
    const el = document.getElementById(elementId);
    if (!el) return;
    try {
      const canvas = await html2canvas(el, {
        backgroundColor: '#0a0a0f',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width / 2, canvas.height / 2] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`${filename}-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      console.error('PDF export failed:', e);
    }
  }, []);

  const exportCSV = useCallback((data: AnalyticsData[], filename = 'analytics') => {
    const headers = ['Date', 'Tokens', 'API Calls', 'Completed', 'Failed', 'Avg Response (s)', 'Cost ($)'];
    const rows = data.map(d => [d.date, d.tokens, d.apiCalls, d.tasksCompleted, d.tasksFailed, d.avgResponseTime, d.cost]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return { exportPDF, exportCSV };
}
