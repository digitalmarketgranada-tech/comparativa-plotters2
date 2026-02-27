import React from 'react';
import { useData, ALL_MACHINES } from '../context/DataContext';
import { TrendingUp, Clock, Euro, ArrowRight, Printer, Zap, GitCompare, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { results, data } = useData();

  const fmt = (val: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const machineA = ALL_MACHINES.find(m => m.model === data.machineAModel);
  const machineB = ALL_MACHINES.find(m => m.model === data.machineBModel);
  const nameA = machineA?.model ?? 'Máquina A';
  const nameB = machineB?.model ?? 'Máquina B';
  const shortA = nameA.length > 20 ? nameA.slice(0, 20) + '…' : nameA;
  const shortB = nameB.length > 20 ? nameB.slice(0, 20) + '…' : nameB;

  const bIsCheaper = results.machineBCost < results.machineACost;
  const monthlySavings = results.machineACost - results.machineBCost;

  return (
    <div className="space-y-8">
      <header className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Resumen Comparativo</h1>
        <p className="text-gray-500 mt-1 font-medium">
          <span className="text-indigo-600 font-semibold">{shortA}</span>
          {' '}vs{' '}
          <span className="text-amber-600 font-semibold">{shortB}</span>
        </p>
      </header>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl shadow-xl"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e3a5f 100%)' }}
      >
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-indigo-500/10 pointer-events-none" />
        <div className="absolute -right-6 -bottom-20 w-80 h-80 rounded-full bg-amber-600/10 pointer-events-none" />

        <div className="relative z-10 p-8 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-5 border border-emerald-500/30">
                <TrendingUp size={12} />
                Diferencia Anual
              </div>
              <div className="flex items-baseline gap-4">
                <h2 className="text-5xl md:text-6xl font-black tracking-tight text-white">{fmt(results.annualSavings)}</h2>
                <span className={`text-lg font-bold ${bIsCheaper ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {bIsCheaper ? `B más económica` : `A más económica`}
                </span>
              </div>
              <p className="text-slate-400 mt-4 max-w-lg text-base leading-relaxed">
                Diferencia de costes operativos anuales entre las dos máquinas seleccionadas.
              </p>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px]">
              <div className="bg-white/8 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">ROI Máquina B</p>
                <span className="text-2xl font-black text-white">
                  {isFinite(results.roiMonths) ? `${results.roiMonths.toFixed(1)} meses` : '—'}
                </span>
              </div>
              <div className="bg-white/8 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                <p className="text-slate-400 text-xs font-semibold mb-1">Ahorro Mensual</p>
                <p className={`text-xl font-black ${bIsCheaper ? 'text-emerald-300' : 'text-rose-300'}`}>{fmt(monthlySavings)}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Speed comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <Printer size={22} />
          </div>
          <h3 className="text-base font-black text-gray-900 mb-3">Velocidad de Impresión</h3>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-indigo-600">{shortA}</span>
                <span className="text-gray-700">{data.machineASpeed} m²/h</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min(100, (data.machineASpeed / Math.max(data.machineASpeed, data.machineBSpeed)) * 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-600">{shortB}</span>
                <span className="text-gray-700">{data.machineBSpeed} m²/h</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, (data.machineBSpeed / Math.max(data.machineASpeed, data.machineBSpeed)) * 100)}%` }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dry time comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-amber-200">
            <Clock size={22} />
          </div>
          <h3 className="text-base font-black text-gray-900 mb-3">Tiempo de Secado</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-indigo-600 font-semibold">{shortA}</span>
              <span className={`text-sm font-black ${data.machineADryTime === 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                {data.machineADryTime === 0 ? 'Instantáneo ✓' : `${data.machineADryTime}h espera`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-amber-600 font-semibold">{shortB}</span>
              <span className={`text-sm font-black ${data.machineBDryTime === 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                {data.machineBDryTime === 0 ? 'Instantáneo ✓' : `${data.machineBDryTime}h espera`}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Cost comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-200">
            <Euro size={22} />
          </div>
          <h3 className="text-base font-black text-gray-900 mb-3">Coste Operativo Mensual</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-[10px] text-indigo-500 font-bold uppercase mb-1">Máq. A</p>
              <p className="text-base font-black text-gray-900">{fmt(results.machineACost)}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-[10px] text-amber-600 font-bold uppercase mb-1">Máq. B</p>
              <p className="text-base font-black text-amber-700">{fmt(results.machineBCost)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA */}
      <div className="flex justify-end">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
        >
          Cambiar Máquinas
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* Info grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-8 border border-gray-200 shadow-sm"
      >
        <h2 className="text-xl font-black text-gray-900 mb-6">Factores de Coste Comparados</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { icon: DollarSign, color: 'text-indigo-500 bg-indigo-50', title: 'Tinta €/m²', desc: `A: ${data.machineAInkCost.toFixed(2)}€/m²  ·  B: ${data.machineBInkCost.toFixed(2)}€/m²` },
            { icon: GitCompare, color: 'text-amber-500 bg-amber-50', title: 'Velocidad', desc: `A: ${data.machineASpeed} m²/h  ·  B: ${data.machineBSpeed} m²/h` },
            { icon: Clock, color: 'text-rose-500 bg-rose-50', title: 'Mantenimiento semanal', desc: `A: ${data.machineAMaintenance}h/sem  ·  B: ${data.machineBMaintenance}h/sem` },
            { icon: Zap, color: 'text-emerald-500 bg-emerald-50', title: 'Tiempo de secado', desc: `A: ${data.machineADryTime === 0 ? 'Ins tantáneo' : data.machineADryTime + 'h'}  ·  B: ${data.machineBDryTime === 0 ? 'Instantáneo' : data.machineBDryTime + 'h'}` },
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
