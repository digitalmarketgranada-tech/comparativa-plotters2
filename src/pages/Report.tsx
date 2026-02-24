import React, { useRef, useState } from 'react';
import { useData } from '../context/DataContext';
import { Printer, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Report: React.FC = () => {
  const { data, results } = useData();
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const handleDownloadPdf = async () => {
    setDownloading(true);
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('HP_Latex_Report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback: intentar imprimir la página si falla la generación del PDF
      try {
        window.print();
      } catch (e) {
        // ignore
      }
    }
    finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center no-print">
        <h1 className="text-3xl font-bold text-gray-900">Informe Final</h1>
        <button 
          onClick={handleDownloadPdf}
          className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-sky-700 transition-colors"
          disabled={downloading}
          aria-disabled={downloading}
        >
          <Download size={20} />
          {downloading ? 'Generando...' : 'Descargar PDF'}
        </button>
      </div>

      <div ref={reportRef} className="bg-white p-12 shadow-lg min-h-[1123px] w-full mx-auto text-gray-900">
        {/* Header with Logo */}
        <div className="flex justify-between items-start border-b-2 border-sky-600 pb-8 mb-12">
          <div className="flex items-center gap-4">
            <img src="/assets/logo-hp.png" alt="HP" className="h-16 w-auto" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Informe Técnico-Comercial</h1>
              <p className="text-gray-500 text-sm mt-1">Análisis ROI: HP Latex Print & Cut vs Competencia</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Preparado por</p>
            <p className="font-bold text-gray-900">Digital Market</p>
            <p className="text-gray-400 text-xs mt-2">{new Date().toLocaleDateString('es-ES')}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-6 rounded-lg border border-sky-200">
            <p className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2">Ahorro Anual</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(results.annualSavings)}</p>
            <p className="text-xs text-gray-500 mt-2">Vs. sistema actual</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-lg border border-emerald-200">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">ROI</p>
            <p className="text-3xl font-bold text-gray-900">{results.roiMonths.toFixed(1)}<span className="text-lg ml-1">meses</span></p>
            <p className="text-xs text-gray-500 mt-2">Retorno de inversión</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Tiempo de Entrega</p>
            <p className="text-3xl font-bold text-gray-900">10x<span className="text-lg ml-1">Rápido</span></p>
            <p className="text-xs text-gray-500 mt-2">2-3h vs 24-50h</p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12 border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-gray-900">📊 Resumen Ejecutivo</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Este análisis compara el coste total de propiedad entre la solución actual ({data.currentMachineType}) 
            y la solución propuesta (HP {data.hpMachineModel}). Incluye costes operativos, tiempos de producción, 
            y eficiencia de operarios.
          </p>
          <div className="grid grid-cols-2 gap-8 mt-6 pt-6 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-2">Inversión inicial</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.hpMachinePrice)}</p>
              <p className="text-xs text-gray-500 mt-1">Sistema completo HP Latex</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-2">Payback</p>
              <p className="text-2xl font-bold text-emerald-600">{(results.roiMonths / 12).toFixed(1)} años</p>
              <p className="text-xs text-gray-500 mt-1">Recuperación total</p>
            </div>
          </div>
        </div>

        {/* Detailed Comparison */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 text-gray-900">🔍 Comparativa Detallada</h2>
          <div className="grid grid-cols-2 gap-8">
            {/* Current System */}
            <div className="border border-rose-200 rounded-lg overflow-hidden">
              <div className="bg-rose-50 p-4 border-b border-rose-200">
                <h3 className="font-bold text-rose-900">{data.currentMachineType}</h3>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Coste Mensual:</span>
                  <span className="font-bold text-rose-600">{formatCurrency(results.currentMonthlyCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Coste Anual:</span>
                  <span className="font-bold text-rose-600">{formatCurrency(results.currentMonthlyCost * 12)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tiempo Espera/Trabajo:</span>
                  <span className="font-bold text-rose-600">{data.waitHours}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Volumen Mensual:</span>
                  <span className="font-bold">{data.monthlyVolume}m²</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-rose-100">
                  <span className="text-gray-600 font-bold">Precio/m² Tinta:</span>
                  <span className="font-bold text-gray-900">{(0.012 * data.inkPrice).toFixed(2)}€</span>
                </div>
              </div>
            </div>

            {/* HP System */}
            <div className="border border-emerald-200 rounded-lg overflow-hidden shadow-md">
              <div className="bg-emerald-50 p-4 border-b border-emerald-200">
                <h3 className="font-bold text-emerald-900">HP {data.hpMachineModel}</h3>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Coste Mensual:</span>
                  <span className="font-bold text-emerald-600">{formatCurrency(results.hpMonthlyCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Coste Anual:</span>
                  <span className="font-bold text-emerald-600">{formatCurrency(results.hpMonthlyCost * 12)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tiempo Espera/Trabajo:</span>
                  <span className="font-bold text-emerald-600">0h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Volumen Mensual:</span>
                  <span className="font-bold">{data.monthlyVolume}m²</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-emerald-100">
                  <span className="text-gray-600 font-bold">Precio/m² Tinta:</span>
                  <span className="font-bold text-gray-900">1.20€</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="mb-12 bg-gradient-to-r from-sky-50 to-emerald-50 p-8 rounded-lg border border-sky-200">
          <h2 className="font-bold text-lg mb-6 text-gray-900">✨ Ventajas de HP Latex Print & Cut</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">✓</div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Secado Inmediato</p>
                <p className="text-xs text-gray-600 mt-0.5">Curado en caliente: listo instántaneamente</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">✓</div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Print & Cut Simultáneo</p>
                <p className="text-xs text-gray-600 mt-0.5">Imprime y corta al mismo tiempo</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">✓</div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Sostenibilidad</p>
                <p className="text-xs text-gray-600 mt-0.5">Certificado UL GREENGUARD GOLD</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">✓</div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Menor Mantenimiento</p>
                <p className="text-xs text-gray-600 mt-0.5">Sistema de tinta más estable</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-12 border-t-2 border-gray-200 text-center text-gray-400 text-xs">
          <p className="mb-2">Generado con Herramienta de Análisis ROI - Digital Market</p>
          <p>Consulta técnica y análisis personalizado basado en datos operativos reales</p>
        </div>
      </div>
    </div>
  );
};

export default Report;
