import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData, ALL_MACHINES, Machine, groupedMachines, getMachineSegment, SECTORS, GROWTH_SCENARIOS } from '../context/DataContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  GitCompare, RefreshCw, ChevronDown, Info, ArrowRight,
  User, Building2, ChevronUp, TrendingUp, AlertTriangle,
} from 'lucide-react';

// ─── Colores por marca ────────────────────────────────────────────────────────
const brandColors: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  'HP Latex':    { bg: 'bg-sky-50',    text: 'text-sky-700',    border: 'border-sky-200',    badge: 'bg-sky-600 text-white' },
  Roland:        { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    badge: 'bg-red-600 text-white' },
  Mimaki:        { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   badge: 'bg-blue-600 text-white' },
  Epson:         { bg: 'bg-slate-50',  text: 'text-slate-700',  border: 'border-slate-200',  badge: 'bg-slate-700 text-white' },
  Mutoh:         { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', badge: 'bg-orange-600 text-white' },
  Canon:         { bg: 'bg-rose-50',   text: 'text-rose-800',   border: 'border-rose-300',   badge: 'bg-rose-700 text-white' },
  Agfa:          { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-200',   badge: 'bg-teal-600 text-white' },
  swissQprint:   { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  badge: 'bg-green-700 text-white' },
};

// ─── Columna de máquina ───────────────────────────────────────────────────────
interface MachineColumnProps {
  label: string;
  accent: 'indigo' | 'amber';
  accentLabel?: string;
  selectedModel: string;
  onModelChange: (model: string) => void;
  speed: number;
  inkPricePerLiter: number;
  inkMlPerM2: number;
  inkCostPerM2: number;
  maintenance: number;
  dryTime: number;
  price: number;
  lifetimeYears: number;
  residualValue: number;
  headCostMonthly: number;
  onParamChange: (key: string, val: number) => void;
}

type SegmentFilter = 'all' | 'flexible' | 'rigid';

const SEGMENT_TABS: { key: SegmentFilter; label: string }[] = [
  { key: 'all',      label: 'Todos' },
  { key: 'flexible', label: 'Rollo' },
  { key: 'rigid',    label: 'Rígidos / Híbridos' },
];

const MachineColumn: React.FC<MachineColumnProps> = ({
  label, accent, accentLabel, selectedModel, onModelChange,
  speed, inkPricePerLiter, inkMlPerM2, inkCostPerM2,
  maintenance, dryTime, price, lifetimeYears, residualValue, headCostMonthly,
  onParamChange,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [segFilter, setSegFilter] = useState<SegmentFilter>('all');
  const selectedMachine: Machine | undefined = ALL_MACHINES.find(m => m.model === selectedModel);

  const filteredGrouped = Object.fromEntries(
    Object.entries(groupedMachines)
      .map(([b, ms]) => [
        b,
        segFilter === 'all'
          ? ms
          : ms.filter(m => {
              const seg = getMachineSegment(m);
              return segFilter === 'rigid' ? seg === 'rigid' || seg === 'hybrid' : seg === 'flexible';
            }),
      ])
      .filter(([, ms]) => (ms as Machine[]).length > 0),
  ) as Record<string, Machine[]>;
  const brand = selectedMachine?.brand ?? 'Roland';
  const bs = brandColors[brand] ?? brandColors.Roland;
  const isLatex = selectedMachine?.technology === 'latex';

  const accentHeader = accent === 'indigo' ? 'bg-indigo-600' : 'bg-amber-500';
  const accentFocus  = accent === 'indigo'
    ? 'focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
    : 'focus:border-amber-400 focus:ring-2 focus:ring-amber-100';

  const techLabel = (t?: string) => {
    if (t === 'latex') return 'Látex';
    if (t === 'uv') return 'UV';
    return 'Eco-Solvente';
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      {/* Header */}
      <div className={`${accentHeader} px-5 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <span className="w-2 h-6 bg-white/40 rounded-full" />
          <div>
            <h2 className="font-bold text-white text-lg leading-tight">{label}</h2>
            {accentLabel && <p className="text-white/70 text-xs">{accentLabel}</p>}
          </div>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
          isLatex ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
        }`}>
          {techLabel(selectedMachine?.technology)}
        </span>
      </div>

      <div className="p-5 space-y-5 flex-1">
        {/* Selector de modelo */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Modelo</label>

          {/* Tabs de segmento */}
          <div className="flex gap-1 mb-2">
            {SEGMENT_TABS.map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSegFilter(tab.key)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${segFilter === tab.key
                  ? 'bg-gray-700 text-white border-transparent'
                  : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Pills de marca */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {Object.keys(filteredGrouped).map(b => (
              <button
                key={b}
                type="button"
                onClick={() => onModelChange(filteredGrouped[b][0].model)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${brand === b
                  ? (brandColors[b]?.badge ?? 'bg-gray-700 text-white') + ' border-transparent shadow-sm'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Dropdown de modelo */}
          <div className={`relative rounded-xl border-2 transition-all ${bs.border} overflow-hidden`}>
            <select
              value={selectedModel}
              onChange={e => onModelChange(e.target.value)}
              className={`w-full px-4 py-3 pr-10 ${bs.bg} ${bs.text} font-semibold text-sm focus:outline-none appearance-none cursor-pointer`}
            >
              {Object.entries(filteredGrouped).map(([b, machines]) => (
                <optgroup key={b} label={`── ${b} ──`}>
                  {machines.map(m => (
                    <option key={m.model} value={m.model}>{m.model}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <ChevronDown size={18} className={bs.text} />
            </div>
          </div>

          {/* Ficha de especificaciones */}
          {selectedMachine && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              key={selectedMachine.model}
              className={`mt-3 p-3 rounded-xl border ${bs.border} ${bs.bg}`}
            >
              <button
                onClick={() => setShowInfo(!showInfo)}
                className={`flex items-center gap-1.5 text-xs font-bold ${bs.text} mb-2`}
              >
                <Info size={13} />
                Especificaciones técnicas
                <ChevronDown size={13} className={`transition-transform ${showInfo ? 'rotate-180' : ''}`} />
              </button>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Velocidad',  val: `${selectedMachine.printSpeed}`,   unit: 'm²/h' },
                  { label: 'Tinta',      val: `${selectedMachine.inkCostPerM2.toFixed(2)}€`, unit: '/m²' },
                  { label: 'Secado',     val: selectedMachine.dryTimeHours === 0 ? 'Inst.' : `${selectedMachine.dryTimeHours}h`, unit: '' },
                ].map(({ label: l, val, unit }) => (
                  <div key={l} className="bg-white/70 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-gray-500 font-semibold uppercase">{l}</p>
                    <p className={`text-sm font-black ${bs.text}`}>{val}</p>
                    <p className="text-[9px] text-gray-400">{unit}</p>
                  </div>
                ))}
              </div>
              {showInfo && (
                <div className="mt-2 pt-2 border-t border-white/50 space-y-1">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <span className="text-gray-500">Anchura: <strong className={bs.text}>{selectedMachine.printWidthMm}mm</strong></span>
                    <span className="text-gray-500">Vida útil: <strong className={bs.text}>{selectedMachine.lifetimeYears} años</strong></span>
                    <span className="text-gray-500">Cabezales/año: <strong className={selectedMachine.headCostAnnual <= 250 ? 'text-emerald-600' : 'text-orange-600'}>
                      {selectedMachine.headCostAnnual}€</strong></span>
                    <span className="text-gray-500">Precio ref.: <strong className={bs.text}>{selectedMachine.referencePrice.toLocaleString('es-ES')}€</strong></span>
                  </div>
                  {selectedMachine.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedMachine.certifications.map(c => (
                        <span key={c} className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded">{c}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <p className="text-[10px] text-gray-400 mt-2 italic">* Ajustables en los campos de abajo.</p>
            </motion.div>
          )}
        </div>

        {/* ── Velocidad y flujo ── */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Velocidad y Flujo</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Velocidad</label>
              <div className="relative">
                <input type="number" value={speed || ''} onChange={e => onParamChange('speed', Number(e.target.value))}
                  min="0" step="0.5" placeholder="20"
                  className={`w-full px-3 py-2.5 rounded-xl border border-gray-200 ${accentFocus} text-gray-900 font-semibold bg-gray-50 focus:bg-white outline-none text-sm transition-all`}
                />
                <span className="absolute right-2 top-2.5 text-gray-400 text-xs pointer-events-none">m²/h</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Mantenim./sem</label>
              <div className="relative">
                <input type="number" value={maintenance || ''} onChange={e => onParamChange('maintenance', Number(e.target.value))}
                  min="0" step="0.5" placeholder="1"
                  className={`w-full px-3 py-2.5 rounded-xl border border-gray-200 ${accentFocus} text-gray-900 font-semibold bg-gray-50 focus:bg-white outline-none text-sm transition-all`}
                />
                <span className="absolute right-2 top-2.5 text-gray-400 text-xs pointer-events-none">h</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Tiempo de Secado</label>
            <div className="relative">
              <input type="number" value={dryTime || ''} onChange={e => onParamChange('dryTime', Number(e.target.value))}
                min="0" step="1" placeholder="0"
                className={`w-full px-3 py-2.5 rounded-xl border border-gray-200 ${accentFocus} text-gray-900 font-semibold bg-gray-50 focus:bg-white outline-none text-sm transition-all ${dryTime === 0 ? 'text-emerald-700' : 'text-orange-600'}`}
              />
              <span className="absolute right-2 top-2.5 text-gray-400 text-xs pointer-events-none">h {dryTime === 0 ? '✓ Inst.' : ''}</span>
            </div>
          </div>
        </div>

        {/* ── Costes de tinta ── */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Costes de Tinta</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Precio tinta</label>
              <div className="relative">
                <span className="absolute left-2.5 top-2.5 text-gray-400 text-xs pointer-events-none">€</span>
                <input type="number" value={inkPricePerLiter || ''} onChange={e => onParamChange('inkPricePerLiter', Number(e.target.value))}
                  min="0" step="1" placeholder="100"
                  className={`w-full px-3 py-2.5 pl-6 rounded-xl border border-gray-200 ${accentFocus} text-gray-900 font-semibold bg-gray-50 focus:bg-white outline-none text-sm transition-all`}
                />
                <span className="absolute right-1.5 top-2.5 text-gray-400 text-[10px] pointer-events-none">/litro</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Consumo</label>
              <div className="relative">
                <input type="number" value={inkMlPerM2 || ''} onChange={e => onParamChange('inkMlPerM2', Number(e.target.value))}
                  min="0" step="0.5" placeholder="12"
                  className={`w-full px-3 py-2.5 rounded-xl border border-gray-200 ${accentFocus} text-gray-900 font-semibold bg-gray-50 focus:bg-white outline-none text-sm transition-all`}
                />
                <span className="absolute right-1.5 top-2.5 text-gray-400 text-[10px] pointer-events-none">ml/m²</span>
              </div>
            </div>
          </div>
          {/* Coste calculado */}
          <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${isLatex ? 'bg-emerald-50 border-emerald-200' : 'bg-orange-50 border-orange-200'}`}>
            <span className="text-xs font-semibold text-gray-600">Coste tinta calculado:</span>
            <span className={`text-sm font-black ${isLatex ? 'text-emerald-700' : 'text-orange-700'}`}>
              {inkCostPerM2.toFixed(3)} €/m²
            </span>
          </div>
        </div>

        {/* ── Inversión y amortización ── */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Inversión y Amortización</h3>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Precio de compra</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-semibold pointer-events-none">€</span>
              <input type="number" value={price || ''} onChange={e => onParamChange('price', Number(e.target.value))}
                min="0" step="100" placeholder="15000"
                className={`w-full px-3 py-2.5 pl-7 rounded-xl border border-gray-200 ${accentFocus} text-gray-900 font-semibold bg-gray-50 focus:bg-white outline-none text-sm transition-all`}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Vida útil</label>
              <div className="relative">
                <input type="number" value={lifetimeYears || ''} onChange={e => onParamChange('lifetimeYears', Number(e.target.value))}
                  min="1" step="1" placeholder="7"
                  className={`w-full px-3 py-2.5 rounded-xl border border-gray-200 ${accentFocus} text-gray-900 font-semibold bg-gray-50 focus:bg-white outline-none text-sm transition-all`}
                />
                <span className="absolute right-2 top-2.5 text-gray-400 text-xs pointer-events-none">años</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Valor residual</label>
              <div className="relative">
                <span className="absolute left-2.5 top-2.5 text-gray-400 text-xs pointer-events-none">€</span>
                <input type="number" value={residualValue || ''} onChange={e => onParamChange('residualValue', Number(e.target.value))}
                  min="0" step="100" placeholder="2000"
                  className={`w-full px-3 py-2.5 pl-6 rounded-xl border border-gray-200 ${accentFocus} text-gray-900 font-semibold bg-gray-50 focus:bg-white outline-none text-sm transition-all`}
                />
              </div>
            </div>
          </div>

          {/* Coste de cabezales */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Coste cabezales/mes</label>
            <div className="relative">
              <span className="absolute left-2.5 top-2.5 text-gray-400 text-xs pointer-events-none">€</span>
              <input type="number" value={headCostMonthly || ''} onChange={e => onParamChange('headCostMonthly', Number(e.target.value))}
                min="0" step="5" placeholder="75"
                className={`w-full px-3 py-2.5 pl-6 rounded-xl border border-gray-200 ${accentFocus} text-gray-900 font-semibold bg-gray-50 focus:bg-white outline-none text-sm transition-all`}
              />
              <span className="absolute right-2 top-2.5 text-gray-400 text-xs pointer-events-none">/mes</span>
            </div>
            <p className={`text-[10px] mt-1 font-semibold ${headCostMonthly <= 25 ? 'text-emerald-600' : 'text-orange-600'}`}>
              {headCostMonthly <= 25
                ? '✓ Látex: cabezales consumibles, bajo coste'
                : '⚠ Piezo: riesgo de avería (1.500–2.500€ por cabezal)'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Calculadora principal ────────────────────────────────────────────────────
const Calculator: React.FC = () => {
  const { data, updateData, calculate } = useData();
  const navigate = useNavigate();
  const [showClientForm, setShowClientForm] = useState(false);

  // ── Cambio de máquina A ──
  const handleMachineAChange = (model: string) => {
    const m = ALL_MACHINES.find(x => x.model === model);
    if (m) updateData({
      machineAModel: model,
      machineASpeed: m.printSpeed,
      machineAInkPricePerLiter: m.inkPricePerLiter,
      machineAInkMlPerM2: m.inkMlPerM2,
      machineAInkCost: m.inkCostPerM2,
      machineAMaintenance: m.weeklyMaintenance,
      machineADryTime: m.dryTimeHours,
      machineAPrice: m.referencePrice,
      machineALifetimeYears: m.lifetimeYears,
      machineAResidualValue: m.residualValue,
      machineAHeadCostMonthly: Math.round(m.headCostAnnual / 12),
    });
  };

  // ── Cambio de máquina B ──
  const handleMachineBChange = (model: string) => {
    const m = ALL_MACHINES.find(x => x.model === model);
    if (m) updateData({
      machineBModel: model,
      machineBSpeed: m.printSpeed,
      machineBInkPricePerLiter: m.inkPricePerLiter,
      machineBInkMlPerM2: m.inkMlPerM2,
      machineBInkCost: m.inkCostPerM2,
      machineBMaintenance: m.weeklyMaintenance,
      machineBDryTime: m.dryTimeHours,
      machineBPrice: m.referencePrice,
      machineBLifetimeYears: m.lifetimeYears,
      machineBResidualValue: m.residualValue,
      machineBHeadCostMonthly: Math.round(m.headCostAnnual / 12),
    });
  };

  // ── Parámetros máquina A ──
  const handleAParam = (key: string, val: number) => {
    if (key === 'inkPricePerLiter') {
      updateData({ machineAInkPricePerLiter: val, machineAInkCost: val * data.machineAInkMlPerM2 / 1000 });
    } else if (key === 'inkMlPerM2') {
      updateData({ machineAInkMlPerM2: val, machineAInkCost: data.machineAInkPricePerLiter * val / 1000 });
    } else {
      updateData({ [`machineA${key.charAt(0).toUpperCase() + key.slice(1)}`]: val } as any);
    }
  };

  // ── Parámetros máquina B ──
  const handleBParam = (key: string, val: number) => {
    if (key === 'inkPricePerLiter') {
      updateData({ machineBInkPricePerLiter: val, machineBInkCost: val * data.machineBInkMlPerM2 / 1000 });
    } else if (key === 'inkMlPerM2') {
      updateData({ machineBInkMlPerM2: val, machineBInkCost: data.machineBInkPricePerLiter * val / 1000 });
    } else {
      updateData({ [`machineB${key.charAt(0).toUpperCase() + key.slice(1)}`]: val } as any);
    }
  };

  const handleCalculateAndNavigate = () => {
    calculate();
    Promise.resolve().then(() => navigate('/cost-breakdown'));
  };

  const inkA = data.machineAInkPricePerLiter * data.machineAInkMlPerM2 / 1000;
  const inkB = data.machineBInkPricePerLiter * data.machineBInkMlPerM2 / 1000;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/20 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <header className="pb-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center shadow-md">
              <GitCompare size={20} className="text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">Comparador de Impresoras</h1>
          </div>
          <p className="text-gray-500 mt-1 ml-[52px]">Selecciona dos máquinas y compara su TCO real (costes totales de propiedad).</p>
        </header>

        {/* ── Datos del Cliente (colapsable) ── */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden"
        >
          <button
            className="w-full flex items-center justify-between px-5 lg:px-6 py-4 hover:bg-blue-50/50 transition-colors"
            onClick={() => setShowClientForm(v => !v)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <User size={15} className="text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900 text-sm">Datos del Cliente</p>
                <p className="text-xs text-gray-400">
                  {data.clientCompany
                    ? `${data.clientCompany}${data.clientSector ? ` · ${data.clientSector}` : ''}`
                    : 'Opcional — aparecerá en el informe PDF'}
                </p>
              </div>
            </div>
            {showClientForm ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
          </button>

          <AnimatePresence>
            {showClientForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 lg:px-6 pb-5 border-t border-blue-50 pt-4 grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Empresa</label>
                    <div className="relative">
                      <Building2 size={14} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        value={data.clientCompany}
                        onChange={e => updateData({ clientCompany: e.target.value })}
                        placeholder="Nombre de la empresa"
                        className="w-full px-3 py-2.5 pl-8 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-gray-900 bg-gray-50 focus:bg-white outline-none text-sm transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Contacto</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        value={data.clientName}
                        onChange={e => updateData({ clientName: e.target.value })}
                        placeholder="Nombre del contacto"
                        className="w-full px-3 py-2.5 pl-8 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-gray-900 bg-gray-50 focus:bg-white outline-none text-sm transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Sector</label>
                    <div className="relative rounded-xl border border-gray-200 overflow-hidden">
                      <select
                        value={data.clientSector}
                        onChange={e => updateData({ clientSector: e.target.value })}
                        className="w-full px-3 py-2.5 pr-8 bg-gray-50 text-gray-900 text-sm font-semibold focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="">Seleccionar sector…</option>
                        {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                        <ChevronDown size={16} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* ── Dos columnas de máquinas ── */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <MachineColumn
              label="Máquina A — Actual"
              accentLabel="Máquina que tiene el cliente"
              accent="indigo"
              selectedModel={data.machineAModel}
              onModelChange={handleMachineAChange}
              speed={data.machineASpeed}
              inkPricePerLiter={data.machineAInkPricePerLiter}
              inkMlPerM2={data.machineAInkMlPerM2}
              inkCostPerM2={inkA}
              maintenance={data.machineAMaintenance}
              dryTime={data.machineADryTime}
              price={data.machineAPrice}
              lifetimeYears={data.machineALifetimeYears}
              residualValue={data.machineAResidualValue}
              headCostMonthly={data.machineAHeadCostMonthly}
              onParamChange={handleAParam}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <MachineColumn
              label="Máquina B — HP Latex"
              accentLabel="Solución Digital Market propuesta"
              accent="amber"
              selectedModel={data.machineBModel}
              onModelChange={handleMachineBChange}
              speed={data.machineBSpeed}
              inkPricePerLiter={data.machineBInkPricePerLiter}
              inkMlPerM2={data.machineBInkMlPerM2}
              inkCostPerM2={inkB}
              maintenance={data.machineBMaintenance}
              dryTime={data.machineBDryTime}
              price={data.machineBPrice}
              lifetimeYears={data.machineBLifetimeYears}
              residualValue={data.machineBResidualValue}
              headCostMonthly={data.machineBHeadCostMonthly}
              onParamChange={handleBParam}
            />
          </motion.div>
        </div>

        {/* ── Parámetros compartidos ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="bg-gray-900 px-5 lg:px-6 py-4 flex items-center gap-3">
            <span className="w-2 h-6 bg-purple-400 rounded-full" />
            <h2 className="font-bold text-white text-lg">Parámetros de Producción</h2>
          </div>

          <div className="p-5 lg:p-6 space-y-6">
            {/* Volumen + Escenario */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Volumen Mensual de Producción</label>
                <div className="relative">
                  <input
                    type="number"
                    value={data.monthlyVolume || ''}
                    onChange={e => updateData({ monthlyVolume: Number(e.target.value) })}
                    min="0" step="100" placeholder="1500"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-900 font-semibold bg-gray-50 focus:bg-white outline-none transition-all"
                  />
                  <span className="absolute right-4 top-3.5 text-gray-400 font-semibold text-sm pointer-events-none">m²/mes</span>
                </div>
              </div>

              {/* Escenario de crecimiento */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Escenario de Producción</label>
                <div className="flex gap-2">
                  {GROWTH_SCENARIOS.map(s => (
                    <button
                      key={s.value}
                      onClick={() => updateData({ growthRate: s.value })}
                      className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                        data.growthRate === s.value
                          ? 'bg-purple-600 text-white border-transparent shadow-md'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                {data.growthRate > 0 && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <TrendingUp size={12} />
                    HP Latex producirá {(data.growthRate * 100).toFixed(0)}% más m² gracias a mayor velocidad y 0h de secado
                  </div>
                )}
                {data.growthRate === 0 && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                    <AlertTriangle size={12} />
                    Escenario conservador: mismo volumen para ambas máquinas
                  </div>
                )}
              </div>
            </div>

            {/* Mix + Precios venta */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mezcla de Producción (%)</h3>
                <div className="grid grid-cols-2 gap-4">
                  {(['lona', 'vinilo'] as const).map((type) => {
                    const key = type === 'lona' ? 'lonaPercentage' : 'viniloPercentage';
                    const other = type === 'lona' ? 'viniloPercentage' : 'lonaPercentage';
                    return (
                      <div key={type}>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">{type.charAt(0).toUpperCase() + type.slice(1)}</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={data[key]}
                            onChange={e => {
                              const val = Math.min(100, Math.max(0, Number(e.target.value)));
                              updateData({ [key]: val, [other]: 100 - val });
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-900 font-semibold bg-gray-50 focus:bg-white outline-none transition-all"
                          />
                          <span className="absolute right-3 top-3.5 text-gray-400 font-bold text-sm">%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
                  <div className="h-full bg-purple-600 transition-all duration-500 rounded-l-full" style={{ width: `${data.lonaPercentage}%` }} />
                  <div className="h-full bg-purple-200 transition-all duration-500 rounded-r-full" style={{ width: `${data.viniloPercentage}%` }} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Costes de Material base (€/m²)</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Lona', name: 'lonaMaterialCost', val: data.lonaMaterialCost },
                    { label: 'Vinilo', name: 'viniloMaterialCost', val: data.viniloMaterialCost },
                  ].map(({ label, name, val }) => (
                    <div key={name}>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">{label}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3.5 text-gray-400 font-bold text-sm">€</span>
                        <input
                          type="number"
                          value={val}
                          onChange={e => updateData({ [name]: Number(e.target.value) })}
                          step="0.01"
                          className="w-full px-4 py-3 pl-7 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-900 font-semibold bg-gray-50 focus:bg-white outline-none transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Precios de Venta Final (€/m²)</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'PVP Lona', name: 'lonaSellPrice', val: data.lonaSellPrice },
                    { label: 'PVP Vinilo', name: 'viniloSellPrice', val: data.viniloSellPrice },
                  ].map(({ label, name, val }) => (
                    <div key={name}>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">{label}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3.5 text-gray-400 font-bold text-sm">€</span>
                        <input
                          type="number"
                          value={val}
                          onChange={e => updateData({ [name]: Number(e.target.value) })}
                          className="w-full px-4 py-3 pl-7 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-900 font-semibold bg-gray-50 focus:bg-white outline-none transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Financiación */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Financiación Máquina B (Renting)</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Plazo</label>
                  <div className="relative rounded-xl border border-gray-200 overflow-hidden">
                    <select
                      value={data.rentingMonths}
                      onChange={e => updateData({ rentingMonths: Number(e.target.value) })}
                      className="w-full px-4 py-3 pr-10 bg-gray-50 text-gray-900 font-semibold focus:outline-none appearance-none cursor-pointer"
                    >
                      {[12, 24, 36, 48, 60].map(m => <option key={m} value={m}>{m} Meses ({m / 12} {m === 12 ? 'año' : 'años'})</option>)}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                      <ChevronDown size={18} className="text-gray-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Interés Anual</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={data.rentingInterest}
                      onChange={e => updateData({ rentingInterest: Number(e.target.value) })}
                      min="0" step="0.1"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 text-gray-900 font-semibold bg-gray-50 focus:bg-white outline-none transition-all"
                    />
                    <span className="absolute right-4 top-3.5 text-gray-400 font-bold text-sm">%</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 italic">* Habitual: 6.0% – 7.5%</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Botones de acción ── */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleCalculateAndNavigate}
            className="flex-1 bg-gray-900 text-white font-black py-4 rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 shadow-lg text-base"
          >
            <GitCompare size={20} />
            <span>Calcular Comparativa Completa</span>
            <ArrowRight size={18} />
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 lg:px-10 bg-white border-2 border-gray-200 text-gray-600 font-bold py-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <RefreshCw size={18} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Calculator;
