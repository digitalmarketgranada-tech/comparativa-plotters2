import React from 'react';
import { useData, ALL_MACHINES } from '../context/DataContext';
import { motion } from 'motion/react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts';
import { TrendingDown, AlertCircle, ShieldAlert, TrendingUp, Euro, Clock } from 'lucide-react';

// ─── Tooltip personalizado para la gráfica de 5 años ─────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const fc = (v: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs min-w-[200px]">
      <p className="font-black text-gray-800 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-3 mb-1">
          <span style={{ color: p.color }} className="font-semibold">{p.name}</span>
          <span className="font-black text-gray-900">{fc(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const CostBreakdown: React.FC = () => {
  const { data, results } = useData();

  const fmt = (v: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);
  const fmt2 = (v: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);

  const machineA = ALL_MACHINES.find(m => m.model === data.machineAModel);
  const machineB = ALL_MACHINES.find(m => m.model === data.machineBModel);
  const nameA = machineA?.model ?? 'Máquina A';
  const nameB = machineB?.model ?? 'Máquina B';
  const shortA = nameA.length > 22 ? nameA.slice(0, 22) + '…' : nameA;
  const shortB = nameB.length > 22 ? nameB.slice(0, 22) + '…' : nameB;

  // ─ Desglose operativo mensual ──────────────────────────────────────────────
  const inkA = results.inkCostPerM2A || data.machineAInkCost;
  const inkB = results.inkCostPerM2B || data.machineBInkCost;

  const aInkCost = data.monthlyVolume * inkA;
  const aPrintH = data.monthlyVolume / (data.machineASpeed || 1);
  const aOpCost = (aPrintH + data.machineAMaintenance * 4) * 20;
  const aWaitCost = data.machineADryTime > 0 ? (data.monthlyVolume / 50) * 0.5 * 20 : 0;

  const volB = data.monthlyVolume * (1 + (data.growthRate || 0));
  const bInkCost = volB * inkB;
  const bPrintH = volB / (data.machineBSpeed || 1);
  const bOpCost = (bPrintH + data.machineBMaintenance * 4) * 20;
  const bWaitCost = data.machineBDryTime > 0 ? (volB / 50) * 0.5 * 20 : 0;

  const monthlySavings = results.machineACost - results.machineBCost;
  const annualSavings = monthlySavings * 12;

  // Datos para gráfica de barras (desglose mensual)
  const monthlyComparison = [
    { name: 'Tinta', A: Math.round(aInkCost), B: Math.round(bInkCost) },
    { name: 'Operario', A: Math.round(aOpCost), B: Math.round(bOpCost) },
    { name: 'Esperas', A: Math.round(aWaitCost), B: Math.round(bWaitCost) },
    { name: 'Cabezales', A: data.machineAHeadCostMonthly || 0, B: data.machineBHeadCostMonthly || 0 },
    { name: 'Amortiz.', A: Math.round(results.machineAAmortizationMonthly || 0), B: Math.round(results.machineBAmortizationMonthly || 0) },
  ];

  // Datos para gráfica 5 años (beneficio acumulado)
  const fiveYearData = (results.yearlyData || []).map(d => ({
    year: `Año ${d.year}`,
    [shortA]: Math.round(d.cumProfitA),
    [shortB]: Math.round(d.cumProfitB),
  }));

  const tcoSaving = results.tcoSavingsMonthly || 0;
  const payback = results.paybackMonthsTCO;
  const isLatexB = machineB?.technology === 'latex';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="mb-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Desglose de Costes</h1>
        <p className="text-gray-500 text-lg">
          TCO completo: <span className="font-semibold text-indigo-600">{shortA}</span> vs{' '}
          <span className="font-semibold text-amber-600">{shortB}</span>
          {(data.growthRate || 0) > 0 && (
            <span className="ml-2 text-sm text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg">
              +{((data.growthRate || 0) * 100).toFixed(0)}% crecimiento B
            </span>
          )}
        </p>
      </header>

      {/* ── KPI Cards TCO ── */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Ahorro TCO Mensual', value: fmt(tcoSaving), sub: 'incl. amortiz. + cabezales', color: tcoSaving >= 0 ? 'emerald' : 'rose', icon: TrendingDown },
          { label: 'Ahorro TCO Anual', value: fmt(results.tcoSavingsAnnual || 0), sub: 'Total Cost of Ownership', color: (results.tcoSavingsAnnual || 0) >= 0 ? 'emerald' : 'rose', icon: Euro },
          { label: 'Payback Real', value: isFinite(payback) ? `${payback.toFixed(1)} meses` : '—', sub: 'inversión vs ahorro TCO', color: isFinite(payback) && payback <= 36 ? 'sky' : 'amber', icon: Clock },
          { label: 'Ahorro Tinta €/m²', value: fmt2(inkA - inkB), sub: `A: ${fmt2(inkA)} · B: ${fmt2(inkB)}`, color: inkA >= inkB ? 'violet' : 'rose', icon: TrendingUp },
        ].map(({ label, value, sub, color, icon: Icon }) => {
          const bg: Record<string, string> = { emerald: 'bg-emerald-50 border-emerald-200', rose: 'bg-rose-50 border-rose-200', sky: 'bg-sky-50 border-sky-200', amber: 'bg-amber-50 border-amber-200', violet: 'bg-violet-50 border-violet-200' };
          const tc: Record<string, string> = { emerald: 'text-emerald-700', rose: 'text-rose-700', sky: 'text-sky-700', amber: 'text-amber-700', violet: 'text-violet-700' };
          return (
            <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl border p-4 ${bg[color]}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${tc[color]} bg-white/60`}>
                <Icon size={16} />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
              <p className={`text-xl font-black leading-tight ${tc[color]}`}>{value}</p>
              <p className="text-[10px] text-gray-400 mt-1">{sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── Tarjetas de beneficio mensual ── */}
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { name: shortA, cost: results.machineACost, tco: results.monthlyTCO_A || 0, profit: results.machineATCONetProfit || 0, revenue: results.monthlyRevenue, amort: results.machineAAmortizationMonthly || 0, head: data.machineAHeadCostMonthly || 0, color: 'indigo' },
          { name: shortB, cost: results.machineBCost, tco: results.monthlyTCO_B || 0, profit: results.machineBTCONetProfit || 0, revenue: results.monthlyRevenueB || results.monthlyRevenue, amort: results.machineBAmortizationMonthly || 0, head: data.machineBHeadCostMonthly || 0, color: 'amber' },
        ].map(({ name, cost, tco, profit, revenue, amort, head, color }) => {
          const header = color === 'indigo' ? 'bg-indigo-600' : 'bg-amber-500';
          const isBetter = color === 'amber' && profit > (results.machineATCONetProfit || 0);
          return (
            <motion.div key={name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className={`${header} px-5 py-3 flex items-center justify-between`}>
                <span className="text-white font-bold text-sm truncate max-w-[60%]">{name}</span>
                {isBetter && <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">MEJOR OPCIÓN</span>}
              </div>
              <div className="p-5 space-y-2.5">
                <div className="flex justify-between"><span className="text-sm text-gray-500">Ingresos mensuales</span><span className="font-bold text-gray-900">{fmt(revenue)}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-500">Coste operativo</span><span className="font-bold text-rose-600">−{fmt(cost)}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-500">Amortización</span><span className="font-bold text-orange-600">−{fmt(amort)}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-500">Cabezales/mes</span><span className="font-bold text-gray-600">−{fmt(head)}</span></div>
                <div className="border-t pt-2.5 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-700">TCO mensual total</span>
                  <span className="font-black text-gray-800">{fmt(tco)}</span>
                </div>
                <div className={`rounded-xl p-3 text-center ${profit >= 0 ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                  <p className="text-xs text-gray-500 mb-1">Beneficio neto (TCO)</p>
                  <p className={`text-2xl font-black ${profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{fmt(profit)}</p>
                  <p className="text-xs font-semibold text-gray-400 mt-0.5">{fmt(profit * 12)} / año</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Tabla TCO completa ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-900 px-5 py-4 flex items-center gap-3">
          <Euro size={18} className="text-purple-400" />
          <h2 className="font-bold text-white text-lg">TCO Mensual Detallado</h2>
          <span className="ml-auto text-gray-400 text-xs">Total Cost of Ownership</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase w-1/2">Concepto</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-indigo-500 uppercase">{shortA}</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-amber-600 uppercase">{shortB}</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-emerald-600 uppercase">Diferencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { label: 'Tinta (€/m² × volumen)', a: aInkCost, b: bInkCost },
                { label: 'Mano de obra operario', a: aOpCost, b: bOpCost },
                { label: 'Coste de esperas de secado', a: aWaitCost, b: bWaitCost },
                { label: 'Cabezales / mantenimiento', a: data.machineAHeadCostMonthly || 0, b: data.machineBHeadCostMonthly || 0 },
                { label: 'Amortización de la máquina', a: results.machineAAmortizationMonthly || 0, b: results.machineBAmortizationMonthly || 0 },
              ].map(({ label, a, b }, i) => {
                const diff = a - b;
                const bWins = b < a;
                return (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}>
                    <td className="px-5 py-3 text-gray-700 font-medium">{label}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${bWins ? 'text-rose-500' : 'text-emerald-600'}`}>{fmt(a)}</td>
                    <td className={`px-4 py-3 text-right font-bold ${bWins ? 'text-emerald-600' : 'text-rose-500'}`}>{fmt(b)}</td>
                    <td className={`px-4 py-3 text-right font-bold ${diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-rose-600' : 'text-gray-400'}`}>
                      {diff > 0 ? '+' : ''}{fmt(diff)}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-gray-900">
                <td className="px-5 py-3 font-black text-white">TOTAL TCO MENSUAL</td>
                <td className="px-4 py-3 text-right font-black text-rose-300">{fmt(results.monthlyTCO_A || 0)}</td>
                <td className="px-4 py-3 text-right font-black text-emerald-300">{fmt(results.monthlyTCO_B || 0)}</td>
                <td className={`px-4 py-3 text-right font-black text-lg ${tcoSaving >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {tcoSaving >= 0 ? '+' : ''}{fmt(tcoSaving)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {isFinite(payback) && tcoSaving > 0 && (
          <div className="px-5 py-3 bg-emerald-50 border-t border-emerald-100 flex items-center gap-2">
            <TrendingUp size={14} className="text-emerald-600 flex-shrink-0" />
            <p className="text-sm text-emerald-800">
              <strong>Payback real: {payback.toFixed(1)} meses</strong> — El ahorro TCO mensual ({fmt(tcoSaving)}) amortiza la inversión en HP Latex ({fmt(data.machineBPrice)}) en ese plazo.
            </p>
          </div>
        )}
      </motion.div>

      {/* ── Gráfica desglose mensual ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Desglose por Categoría — Coste Mensual</h2>
          <p className="text-xs text-gray-400 mt-0.5">Cada componente del TCO comparado</p>
        </div>
        <div className="p-5">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyComparison} barSize={28} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k€`} />
              <Tooltip formatter={(value: number) => fmt(value)} />
              <Legend formatter={(v: string) => v === 'A' ? shortA : shortB} />
              <Bar dataKey="A" fill="#6366f1" name="A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="B" fill="#f59e0b" name="B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ── Gráfica de beneficio acumulado 5 años ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-900 px-5 py-4 flex items-center gap-3">
          <TrendingUp size={18} className="text-emerald-400" />
          <div>
            <h2 className="font-bold text-white text-lg">Beneficio Acumulado — 5 Años</h2>
            <p className="text-gray-400 text-xs">Incluye amortización, cabezales y costes operativos completos (TCO total)</p>
          </div>
        </div>
        <div className="p-5">
          {fiveYearData.length > 0 && (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fiveYearData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k€`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <ReferenceLine y={0} stroke="#e5e7eb" strokeDasharray="4 4" />
                <Line type="monotone" dataKey={shortA} stroke="#6366f1" strokeWidth={2.5} dot={{ r: 5, fill: '#6366f1' }} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey={shortB} stroke="#f59e0b" strokeWidth={3} dot={{ r: 5, fill: '#f59e0b' }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          )}

          {/* Tabla resumen 5 años */}
          {results.yearlyData && results.yearlyData.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-3 py-2 text-gray-400 font-bold uppercase">Año</th>
                    <th className="text-right px-3 py-2 text-indigo-500 font-bold uppercase">Benef. A</th>
                    <th className="text-right px-3 py-2 text-amber-600 font-bold uppercase">Benef. B</th>
                    <th className="text-right px-3 py-2 text-indigo-400 font-bold uppercase">Acum. A</th>
                    <th className="text-right px-3 py-2 text-amber-500 font-bold uppercase">Acum. B</th>
                    <th className="text-right px-3 py-2 text-emerald-600 font-bold uppercase">Ventaja B</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {results.yearlyData.map(d => {
                    const advantage = d.cumProfitB - d.cumProfitA;
                    return (
                      <tr key={d.year} className="bg-white hover:bg-gray-50">
                        <td className="px-3 py-2 font-bold text-gray-700">Año {d.year}</td>
                        <td className={`px-3 py-2 text-right font-semibold ${d.profitA >= 0 ? 'text-gray-700' : 'text-rose-500'}`}>{fmt(d.profitA)}</td>
                        <td className={`px-3 py-2 text-right font-semibold ${d.profitB >= 0 ? 'text-gray-700' : 'text-rose-500'}`}>{fmt(d.profitB)}</td>
                        <td className={`px-3 py-2 text-right font-bold ${d.cumProfitA >= 0 ? 'text-indigo-600' : 'text-rose-500'}`}>{fmt(d.cumProfitA)}</td>
                        <td className={`px-3 py-2 text-right font-bold ${d.cumProfitB >= 0 ? 'text-amber-600' : 'text-rose-500'}`}>{fmt(d.cumProfitB)}</td>
                        <td className={`px-3 py-2 text-right font-black ${advantage >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {advantage >= 0 ? '+' : ''}{fmt(advantage)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Riesgo de Cabezales ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-orange-600 px-5 py-4 flex items-center gap-3">
          <ShieldAlert size={18} className="text-white" />
          <h2 className="font-bold text-white text-lg">Riesgo de Cabezales: Térmico vs Piezoeléctrico</h2>
        </div>
        <div className="p-5 grid md:grid-cols-2 gap-6">
          <div className={`rounded-xl border p-4 ${machineA?.technology !== 'latex' ? 'border-orange-200 bg-orange-50' : 'border-emerald-200 bg-emerald-50'}`}>
            <div className="flex items-center gap-2 mb-3">
              {machineA?.technology !== 'latex'
                ? <AlertCircle size={18} className="text-orange-600" />
                : <TrendingDown size={18} className="text-emerald-600" />}
              <h3 className={`font-bold text-sm ${machineA?.technology !== 'latex' ? 'text-orange-800' : 'text-emerald-800'}`}>
                {shortA} — {machineA?.technology === 'latex' ? 'Cabezal Térmico' : 'Cabezal Piezoeléctrico'}
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              {machineA?.technology !== 'latex' ? (
                <>
                  <p className="text-orange-700"><strong>Coste de reemplazo:</strong> 1.500–2.500 € por cabezal + servicio técnico</p>
                  <p className="text-orange-700"><strong>Sensibilidad:</strong> Alta. Se daña con paradas largas o mala conservación</p>
                  <p className="text-orange-700"><strong>Quién lo cambia:</strong> Solo servicio técnico certificado (días de espera)</p>
                  <p className="text-orange-700"><strong>Coste anual estimado:</strong> <strong>{fmt((data.machineAHeadCostMonthly || 0) * 12)}</strong>/año</p>
                </>
              ) : (
                <>
                  <p className="text-emerald-700"><strong>Consumible controlado:</strong> El operario lo cambia en minutos</p>
                  <p className="text-emerald-700"><strong>Sin sorpresas:</strong> Coste bajo y predecible</p>
                  <p className="text-emerald-700"><strong>Coste anual estimado:</strong> <strong>{fmt((data.machineAHeadCostMonthly || 0) * 12)}</strong>/año</p>
                </>
              )}
            </div>
          </div>

          <div className={`rounded-xl border p-4 ${isLatexB ? 'border-emerald-200 bg-emerald-50' : 'border-orange-200 bg-orange-50'}`}>
            <div className="flex items-center gap-2 mb-3">
              {isLatexB ? <TrendingDown size={18} className="text-emerald-600" /> : <AlertCircle size={18} className="text-orange-600" />}
              <h3 className={`font-bold text-sm ${isLatexB ? 'text-emerald-800' : 'text-orange-800'}`}>
                {shortB} — {isLatexB ? 'Cabezal Térmico HP' : 'Cabezal Piezoeléctrico'}
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              {isLatexB ? (
                <>
                  <p className="text-emerald-700"><strong>Consumible integrado:</strong> El operador lo cambia sin asistencia técnica</p>
                  <p className="text-emerald-700"><strong>Sin riesgo de avería catastrófica:</strong> Coste repartido y predecible</p>
                  <p className="text-emerald-700"><strong>Sin paradas no planificadas</strong> por obstrucción de cabezal</p>
                  <p className="text-emerald-700"><strong>Coste anual estimado:</strong> <strong>{fmt((data.machineBHeadCostMonthly || 0) * 12)}</strong>/año</p>
                </>
              ) : (
                <>
                  <p className="text-orange-700"><strong>Coste de reemplazo:</strong> 1.500–2.500 € por cabezal + servicio técnico</p>
                  <p className="text-orange-700"><strong>Coste anual estimado:</strong> <strong>{fmt((data.machineBHeadCostMonthly || 0) * 12)}</strong>/año</p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="px-5 pb-5">
          <div className={`rounded-xl p-4 border ${(data.machineAHeadCostMonthly || 0) > (data.machineBHeadCostMonthly || 0) ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Diferencia anual en cabezales:</strong>{' '}
              {fmt(((data.machineAHeadCostMonthly || 0) - (data.machineBHeadCostMonthly || 0)) * 12)} €/año a favor de la Máquina B.{' '}
              {machineA?.technology !== 'latex'
                ? 'Con tecnología piezo en Máquina A, un solo cabezal dañado puede costar más que todo el presupuesto anual de cabezales HP Latex.'
                : 'Ambas máquinas tienen tecnología de cabezal controlada.'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Resumen ahorro operativo ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="font-black text-gray-900 mb-4">Resumen Ahorro Operativo (sin amortización)</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border-l-4 border-indigo-400 pl-4">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Coste operativo mensual A</p>
            <p className="text-2xl font-black text-gray-900">{fmt(results.machineACost)}</p>
            <p className="text-xs text-indigo-600 mt-1 font-medium">{shortA}</p>
          </div>
          <div className="border-l-4 border-amber-400 pl-4">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Coste operativo mensual B</p>
            <p className="text-2xl font-black text-gray-900">{fmt(results.machineBCost)}</p>
            <p className="text-xs text-amber-600 mt-1 font-medium">{shortB}</p>
          </div>
          <div className="border-l-4 border-emerald-400 pl-4">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Ahorro operativo mensual</p>
            <p className={`text-2xl font-black ${monthlySavings >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {fmt(monthlySavings)}/mes
            </p>
            <p className="text-xs text-gray-500 mt-1">ROI operativo: {isFinite(results.roiMonths) ? `${results.roiMonths.toFixed(1)} meses` : '—'}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CostBreakdown;
