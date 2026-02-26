import React from 'react';
import { useData } from '../context/DataContext';
import {
  TrendingUp,
  Clock,
  Euro,
  CheckCircle,
  ArrowRight,
  Printer,
  Zap,
  Leaf,
  Shield
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { results, data } = useData();

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8">
      <header className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Resumen Ejecutivo</h1>
        <p className="text-gray-500 mt-1 font-medium">Visión general del impacto financiero y operativo.</p>
      </header>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl shadow-xl"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0c4a6e 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-sky-500/10 pointer-events-none" />
        <div className="absolute -right-6 -bottom-20 w-80 h-80 rounded-full bg-blue-600/10 pointer-events-none" />
        <div className="absolute left-1/2 top-0 w-px h-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 p-8 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-5 border border-emerald-500/30">
                <TrendingUp size={12} />
                Ahorro Anual Proyectado
              </div>
              <div className="flex items-baseline gap-4">
                <h2 className="text-5xl md:text-6xl font-black tracking-tight text-white">{formatCurrency(results.annualSavings)}</h2>
                <span className="text-lg text-emerald-400 font-bold">+ {Math.round(results.productionTimeSavings * 12)}h/año</span>
              </div>
              <p className="text-slate-400 mt-4 max-w-lg text-base leading-relaxed">
                Ahorro basado en reducción de costes operativos, eliminación de tiempos de espera y menor consumo de tinta.
              </p>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px]">
              <div className="bg-white/8 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Retorno de Inversión</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-white">{results.roiMonths.toFixed(1)} meses</span>
                </div>
                <span className="inline-block mt-2 text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">Amortización Rápida</span>
              </div>
              <div className="bg-white/8 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                <p className="text-slate-400 text-xs font-semibold mb-1">Ahorro Mensual</p>
                <p className="text-xl font-black text-sky-300">{formatCurrency(results.monthlySavings)}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Productivity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <Printer size={22} />
          </div>
          <h3 className="text-base font-black text-gray-900 mb-1.5">Productividad Dual</h3>
          <p className="text-gray-500 text-sm mb-4 leading-relaxed">
            Imprime y corta simultáneamente — flujo continuo sin interrupciones.
          </p>
          <div className="flex items-center gap-2 text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-2 rounded-lg w-fit">
            <CheckCircle size={15} />
            2x Más Rápido
          </div>
        </motion.div>

        {/* Time Savings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-amber-200">
            <Clock size={22} />
          </div>
          <h3 className="text-base font-black text-gray-900 mb-3">Tiempo de Entrega</h3>
          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between items-center text-xs mb-1 font-semibold">
                <span className="text-gray-500">HP Latex</span>
                <span className="text-emerald-600">Inmediato ✓</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-full rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center text-xs mb-1 font-semibold">
                <span className="text-gray-500">Eco-Solvente</span>
                <span className="text-rose-500">Esperar {data.waitHours}h</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full w-[18%] rounded-full" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cost Efficiency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-200">
            <Euro size={22} />
          </div>
          <h3 className="text-base font-black text-gray-900 mb-3">Eficiencia de Costes</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
              <p className="text-[10px] text-rose-500 font-bold uppercase mb-1">Actual</p>
              <p className="text-base font-black text-gray-900">{formatCurrency(results.currentMonthlyCost)}</p>
              <p className="text-[10px] text-gray-400">/mes</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-[10px] text-emerald-600 font-bold uppercase mb-1">HP Latex</p>
              <p className="text-base font-black text-emerald-700">{formatCurrency(results.hpMonthlyCost)}</p>
              <p className="text-[10px] text-gray-400">/mes</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <div className="flex justify-end">
        <Link
          to="/calculator"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
        >
          Personalizar Cálculo
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* HP Advantages Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-8 border border-sky-100 shadow-sm"
      >
        <h2 className="text-xl font-black text-gray-900 mb-6">Ventajas de HP Latex Print &amp; Cut</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { icon: Zap, color: 'text-amber-500 bg-amber-50', title: 'Secado Instantáneo', desc: 'Tinta latex curable con calor — sin tiempo de espera para desgasificación.' },
            { icon: Printer, color: 'text-sky-500 bg-sky-50', title: 'Print & Cut Simultáneo', desc: 'Corte inmediato sin esperas — reduce el tiempo total de producción.' },
            { icon: Shield, color: 'text-violet-500 bg-violet-50', title: 'Menor Mantenimiento', desc: 'Sistema de tinta latex más estable — menos limpiezas y recambios.' },
            { icon: Leaf, color: 'text-emerald-500 bg-emerald-50', title: 'Mejor Sostenibilidad', desc: 'Sin solventes — más saludable para operarios y medio ambiente.' },
          ].map(({ icon: Icon, color, title, desc }, i) => (
            <div key={i} className="flex gap-4 bg-white/70 rounded-xl p-4 border border-white shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
