import React from 'react';
import { useData, ALL_MACHINES } from '../context/DataContext';
import {
  TrendingUp, Clock, Euro, ArrowRight, Zap,
  DollarSign, ShieldCheck, TrendingDown, BarChart3, FileText, AlertTriangle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import GlowButton from '../components/GlowButton';

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
  const hasHPinA = machineA?.brand === 'HP Latex';
  const hasHPinB = machineB?.brand === 'HP Latex';
  const hasHP = hasHPinA || hasHPinB;
  const winnerName = bIsBetter ? shortB : shortA;
  const inkA = results.inkCostPerM2A || data.machineAInkCost;
  const inkB = results.inkCostPerM2B || data.machineBInkCost;

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
                {winnerName} más rentable
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

      {/* ── Alertas / Puntos de atención ── */}
      <div className="grid md:grid-cols-2 gap-4">
        {machineA?.technology !== 'latex' && machineB?.technology === 'latex' && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-orange-200 bg-orange-50 p-4 flex gap-3">
            <AlertTriangle size={18} className="text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-orange-800 text-sm">Riesgo de cabezal piezoeléctrico</p>
              <p className="text-xs text-orange-700 mt-1">{shortA} usa cabezal piezo. Un reemplazo puede costar 1.500–2.500€ + técnico. {shortB} usa cabezal térmico: el operario lo cambia en minutos.</p>
            </div>
          </motion.div>
        )}
        {machineA?.technology !== 'latex' && machineB?.technology !== 'latex' && (machineA?.technology === 'uv' || machineB?.technology === 'uv') && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-orange-200 bg-orange-50 p-4 flex gap-3">
            <AlertTriangle size={18} className="text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-orange-800 text-sm">Ambas usan cabezal piezoeléctrico</p>
              <p className="text-xs text-orange-700 mt-1">Ambas máquinas usan cabezal piezo. Un reemplazo puede costar 1.500–2.500€ + servicio técnico.</p>
            </div>
          </motion.div>
        )}
        {(() => {
          const certsA = machineA?.certifications ?? [];
          const certsB = machineB?.certifications ?? [];
          const allCerts = [...new Set([...certsA, ...certsB])];
          const certMachine = certsB.length > 0 ? shortB : certsA.length > 0 ? shortA : null;
          if (!certMachine || allCerts.length === 0) return null;
          return (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex gap-3">
              <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-800 text-sm">Certificaciones {certMachine}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {allCerts.map(c => (
                    <span key={c} className="bg-emerald-200 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">{c}</span>
                  ))}
                </div>
                <p className="text-xs text-emerald-700 mt-1">Acceso a nuevos mercados: hospitales, colegios, retail premium.</p>
              </div>
            </motion.div>
          );
        })()}
        {data.machineADryTime > 0 && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-rose-200 bg-rose-50 p-4 flex gap-3">
            <Clock size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-800 text-sm">{data.machineADryTime}h de secado bloqueante en {shortA}</p>
              <p className="text-xs text-rose-700 mt-1">
                Cada trabajo requiere esperar {data.machineADryTime}h antes de cortar o laminar.
                {data.machineBDryTime === 0 ? ` ${shortB} tiene curado instantáneo.` : ''}
              </p>
            </div>
          </motion.div>
        )}
        {isFinite(payback) && payback <= 36 && bIsBetter && (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-sky-200 bg-sky-50 p-4 flex gap-3">
            <Zap size={18} className="text-sky-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sky-800 text-sm">Payback en {payback.toFixed(1)} meses</p>
              <p className="text-xs text-sky-700 mt-1">La inversión en {shortB} se recupera en menos de {Math.ceil(payback / 12)} {Math.ceil(payback / 12) === 1 ? 'año' : 'años'} solo con el ahorro TCO.</p>
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
