import React from 'react';
import { useData } from '../context/DataContext';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  ArrowRight,
  Printer,
  Scissors
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { results, data } = useData();

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Resumen Ejecutivo</h1>
        <p className="text-gray-500 mt-2">Visión general del impacto financiero y operativo.</p>
      </header>

      {/* Hero Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl bg-gray-900 text-white shadow-lg"
      >
        <div className="relative z-10 p-8 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
                <TrendingUp size={14} />
                Ahorro Anual Proyectado
              </div>
              <div className="flex items-baseline gap-3">
                <h2 className="text-5xl md:text-6xl font-bold tracking-tight">{formatCurrency(results.annualSavings)}</h2>
                <span className="text-xl text-emerald-400 font-medium">+ {Math.round(results.productionTimeSavings * 12)}h libres</span>
              </div>
              <p className="text-gray-400 mt-4 max-w-lg text-lg">
                Optimización basada en reducción de costes operativos, eliminación de tiempos de espera y menor consumo de tinta.
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10 min-w-[200px]">
              <p className="text-gray-400 text-sm mb-1">Retorno de Inversión</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{results.roiMonths.toFixed(1)} meses</span>
                <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">Rápido</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Productivity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
            <Printer size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Productividad Dual</h3>
          <p className="text-gray-500 text-sm mb-4">
            Imprime y corta simultáneamente con la solución HP Latex vs. flujo secuencial tradicional.
          </p>
          <div className="flex items-center gap-2 text-sm font-medium text-indigo-700 bg-indigo-50 px-3 py-2 rounded-lg w-fit">
            <CheckCircle size={16} />
            2x Más Rápido
          </div>
        </motion.div>

        {/* Time Savings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4">
            <Clock size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Tiempo de Entrega</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">HP Latex</span>
              <span className="font-bold text-emerald-600">Inmediato</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-full"></div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Solvente</span>
              <span className="font-bold text-rose-500">Esperar {data.waitHours}h</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full w-[20%]"></div>
            </div>
          </div>
        </motion.div>

        {/* Cost Efficiency */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
            <DollarSign size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Eficiencia de Costes</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Coste Mensual Actual</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(results.currentMonthlyCost)}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <p className="text-xs text-emerald-700 mb-1">Coste Mensual HP</p>
              <p className="text-lg font-bold text-emerald-700">{formatCurrency(results.hpMonthlyCost)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <div className="flex justify-end pt-4">
        <Link 
          to="/calculator" 
          className="inline-flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-sky-700 transition-colors"
        >
          Personalizar Cálculo
          <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
