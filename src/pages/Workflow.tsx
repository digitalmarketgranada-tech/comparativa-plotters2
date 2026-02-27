import React from 'react';
import { motion } from 'motion/react';
import { Clock, Users, Zap, BarChart3 } from 'lucide-react';
import { useData, ALL_MACHINES } from '../context/DataContext';

const Workflow: React.FC = () => {
  const { data, results } = useData();

  const fmt = (val: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const machineA = ALL_MACHINES.find(m => m.model === data.machineAModel);
  const machineB = ALL_MACHINES.find(m => m.model === data.machineBModel);
  const nameA = machineA?.model ?? 'Máquina A';
  const nameB = machineB?.model ?? 'Máquina B';
  const shortA = nameA.length > 22 ? nameA.slice(0, 22) + '…' : nameA;
  const shortB = nameB.length > 22 ? nameB.slice(0, 22) + '…' : nameB;

  const dryA = data.machineADryTime;
  const dryB = data.machineBDryTime;

  const WorkflowCard = ({
    title, subtitle, accentClass, headerClass, dryTime, speed, maintenance, color,
  }: {
    title: string; subtitle: string; accentClass: string; headerClass: string;
    dryTime: number; speed: number; maintenance: number; color: 'indigo' | 'amber';
  }) => {
    const isLatex = dryTime === 0;
    const barA = color === 'indigo' ? 'bg-indigo-500' : 'bg-amber-500';
    const barB = color === 'indigo' ? 'bg-indigo-200' : 'bg-amber-200';
    const labelColor = color === 'indigo' ? 'text-indigo-600' : 'text-amber-600';

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-2xl shadow-sm overflow-hidden border ${accentClass}`}
      >
        <div className={`${headerClass} px-6 py-4 flex items-center justify-between text-white`}>
          <h3 className="text-lg font-black truncate max-w-[55%]">{title}</h3>
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">{subtitle}</span>
        </div>

        <div className="p-6 space-y-5">
          {/* Timeline */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Línea de Tiempo — 1 trabajo</p>

            {/* Print bar */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-24 text-right text-xs text-gray-500 font-medium flex-shrink-0">Impresión</span>
              <div className="flex h-8 flex-1 rounded-lg overflow-hidden bg-gray-100 text-xs font-bold">
                <div className={`${barA} flex items-center justify-center text-white`} style={{ width: isLatex ? '40%' : '25%' }}>
                  Imprimir
                </div>
                <div className="bg-gray-50 flex-1 flex items-center justify-center text-gray-300 text-[10px]">libre</div>
              </div>
            </div>

            {/* Dry wait bar */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-24 text-right text-xs text-gray-500 font-medium flex-shrink-0">Secado</span>
              <div className="flex h-8 flex-1 rounded-lg overflow-hidden bg-gray-100 text-xs font-bold">
                {isLatex ? (
                  <div className="bg-emerald-100 flex items-center justify-center text-emerald-500 w-full text-[10px]">
                    ✅ Sin espera — curado interno
                  </div>
                ) : (
                  <>
                    <div className="bg-gray-50 text-gray-300 flex items-center justify-center" style={{ width: '25%' }} />
                    <div className="bg-orange-400 flex items-center justify-center text-white" style={{ width: '40%' }}>
                      ⏳ {dryTime}h espera
                    </div>
                    <div className="bg-gray-50 flex-1" />
                  </>
                )}
              </div>
            </div>

            {/* Cut bar */}
            <div className="flex items-center gap-2">
              <span className="w-24 text-right text-xs text-gray-500 font-medium flex-shrink-0">Corte</span>
              <div className="flex h-8 flex-1 rounded-lg overflow-hidden bg-gray-100 text-xs font-bold">
                {isLatex ? (
                  <>
                    <div className="bg-gray-100 flex items-center justify-center text-gray-300 text-[10px]" style={{ width: '40%' }}>libre (otro trabajo)</div>
                    <div className={`${barA} flex items-center justify-center text-white`} style={{ width: '25%' }}>Cortar ← inmediato</div>
                    <div className="flex-1 bg-gray-50" />
                  </>
                ) : (
                  <>
                    <div className="bg-gray-100 flex items-center justify-center text-gray-400 text-[10px]" style={{ width: '65%' }}>— bloqueado esperando —</div>
                    <div className={`${barA} flex items-center justify-center text-white`} style={{ width: '35%' }}>Cortar</div>
                  </>
                )}
              </div>
            </div>

            <p className={`text-xs font-semibold mt-2 ml-28 ${labelColor}`}>
              {isLatex
                ? '✓ El plotter puede trabajar en otro pedido mientras imprime'
                : `⚠ El plotter espera ${dryTime}h de desgasificación antes de cortar`
              }
            </p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-3">
            <div className={`rounded-xl p-3 text-center border ${color === 'indigo' ? 'bg-indigo-50 border-indigo-100' : 'bg-amber-50 border-amber-100'}`}>
              <p className="text-xl font-black text-gray-800">{speed}</p>
              <p className="text-[10px] text-gray-500 font-semibold">m²/h</p>
            </div>
            <div className={`rounded-xl p-3 text-center border ${color === 'indigo' ? 'bg-indigo-50 border-indigo-100' : 'bg-amber-50 border-amber-100'}`}>
              <p className={`text-xl font-black ${isLatex ? 'text-emerald-600' : 'text-rose-500'}`}>
                {dryTime === 0 ? '0h' : `${dryTime}h`}
              </p>
              <p className="text-[10px] text-gray-500 font-semibold">Secado</p>
            </div>
            <div className={`rounded-xl p-3 text-center border ${color === 'indigo' ? 'bg-indigo-50 border-indigo-100' : 'bg-amber-50 border-amber-100'}`}>
              <p className={`text-xl font-black ${maintenance === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {maintenance}h
              </p>
              <p className="text-[10px] text-gray-500 font-semibold">Mantenim./sem</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Flujo de Trabajo</h1>
        <p className="text-gray-500 mt-1">
          Comparativa de tiempos de producción entre{' '}
          <span className="text-indigo-600 font-semibold">{shortA}</span>
          {' '}y{' '}
          <span className="text-amber-600 font-semibold">{shortB}</span>.
        </p>
      </header>

      {/* KPI strip */}
      <div className="grid md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-black text-gray-900 mb-1">{data.monthlyVolume} m²</p>
          <p className="text-sm text-gray-500">Volumen mensual</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className={`text-3xl font-black mb-1 ${dryA !== dryB ? (dryB < dryA ? 'text-amber-600' : 'text-indigo-600') : 'text-gray-700'}`}>
            {Math.abs(dryA - dryB)}h
          </p>
          <p className="text-sm text-gray-500">Diferencia de espera</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className={`text-3xl font-black mb-1 ${results.monthlySavings > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
            {fmt(results.monthlySavings)}
          </p>
          <p className="text-sm text-gray-500">Ahorro mensual (B vs A)</p>
        </motion.div>
      </div>

      {/* Workflow cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <WorkflowCard
          title={shortA} subtitle="Máquina A"
          accentClass="border-indigo-100" headerClass="bg-indigo-600"
          dryTime={dryA} speed={data.machineASpeed} maintenance={data.machineAMaintenance}
          color="indigo"
        />
        <WorkflowCard
          title={shortB} subtitle="Máquina B"
          accentClass="border-amber-200" headerClass="bg-amber-500"
          dryTime={dryB} speed={data.machineBSpeed} maintenance={data.machineBMaintenance}
          color="amber"
        />
      </div>

      {/* Summary table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <h3 className="font-black text-gray-900">Comparativa de Flujo</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Aspecto</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-indigo-500 uppercase">{shortA}</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-amber-600 uppercase">{shortB}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { label: 'Velocidad (m²/h)', a: data.machineASpeed, b: data.machineBSpeed, lowerIsBetter: false },
                { label: 'Tiempo secado antes de corte', a: dryA, b: dryB, lowerIsBetter: true },
                { label: 'Mantenimiento (h/sem)', a: data.machineAMaintenance, b: data.machineBMaintenance, lowerIsBetter: true },
                { label: 'Coste tinta (€/m²)', a: data.machineAInkCost, b: data.machineBInkCost, lowerIsBetter: true },
              ].map((row, i) => {
                const better = row.lowerIsBetter ? (row.a < row.b ? 'a' : row.b < row.a ? 'b' : 'tie') : (row.a > row.b ? 'a' : row.b > row.a ? 'b' : 'tie');
                return (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-6 py-3.5 font-medium text-gray-700">{row.label}</td>
                    <td className={`px-4 py-3.5 text-center ${better === 'a' ? 'font-black text-emerald-600' : 'text-gray-500'}`}>
                      {better === 'a' ? '✅ ' : ''}{row.a}{typeof row.a === 'number' && row.label.includes('tinta') ? '' : ''}
                    </td>
                    <td className={`px-4 py-3.5 text-center ${better === 'b' ? 'font-black text-emerald-600' : 'text-gray-500'}`}>
                      {better === 'b' ? '✅ ' : ''}{row.b}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Economic summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-200 p-6"
      >
        <h3 className="font-black text-gray-900 mb-5">Resumen Económico del Flujo</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border-l-4 border-indigo-400 pl-5">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Coste Mensual A</p>
            <p className="text-2xl font-black text-gray-900">{fmt(results.machineACost)}</p>
            <p className="text-xs text-indigo-600 mt-1 font-medium">{shortA}</p>
          </div>
          <div className="border-l-4 border-amber-400 pl-5">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Coste Mensual B</p>
            <p className="text-2xl font-black text-gray-900">{fmt(results.machineBCost)}</p>
            <p className="text-xs text-amber-600 mt-1 font-medium">{shortB}</p>
          </div>
          <div className="border-l-4 border-emerald-400 pl-5">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Diferencia</p>
            <p className={`text-2xl font-black ${results.monthlySavings >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {fmt(results.monthlySavings)}
            </p>
            <p className="text-xs text-gray-500 mt-1">ROI B: {isFinite(results.roiMonths) ? `${results.roiMonths.toFixed(1)} meses` : '—'}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Workflow;
