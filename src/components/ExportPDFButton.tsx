"use client";

import React, { useState, useRef } from 'react';
import { Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { useAppStore } from '../store/useAppStore';

export function ExportPDFButton() {
  const [isExporting, setIsExporting] = useState(false);
  const { conversation } = useAppStore();
  const { analysis, problemStatement, steps } = conversation;
  const exportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!analysis || !exportRef.current) return;
    setIsExporting(true);
    
    let clone: HTMLElement | null = null;
    
    try {
      // Create a clone of the hidden export element
      const element = exportRef.current;
      clone = element.cloneNode(true) as HTMLElement;
      document.body.appendChild(clone);
      
      // Setup clone styles for capture - make invisible but within viewport
      clone.style.position = 'fixed';
      clone.style.top = '0';
      clone.style.left = '0';
      clone.style.width = '800px'; 
      clone.style.opacity = '0';
      clone.style.pointerEvents = 'none';
      clone.style.zIndex = '-1000';
      clone.style.visibility = 'visible';
      clone.style.display = 'block';
      clone.style.backgroundColor = '#f8fafc';

      // Ensure clone is rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      // html-to-image is generally better at handling modern CSS
      const dataUrl = await toPng(clone, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#f8fafc',
        width: 800,
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Create an image to get dimensions
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => (img.onload = resolve));

      const imgWidth = pdfWidth;
      const imgHeight = (img.height * pdfWidth) / img.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`5-Whys-Analysis-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export PDF. Please try again later.');
    } finally {
      // ALWAYS remove the clone to avoid layout mess
      if (clone && document.body.contains(clone)) {
        document.body.removeChild(clone);
      }
      setIsExporting(false);
    }
  };

  return (
    <>
      {/* Hidden PDF Template styled with Hex Colors to avoid oklch errors */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div ref={exportRef} style={{ backgroundColor: '#f8fafc', padding: '48px', color: '#0f172a', fontFamily: 'sans-serif', width: '800px' }}>
          <div style={{ backgroundColor: '#4f46e5', margin: '-48px -48px 48px -48px', padding: '48px', color: '#ffffff' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>Root Cause Analysis Report</h1>
            <p style={{ opacity: 0.8 }}>Generated on {new Date().toLocaleDateString()}</p>
          </div>

          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'inline-block', padding: '8px 16px', backgroundColor: '#d1fae5', color: '#047857', borderRadius: '9999px', fontWeight: 'bold', fontSize: '14px', marginBottom: '32px', border: '1px solid #a7f3d0' }}>
              Confidence Score: {analysis?.confidence}%
            </div>

            <section style={{ marginBottom: '48px' }}>
              <h2 style={{ color: '#94a3b8', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Identified Root Cause</h2>
              <div style={{ padding: '32px', backgroundColor: '#fffbeb', borderRadius: '16px', border: '1px solid #fef3c7' }}>
                <p style={{ fontSize: '24px', color: '#1e293b', fontWeight: 'bold', lineHeight: 1.2 }}>{analysis?.rootCause}</p>
              </div>
            </section>

            <section style={{ marginBottom: '48px' }}>
              <h2 style={{ color: '#94a3b8', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Detailed Explanation</h2>
              <p style={{ fontSize: '18px', color: '#334155', lineHeight: 1.6 }}>{analysis?.explanation}</p>
            </section>

            <section style={{ marginBottom: '48px' }}>
              <h2 style={{ color: '#94a3b8', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Recommended Actions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {analysis?.recommendations.map((rec, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'start', gap: '16px', padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '9999px', backgroundColor: '#e0e7ff', color: '#4338ca', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    <p style={{ color: '#334155', lineHeight: 1.6 }}>{rec}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div style={{ paddingTop: '48px', borderTop: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px' }}>Investigation Timeline</h2>
            <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', display: 'block' }}>Initial Problem Statement</span>
              <p style={{ fontSize: '20px', color: '#0f172a', fontWeight: 'bold' }}>{problemStatement}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingLeft: '32px', borderLeft: '2px solid #e0e7ff', marginLeft: '16px' }}>
              {steps.map((step, i) => (
                <div key={i} style={{ position: 'relative', paddingLeft: '40px' }}>
                  <div style={{ position: 'absolute', left: '-41px', top: '4px', width: '20px', height: '20px', borderRadius: '9999px', backgroundColor: '#ffffff', border: '4px solid #6366f1' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Why {step.level}</p>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{step.question}</p>
                    <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#334155' }}>
                      {step.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '96px', paddingTop: '32px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <span>5 Whys Diagnostic Report</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 no-print w-full sm:w-auto">
        <button
          onClick={handleDownloadPDF}
          disabled={isExporting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 shadow-sm"
        >
          {isExporting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          {isExporting ? 'Generating...' : 'Download PDF'}
        </button>
      </div>
    </>
  );
}
