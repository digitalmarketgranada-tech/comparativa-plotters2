import React from 'react';
import { motion } from 'motion/react';
import { useData, ALL_MACHINES } from '../context/DataContext';
import {
  Hourglass, Wind, Leaf, Monitor, Cloud, BarChart3, Wifi, Package,
  Zap, Clock, DollarSign, Wrench, Ruler, Award, Shield, AlertTriangle,
} from 'lucide-react';

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
    if (m.technology === 'latex') return 'Tinta Látex';
    if (m.technology === 'uv') return 'UV';
    return 'Eco-Solvente';
  };

  const techColor = (m: typeof machineA) => {
    if (!m) return 'bg-rose-100 text-rose-700';
    if (m.technology === 'latex') return 'bg-emerald-100 text-emerald-700';
    if (m.technology === 'uv') return 'bg-violet-100 text-violet-700';
    return 'bg-rose-100 text-rose-700';
  };

  type WinSide = 'a' | 'b' | 'tie';
  const w = (lower: boolean, a: number, b: number): WinSide =>
    lower ? (b < a ? 'b' : a < b ? 'a' : 'tie') : (b > a ? 'b' : a > b ? 'a' : 'tie');

  const inkA = data.machineAInkCost ?? machineA?.inkCostPerM2 ?? 0;
  const inkB = data.machineBInkCost ?? machineB?.inkCostPerM2 ?? 0;
  const headA = machineA?.headCostAnnual ?? 800;
  const headB = machineB?.headCostAnnual ?? 200;
  const lifeA = machineA?.lifetimeYears ?? 5;
  const lifeB = machineB?.lifetimeYears ?? 8;
  const widthA = machineA?.printWidthMm ?? 0;
  const widthB = machineB?.printWidthMm ?? 0;

  const rows: { label: string; icon: React.ElementType; a: string; b: string; winner: WinSide }[] = [
    { label: 'Velocidad de impresión',    icon: Zap,        a: `${data.machineASpeed} m²/h`,      b: `${data.machineBSpeed} m²/h`,      winner: w(false, data.machineASpeed, data.machineBSpeed) },
    { label: 'Coste de tinta',            icon: DollarSign, a: `${inkA.toFixed(2)} €/m²`,          b: `${inkB.toFixed(2)} €/m²`,          winner: w(true, inkA, inkB) },
    { label: 'Tiempo de secado',          icon: Hourglass,  a: data.machineADryTime === 0 ? '0h — instantáneo' : `${data.machineADryTime}h espera`, b: data.machineBDryTime === 0 ? '0h — instantáneo' : `${data.machineBDryTime}h espera`, winner: w(true, data.machineADryTime, data.machineBDryTime) },
    { label: 'Mantenimiento semanal',     icon: Wrench,     a: `${data.machineAMaintenance}h/sem`, b: `${data.machineBMaintenance}h/sem`, winner: w(true, data.machineAMaintenance, data.machineBMaintenance) },
    { label: 'Anchura de impresión',      icon: Ruler,      a: widthA ? `${widthA} mm` : '—',     b: widthB ? `${widthB} mm` : '—',     winner: w(false, widthA, widthB) },
    { label: 'Riesgo cabezales (anual)',  icon: AlertTriangle, a: `${headA.toLocaleString('es-ES')} €/año`, b: `${headB.toLocaleString('es-ES')} €/año`, winner: w(true, headA, headB) },
    { label: 'Vida útil estimada',        icon: Clock,      a: `${lifeA} años`,                   b: `${lifeB} años`,                   winner: w(false, lifeA, lifeB) },
    { label: 'Precio referencia',         icon: DollarSign, a: `${data.machineAPrice.toLocaleString('es-ES')} €`, b: `${data.machineBPrice.toLocaleString('es-ES')} €`, winner: w(true, data.machineAPrice, data.machineBPrice) },
  ];

  const winnerBadge = (side: 'a' | 'b' | 'tie', col: 'a' | 'b') => {
    if (side === 'tie') return '';
    if (side === col) return ' font-black text-emerald-600';
    return ' text-gray-400';
  };

  const certsA = machineA?.certifications ?? [];
  const certsB = machineB?.certifications ?? [];

  const certInfo: Record<string, { color: string; desc: string }> = {
    'GREENGUARD Gold': { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', desc: 'Calidad de aire interior — apto para escuelas y hospitales' },
    'UL ECOLOGO':      { color: 'bg-sky-100 text-sky-800 border-sky-200',             desc: 'Producto con impacto ambiental reducido certificado' },
    'ENERGY STAR':     { color: 'bg-amber-100 text-amber-800 border-amber-200',       desc: 'Eficiencia energética superior a la media del sector' },
    'EPEAT':           { color: 'bg-violet-100 text-violet-800 border-violet-200',    desc: 'Registro de productos electrónicos de impacto ambiental' },
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
        {/* Machine A */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl overflow-hidden border border-indigo-100 shadow-sm"
        >
          <div className="bg-indigo-600 px-5 py-4 flex justify-between items-center">
            <span className="text-white font-bold">Máquina A</span>
            <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg max-w-[160px] truncate">{shortA}</span>
          </div>
          <div className="p-5 space-y-4">
            {[
              { icon: Zap,          label: 'Velocidad',       val: `${data.machineASpeed} m²/h` },
              { icon: DollarSign,   label: 'Tinta',           val: `${inkA.toFixed(2)} €/m²` },
              { icon: Hourglass,    label: 'Secado',          val: data.machineADryTime === 0 ? 'Instantáneo' : `${data.machineADryTime}h` },
              { icon: Wrench,       label: 'Mantenimiento',   val: `${data.machineAMaintenance}h/sem` },
              { icon: Wind,         label: 'Tecnología',      val: techLabel(machineA) },
              { icon: Ruler,        label: 'Anchura',         val: widthA ? `${widthA} mm` : '—' },
              { icon: AlertTriangle, label: 'Cabezales/año',  val: `${headA.toLocaleString('es-ES')} €` },
              { icon: Clock,        label: 'Vida útil',       val: `${lifeA} años` },
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
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tecnología</p>
              <span className={`text-xs font-bold px-2 py-1 rounded ${techColor(machineA)}`}>
                {techLabel(machineA)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Machine B */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl overflow-hidden border border-amber-200 shadow-sm"
        >
          <div className="bg-amber-500 px-5 py-4 flex justify-between items-center">
            <span className="text-white font-bold">Máquina B</span>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded-lg max-w-[160px] truncate">{shortB}</span>
          </div>
          <div className="p-5 space-y-4">
            {[
              { icon: Zap,          label: 'Velocidad',       val: `${data.machineBSpeed} m²/h` },
              { icon: DollarSign,   label: 'Tinta',           val: `${inkB.toFixed(2)} €/m²` },
              { icon: Hourglass,    label: 'Secado',          val: data.machineBDryTime === 0 ? 'Instantáneo' : `${data.machineBDryTime}h` },
              { icon: Wrench,       label: 'Mantenimiento',   val: `${data.machineBMaintenance}h/sem` },
              { icon: Wind,         label: 'Tecnología',      val: techLabel(machineB) },
              { icon: Ruler,        label: 'Anchura',         val: widthB ? `${widthB} mm` : '—' },
              { icon: AlertTriangle, label: 'Cabezales/año',  val: `${headB.toLocaleString('es-ES')} €` },
              { icon: Clock,        label: 'Vida útil',       val: `${lifeB} años` },
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
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tecnología</p>
              <span className={`text-xs font-bold px-2 py-1 rounded ${techColor(machineB)}`}>
                {techLabel(machineB)}
              </span>
            </div>
            {certsB.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Certificaciones</p>
                <div className="flex flex-wrap gap-1">
                  {certsB.map(c => (
                    <span key={c} className={`text-[10px] font-bold px-2 py-0.5 rounded border ${certInfo[c]?.color ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Comparison table ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
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
                <th className="text-center px-4 py-3 text-xs font-bold text-indigo-500 uppercase">Máq. A — {shortA}</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-amber-600 uppercase">Máq. B — {shortB}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((row, i) => {
                const IconC = row.icon;
                return (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-6 py-3.5 font-medium text-gray-700">
                      <span className="flex items-center gap-2">
                        <IconC size={15} className="text-gray-400" />
                        {row.label}
                      </span>
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
          <p className="text-xs text-gray-400 italic">* Los parámetros se toman de los valores introducidos en la calculadora y las especificaciones del fabricante.</p>
        </div>
      </motion.div>

      {/* ── Head cost risk section ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="bg-white rounded-2xl border border-orange-200 shadow-sm overflow-hidden"
      >
        <div className="bg-orange-500 px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-400 rounded-xl flex items-center justify-center">
            <AlertTriangle size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-black text-white text-lg leading-tight">Riesgo de Cabezales</h2>
            <p className="text-orange-100 text-xs">Coste real de los cabezales según tecnología</p>
          </div>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
            <p className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">Máquina A — {shortA}</p>
            <p className="text-2xl font-black text-rose-700 mb-1">{headA.toLocaleString('es-ES')} €/año</p>
            <p className="text-xs text-rose-600">
              {machineA?.technology === 'latex'
                ? 'Cabezales térmicos reemplazables por el usuario. Bajo riesgo y coste controlado.'
                : 'Cabezales piezoelectricos de alta precisión. Obstrucciones frecuentes por inactividad o mantenimiento inadecuado. Coste por cabezal: 800–1.200 €.'}
            </p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">Máquina B — {shortB}</p>
            <p className="text-2xl font-black text-emerald-700 mb-1">{headB.toLocaleString('es-ES')} €/año</p>
            <p className="text-xs text-emerald-700">
              {machineB?.technology === 'latex'
                ? 'Cabezales térmicos HP reemplazables por el usuario en minutos, sin técnico. Bajo riesgo y coste controlado.'
                : 'Cabezales piezoelectricos. Require mantenimiento preventivo y técnico especializado para sustitución.'}
            </p>
          </div>
          <div className="md:col-span-2 bg-gray-50 rounded-xl p-4 border border-gray-100 text-xs text-gray-500 leading-relaxed">
            <strong className="text-gray-700">¿Por qué importa?</strong> Los cabezales de inyección de tinta son el componente más caro y frágil de las máquinas de impresión. En tecnología piezo (eco-solvente), un único cabezal dañado puede suponer 800–1.200 € de coste de reposición más mano de obra técnica. En HP Latex, los cabezales térmicos se cambian en minutos por el propio operario, a un coste notablemente inferior, y están incluidos en los planes de servicio HP.
          </div>
        </div>
      </motion.div>

      {/* ── Certifications ── */}
      {(certsA.length > 0 || certsB.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="bg-gray-900 px-6 py-5 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
              <Award size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-black text-white text-lg leading-tight">Certificaciones y Mercados</h2>
              <p className="text-gray-400 text-xs">Certificaciones que abren nuevos segmentos de negocio</p>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {certsA.length > 0 && (
              <div>
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-3">Máquina A — {shortA}</p>
                <div className="flex flex-wrap gap-2">
                  {certsA.map(c => (
                    <div key={c} className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${certInfo[c]?.color ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                      {c}
                      {certInfo[c] && <span className="ml-1 font-normal opacity-70">— {certInfo[c].desc}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {certsB.length > 0 && (
              <div>
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3">Máquina B — {shortB}</p>
                <div className="flex flex-wrap gap-2">
                  {certsB.map(c => (
                    <div key={c} className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${certInfo[c]?.color ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                      {c}
                      {certInfo[c] && <span className="ml-1 font-normal opacity-70">— {certInfo[c].desc}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="grid md:grid-cols-3 gap-3 pt-2">
              {[
                { icon: Shield, color: 'bg-emerald-50 text-emerald-600', title: 'Hospitales y Clínicas', desc: 'GREENGUARD Gold certifica la calidad del aire interior. Permite trabajar con contratos sanitarios.' },
                { icon: Monitor, color: 'bg-sky-50 text-sky-600',        title: 'Escuelas y Universidades', desc: 'Las licitaciones públicas educativas exigen GREENGUARD Gold para garantizar seguridad en aulas.' },
                { icon: Leaf, color: 'bg-violet-50 text-violet-600',     title: 'Contratación Pública Verde', desc: 'EPEAT y UL ECOLOGO son criterios de desempate en contratos con administraciones públicas.' },
              ].map(({ icon: Icon, color, title, desc }, i) => (
                <div key={i} className="rounded-xl border border-gray-100 p-4 bg-gray-50">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                    <Icon size={18} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Software / Connectivity ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="bg-gray-900 px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
            <Cloud size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-black text-white text-lg leading-tight">Conectividad y Ecosistema Digital</h2>
            <p className="text-gray-400 text-xs">Capacidades de gestión y monitoreo según fabricante</p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {[
              { icon: Wifi,    color: 'bg-sky-50 text-sky-600 border-sky-100',         title: 'Monitorización remota',   desc: 'Permite seguir el estado de la producción desde dispositivos móviles o web.' },
              { icon: BarChart3, color: 'bg-violet-50 text-violet-600 border-violet-100', title: 'Análisis de costes',     desc: 'Herramientas integradas para el cálculo del consumo de tinta y soportes por cada trabajo.' },
              { icon: Package, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', title: 'Gestión de flujos RIP', desc: 'Compatibilidad con los principales software RIP (Onyx, Caldera, VersaWorks, RasterLink).' },
              { icon: Zap,     color: 'bg-amber-50 text-amber-600 border-amber-100',    title: 'Actualizaciones OTA',     desc: 'Descarga automática de perfiles de materiales y actualizaciones de sistema.' },
            ].map(({ icon: Icon, color, title, desc }, i) => (
              <div key={i} className="rounded-xl p-4 border bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-3 ${color}`}>
                  <Icon size={18} />
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-2">{title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 italic">* Las funciones específicas dependen del modelo y el software de control (RIP) seleccionado para el flujo de trabajo.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Technical;
