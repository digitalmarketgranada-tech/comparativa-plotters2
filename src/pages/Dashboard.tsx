import React from 'react';
import { useData, ALL_MACHINES } from '../context/DataContext';
import {
  TrendingUp, Clock, Euro, ArrowRight, Zap, GitCompare,
  DollarSign, ShieldCheck, TrendingDown, BarChart3, FileText, AlertTriangle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import GlowButton from '../components/GlowButton';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts';

const Dashboard: React.FC = () => {
  const { results, data } = useData();
  const navigate = useNavigate();

  const fmt = (val: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  const fmt2 = (val: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

  const machineA = ALL_MACHINES.find(m => m.model === data.machineAModel);
  const machineB = ALL_MACHINES.find(m => m.model === data.machineBModel);
  const shortA = (machineA?.model ?? 'Máquina A').length > 20 ? (machineA?.model ?? '').slice(0, 20) + '…' : (machineA?.model ?? 'Máquina A');
  const shortB = (machineB?.model ?? 'Máquina B').length > 20 ? (machineB?.model ?? '').slice(0, 20) + '…' : (machineB?.model ?? 'Máquina B');

  const tcoSaving = results.tcoSavingsMonthly || 0;
  const bIsBetter = tcoSaving > 0;
  const payback = results.paybackMonthsTCO;
  const inkA = results.inkCostPerM2A || data.machineAInkCost;
  const inkB = results.inkCostPerM2B || data.machineBInkCost;

  // Datos para gráfica de barras de costes mensuales TCO
  const costsData = [
    { name: 'Operativo', A: Math.round(results.machineACost), B: Math.round(results.machineBCost) },
    { name: 'Cabezales', A: data.machineAHeadCostMonthly || 0, B: data.machineBHeadCostMonthly || 0 },
    { name: 'Amortiz.', A: Math.round(results.machineAAmortizationMonthly || 0), B: Math.round(results.machineBAmortizationMonthly || 0) },
    { name: 'Total TCO', A: Math.round(results.monthlyTCO_A || 0), B: Math.round(results.monthlyTCO_B || 0) },
  ];

  // Datos para radar (puntuaciones 0-10 normalizadas)
  const maxSpeed = Math.max(data.machineASpeed, data.machineBSpeed, 1);
  const maxPrice = Math.max(data.machineAPrice, data.machineBPrice, 1);
  const maxInk = Math.max(inkA, inkB, 0.01);
  const maxHead = Math.max(data.machineAHeadCostMonthly || 1, data.machineBHeadCostMonthly || 1, 1);

  const radarData = [
    { subject: 'Velocidad',   A: Math.round((data.machineASpeed / maxSpeed) * 10), B: Math.round((data.machineBSpeed / maxSpeed) * 10) },
    { subject: 'Bajo coste\ntinta', A: Math.round((1 - inkA / maxInk) * 10), B: Math.round((1 - inkB / maxInk) * 10) },
    { subject: 'Bajo mantenim.', A: data.machineAMaintenance === 0 ? 10 : Math.round((1 - Math.min(data.machineAMaintenance, 3) / 3) * 10), B: data.machineBMaintenance === 0 ? 10 : Math.round((1 - Math.min(data.machineBMaintenance, 3) / 3) * 10) },
    { subject: 'Secado rápido', A: data.machineADryTime === 0 ? 10 : Math.round((1 - Math.min(data.machineADryTime, 48) / 48) * 10), B: data.machineBDryTime === 0 ? 10 : Math.round((1 - Math.min(data.machineBDryTime, 48) / 48) * 10) },
    { subject: 'Bajo riesgo\ncabezal', A: Math.round((1 - Math.min(data.machineAHeadCostMonthly || 0, maxHead) / maxHead) * 10), B: Math.round((1 - Math.min(data.machineBHeadCostMonthly || 0, maxHead) / maxHead) * 10) },
    { subject: 'Bajo precio', A: Math.round((1 - data.machineAPrice / maxPrice) * 10), B: Math.round((1 - data.machineBPrice / maxPrice) * 10) },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Resumen Comparativo</h1>
        <p className="text-gray-500 mt-1 font-medium">
          <span className="text-indigo-600 font-semibold">{shortA}</span>
          {' '}vs{' '}
          <span className="text-amber-600 font-semibold">{shortB}</span>
          {data.clientCompany && <span className="ml-2 text-blue-600 font-semibold text-sm">· {data.clientCompany}</span>}
        </p>
      </header>

      {/* ── Hero Card TCO ── */}
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
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5 border ${bIsBetter ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'}`}>
                {bIsBetter ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {bIsBetter ? 'HP Latex más rentable' : 'Revisar parámetros'}
              </div>
              <div className="flex items-baseline gap-4 flex-wrap">
                <h2 className="text-5xl md:text-6xl font-black tracking-tight text-white">{fmt(Math.abs(tcoSaving))}</h2>
                <span className={`text-lg font-bold ${bIsBetter ? 'text-emerald-400' : 'text-rose-400'}`}>
                  /mes ahorro TCO
                </span>
              </div>
              <p className="text-slate-400 mt-3 max-w-lg text-sm leading-relaxed">
                Diferencia en TCO mensual total (operativo + amortización + cabezales).
                {(data.growthRate || 0) > 0 && <span className="text-emerald-400"> Escenario crecimiento +{((data.growthRate || 0) * 100).toFixed(0)}% m².</span>}
              </p>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px]">
              <div className="bg-white/8 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Payback Real</p>
                <span className="text-2xl font-black text-white">
                  {isFinite(payback) && payback > 0 ? `${payback.toFixed(1)} meses` : '—'}
                </span>
              </div>
              <div className="bg-white/8 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Ahorro anual</p>
                <p className={`text-xl font-black ${bIsBetter ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {fmt(results.tcoSavingsAnnual || 0)}
                </p>
              </div>
              <div className="bg-white/8 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Beneficio B año 5</p>
                <p className="text-xl font-black text-amber-300">
                  {results.yearlyData?.length ? fmt(results.yearlyData[4].cumProfitB) : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── KPI grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'TCO mensual A', value: fmt(results.monthlyTCO_A || 0), sub: shortA, color: 'indigo', icon: Euro },
          { label: 'TCO mensual B', value: fmt(results.monthlyTCO_B || 0), sub: shortB, color: 'amber', icon: Euro },
          { label: 'Tinta A vs B', value: `${fmt2(inkA - inkB)}/m²`, sub: `${fmt2(inkA)} → ${fmt2(inkB)}`, color: inkA > inkB ? 'emerald' : 'rose', icon: DollarSign },
          { label: 'Tiempo liberado', value: `${Math.round(Math.abs(results.productionTimeSavings * 12))}h/año`, sub: 'sin esperas de secado', color: 'violet', icon: Clock },
        ].map(({ label, value, sub, color, icon: Icon }) => {
          const palettes: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
            indigo:  { bg: 'bg-indigo-50',  border: 'border-indigo-200',  text: 'text-indigo-700',  iconBg: 'bg-indigo-600' },
            amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   iconBg: 'bg-amber-500' },
            emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', iconBg: 'bg-emerald-600' },
            rose:    { bg: 'bg-rose-50',    border: 'border-rose-200',    text: 'text-rose-700',    iconBg: 'bg-rose-600' },
            violet:  { bg: 'bg-violet-50',  border: 'border-violet-200',  text: 'text-violet-700',  iconBg: 'bg-violet-600' },
          };
          const p = palettes[color] || palettes.emerald;
          return (
            <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`${p.bg} ${p.border} border rounded-2xl p-4`}>
              <div className={`w-8 h-8 ${p.iconBg} rounded-lg flex items-center justify-center mb-2`}>
                <Icon size={15} className="text-white" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
              <p className={`text-lg font-black ${p.text}`}>{value}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── Gráficas: barras TCO + radar ── */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Barras de costes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <BarChart3 size={16} className="text-gray-500" />
            <h3 className="font-bold text-gray-900 text-sm">Desglose TCO Mensual</h3>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={costsData} barSize={20} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Legend formatter={(v: string) => v === 'A' ? shortA : shortB} iconSize={10} />
                <Bar dataKey="A" fill="#6366f1" name="A" radius={[3, 3, 0, 0]} />
                <Bar dataKey="B" fill="#f59e0b" name="B" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Radar de comparación */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <GitCompare size={16} className="text-gray-500" />
            <h3 className="font-bold text-gray-900 text-sm">Puntuación por Categoría (0–10)</h3>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData} margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#6b7280' }} />
                <Radar name={shortA} dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
                <Radar name={shortB} dataKey="B" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} strokeWidth={2.5} />
                <Legend formatter={(v: string) => v} iconSize={10} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ── Comparativa rápida ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm">Comparativa Rápida de Parámetros</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-2.5 text-xs font-bold text-gray-400 uppercase">Parámetro</th>
                <th className="text-center px-4 py-2.5 text-xs font-bold text-indigo-500 uppercase">{shortA}</th>
                <th className="text-center px-4 py-2.5 text-xs font-bold text-amber-600 uppercase">{shortB}</th>
                <th className="text-center px-4 py-2.5 text-xs font-bold text-gray-400 uppercase">Ganador</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Velocidad', a: `${data.machineASpeed} m²/h`, b: `${data.machineBSpeed} m²/h`, winner: data.machineBSpeed > data.machineASpeed ? 'b' : data.machineASpeed > data.machineBSpeed ? 'a' : 'tie' },
                { label: 'Tinta €/m²', a: fmt2(inkA), b: fmt2(inkB), winner: inkB < inkA ? 'b' : inkA < inkB ? 'a' : 'tie' },
                { label: 'Secado', a: data.machineADryTime === 0 ? '0h ✓' : `${data.machineADryTime}h`, b: data.machineBDryTime === 0 ? '0h ✓' : `${data.machineBDryTime}h`, winner: data.machineBDryTime < data.machineADryTime ? 'b' : data.machineADryTime < data.machineBDryTime ? 'a' : 'tie' },
                { label: 'Mantenimiento', a: `${data.machineAMaintenance}h/sem`, b: `${data.machineBMaintenance}h/sem`, winner: data.machineBMaintenance < data.machineAMaintenance ? 'b' : data.machineAMaintenance < data.machineBMaintenance ? 'a' : 'tie' },
                { label: 'Cabezales/mes', a: fmt(data.machineAHeadCostMonthly || 0), b: fmt(data.machineBHeadCostMonthly || 0), winner: (data.machineBHeadCostMonthly || 0) < (data.machineAHeadCostMonthly || 0) ? 'b' : (data.machineAHeadCostMonthly || 0) < (data.machineBHeadCostMonthly || 0) ? 'a' : 'tie' },
                { label: 'TCO mensual', a: fmt(results.monthlyTCO_A || 0), b: fmt(results.monthlyTCO_B || 0), winner: (results.monthlyTCO_B || 0) < (results.monthlyTCO_A || 0) ? 'b' : (results.monthlyTCO_A || 0) < (results.monthlyTCO_B || 0) ? 'a' : 'tie' },
                { label: 'Precio compra', a: fmt(data.machineAPrice), b: fmt(data.machineBPrice), winner: data.machineBPrice < data.machineAPrice ? 'b' : data.machineAPrice < data.machineBPrice ? 'a' : 'tie' },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}>
                  <td className="px-5 py-2.5 text-gray-700 font-medium text-xs">{row.label}</td>
                  <td className={`px-4 py-2.5 text-center text-xs font-bold ${row.winner === 'a' ? 'text-emerald-600' : 'text-gray-500'}`}>{row.winner === 'a' ? '✅ ' : ''}{row.a}</td>
                  <td className={`px-4 py-2.5 text-center text-xs font-bold ${row.winner === 'b' ? 'text-emerald-600' : 'text-gray-500'}`}>{row.winner === 'b' ? '✅ ' : ''}{row.b}</td>
                  <td className="px-4 py-2.5 text-center text-xs">
                    {row.winner === 'b' ? <span className="text-amber-600 font-black">B</span> : row.winner === 'a' ? <span className="text-indigo-600 font-black">A</span> : <span className="text-gray-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Alertas / Puntos de atención ── */}
      <div className="grid md:grid-cols-2 gap-4">
        {machineA?.technology !== 'latex' && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-orange-200 bg-orange-50 p-4 flex gap-3">
            <AlertTriangle size={18} className="text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-orange-800 text-sm">Riesgo de cabezal piezoeléctrico</p>
              <p className="text-xs text-orange-700 mt-1">{shortA} usa cabezal piezo. Un reemplazo puede costar 1.500–2.500€ + técnico. Con HP Latex el operario lo cambia en minutos por mucho menos.</p>
            </div>
          </motion.div>
        )}
        {machineB?.certifications && machineB.certifications.length > 0 && (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex gap-3">
            <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-800 text-sm">Certificaciones HP Latex</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {machineB.certifications.map(c => (
                  <span key={c} className="bg-emerald-200 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">{c}</span>
                ))}
              </div>
              <p className="text-xs text-emerald-700 mt-1">Acceso a nuevos mercados: hospitales, colegios, retail premium.</p>
            </div>
          </motion.div>
        )}
        {data.machineADryTime > 0 && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-rose-200 bg-rose-50 p-4 flex gap-3">
            <Clock size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-800 text-sm">{data.machineADryTime}h de secado bloqueante</p>
              <p className="text-xs text-rose-700 mt-1">Cada trabajo requiere esperar {data.machineADryTime}h antes de poder cortar o laminar. Con HP Latex sale seco e inmediato.</p>
            </div>
          </motion.div>
        )}
        {isFinite(payback) && payback <= 36 && (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-sky-200 bg-sky-50 p-4 flex gap-3">
            <Zap size={18} className="text-sky-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sky-800 text-sm">Payback en {payback.toFixed(1)} meses</p>
              <p className="text-xs text-sky-700 mt-1">La inversión en HP Latex se recupera en menos de {Math.ceil(payback / 12)} {Math.ceil(payback / 12) === 1 ? 'año' : 'años'} solo con el ahorro TCO. A partir de ahí, beneficio puro.</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── CTAs ── */}
      <div className="flex flex-wrap gap-3 justify-between items-center pt-2">
        <Link to="/" className="flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors">
          Cambiar máquinas
        </Link>
        <div className="flex gap-3">
          <Link to="/cost-breakdown" className="flex items-center gap-2 bg-gray-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-700 transition-colors shadow-sm">
            <BarChart3 size={15} />
            Ver TCO detallado
            <ArrowRight size={15} />
          </Link>
          <GlowButton onClick={() => navigate('/report')} size="md" variant="cyan-indigo">
            <FileText size={15} />
            Generar Informe PDF
            <ArrowRight size={15} />
          </GlowButton>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
