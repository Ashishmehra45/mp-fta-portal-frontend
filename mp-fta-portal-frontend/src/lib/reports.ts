import { jsPDF } from 'jspdf';
import { branding, prototypeNotice } from '@/config/branding';

export interface ReportSection {
  heading: string;
  lines: string[];
}

/** Simple text PDF report with portal header and disclaimer footer. */
export function downloadPdfReport(filename: string, title: string, subtitle: string, sections: ReportSection[], disclaimer: string) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 48;
  let y = M;

  const header = () => {
    doc.setFillColor(17, 45, 92);
    doc.rect(0, 0, W, 6, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(branding.portalName, M, 24);
  };
  const ensure = (h: number) => {
    if (y + h > H - 60) { doc.addPage(); header(); y = M; }
  };

  header();
  doc.setTextColor(20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(title, M, (y += 20));
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text(subtitle, M, (y += 18));
  y += 14;

  sections.forEach((s) => {
    ensure(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(17, 45, 92);
    doc.text(s.heading, M, (y += 18));
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30);
    s.lines.forEach((l) => {
      const wrapped = doc.splitTextToSize(l, W - M * 2 - 10);
      ensure(wrapped.length * 13 + 4);
      doc.text(wrapped, M + 8, (y += 14));
      y += (wrapped.length - 1) * 13;
    });
    y += 6;
  });

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(110);
    doc.text(doc.splitTextToSize(`${disclaimer} ${prototypeNotice}`.trim(), W - M * 2), M, H - 36);
    doc.text(`Page ${i} of ${pages} · Generated ${new Date().toLocaleDateString('en-IN')}`, W - M, H - 16, { align: 'right' });
  }
  doc.save(filename);
}

export function downloadCsv(filename: string, header: string[], rows: (string | number)[][]) {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [header, ...rows].map((r) => r.map(esc).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
