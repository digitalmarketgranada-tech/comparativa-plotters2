import React from 'react';
import { motion } from 'motion/react';
import { useData, ALL_MACHINES } from '../context/DataContext';
import { Leaf, School, Home, Hospital, Building2, Check, X, Zap, Droplets, Wind, Recycle, Award, AlertTriangle, ShoppingBag } from 'lucide-react';

const Sustainability: React.FC = () => {
  const { data } = useData();

  const machineA = ALL_MACHINES.find(m => m.model === data.machineAModel);
  const machineB = ALL_MACHINES.find(m => m.model === data.machineBModel);
  const shortA = (machineA?.model ?? 'Máquina A').slice(0, 28);
  const shortB = (machineB?.model ?? 'Máquina B').slice(0, 28);

  const isLatexA = machineA?.technology === 'latex';
  const isLatexB = machineB?.technology === 'latex';

  // Certification badges for both machines
  const certsA = machineA?.certifications ?? [];
  const certsB = machineB?.certifications ?? [];

  type Aspect = { icon: React.ElementType; label: string; latexVal: string; ecoVal: string; latexWin: boolean };

  const aspects: Aspect[] = [
    { icon: Wind,     label: 'Emisiones VOC',           latexVal: 'Prácticamente 0 — base agua',  ecoVal: 'Altas — require ventilación',      latexWin: true  },
    { icon: Droplets, label: 'Secado / Desgasificación', latexVal: '0h — instantáneo al salir',    ecoVal: '24–48h espera obligatoria',        latexWin: true  },
    { icon: Recycle,  label: 'Residuos peligrosos',     latexVal: 'No — residuos no peligrosos',  ecoVal: 'Sí — gestión especial requerida',   latexWin: true  },
    { icon: Zap,      label: 'Consumo energético',      latexVal: 'ENERGY STAR certificado',       ecoVal: 'Sin certificación energética',      latexWin: true  },
    { icon: Award,    label: 'Certificaciones',          latexVal: 'GREENGUARD Gold / ECOLOGO',    ecoVal: 'Sin certificaciones ambientales',   latexWin: true  },
    { icon: AlertTriangle, label: 'Riesgo cabezales',  latexVal: 'Bajo — térmicos, reemplazables', ecoVal: 'Alto — piezo, técnico especializado', latexWin: true },
  ];

  // Markets opened by latex certifications
  const markets = [
    { icon: Hospital,     color: 'bg-rose-50 text-rose-600 border-rose-100',         title: 'Hospitales y Clínicas',       desc: 'GREENGUARD Gold acredita niveles de emisiones aptos para entornos sanitarios. Requisito en muchas licitaciones hospitalarias.' },
    { icon: School,       color: 'bg-sky-50 text-sky-600 border-sky-100',             title: 'Escuelas y Universidades',    desc: 'Las administraciones educativas exigen GREENGUARD Gold para garantizar la seguridad del alumnado en aulas y comedores.' },
    { icon: Building2,    color: 'bg-violet-50 text-violet-600 border-violet-100',   title: 'Edificios corporativos',      desc: 'Proyectos de señalización y decoración interior en grandes superficies y edificios de oficinas certificados.' },
    { icon: Home,         color: 'bg-emerald-50 text-emerald-600 border-emerald-100', title: 'Decoración residencial',      desc: 'Sin olores ni COVs, se puede trabajar en instalación directa en hogares y zonas habitadas.' },
    { icon: ShoppingBag,  color: 'bg-amber-50 text-amber-600 border-amber-100',       title: 'Retail y Punto de Venta',    desc: 'Las marcas de retail premium exigen materiales impresos sin olores para instalación en tiendas abiertas al público.' },
    { icon: Leaf,         color: 'bg-teal-50 text-teal-600 border-teal-100',          title: 'Contratación pública verde', desc: 'EPEAT y UL ECOLOGO son criterios de puntuación en contratos con administraciones públicas en proceso de digitalización verde.' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold uppercase tracking-wider mb-4">
          <Leaf size={16} />
          Sostenibilidad y Tecnología
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Impacto Ambiental y Operativo</h1>
        <p className="text-gray-500">
          Comparando{' '}
          <span className="font-semibold text-indigo-600">{shortA}</span>
          {' '}vs{' '}
          <span className="font-semibold text-amber-600">{shortB}</span>
        </p>
      </header>

      {/* ── Tech cards side by side ── */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Machine A */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className={`bg-white rounded-xl overflow-hidden border shadow-sm ${isLatexA ? 'border-emerald-200' : 'border-rose-100'}`}
        >
          <div className={`p-5 border-b flex justify-between items-start ${isLatexA ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
            <div>
              <div className={`flex items-center gap-2 mb-1 ${isLatexA ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isLatexA ? <Check size={20} /> : <X size={20} />}
                <h3 className="font-bold uppercase tracking-wide text-sm">Máquina A</h3>
              </div>
              <p className="font-black text-gray-900 text-base">{shortA}</p>
              <p className={`text-xs mt-0.5 ${isLatexA ? 'text-emerald-700' : 'text-rose-700'}`}>
                {isLatexA ? 'Tinta Látex — base agua' : machineA?.technology === 'uv' ? 'Tinta UV' : 'Eco-Solvente — disolventes orgánicos'}
              </p>
            </div>
            <span className={`text-[10px] font-black px-2 py-1 rounded ${isLatexA ? 'bg-emerald-600 text-white' : 'bg-rose-500 text-white'}`}>
              {isLatexA ? 'VERDE' : 'RIESGO'}
            </span>
          </div>
          <div className="p-5 space-y-3">
            {isLatexA ? (
              <>
                <SustPoint win={true}  text="Tintas base agua — sin COVs peligrosos" />
                <SustPoint win={true}  text="Curado instantáneo — sin espera de desgasificación" />
                <SustPoint win={true}  text="No requiere extracción de aire especial" />
                <SustPoint win={true}  text="Residuos no peligrosos — gestión estándar" />
                {certsA.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Certificaciones</p>
                    <div className="flex flex-wrap gap-1">
                      {certsA.map(c => <span key={c} className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded border border-emerald-200">{c}</span>)}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <SustPoint win={false} text="Emisiones de COVs — requiere ventilación o extracción" />
                <SustPoint win={false} text="Desgasificación 24–48h antes de entregar al cliente" />
                <SustPoint win={false} text={`Secado: ${data.machineADryTime}h de espera por trabajo`} />
                <SustPoint win={false} text="Residuos clasificados como peligrosos en muchas normativas" />
                <SustPoint win={false} text="Sin certificaciones ambientales reconocidas" />
              </>
            )}
          </div>
        </motion.div>

        {/* Machine B */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className={`bg-white rounded-xl overflow-hidden border shadow-sm ${isLatexB ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-rose-100'}`}
        >
          <div className={`p-5 border-b flex justify-between items-start ${isLatexB ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
            <div>
              <div className={`flex items-center gap-2 mb-1 ${isLatexB ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isLatexB ? <Check size={20} /> : <X size={20} />}
                <h3 className="font-bold uppercase tracking-wide text-sm">Máquina B</h3>
              </div>
              <p className="font-black text-gray-900 text-base">{shortB}</p>
              <p className={`text-xs mt-0.5 ${isLatexB ? 'text-emerald-700' : 'text-rose-700'}`}>
                {isLatexB ? 'Tinta Látex — base agua' : machineB?.technology === 'uv' ? 'Tinta UV' : 'Eco-Solvente — disolventes orgánicos'}
              </p>
            </div>
            <span className={`text-[10px] font-black px-2 py-1 rounded ${isLatexB ? 'bg-emerald-600 text-white' : 'bg-rose-500 text-white'}`}>
              {isLatexB ? 'VERDE' : 'RIESGO'}
            </span>
          </div>
          <div className="p-5 space-y-3">
            {isLatexB ? (
              <>
                <SustPoint win={true}  text="Tintas base agua — sin COVs peligrosos" />
                <SustPoint win={true}  text="Curado instantáneo — sin espera de desgasificación" />
                <SustPoint win={true}  text="No requiere extracción de aire especial" />
                <SustPoint win={true}  text="Residuos no peligrosos — gestión estándar" />
                {certsB.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Certificaciones</p>
                    <div className="flex flex-wrap gap-1">
                      {certsB.map(c => <span key={c} className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded border border-emerald-200">{c}</span>)}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <SustPoint win={false} text="Emisiones de COVs — requiere ventilación o extracción" />
                <SustPoint win={false} text="Desgasificación 24–48h antes de entregar al cliente" />
                <SustPoint win={false} text={`Secado: ${data.machineBDryTime}h de espera por trabajo`} />
                <SustPoint win={false} text="Residuos clasificados como peligrosos en muchas normativas" />
                <SustPoint win={false} text="Sin certificaciones ambientales reconocidas" />
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Aspect comparison table ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="bg-gray-900 px-6 py-5 flex items-center justify-between">
          <h2 className="font-black text-white text-lg">Tabla de Impacto Ambiental</h2>
          <span className="text-gray-400 text-xs">Látex vs Eco-Solvente</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Aspecto</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-indigo-500 uppercase">Máq. A — {shortA.slice(0, 18)}</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-amber-600 uppercase">Máq. B — {shortB.slice(0, 18)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {aspects.map((asp, i) => {
                const Icon = asp.icon;
                const aLatex = isLatexA;
                const bLatex = isLatexB;
                return (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-6 py-3.5 font-medium text-gray-700">
                      <span className="flex items-center gap-2">
                        <Icon size={15} className="text-gray-400" />
                        {asp.label}
                      </span>
                    </td>
                    <td className={`px-4 py-3.5 text-center text-xs ${aLatex && asp.latexWin ? 'font-bold text-emerald-600' : !aLatex && !asp.latexWin ? 'font-bold text-emerald-600' : 'text-gray-400'}`}>
                      {aLatex ? asp.latexVal : asp.ecoVal}
                    </td>
                    <td className={`px-4 py-3.5 text-center text-xs ${bLatex && asp.latexWin ? 'font-bold text-emerald-600' : !bLatex && !asp.latexWin ? 'font-bold text-emerald-600' : 'text-gray-400'}`}>
                      {bLatex ? asp.latexVal : asp.ecoVal}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── New markets (only if machine B is latex) ── */}
      {isLatexB && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden"
        >
          <div className="bg-emerald-600 px-6 py-5 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Award size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-black text-white text-lg leading-tight">Nuevos Mercados con HP Latex</h2>
              <p className="text-emerald-100 text-xs">Sectores inaccesibles con eco-solvente que se abren con certificaciones</p>
            </div>
          </div>
          <div className="p-6 grid md:grid-cols-3 gap-4">
            {markets.map(({ icon: Icon, color, title, desc }, i) => (
              <div key={i} className={`rounded-xl border p-4 ${color}`}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-white/60">
                  <Icon size={18} />
                </div>
                <h4 className="font-bold text-sm mb-1">{title}</h4>
                <p className="text-xs leading-relaxed opacity-80">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Dry time impact ── */}
      {(data.machineADryTime > 0 || data.machineBDryTime > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl border border-orange-200 shadow-sm overflow-hidden"
        >
          <div className="bg-orange-500 px-6 py-4 flex items-center gap-3">
            <AlertTriangle size={20} className="text-white" />
            <h2 className="font-black text-white">Impacto del Tiempo de Secado en la Operativa</h2>
          </div>
          <div className="p-6 grid md:grid-cols-2 gap-4">
            {data.machineADryTime > 0 && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                <p className="text-xs font-bold text-rose-500 uppercase mb-1">Máquina A — {shortA.slice(0, 20)}</p>
                <p className="text-2xl font-black text-rose-700 mb-2">{data.machineADryTime}h / trabajo</p>
                <ul className="space-y-1 text-xs text-rose-700">
                  <li>• Trabajos urgentes bloqueados durante el secado</li>
                  <li>• Necesita espacio extra de almacenamiento para secar</li>
                  <li>• Imposible laminar o acabar hasta el día siguiente</li>
                  <li>• Clientes con plazos ajustados se van a la competencia</li>
                </ul>
              </div>
            )}
            {data.machineBDryTime === 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-xs font-bold text-emerald-500 uppercase mb-1">Máquina B — {shortB.slice(0, 20)}</p>
                <p className="text-2xl font-black text-emerald-700 mb-2">0h — Instantáneo</p>
                <ul className="space-y-1 text-xs text-emerald-700">
                  <li>• Laminar, cortar y entregar en el mismo turno</li>
                  <li>• Trabajos urgentes con entrega en el día</li>
                  <li>• Sin cola de espera de secado</li>
                  <li>• Mayor rotación y capacidad productiva efectiva</li>
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const SustPoint: React.FC<{ win: boolean; text: string }> = ({ win, text }) => (
  <div className="flex items-start gap-2.5">
    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${win ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-500'}`}>
      {win ? <Check size={12} /> : <X size={12} />}
    </div>
    <p className={`text-xs leading-relaxed ${win ? 'text-gray-700' : 'text-gray-500'}`}>{text}</p>
  </div>
);

export default Sustainability;
