import React from 'react';
import { motion } from 'motion/react';
import { Clock, CheckCircle, AlertTriangle, Users, Zap, BarChart3 } from 'lucide-react';
import { useData } from '../context/DataContext';

const Workflow: React.FC = () => {
  const { data, results } = useData();

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Flujo de Trabajo</h1>
        <p className="text-gray-500 mt-1">Comparativa real de tiempos: impresión, laminación y corte.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center"
        >
          <p className="text-3xl font-black text-amber-600 mb-1">{data.monthlyVolume} m²</p>
          <p className="text-sm text-gray-500">Volumen mensual</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center"
        >
          <p className="text-3xl font-black text-emerald-600 mb-1">24-48h</p>
          <p className="text-sm text-gray-500">Espera eliminada con HP Latex</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center"
        >
          <p className="text-3xl font-black text-sky-600 mb-1">{formatCurrency(results.monthlySavings || 0)}</p>
          <p className="text-sm text-gray-500">Ahorro mensual total</p>
        </motion.div>
      </div>

      {/* ─── NOTA IMPORTANTE ─── */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
        <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={18} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-amber-900 text-sm mb-1">Contexto del flujo comparado</p>
          <p className="text-amber-800 text-sm leading-relaxed">
            En ambos sistemas, la <strong>impresora y el plotter de corte son dos máquinas independientes</strong>. El corte comienza siempre después de que finalice la impresión. La diferencia clave está en el tiempo de espera entre ambas fases, y en la <strong>disponibilidad del plotter durante la impresión</strong>.
          </p>
        </div>
      </div>

      {/* ─── FLUJO SOLVENTE ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden"
      >
        <div className="bg-rose-50 px-6 py-4 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-rose-500" size={20} />
            <h3 className="text-lg font-black text-gray-900">Roland / Mimaki / Epson — Eco-Solvente</h3>
          </div>
          <span className="text-xs font-bold bg-rose-100 text-rose-600 px-3 py-1 rounded-full uppercase">Sin laminado: solo corte</span>
        </div>

        <div className="p-6 space-y-6">
          {/* Timeline visual */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Línea de tiempo (ejemplo: 1 trabajo)</p>

            {/* Escenario A: Sin laminado */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Escenario A — <span className="text-rose-600 font-bold">Sin laminado</span> (más favorable)</p>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs text-gray-500 font-medium flex-shrink-0 text-right">Impresora</span>
                  <div className="flex h-8 flex-1 rounded-lg overflow-hidden bg-gray-100 text-xs font-bold">
                    <div className="bg-rose-400 flex items-center justify-center text-white" style={{ width: '30%' }}>Impresión</div>
                    <div className="bg-rose-200 flex items-center justify-center text-rose-700" style={{ width: '70%' }}>— libre —</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs text-gray-500 font-medium flex-shrink-0 text-right">Desgasific.</span>
                  <div className="flex h-8 flex-1 rounded-lg overflow-hidden bg-gray-100 text-xs font-bold">
                    <div className="bg-gray-200 flex items-center justify-center text-gray-400" style={{ width: '30%' }}></div>
                    <div className="bg-orange-400 flex items-center justify-center text-white" style={{ width: '40%' }}>⏳ 24-48h espera</div>
                    <div className="bg-gray-100 flex items-center justify-center text-gray-300" style={{ width: '30%' }}></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs text-gray-500 font-medium flex-shrink-0 text-right">Plotter corte</span>
                  <div className="flex h-8 flex-1 rounded-lg overflow-hidden bg-gray-100 text-xs font-bold">
                    <div className="bg-gray-100 flex items-center justify-center text-gray-300" style={{ width: '70%' }}>— bloqueado / en espera —</div>
                    <div className="bg-rose-500 flex items-center justify-center text-white" style={{ width: '30%' }}>Corte</div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-rose-600 font-semibold mt-2 ml-28">⚠ El plotter de corte está BLOQUEADO esperando la desgasificación (24-48h)</p>
            </div>

            {/* Escenario B: Con laminado */}
            <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
              <p className="text-xs font-semibold text-gray-500 mb-2">Escenario B — <span className="text-rose-700 font-bold">Con laminado</span></p>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs text-gray-500 font-medium flex-shrink-0 text-right">Impresión</span>
                  <div className="bg-rose-400 h-8 flex items-center justify-center text-white text-xs font-bold rounded-lg" style={{ width: '20%' }}>Imprimir</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs text-gray-500 font-medium flex-shrink-0 text-right">Desgasific.</span>
                  <div className="bg-orange-400 h-8 flex items-center justify-center text-white text-xs font-bold rounded-lg ml-[20%]" style={{ width: '40%' }}>⏳ 24-48h OBLIGATORIO</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs text-gray-500 font-medium flex-shrink-0 text-right">Laminado</span>
                  <div className="bg-amber-400 h-8 flex items-center justify-center text-white text-xs font-bold rounded-lg ml-[60%]" style={{ width: '25%' }}>Laminar</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs text-gray-500 font-medium flex-shrink-0 text-right">Plotter corte</span>
                  <div className="bg-rose-600 h-8 flex items-center justify-center text-white text-xs font-bold rounded-lg ml-[85%]" style={{ width: '15%' }}>Corte</div>
                </div>
              </div>
              <p className="text-xs text-rose-700 font-bold mt-2 ml-28">⛔ Pedido entregado en DÍA 3 mínimo. Plotter libre pero sin trabajo productivo hasta el final.</p>
            </div>
          </div>

          {/* Key limitation */}
          <div className="bg-rose-50 rounded-xl p-4 border border-rose-200">
            <p className="text-sm font-bold text-rose-900 mb-2">📌 Limitación estructural del eco-solvente:</p>
            <ul className="text-sm text-rose-800 space-y-1.5">
              <li>• El plotter de corte <strong>no puede trabajar en otro pedido</strong> si está esperando el material actual</li>
              <li>• Con laminado, el flujo es completamente secuencial: imprimir → esperar → laminar → cortar</li>
              <li>• Sin laminado se puede cortar antes, pero la espera de desgasificación sigue siendo obligatoria</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* ─── FLUJO HP LATEX ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl shadow-sm border-2 border-sky-300 overflow-hidden ring-4 ring-sky-50"
      >
        <div className="bg-gradient-to-r from-sky-600 to-blue-700 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <CheckCircle size={20} />
            <h3 className="text-lg font-black">HP Latex — Flujo Continuo</h3>
          </div>
          <span className="bg-emerald-400 text-emerald-900 text-[10px] font-black px-3 py-1 rounded-full uppercase">RECOMENDADO</span>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Línea de tiempo (ejemplo: 1 trabajo)</p>

            {/* Escenario A: Sin laminado */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Escenario A — <span className="text-emerald-600 font-bold">Sin laminado</span></p>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs text-gray-500 font-medium flex-shrink-0 text-right">HP Latex</span>
                  <div className="flex h-8 flex-1 rounded-lg overflow-hidden bg-gray-100 text-xs font-bold">
                    <div className="bg-sky-500 flex items-center justify-center text-white" style={{ width: '40%' }}>Impresión</div>
                    <div className="bg-sky-100 flex items-center justify-center text-sky-400" style={{ width: '60%' }}>— libre para otro trabajo —</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs text-gray-500 font-medium flex-shrink-0 text-right">Plotter corte</span>
                  <div className="flex h-8 flex-1 rounded-lg overflow-hidden bg-gray-100 text-xs font-bold">
                    <div className="bg-sky-100 flex items-center justify-center text-sky-400" style={{ width: '40%' }}>— libre (otro pedido) ✓</div>
                    <div className="bg-emerald-500 flex items-center justify-center text-white" style={{ width: '30%' }}>Cortar ← inmediato</div>
                    <div className="bg-emerald-100 flex items-center justify-center text-emerald-400" style={{ width: '30%' }}>libre</div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-sky-600 font-semibold mt-2 ml-28">✓ El plotter de corte trabaja en otros pedidos MIENTRAS el HP Latex imprime</p>
            </div>

            {/* Escenario B: Con laminado */}
            <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
              <p className="text-xs font-semibold text-gray-500 mb-2">Escenario B — <span className="text-sky-700 font-bold">Con laminado</span></p>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs text-gray-500 font-medium flex-shrink-0 text-right">HP Latex</span>
                  <div className="bg-sky-500 h-8 flex items-center justify-center text-white text-xs font-bold rounded-lg" style={{ width: '30%' }}>Imprime (curado al instante)</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs text-gray-500 font-medium flex-shrink-0 text-right">Laminado</span>
                  <div className="flex gap-0.5 ml-[30%]" style={{ width: '22%' }}>
                    <span className="text-xs text-emerald-600 font-bold flex items-center">← tras 1 minuto de enfriamiento</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs text-gray-500 font-medium flex-shrink-0 text-right"></span>
                  <div className="bg-amber-400 h-8 flex items-center justify-center text-white text-xs font-bold rounded-lg ml-[30%]" style={{ width: '25%' }}>Laminar</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs text-gray-500 font-medium flex-shrink-0 text-right">Plotter corte</span>
                  <div className="bg-emerald-500 h-8 flex items-center justify-center text-white text-xs font-bold rounded-lg ml-[55%]" style={{ width: '20%' }}>Cortar</div>
                </div>
              </div>
              <p className="text-xs text-emerald-700 font-bold mt-2 ml-28">✓ Pedido entregado en 2-3 horas. Sin esperas de desgasificación.</p>
            </div>
          </div>

          {/* Ventaja clave */}
          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-sky-50 rounded-xl p-4 border border-sky-100 text-center">
              <p className="text-2xl font-black text-sky-600 mb-1">0 min</p>
              <p className="text-xs text-gray-500 font-semibold">Espera de desgasificación</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 text-center">
              <p className="text-2xl font-black text-emerald-600 mb-1">1 min</p>
              <p className="text-xs text-gray-500 font-semibold">Enfriamiento para laminar</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-center">
              <p className="text-2xl font-black text-amber-600 mb-1">Libre</p>
              <p className="text-xs text-gray-500 font-semibold">Plotter corte durante impresión</p>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <p className="text-sm font-bold text-emerald-900 mb-2">✅ Ventaja estructural del HP Latex:</p>
            <ul className="text-sm text-emerald-800 space-y-1.5">
              <li>• La tinta se cura con calor <strong>dentro de la impresora</strong> — el material sale listo</li>
              <li>• <strong>Sin laminado:</strong> el plotter de corte puede trabajar en otro pedido mientras el HP Latex imprime</li>
              <li>• <strong>Con laminado:</strong> solo 1 minuto de enfriamiento, sin 24-48h de espera química</li>
              <li>• Capacidad de producir y entregar <strong>varios pedidos al día</strong> sin cuellos de botella</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* ─── TABLA RESUMEN ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <h3 className="font-black text-gray-900">Comparativa Resumen</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Situación</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-rose-500 uppercase">Roland / Mimaki / Epson</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-sky-600 uppercase">HP Latex</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { label: 'Plotter libre durante impresión', comp: '❌ No (mismo pedido bloquea)', hp: '✅ Sí (otro pedido puede cortar)' },
                { label: 'Tiempo entre impresión y corte (sin laminado)', comp: '⏳ 24-48h desgasificación', hp: '✅ 0h — inmediato' },
                { label: 'Tiempo entre impresión y laminado', comp: '⛔ 24-48h obligatorio', hp: '✅ ~1 min enfriamiento' },
                { label: 'Tiempo entre laminado y corte', comp: '30 min adicionales', hp: '30 min (igual)' },
                { label: 'Entrega total (sin laminado)', comp: '24-50h desde inicio', hp: '2-3h desde inicio' },
                { label: 'Entrega total (con laminado)', comp: '26-52h desde inicio', hp: '3-5h desde inicio' },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-6 py-3.5 font-medium text-gray-700">{row.label}</td>
                  <td className="px-4 py-3.5 text-center text-gray-600">{row.comp}</td>
                  <td className="px-4 py-3.5 text-center font-semibold text-gray-800">{row.hp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ─── ECONÓMICO ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-200 p-6"
      >
        <h3 className="font-black text-gray-900 mb-5">Resumen Económico</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border-l-4 border-rose-400 pl-5">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Coste Mensual (Solvente)</p>
            <p className="text-2xl font-black text-gray-900">{formatCurrency(results.currentMonthlyCost)}</p>
            <p className="text-xs text-gray-500 mt-1">Con esperas incluidas</p>
          </div>
          <div className="border-l-4 border-sky-400 pl-5">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Coste Mensual (HP Latex)</p>
            <p className="text-2xl font-black text-gray-900">{formatCurrency(results.hpMonthlyCost)}</p>
            <p className="text-xs text-gray-500 mt-1">Sin tiempos de espera</p>
          </div>
          <div className="border-l-4 border-emerald-400 pl-5">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Ahorro Mensual</p>
            <p className="text-2xl font-black text-emerald-600">{formatCurrency(results.monthlySavings || 0)}</p>
            <p className="text-xs text-emerald-600 mt-1">ROI en {results.roiMonths?.toFixed(1) || '—'} meses</p>
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default Workflow;
