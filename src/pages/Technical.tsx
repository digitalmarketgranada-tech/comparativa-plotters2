import React from 'react';
import { motion } from 'motion/react';
import { useData, ALL_MACHINES } from '../context/DataContext';
import { Hourglass, Wind, Leaf, Monitor, Cloud, BarChart3, Wifi, Package, Zap, Clock, DollarSign, Wrench } from 'lucide-react';

const Technical: React.FC = () => {
  const { data } = useData();

  const machineA = ALL_MACHINES.find(m => m.model === data.machineAModel);
  const machineB = ALL_MACHINES.find(m => m.model === data.machineBModel);
  const nameA = machineA?.model ?? 'Máquina A';
  const nameB = machineB?.model ?? 'Máquina B';
  const shortA = nameA.length > 22 ? nameA.slice(0, 22) + '…' : nameA;
  const shortB = nameB.length > 22 ? nameB.slice(0, 22) + '…' : nameB;

  const techLabel = (m: typeof machineA) => {
    if (!m) return 'Eco-Solvente';
    return m.technology === 'latex' ? 'Tinta Látex' : 'Eco-Solvente';
  };

  type WinSide = 'a' | 'b' | 'tie';
  const w = (lower: boolean, a: number, b: number): WinSide =>
    lower ? (b < a ? 'b' : a < b ? 'a' : 'tie') : (b > a ? 'b' : a > b ? 'a' : 'tie');

  const rows: { label: string; icon: React.ElementType; a: string; b: string; winner: WinSide }[] = [
    { label: 'Velocidad de impresión', icon: Zap, a: `${data.machineASpeed} m²/h`, b: `${data.machineBSpeed} m²/h`, winner: w(false, data.machineASpeed, data.machineBSpeed) },
    { label: 'Coste de tinta', icon: DollarSign, a: `${data.machineAInkCost.toFixed(2)} €/m²`, b: `${data.machineBInkCost.toFixed(2)} €/m²`, winner: w(true, data.machineAInkCost, data.machineBInkCost) },
    { label: 'Tiempo de secado', icon: Hourglass, a: data.machineADryTime === 0 ? '0h — instantáneo' : `${data.machineADryTime}h espera`, b: data.machineBDryTime === 0 ? '0h — instantáneo' : `${data.machineBDryTime}h espera`, winner: w(true, data.machineADryTime, data.machineBDryTime) },
    { label: 'Mantenimiento semanal', icon: Wrench, a: `${data.machineAMaintenance}h/sem`, b: `${data.machineBMaintenance}h/sem`, winner: w(true, data.machineAMaintenance, data.machineBMaintenance) },
    { label: 'Tecnología de tinta', icon: Leaf, a: techLabel(machineA), b: techLabel(machineB), winner: 'tie' },
    { label: 'Precio referencia', icon: DollarSign, a: `${data.machineAPrice.toLocaleString('es-ES')} €`, b: `${data.machineBPrice.toLocaleString('es-ES')} €`, winner: w(true, data.machineAPrice, data.machineBPrice) },
  ];

  const winnerBadge = (side: 'a' | 'b' | 'tie', col: 'a' | 'b') => {
    if (side === 'tie') return '';
    if (side === col) return ' font-black text-emerald-600';
    return ' text-gray-400';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Detalle Técnico</h1>
        <p className="text-gray-500 mt-1">
          Comparativa técnica objetiva entre{' '}
          <span className="text-indigo-600 font-semibold">{shortA}</span>
          {' '}y{' '}
          <span className="text-amber-600 font-semibold">{shortB}</span>.
        </p>
      </header>

      {/* ── Top cards ── */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Machine A card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl overflow-hidden border border-indigo-100 shadow-sm"
        >
          <div className="bg-indigo-600 px-5 py-4 flex justify-between items-center">
            <span className="text-white font-bold">Máquina A</span>
            <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg max-w-[160px] truncate">{shortA}</span>
          </div>
          <div className="p-5 space-y-4">
            {[
              { icon: Zap, label: 'Velocidad', val: `${data.machineASpeed} m²/h` },
              { icon: DollarSign, label: 'Tinta', val: `${data.machineAInkCost.toFixed(2)} €/m²` },
              { icon: Hourglass, label: 'Secado', val: data.machineADryTime === 0 ? 'Instantáneo' : `${data.machineADryTime}h` },
              { icon: Wrench, label: 'Mantenimiento', val: `${data.machineAMaintenance}h/sem` },
              { icon: Wind, label: 'Tecnología', val: techLabel(machineA) },
            ].map(({ icon: Icon, label, val }, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                  <p className="text-base font-black text-gray-900">{val}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Machine B card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl overflow-hidden border border-amber-200 shadow-sm"
        >
          <div className="bg-amber-500 px-5 py-4 flex justify-between items-center">
            <span className="text-white font-bold">Máquina B</span>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded-lg max-w-[160px] truncate">{shortB}</span>
          </div>
          <div className="p-5 space-y-4">
            {[
              { icon: Zap, label: 'Velocidad', val: `${data.machineBSpeed} m²/h` },
              { icon: DollarSign, label: 'Tinta', val: `${data.machineBInkCost.toFixed(2)} €/m²` },
              { icon: Hourglass, label: 'Secado', val: data.machineBDryTime === 0 ? 'Instantáneo' : `${data.machineBDryTime}h` },
              { icon: Wrench, label: 'Mantenimiento', val: `${data.machineBMaintenance}h/sem` },
              { icon: Wind, label: 'Tecnología', val: techLabel(machineB) },
            ].map(({ icon: Icon, label, val }, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                  <p className="text-base font-black text-gray-900">{val}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Comparison table ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="bg-gray-900 px-6 py-5 flex items-center justify-between">
          <h2 className="font-black text-white text-lg">Tabla Comparativa</h2>
          <span className="text-gray-400 text-xs">✅ = mejor en esta categoría</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Parámetro</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-indigo-500 uppercase">
                  Máq. A — {shortA}
                </th>
                <th className="text-center px-4 py-3 text-xs font-bold text-amber-600 uppercase">
                  Máq. B — {shortB}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((row, i) => {
                const IconC = row.icon;
                return (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-6 py-3.5 font-medium text-gray-700 flex items-center gap-2">
                      <IconC size={15} className="text-gray-400" />
                      {row.label}
                    </td>
                    <td className={`px-4 py-3.5 text-center${winnerBadge(row.winner, 'a')}`}>
                      {row.winner === 'a' ? '✅ ' : ''}{row.a}
                    </td>
                    <td className={`px-4 py-3.5 text-center${winnerBadge(row.winner, 'b')}`}>
                      {row.winner === 'b' ? '✅ ' : ''}{row.b}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400 italic">* Los parámetros se toman de los valores introducidos en la calculadora.</p>
        </div>
      </motion.div>

      {/* ── Software / cloud ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="bg-gray-900 px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
            <Cloud size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-black text-white text-lg leading-tight">Ecosistema de Software</h2>
            <p className="text-gray-400 text-xs">Capacidades de gestión y conectividad por fabricante</p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {[
              { icon: Wifi, color: 'bg-sky-50 text-sky-600 border-sky-100', title: 'Monitorización remota', hp: '✅ HP PrintOS Live', other: '⚠ Local / limitado' },
              { icon: BarChart3, color: 'bg-violet-50 text-violet-600 border-violet-100', title: 'Analíticas producción', hp: '✅ HP Print Beat', other: '⚠ Parcial / RIP' },
              { icon: Package, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', title: 'Recepción archivos Web', hp: '✅ HP PrintOS Box', other: '❌ No' },
              { icon: Zap, color: 'bg-amber-50 text-amber-600 border-amber-100', title: 'API abierta / integraciones', hp: '✅ Incluida', other: '❌ No' },
            ].map(({ icon: Icon, color, title, hp, other }, i) => (
              <div key={i} className="rounded-xl p-4 border bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-3 ${color}`}>
                  <Icon size={18} />
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-2">{title}</h4>
                <p className="text-xs text-gray-500">
                  <span className="font-semibold text-sky-700">HP Latex:</span> {hp}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  <span className="font-semibold text-gray-600">Roland / Mimaki / Epson:</span> {other}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 italic">* HP PrintOS es una plataforma cloud gratuita exclusiva de impresoras HP Latex. Los competidores ofrecen variantes más limitadas o de pago.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Technical;
