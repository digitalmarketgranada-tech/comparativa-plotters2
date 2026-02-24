import React from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'motion/react';
import { Calculator as CalcIcon, RefreshCw } from 'lucide-react';

const Calculator: React.FC = () => {
  const { data, updateData, calculate } = useData();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: name === 'currentMachineType' || name === 'hpMachineModel' ? value : Number(value) });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Calculadora ROI</h1>
        <p className="text-gray-500 mt-2">Introduce los datos actuales para generar una comparativa precisa.</p>
      </header>

      <div className="grid gap-8">
        {/* Current Machine Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <span className="w-2 h-6 bg-rose-500 rounded-full"></span>
              Máquina Actual (Competencia)
            </h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Máquina</label>
              <select 
                name="currentMachineType" 
                value={data.currentMachineType} 
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 focus:border-rose-500 focus:ring-rose-500"
              >
                <option value="Solvente Genérica">Solvente Genérica</option>
                <option value="Eco-Solvente">Eco-Solvente</option>
                <option value="UV">UV</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Volumen Mensual (m²)</label>
              <div className="relative">
                <input 
                  type="number" 
                  name="monthlyVolume" 
                  value={data.monthlyVolume} 
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 pl-4 pr-12 focus:border-rose-500 focus:ring-rose-500"
                />
                <span className="absolute right-4 top-2.5 text-gray-400 text-sm font-medium">m²</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Precio Tinta (€/L)</label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-gray-400 text-sm font-medium">€</span>
                <input 
                  type="number" 
                  name="inkPrice" 
                  value={data.inkPrice} 
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 pl-8 pr-4 focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Velocidad (m²/h)</label>
              <div className="relative">
                <input 
                  type="number" 
                  name="printSpeed" 
                  value={data.printSpeed} 
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 pl-4 pr-16 focus:border-rose-500 focus:ring-rose-500"
                />
                <span className="absolute right-4 top-2.5 text-gray-400 text-sm font-medium">m²/h</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Espera Secado (Horas)</label>
              <div className="relative">
                <input 
                  type="number" 
                  name="waitHours" 
                  value={data.waitHours} 
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 pl-4 pr-12 focus:border-rose-500 focus:ring-rose-500"
                />
                <span className="absolute right-4 top-2.5 text-gray-400 text-sm font-medium">h</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Tiempo de desgasificación necesario.</p>
            </div>
          </div>
        </motion.section>

        {/* HP Machine Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-sky-200 overflow-hidden ring-1 ring-sky-100"
        >
          <div className="bg-sky-50 px-6 py-4 border-b border-sky-100 flex justify-between items-center">
            <h2 className="font-bold text-sky-900 flex items-center gap-2">
              <span className="w-2 h-6 bg-sky-500 rounded-full"></span>
              Solución HP Latex (Recomendado)
            </h2>
            <span className="bg-sky-100 text-sky-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
              Recomendado
            </span>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Modelo HP</label>
              <select 
                name="hpMachineModel" 
                value={data.hpMachineModel} 
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 focus:border-sky-500 focus:ring-sky-500"
              >
                <option value="HP Latex 630 Print & Cut">HP Latex 630 Print & Cut</option>
                <option value="HP Latex 700 Print & Cut">HP Latex 700 Print & Cut</option>
                <option value="HP Latex 800 W">HP Latex 800 W</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Precio Solución (€)</label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-gray-400 text-sm font-medium">€</span>
                <input 
                  type="number" 
                  name="hpMachinePrice" 
                  value={data.hpMachinePrice} 
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 pl-8 pr-4 focus:border-sky-500 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Precio Tinta HP (€/L)</label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-gray-400 text-sm font-medium">€</span>
                <input 
                  type="number" 
                  name="hpInkPrice" 
                  value={data.hpInkPrice} 
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 pl-8 pr-4 focus:border-sky-500 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>
        </motion.section>

        <div className="flex gap-4 pt-4">
          <button 
            onClick={() => calculate()}
            className="flex-1 bg-sky-600 text-white font-bold py-4 rounded-lg hover:bg-sky-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <CalcIcon size={20} />
            Calcular Comparativa
          </button>
          
          <button 
            className="px-6 bg-white border border-gray-200 text-gray-600 font-bold py-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
