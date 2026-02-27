import React from 'react';
import { useData, ALL_MACHINES } from '../context/DataContext';
import { motion } from 'motion/react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { TrendingDown, AlertCircle } from 'lucide-react';

const CostBreakdown: React.FC = () => {
  const { data, results } = useData();

  const fmt = (v: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(v);

  const machineA = ALL_MACHINES.find(m => m.model === data.machineAModel);
  const machineB = ALL_MACHINES.find(m => m.model === data.machineBModel);
  const nameA = machineA?.model ?? 'Máquina A';
  const nameB = machineB?.model ?? 'Máquina B';
  const shortA = nameA.length > 22 ? nameA.slice(0, 22) + '…' : nameA;
  const shortB = nameB.length > 22 ? nameB.slice(0, 22) + '…' : nameB;

  // ─ Detailed breakdown for A ──────────────────────────────────
  const aInkCost = data.monthlyVolume * data.machineAInkCost;
  const aPrintH = data.monthlyVolume / (data.machineASpeed || 1);
  const aOpCost = (aPrintH + data.machineAMaintenance * 4) * 20;
  const aWaitCost = data.machineADryTime > 0 ? (data.monthlyVolume / 50) * 0.5 * 20 : 0;

  // ─ Detailed breakdown for B ──────────────────────────────────
  const bInkCost = data.monthlyVolume * data.machineBInkCost;
  const bPrintH = data.monthlyVolume / (data.machineBSpeed || 1);
  const bOpCost = (bPrintH + data.machineBMaintenance * 4) * 20;
  const bWaitCost = data.machineBDryTime > 0 ? (data.monthlyVolume / 50) * 0.5 * 20 : 0;

  const monthlySavings = results.machineACost - results.machineBCost;
  const annualSavings = monthlySavings * 12;

  const monthlyComparison = [
    { name: 'Tinta', A: aInkCost, B: bInkCost },
    { name: 'Operario', A: aOpCost, B: bOpCost },
    { name: 'Espera', A: aWaitCost, B: bWaitCost },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Desglose de Costes</h1>
        <p className="text-gray-500 text-lg">Comparativa transparente: <span className="font-semibold text-indigo-600">{shortA}</span> vs <span className="font-semibold text-amber-600">{shortB}</span></p>
      </header>

      {/* ── Side-by-side profit cards ── */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Machine A */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden"
        >
          <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
            <h3 className="font-bold text-white text-base uppercase tracking-tight">Máquina A</h3>
            <span className="bg-indigo-100 text-indigo-700 font-mono text-xs font-bold px-2 py-1 rounded max-w-[180px] truncate">{shortA}</span>
          </div>
          <div className="p-6 space-y-0">
            <div className="flex justify-between items-center py-4 border-b border-gray-100">
              <span className="text-gray-500 font-medium text-sm">Ventas Mensuales</span>
              <span className="text-xl font-bold text-gray-900">{fmt(results.monthlyRevenue)}</span>
            </div>
            <div className="py-4 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-gray-500 font-medium text-sm">Costes Operativos</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-bold">Tinta {fmt(aInkCost)}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">Operario {fmt(aOpCost)}</span>
                    {aWaitCost > 0 && <span className="text-[10px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded font-bold">Espera {fmt(aWaitCost)}</span>}
                  </div>
                </div>
                <span className="text-xl font-bold text-rose-500">−{fmt(results.machineACost)}</span>
              </div>
            </div>
            <div className="pt-5">
              <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-5">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Beneficio Bruto Mensual</p>
                <p className="text-4xl font-black text-indigo-700">{fmt(results.machineAProfit)}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Machine B */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden"
        >
          <div className="bg-amber-500 px-6 py-4 flex items-center justify-between">
            <h3 className="font-bold text-white text-base uppercase tracking-tight">Máquina B</h3>
            <span className="bg-amber-100 text-amber-800 font-mono text-xs font-bold px-2 py-1 rounded max-w-[180px] truncate">{shortB}</span>
          </div>
          <div className="p-6 space-y-0">
            <div className="flex justify-between items-center py-4 border-b border-gray-100">
              <span className="text-gray-500 font-medium text-sm">Ventas Mensuales</span>
              <span className="text-xl font-bold text-gray-900">{fmt(results.monthlyRevenue)}</span>
            </div>
            <div className="py-4 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-gray-500 font-medium text-sm">Costes Operativos</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">Tinta {fmt(bInkCost)}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">Operario {fmt(bOpCost)}</span>
                    {bWaitCost > 0 && <span className="text-[10px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded font-bold">Espera {fmt(bWaitCost)}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-rose-500">−{fmt(results.machineBCost)}</span>
                  {monthlySavings > 0 && (
                    <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Ahorras {fmt(monthlySavings)}/mes vs A</p>
                  )}
                </div>
              </div>
            </div>
            {/* Renting row */}
            <div className="py-4 border-b border-gray-100 bg-gray-50 -mx-6 px-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-gray-700 font-bold text-sm">Cuota Financiación</span>
                  <p className="text-xs text-gray-400 mt-0.5">{data.rentingMonths} meses · {data.rentingInterest}% anual</p>
                </div>
                <span className="text-xl font-bold text-orange-600">−{fmt(results.monthlyRentingQuota)}</span>
              </div>
            </div>
            <div className="pt-5">
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-5">
                <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Beneficio Neto Final</p>
                <p className="text-4xl font-black text-amber-700">{fmt(results.machineBNetProfit)}</p>
                <p className="text-xs text-amber-500 mt-1">Ventas − Operativos − Financiación</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Summary bridge ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 rounded-2xl p-6 text-white mb-8"
      >
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Resumen mensual comparativo</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/8 rounded-xl p-4 border border-white/10">
            <p className="text-xs text-gray-400 mb-1">Coste A ({shortA.split(' ').slice(0, 2).join(' ')})</p>
            <p className="text-2xl font-black text-indigo-300">{fmt(results.machineACost)}</p>
          </div>
          <div className="bg-white/8 rounded-xl p-4 border border-white/10">
            <p className="text-xs text-gray-400 mb-1">Coste B ({shortB.split(' ').slice(0, 2).join(' ')})</p>
            <p className="text-2xl font-black text-amber-300">{fmt(results.machineBCost)}</p>
          </div>
          <div className="bg-white/8 rounded-xl p-4 border border-white/10">
            <p className="text-xs text-gray-400 mb-1">Diferencia mensual</p>
            <p className={`text-2xl font-black ${monthlySavings > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {monthlySavings > 0 ? '+' : ''}{fmt(monthlySavings)}
            </p>
            <p className="text-[10px] text-gray-500 mt-1">{monthlySavings > 0 ? 'B más barata' : 'A más barata'}</p>
          </div>
          <div className="bg-white/8 rounded-xl p-4 border border-white/10">
            <p className="text-xs text-gray-400 mb-1">Cuota financiación B</p>
            <p className="text-2xl font-black text-orange-300">−{fmt(results.monthlyRentingQuota)}</p>
            <p className="text-[10px] text-gray-500 mt-1">{data.rentingMonths} meses · {data.rentingInterest}%</p>
          </div>
        </div>
      </motion.div>

      {/* ── ROI Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-8 border border-gray-200"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-white">
            <TrendingDown size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ROI en {isFinite(results.roiMonths) ? `${results.roiMonths.toFixed(1)} meses` : '—'}
            </h2>
            <p className="text-gray-600 font-medium italic">Basado en la diferencia de costes operativos mensuales.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { label: 'Ahorro Mensual', val: fmt(monthlySavings) },
                { label: 'Ahorro Anual', val: fmt(annualSavings) },
                { label: 'Margen Extra', val: `${results.monthlyRevenue > 0 ? ((monthlySavings / results.monthlyRevenue) * 100).toFixed(1) : '0'}%` },
                { label: 'Retorno Anual', val: data.machineBPrice > 0 ? `${((annualSavings / data.machineBPrice) * 100).toFixed(0)}%` : '—' },
              ].map(({ label, val }) => (
                <div key={label} className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase">{label}</p>
                  <p className="text-lg font-bold text-gray-800">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Chart: monthly breakdown ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-lg text-gray-900">Desglose Mensual por Componente</h3>
        </div>
        <div className="h-[300px] w-full p-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyComparison}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={v => `€${v}`} />
              <Tooltip
                formatter={(v: number) => fmt(v)}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0/0.1)' }}
              />
              <Bar dataKey="A" name={shortA} fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="B" name={shortB} fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ── Formulas ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <AlertCircle size={20} className="text-blue-600" />
          <h3 className="font-bold text-lg text-gray-900">Fórmulas utilizadas (iguales para ambas máquinas)</h3>
        </div>
        <div className="p-6 space-y-2 text-sm text-gray-600">
          <p><span className="font-mono bg-gray-100 px-2 py-1 rounded">Coste Tinta = Volumen × Coste Tinta/m²</span></p>
          <p><span className="font-mono bg-gray-100 px-2 py-1 rounded">Coste Operario = (Horas Impresión + Mantenimiento × 4) × 20 €/h</span></p>
          <p><span className="font-mono bg-gray-100 px-2 py-1 rounded">Coste Espera = (Volumen ÷ 50 rollos) × 0.5h × 20 €/h  [si Secado &gt; 0h]</span></p>
          <p className="text-xs text-gray-400 pt-2">* Las mismas fórmulas se aplican simétricamente a Máquina A y Máquina B. Ninguna tiene ventaja de partida.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default CostBreakdown;
