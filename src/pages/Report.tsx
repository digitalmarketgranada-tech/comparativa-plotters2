import React, { useRef } from 'react';
import { useData } from '../context/DataContext';
import { Printer, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Report: React.FC = () => {
  const { data, results } = useData();
  const reportRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const handleDownloadPdf = async () => {
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
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center no-print">
        <h1 className="text-3xl font-bold text-gray-900">Informe Final</h1>
        <button 
          onClick={handleDownloadPdf}
          className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-sky-700 transition-colors"
        >
          <Download size={20} />
          Descargar PDF
        </button>
      </div>

      <div ref={reportRef} className="bg-white p-12 shadow-lg min-h-[1123px] w-full mx-auto text-gray-900">
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-gray-900 pb-6 mb-8">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-sky-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">HP</div>
             <div>
               <h1 className="text-2xl font-bold">Informe de Eficiencia</h1>
               <p className="text-gray-500 text-sm">Comparativa Tecnológica</p>
             </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Fecha</p>
            <p className="font-bold">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-gray-50 rounded-lg p-8 mb-8 border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-sky-900">Resumen Ejecutivo</h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Ahorro Anual Estimado</p>
              <p className="text-4xl font-bold text-gray-900">{formatCurrency(results.annualSavings)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Retorno de Inversión</p>
              <p className="text-4xl font-bold text-emerald-600">{results.roiMonths.toFixed(1)} meses</p>
            </div>
          </div>
        </div>

        {/* Comparison Details */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="font-bold text-lg mb-4 border-b pb-2">Situación Actual</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Equipo</span>
                <span className="font-medium">{data.currentMachineType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Coste Mensual</span>
                <span className="font-medium text-rose-600">{formatCurrency(results.currentMonthlyCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tiempo Espera</span>
                <span className="font-medium text-rose-600">{data.waitHours}h / trabajo</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 border-b pb-2 text-sky-900">Propuesta HP Latex</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Equipo</span>
                <span className="font-medium">{data.hpMachineModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Coste Mensual</span>
                <span className="font-medium text-emerald-600">{formatCurrency(results.hpMonthlyCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tiempo Espera</span>
                <span className="font-medium text-emerald-600">Inmediato</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-4">Beneficios Clave</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-sky-50 border-sky-100">
              <h4 className="font-bold text-sky-900 mb-2">Productividad</h4>
              <p className="text-sm text-gray-600">Impresión y corte simultáneo reduce tiempos de entrega en un 40%.</p>
            </div>
            <div className="p-4 border rounded-lg bg-emerald-50 border-emerald-100">
              <h4 className="font-bold text-emerald-900 mb-2">Sostenibilidad</h4>
              <p className="text-sm text-gray-600">Tintas base agua sin olores ni residuos peligrosos. Certificación UL ECOLOGO.</p>
            </div>
            <div className="p-4 border rounded-lg bg-gray-50 border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">Versatilidad</h4>
              <p className="text-sm text-gray-600">Apto para espacios interiores sensibles como escuelas y hospitales.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 border-t text-center text-gray-400 text-sm">
          <p>Generado con Herramienta Comercial HP - {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};

export default Report;
