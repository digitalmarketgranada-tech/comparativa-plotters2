import React from 'react';
import { motion } from 'motion/react';
import { Clock, Zap, Package, ArrowRight, CheckCircle2, XCircle, Layers, TrendingDown, Euro, Calculator } from 'lucide-react';
import { useData, ALL_MACHINES } from '../context/DataContext';

// Modelos que son mesas planas (UV flatbed) — no rollo a rollo
const FLATBED_KEYWORDS = ['JFX', 'LEJ', 'UJ-330H', 'Kudu', 'Nyala', 'Topi', 'Impala', 'Oryx', 'Anapurna', 'Jeti Tauro', 'Arizona', 'V7000', 'CO-640', 'XpertJet 14'];
const isFlatbed = (model: string) => FLATBED_KEYWORDS.some(k => model.includes(k));
const isR530model = (model: string) => model.includes('R530');

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
      <div className="grid grid-cols-1 gap-6">
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

      {/* ── Sección exclusiva: Print & Mount ROI (solo cuando R530 está en la comparativa) ── */}
      {(isR530model(nameA) || isR530model(nameB)) && (() => {
        // Cálculo basado en la herramienta oficial HP "Print and Mount Cost Calculator EMEA"
        // Parámetros por defecto: vinilo €2.50/m², laminado €2.50/m² (70% planchas),
        // montaje manual A0: 7 min/plancha, operario €20/h → total €6.58/m² extra
        const VINYL_COST = 2.50;         // €/m²
        const LAMINATE_COST = 2.50;      // €/m² (70% laminado)
        const LAMINATE_RATE = 0.70;
        const LABOR_RATE = 20;           // €/h operario
        const MOUNT_MIN_PER_M2 = 7;      // min por plancha A0 (1m²) — HP Excel oficial

        const vol = data.monthlyVolume || 150;
        const vinyLaborMin = vol * MOUNT_MIN_PER_M2;
        const vinyLaborH = vinyLaborMin / 60;
        const vinyLaborCost = vinyLaborH * LABOR_RATE;
        const vinylMaterialCost = vol * VINYL_COST;
        const laminateCost = vol * LAMINATE_RATE * LAMINATE_COST;
        const totalPrintMountSaving = Math.round(vinylMaterialCost + laminateCost + vinyLaborCost);
        const savingPerM2 = (totalPrintMountSaving / vol);
        const annualSaving = totalPrintMountSaving * 12;
        const r530Price = 35000;
        const paybackMonths = totalPrintMountSaving > 0 ? Math.ceil(r530Price / totalPrintMountSaving) : null;

        const fmt = (v: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);
        const fmt2 = (v: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);

        return (
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-2xl overflow-hidden border border-emerald-200 shadow-sm"
          >
            {/* Header */}
            <div className="bg-emerald-700 px-6 py-5 flex items-center gap-3">
              <Calculator size={20} className="text-emerald-200" />
              <div>
                <h2 className="font-black text-white text-lg leading-tight">Ahorro Real con Impresión Directa en Rígido</h2>
                <p className="text-emerald-200 text-xs mt-0.5">
                  La HP R530 elimina el flujo print &amp; mount tradicional — datos de la herramienta oficial HP EMEA
                </p>
              </div>
            </div>

            <div className="bg-white p-6 space-y-6">

              {/* Explicación del problema */}
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm font-bold text-amber-800 mb-2">¿Qué es el flujo Print &amp; Mount?</p>
                <p className="text-sm text-amber-700 leading-relaxed">
                  La mayoría de talleres que no tienen impresora de rígido hacen: <strong>imprimir en vinilo
                  autodesalvo → laminar → cortar → montar manualmente sobre el soporte rígido</strong>.
                  Cada paso cuesta tiempo y material. La R530 <strong>elimina todo ese flujo</strong>
                  imprimiendo directamente sobre la plancha rígida.
                </p>
              </div>

              {/* Comparativa de flujos */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                  <p className="text-xs font-bold text-rose-500 uppercase mb-3">Sin HP R530 — Print &amp; Mount</p>
                  <div className="space-y-2">
                    {[
                      { item: 'Vinilo autoadhesivo', cost: fmt2(VINYL_COST) + '/m²' },
                      { item: `Laminado (${(LAMINATE_RATE * 100).toFixed(0)}% de planchas)`, cost: fmt2(LAMINATE_COST * LAMINATE_RATE) + '/m²' },
                      { item: `Montaje manual (${MOUNT_MIN_PER_M2} min/m² × ${fmt(LABOR_RATE)}/h)`, cost: fmt2(MOUNT_MIN_PER_M2 / 60 * LABOR_RATE) + '/m²' },
                    ].map((r, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-rose-700">{r.item}</span>
                        <span className="font-black text-rose-600">{r.cost}</span>
                      </div>
                    ))}
                    <div className="border-t border-rose-300 pt-2 flex justify-between items-center">
                      <span className="font-black text-rose-800 text-sm">Coste extra total</span>
                      <span className="font-black text-rose-600 text-lg">{fmt2(savingPerM2)}/m²</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-bold text-emerald-500 uppercase mb-3">Con HP R530 — Impresión directa</p>
                  <div className="space-y-2">
                    {[
                      { item: 'Vinilo autodesalvo', cost: '€0' },
                      { item: 'Laminado', cost: '€0 (papel reciclable)' },
                      { item: 'Montaje manual', cost: '€0 (impresión directa)' },
                    ].map((r, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-emerald-700">{r.item}</span>
                        <span className="font-black text-emerald-600">{r.cost}</span>
                      </div>
                    ))}
                    <div className="border-t border-emerald-300 pt-2 flex justify-between items-center">
                      <span className="font-black text-emerald-800 text-sm">Coste extra total</span>
                      <span className="font-black text-emerald-600 text-lg">€0,00/m²</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculadora con volumen real del cliente */}
              <div className="rounded-2xl bg-slate-900 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Euro size={16} className="text-cyan-400" />
                  <p className="text-sm font-bold text-white">
                    Con los <span className="text-cyan-400">{vol} m²/mes</span> de tu cliente — ahorro estimado
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Ahorro vinilo + laminado', value: fmt(vinylMaterialCost + laminateCost), sub: '/mes', color: 'text-amber-300' },
                    { label: 'Ahorro mano de obra montaje', value: fmt(vinyLaborCost), sub: '/mes', color: 'text-cyan-300' },
                    { label: 'Ahorro total mensual', value: fmt(totalPrintMountSaving), sub: '/mes', color: 'text-emerald-400' },
                    { label: 'Ahorro anual', value: fmt(annualSaving), sub: '/año', color: 'text-emerald-300' },
                  ].map(({ label, value, sub, color }) => (
                    <div key={label} className="bg-white/8 rounded-xl p-3 text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{label}</p>
                      <p className={`text-xl font-black ${color}`}>{value}</p>
                      <p className="text-[10px] text-slate-500">{sub}</p>
                    </div>
                  ))}
                </div>

                {paybackMonths && (
                  <div className="mt-4 rounded-xl bg-emerald-600/20 border border-emerald-500/30 px-4 py-3 flex items-center gap-3">
                    <TrendingDown size={18} className="text-emerald-400 flex-shrink-0" />
                    <p className="text-sm text-emerald-200">
                      <strong className="text-emerald-300">Payback del R530 solo con el ahorro Print &amp; Mount:</strong>{' '}
                      {paybackMonths} meses — sin contar el ahorro en costes de tinta ni mayor productividad.
                    </p>
                  </div>
                )}
              </div>

              {/* Testimonios reales de clientes HP */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm italic text-slate-700 leading-relaxed">
                    "La impresión directa en soportes rígidos nos ahorrará <strong>10 €/m²</strong>,
                    contando el SAV, el laminado y la mano de obra para montar."
                  </p>
                  <p className="text-xs text-slate-500 mt-2 font-semibold">— GS Graphixx (Alemania) · Cliente HP Latex 365</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm italic text-slate-700 leading-relaxed">
                    "Tenemos que hacer impresión en flexible y laminar en el <strong>40% de los proyectos</strong>
                    con aplicaciones rígidas debido a la diferencia de calidad con el Mimaki JFX200."
                  </p>
                  <p className="text-xs text-slate-500 mt-2 font-semibold">— XL Print (Francia) · Ahora con R530</p>
                </div>
              </div>

            </div>
          </motion.div>
        );
      })()}

      {/* ── Sección exclusiva: Mesas Planas ── */}
      {(isFlatbed(nameA) || isFlatbed(nameB) || isR530model(nameA) || isR530model(nameB)) && (() => {
        const hasFlatbedA = isFlatbed(nameA);
        const hasFlatbedB = isFlatbed(nameB);
        const hasR530A    = isR530model(nameA);
        const hasR530B    = isR530model(nameB);
        const flatbedName = hasFlatbedA ? shortA : hasFlatbedB ? shortB : null;
        const r530Name    = hasR530A ? shortA : hasR530B ? shortB : null;

        return (
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
          >
            {/* Header */}
            <div className="bg-slate-900 px-6 py-5 flex items-center gap-3">
              <Layers size={20} className="text-cyan-400" />
              <div>
                <h2 className="font-black text-white text-lg leading-tight">Mesas Planas: Flujo de Trabajo Real</h2>
                <p className="text-slate-400 text-xs mt-0.5">Carga manual vs cinta de arrastre continua</p>
              </div>
            </div>

            <div className="bg-white p-6 space-y-6">

              {/* Comparativa visual de pasos */}
              <div className="grid md:grid-cols-2 gap-5">

                {/* — Mesa plana tradicional — */}
                <div className="rounded-2xl border border-rose-200 bg-rose-50 overflow-hidden">
                  <div className="bg-rose-600 px-4 py-3 flex items-center gap-2">
                    <XCircle size={16} className="text-white" />
                    <span className="text-white font-bold text-sm">
                      {flatbedName ?? 'Mesa Plana UV'} — Carga Manual
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    {[
                      { icon: '📦', label: 'Colocar plancha', detail: 'El operario la posiciona y activa vacío', time: '~1–2 min', bad: false },
                      { icon: '🖨️', label: 'Imprimir', detail: 'El cabezal recorre la plancha', time: 'variable', bad: false },
                      { icon: '⏸️', label: 'Esperar retorno del cabezal', detail: 'El carro vuelve a posición inicial', time: '~30–60 s', bad: true },
                      { icon: '📤', label: 'Retirar plancha impresa', detail: 'Desactivar vacío + retirar manualmente', time: '~1–2 min', bad: true },
                      { icon: '🔁', label: 'Repetir desde el paso 1', detail: 'La máquina queda parada entre planchas', time: 'cada vez', bad: true },
                    ].map((step, i) => (
                      <div key={i} className={`flex items-start gap-3 rounded-xl px-3 py-2.5 ${step.bad ? 'bg-rose-100' : 'bg-white'}`}>
                        <span className="text-xl leading-none mt-0.5">{step.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-sm font-bold ${step.bad ? 'text-rose-800' : 'text-gray-800'}`}>{step.label}</p>
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded whitespace-nowrap ${step.bad ? 'bg-rose-200 text-rose-700' : 'bg-gray-100 text-gray-500'}`}>{step.time}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5">{step.detail}</p>
                        </div>
                      </div>
                    ))}
                    <div className="mt-3 rounded-xl bg-rose-200/60 px-3 py-2.5 flex items-center gap-2">
                      <Clock size={14} className="text-rose-700 flex-shrink-0" />
                      <p className="text-xs font-bold text-rose-800">Tiempo muerto entre planchas: <span className="text-rose-600">3–5 minutos</span> — la máquina espera al operario</p>
                    </div>
                  </div>
                </div>

                {/* — HP R530 cinta de arrastre — */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 overflow-hidden">
                  <div className="bg-emerald-600 px-4 py-3 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-white" />
                    <span className="text-white font-bold text-sm">
                      {r530Name ?? 'HP Latex R530'} — Cinta de Arrastre
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    {[
                      { icon: '📦', label: 'Cargar primera plancha', detail: 'Se desliza sobre la cinta de arrastre', time: '~30 s', bad: false },
                      { icon: '🖨️', label: 'Imprimir en movimiento', detail: 'La cinta avanza mientras imprime', time: 'continuo', bad: false },
                      { icon: '➡️', label: 'Insertar siguiente plancha', detail: 'Se introduce POR DETRÁS mientras la anterior sigue imprimiéndose', time: 'simultáneo', bad: false },
                      { icon: '✅', label: 'Plancha sale lista por delante', detail: 'Sin retorno de cabezal, sin espera', time: '0 s muerto', bad: false },
                      { icon: '🔄', label: 'Flujo continuo sin paradas', detail: 'El operario solo alimenta; la máquina nunca para', time: 'siempre activa', bad: false },
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl px-3 py-2.5 bg-white">
                        <span className="text-xl leading-none mt-0.5">{step.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-bold text-gray-800">{step.label}</p>
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 whitespace-nowrap">{step.time}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5">{step.detail}</p>
                        </div>
                      </div>
                    ))}
                    <div className="mt-3 rounded-xl bg-emerald-200/60 px-3 py-2.5 flex items-center gap-2">
                      <Zap size={14} className="text-emerald-700 flex-shrink-0" />
                      <p className="text-xs font-bold text-emerald-800">Tiempo muerto entre planchas: <span className="text-emerald-600">≈ 0 — flujo continuo</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Diagrama animado de cinta */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Diagrama — Cinta de Arrastre HP R530</p>
                <div className="flex items-center gap-1 overflow-x-auto pb-2">
                  {/* Operario carga */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
                    <div className="w-16 h-10 rounded-lg bg-slate-200 border border-slate-300 flex items-center justify-center">
                      <Package size={18} className="text-slate-500" />
                    </div>
                    <p className="text-[9px] text-slate-500 font-bold text-center">CARGA</p>
                  </div>
                  <ArrowRight size={14} className="text-slate-400 flex-shrink-0" />
                  {/* Plancha 3 - entrando */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
                    <div className="w-20 h-10 rounded-lg bg-amber-100 border-2 border-amber-300 flex items-center justify-center">
                      <p className="text-[10px] font-black text-amber-700">Plancha 3</p>
                    </div>
                    <p className="text-[9px] text-amber-600 font-bold">entrando</p>
                  </div>
                  <ArrowRight size={14} className="text-slate-400 flex-shrink-0" />
                  {/* Zona de impresión */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
                    <div className="w-24 h-10 rounded-lg bg-cyan-100 border-2 border-cyan-400 flex items-center justify-center gap-1">
                      <p className="text-[10px] font-black text-cyan-700">🖨️ Plancha 2</p>
                    </div>
                    <p className="text-[9px] text-cyan-600 font-bold text-center">IMPRIMIENDO</p>
                  </div>
                  <ArrowRight size={14} className="text-slate-400 flex-shrink-0" />
                  {/* Plancha 1 saliendo */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
                    <div className="w-20 h-10 rounded-lg bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center">
                      <p className="text-[10px] font-black text-emerald-700">✅ Plancha 1</p>
                    </div>
                    <p className="text-[9px] text-emerald-600 font-bold">lista</p>
                  </div>
                  <ArrowRight size={14} className="text-slate-400 flex-shrink-0" />
                  {/* Salida */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
                    <div className="w-16 h-10 rounded-lg bg-emerald-200 border border-emerald-300 flex items-center justify-center">
                      <CheckCircle2 size={18} className="text-emerald-600" />
                    </div>
                    <p className="text-[9px] text-emerald-600 font-bold text-center">SALIDA</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-3">Tres planchas en la cinta simultáneamente: una entrando, una imprimiéndose, una saliendo lista.</p>
              </div>

              {/* Impacto real en producción */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-center">
                  <p className="text-xs text-rose-500 font-bold uppercase mb-1">Mesa Plana — Tiempo muerto</p>
                  <p className="text-3xl font-black text-rose-600">3–5 min</p>
                  <p className="text-[11px] text-rose-500 mt-1">por plancha entre carga y descarga</p>
                </div>
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
                  <p className="text-xs text-emerald-500 font-bold uppercase mb-1">HP R530 — Tiempo muerto</p>
                  <p className="text-3xl font-black text-emerald-600">≈ 0</p>
                  <p className="text-[11px] text-emerald-500 mt-1">cinta continua, sin paradas entre planchas</p>
                </div>
                <div className="rounded-xl bg-slate-800 border border-slate-700 p-4 text-center">
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">En jornada de 8h</p>
                  <p className="text-2xl font-black text-cyan-400">+30–40%</p>
                  <p className="text-[11px] text-slate-400 mt-1">más planchas producidas con la cinta vs carga manual</p>
                </div>
              </div>

            </div>
          </motion.div>
        );
      })()}
    </div>
  );
};

export default Workflow;
