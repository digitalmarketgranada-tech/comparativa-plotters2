import React from 'react';
import { motion } from 'motion/react';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const Workflow: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center mb-12">
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

      {/* Competitor Flow */}
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

        <p className="text-gray-500 text-sm mt-4">
          El proceso es secuencial. La impresora debe terminar y secar (desgasificar) antes de cargar en el plotter de corte.
        </p>
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

        <div className="grid grid-cols-2 gap-4 mt-8 relative z-10">
          <div className="bg-white p-4 rounded-lg border border-sky-100 text-center shadow-sm">
            <span className="block text-3xl font-bold text-sky-600 mb-1">40%</span>
            <span className="text-xs text-gray-500 uppercase tracking-wide font-bold">Más Rápido</span>
          </div>
          <div className="bg-white p-4 rounded-lg border border-sky-100 text-center shadow-sm">
            <span className="block text-3xl font-bold text-emerald-500 mb-1">0h</span>
            <span className="text-xs text-gray-500 uppercase tracking-wide font-bold">Espera Secado</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Workflow;
