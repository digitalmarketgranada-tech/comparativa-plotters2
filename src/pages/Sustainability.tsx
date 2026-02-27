import React from 'react';
import { motion } from 'motion/react';
import { Leaf, School, Home, Hospital, Check, X } from 'lucide-react';

const Sustainability: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold uppercase tracking-wider mb-4">
          <Leaf size={16} />
          Sostenibilidad y Tecnología
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Comparativa de Tecnologías</h1>
        <p className="text-gray-500 text-lg">Análisis objetivo del impacto ambiental y operativo</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Solvent Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl overflow-hidden border border-rose-100 shadow-sm"
        >
          <div className="bg-rose-50 p-6 border-b border-rose-100">
            <div className="flex items-center gap-3 text-rose-600 mb-2">
              <X size={24} />
              <h3 className="font-bold text-lg uppercase tracking-wide">Tecnología Eco-Solvente</h3>
            </div>
            <p className="text-rose-800 text-sm">Basada en pigmentos suspendidos en disolventes.</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <span className="font-bold text-lg">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Emisiones de COVs</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Requiere desgasificación externa (24-48h). El olor puede ser persistente en interiores si no se ventila.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <span className="font-bold text-lg">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Mantenimiento Químico</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Requiere limpiezas frecuentes con solventes para evitar la obstrucción de cabezales.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <span className="font-bold text-lg">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Gestión de Residuos</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Los residuos de tinta y mantenimiento suelen clasificarse como peligrosos en muchas normativas locales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Latex Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl overflow-hidden border border-emerald-200 shadow-sm ring-1 ring-emerald-100"
        >
          <div className="bg-emerald-50 p-6 border-b border-emerald-100 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 text-emerald-600 mb-2">
                <Check size={24} />
                <h3 className="font-bold text-lg uppercase tracking-wide">Tecnología Látex</h3>
              </div>
              <p className="text-emerald-800 text-sm">Tintas de base acuosa de curado térmico.</p>
            </div>
            <div className="bg-white px-3 py-1 rounded text-xs font-bold text-emerald-700 border border-emerald-200 shadow-sm">
              BASE AGUA
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Leaf size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Sin Olores / Curado Inmediato</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Las copias salen secas y listas para laminar o cortar. Bajo nivel de emisiones (apto para hospitales).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Salud y Seguridad</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    No requiere extracción de aire especial. Cumple con normativas rigurosas de calidad de aire interior.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 mt-6">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">Entornos de Aplicación</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-sky-500">
                    <School size={24} />
                  </div>
                  <span className="text-xs font-medium text-gray-600">Educativo</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-rose-500">
                    <Hospital size={24} />
                  </div>
                  <span className="text-xs font-medium text-gray-600">Sanitario</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-emerald-500">
                    <Home size={24} />
                  </div>
                  <span className="text-xs font-medium text-gray-600">Residencial</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Sustainability;
