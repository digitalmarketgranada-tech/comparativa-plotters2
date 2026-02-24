import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Clock, CheckCircle, AlertTriangle, Users, Zap, Download, BarChart3 } from 'lucide-react';
import { useData } from '../context/DataContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Workflow: React.FC = () => {
  const { data, results } = useData();
  const workflowRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const handleDownloadPdf = async () => {
    if (!workflowRef.current) return;

    try {
      const canvas = await html2canvas(workflowRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
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

      pdf.save('HP_Latex_Workflow_Comparativa.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 -mx-8 px-8 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Flujo de Trabajo</h1>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Download size={18} />
            Descargar Comparativa PDF
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8" ref={workflowRef}>
        <header className="text-center mb-12 pt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6 text-amber-600">
            <Clock size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ahorra un <span className="text-amber-600">40% de tiempo real</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Comparación de tiempos de producción total: Impresión y Corte
          </p>
        </header>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center"
          >
            <p className="text-4xl font-bold text-amber-600 mb-2">{data.monthlyVolume}m²</p>
            <p className="text-sm text-gray-600">Volumen mensual procesado</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center"
          >
            <p className="text-4xl font-bold text-emerald-600 mb-2">24+ h</p>
            <p className="text-sm text-gray-600">Ahorro por lote de trabajo</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center"
          >
            <p className="text-4xl font-bold text-sky-600 mb-2">{formatCurrency(results.monthlySavings || 0)}</p>
            <p className="text-sm text-gray-600">Ahorro mensual total</p>
          </motion.div>
        </div>

        {/* Timeline Comparison */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-rose-500" />
              <h3 className="text-xl font-bold text-gray-800">Flujo Convencional</h3>
            </div>
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Competencia</span>
          </div>

          <div className="relative py-8">
            {/* Timeline Bar */}
            <div className="flex h-16 w-full rounded-lg overflow-hidden bg-gray-100">
              <div className="w-[45%] bg-gray-400 flex items-center justify-center text-white font-medium relative group">
                Impresión
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              {/* Wait Time */}
              <div className="w-[10%] bg-rose-50 flex flex-col items-center justify-center border-x-2 border-rose-500 relative">
                <div className="absolute -top-8 text-rose-500 text-xs font-bold whitespace-nowrap">Espera (Secado)</div>
                <span className="text-rose-500 font-bold text-xs">24h+</span>
              </div>
              <div className="w-[45%] bg-gray-300 flex items-center justify-center text-gray-700 font-medium">
                Corte
              </div>
            </div>
            
            <div className="flex justify-between mt-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <span>Inicio</span>
              <span>Fin (26h 30m)</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-rose-50 rounded-lg border border-rose-200">
            <p className="text-gray-700 text-sm font-medium mb-2">⚠️ Cuello de botella crítico:</p>
            <p className="text-gray-600 text-sm">El proceso es secuencial. La impresora debe terminar, secar completamente (desgasificar) antes de cargar en el plotter de corte. Esto causa hasta 50 horas de espera total.</p>
          </div>
        </motion.div>

        {/* HP Flow */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-sky-50 rounded-xl p-8 shadow-sm border border-sky-100 relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-sky-600" />
              <h3 className="text-xl font-bold text-gray-900">Solución HP Latex + Summa</h3>
            </div>
            <span className="bg-sky-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Recomendado
            </span>
          </div>

          <div className="relative py-8 z-10">
            {/* Timeline Container */}
            <div className="relative h-24 w-full">
              {/* Printing Phase */}
              <div className="absolute top-0 left-0 h-10 w-[45%] bg-sky-600 rounded-l-lg rounded-tr-lg flex items-center justify-center text-white font-bold shadow-sm z-20">
                Impresión HP
              </div>
              
              {/* Cutting Phase (Overlapping) */}
              <div className="absolute top-6 left-[10%] h-10 w-[45%] bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold shadow-sm z-30 border-2 border-white">
                Corte Simultáneo
              </div>

              {/* Total Time Marker */}
              <div className="absolute top-0 left-0 w-[55%] h-full border-b-2 border-dashed border-sky-300 pointer-events-none"></div>
              <div className="absolute bottom-0 left-[55%] text-sky-700 font-bold text-sm translate-y-6">Fin (1h 45m)</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 relative z-10">
            <div className="bg-white p-4 rounded-lg border border-sky-100 text-center shadow-sm">
              <span className="block text-3xl font-bold text-sky-600 mb-1">40%</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide font-bold">Más Rápido</span>
            </div>
            <div className="bg-white p-4 rounded-lg border border-sky-100 text-center shadow-sm">
              <span className="block text-3xl font-bold text-emerald-500 mb-1">0h</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide font-bold">Espera Secado</span>
            </div>
            <div className="bg-white p-4 rounded-lg border border-sky-100 text-center shadow-sm">
              <span className="block text-3xl font-bold text-amber-500 mb-1">24x</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide font-bold">Más Entregas</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-gray-700 text-sm font-medium mb-2">✓ Ventaja competitiva:</p>
            <p className="text-gray-600 text-sm">Impresión y corte simultáneos. Curado instantáneo de la tinta al calor. Entrega en 2-3 horas vs 24-50 horas. Ideal para clientes que necesitan entrega rápida.</p>
          </div>
        </motion.div>

        {/* Step by Step Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 pt-12 border-t border-gray-200"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Proceso Detallado Paso a Paso</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Solvente Process */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">⏱</div>
                Flujo Solvente Tradicional (26.5 - 50.5h)
              </h3>
              
              <div className="space-y-3">
                {[
                  { step: 1, time: "0 min", title: "Preparar Material", desc: "Cargar rollo/hoja en la impresora" },
                  { step: 2, time: "45 min", title: "Imprimir", desc: `Impresión a ${data.printSpeed}m²/h (ej: ${data.monthlyVolume}m²)` },
                  { step: 3, time: "24-48 h", title: "Desgasificación", desc: "Material debe 'respirar' para eliminar solventes volátiles - TIEMPO CRÍTICO" },
                  { step: 4, time: "30 min", title: "Transferir Material", desc: "Mover a plotter de corte (manual o con sistema)" },
                  { step: 5, time: "1-2 h", title: "Cortar", desc: "Proceso de corte según diseño" },
                  { step: 6, time: "Total", title: "De Pedido a Producto Final", desc: "Entre 26.5 a 50.5 horas de espera real" },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 bg-rose-50 rounded-lg border border-rose-100 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center shrink-0 font-bold text-sm">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 flex justify-between items-start gap-2">
                        {item.title}
                        <span className="text-xs bg-rose-200 text-rose-700 px-2 py-1 rounded font-mono whitespace-nowrap">{item.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HP Latex Process */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">⚡</div>
                Flujo HP Latex Print & Cut (2-3h)
              </h3>
              
              <div className="space-y-3">
                {[
                  { step: 1, time: "0 min", title: "Preparar Material", desc: "Cargar rollo en HP Latex 630 Print & Cut" },
                  { step: 2, time: "45 min", title: "Imprimir", desc: "Impresión HP Latex 18m²/h - Tinta se cura al instante con calor" },
                  { step: 3, time: "0 min", title: "✓ Corte Simultáneo", desc: "Módulo Summa comienza mientras finaliza impresión (sin pausas)" },
                  { step: 4, time: "1-2 h", title: "Corte Final", desc: "Completa el corte sin tiempos de espera" },
                  { step: 5, time: "0 min", title: "Producto Listo", desc: "Laminación o acabado inmediato - Sin esperas de secado" },
                  { step: 6, time: "Total", title: "De Pedido a Producto Final", desc: "Solo 2-3 horas de tiempo real (10x más rápido)" },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 bg-emerald-50 rounded-lg border border-emerald-100 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-sm">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 flex justify-between items-start gap-2">
                        {item.title}
                        <span className="text-xs bg-emerald-200 text-emerald-700 px-2 py-1 rounded font-mono whitespace-nowrap">{item.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Impact Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-sky-50 to-emerald-50 rounded-xl p-8 border border-sky-200 mt-12"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 size={24} className="text-sky-600" />
            Impacto en tu Negocio
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center bg-white rounded-lg p-6 shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <p className="font-bold text-gray-900 text-lg">10x Más Rápido</p>
              <p className="text-sm text-gray-600 mt-1">Entrega en 2-3 horas vs 24-50 horas</p>
              <p className="text-xs text-amber-600 font-bold mt-2">Ahorro: 24+ horas/lote</p>
            </div>
            <div className="text-center bg-white rounded-lg p-6 shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <p className="font-bold text-gray-900 text-lg">Menos Intervención</p>
              <p className="text-sm text-gray-600 mt-1">Automático: imprime y corta sin pausas</p>
              <p className="text-xs text-blue-600 font-bold mt-2">Operario solo supervisa</p>
            </div>
            <div className="text-center bg-white rounded-lg p-6 shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <Zap className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="font-bold text-gray-900 text-lg">Máxima Producción</p>
              <p className="text-sm text-gray-600 mt-1">Solo limitado por velocidad de impresión</p>
              <p className="text-xs text-emerald-600 font-bold mt-2">+500% más entregas/día</p>
            </div>
          </div>
        </motion.div>

        {/* TCO Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-8 border border-gray-200 mt-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Resumen Económico</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border-l-4 border-rose-500 pl-6">
              <p className="text-sm text-gray-500 uppercase tracking-wide font-bold mb-1">Coste Mensual (Solvente)</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(results.currentMonthlyCost)}</p>
              <p className="text-xs text-gray-600 mt-2">Con tiempos de espera incluidos</p>
            </div>
            <div className="border-l-4 border-sky-500 pl-6">
              <p className="text-sm text-gray-500 uppercase tracking-wide font-bold mb-1">Coste Mensual (HP Latex)</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(results.hpMonthlyCost)}</p>
              <p className="text-xs text-gray-600 mt-2">Sin tiempos de espera</p>
            </div>
            <div className="border-l-4 border-emerald-500 pl-6">
              <p className="text-sm text-gray-500 uppercase tracking-wide font-bold mb-1">Ahorro Mensual</p>
              <p className="text-3xl font-bold text-emerald-600">{formatCurrency(results.monthlySavings || 0)}</p>
              <p className="text-xs text-emerald-700 mt-2">ROI en {results.roiMonths?.toFixed(1) || '19'} meses</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recommendations */}
      <div className="max-w-6xl mx-auto bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 border border-amber-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recomendaciones</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-3">
            <CheckCircle size={20} className="text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Adoptar HP Latex 630 P&C</strong> es crítico para entregas rápidas y competitivas</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle size={20} className="text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Reducir tiempos de espera</strong> permite hacer más entregas al día y captar nuevos clientes</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle size={20} className="text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Automatización total</strong> reduce errores humanos y costes operativos</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Workflow;
