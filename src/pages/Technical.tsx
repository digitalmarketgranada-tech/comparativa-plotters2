import React from 'react';
import { motion } from 'motion/react';
import { Hourglass, Wind, AlertTriangle, TimerOff, Leaf, Rocket, CheckCircle } from 'lucide-react';

const Technical: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Detalle Técnico</h1>
        <p className="text-gray-500 mt-2">Solvente vs. HP Latex 4ª Gen</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Solvent Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl overflow-hidden border border-rose-100 shadow-sm"
        >
          <div className="bg-rose-50 p-4 border-b border-rose-100 flex justify-between items-center">
            <div className="flex items-center gap-2 text-rose-700 font-bold">
              <AlertTriangle size={20} />
              Solvente (Tradicional)
            </div>
            <span className="text-xs font-bold bg-rose-100 text-rose-600 px-2 py-1 rounded uppercase">Riesgo</span>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500 shrink-0">
                <Hourglass size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tiempo de Espera</p>
                <p className="text-2xl font-bold text-gray-900">24-48 Horas</p>
                <p className="text-xs text-rose-500 mt-1 font-medium">Outgassing necesario antes de laminar.</p>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100"></div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500 shrink-0">
                <Wind size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ventilación</p>
                <p className="text-lg font-bold text-gray-900">Requiere Extracción</p>
                <p className="text-xs text-gray-500 mt-1">Olores fuertes por VOCs nocivos.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* HP Latex Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl overflow-hidden border border-emerald-200 shadow-sm ring-1 ring-emerald-100 relative"
        >
          <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg z-10">RECOMENDADO</div>
          <div className="bg-emerald-50 p-4 border-b border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <CheckCircle size={20} />
              HP Latex 4ª Gen
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 shrink-0">
                <TimerOff size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tiempo de Espera</p>
                <p className="text-2xl font-bold text-gray-900">0 Horas</p>
                <p className="text-xs text-emerald-600 mt-1 font-medium">Curado instantáneo dentro de la impresora.</p>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100"></div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-sky-50 rounded-lg flex items-center justify-center text-sky-500 shrink-0">
                <Leaf size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sostenibilidad</p>
                <p className="text-lg font-bold text-gray-900">Base Agua</p>
                <p className="text-xs text-gray-500 mt-1">Sin olores, apto para interiores sensibles.</p>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-lg p-3 flex items-center gap-3 border border-emerald-100">
              <Rocket className="text-emerald-600" size={20} />
              <div>
                <p className="text-xs font-bold text-emerald-800">Flujo Continuo</p>
                <p className="text-[10px] text-emerald-700">Imprimir, laminar y entregar en el mismo día.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Technical;
