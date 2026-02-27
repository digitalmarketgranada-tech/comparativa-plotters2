import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData, ALL_MACHINES, Machine, groupedMachines } from '../context/DataContext';
import { motion } from 'motion/react';
import { GitCompare, RefreshCw, ChevronDown, Info, ArrowRight } from 'lucide-react';

// ─── Colour scheme per brand ──────────────────────────────────────────────────
const brandColors: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  'HP Latex': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', badge: 'bg-sky-600 text-white' },
  Roland: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-600 text-white' },
  Mimaki: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-600 text-white' },
  Epson: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', badge: 'bg-slate-700 text-white' },
};

// ─── Shared machine column ────────────────────────────────────────────────────
interface MachineColumnProps {
  label: string;
  accent: 'indigo' | 'amber';
  selectedModel: string;
  onModelChange: (model: string) => void;
  speed: number;
  inkCost: number;
  maintenance: number;
  dryTime: number;
  price: number;
  onParamChange: (key: string, val: number) => void;
  showPrice?: boolean;
}

const MachineColumn: React.FC<MachineColumnProps> = ({
  label, accent, selectedModel, onModelChange,
  speed, inkCost, maintenance, dryTime, price, onParamChange, showPrice = true,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const selectedMachine: Machine | undefined = ALL_MACHINES.find(m => m.model === selectedModel);
  const brand = selectedMachine?.brand ?? 'Roland';
  const bs = brandColors[brand] ?? brandColors.Roland;

  const accentHeader = accent === 'indigo'
    ? 'bg-indigo-600'
    : 'bg-amber-500';
  const accentFocus = accent === 'indigo'
    ? 'focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
    : 'focus:border-amber-400 focus:ring-2 focus:ring-amber-100';
  const accentTag = accent === 'indigo'
    ? 'bg-indigo-100 text-indigo-700'
    : 'bg-amber-100 text-amber-700';

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      {/* Header */}
      <div className={`${accentHeader} px-5 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <span className="w-2 h-6 bg-white/40 rounded-full" />
          <h2 className="font-bold text-white text-lg">{label}</h2>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${accentTag}`}>
          {selectedMachine?.technology === 'latex' ? 'Latex' : 'Eco-Solvente'}
        </span>
      </div>

      <div className="p-5 space-y-5 flex-1">
        {/* Brand filter + Model select */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Modelo</label>

          {/* Brand pills */}
          <div className="flex flex-wrap gap-2 mb-3">
            {Object.keys(groupedMachines).map(b => (
              <button
                key={b}
                type="button"
                onClick={() => onModelChange(groupedMachines[b][0].model)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${brand === b
                  ? brandColors[b].badge + ' border-transparent shadow-sm'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                  }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Model dropdown */}
          <div className={`relative rounded-xl border-2 transition-all ${bs.border} overflow-hidden`}>
            <select
              value={selectedModel}
              onChange={e => onModelChange(e.target.value)}
              className={`w-full px-4 py-3 pr-10 ${bs.bg} ${bs.text} font-semibold text-sm focus:outline-none appearance-none cursor-pointer`}
            >
              {Object.entries(groupedMachines).map(([b, machines]) => (
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

          {/* Specs card */}
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
                Especificaciones automáticas
                <ChevronDown size={13} className={`transition-transform ${showInfo ? 'rotate-180' : ''}`} />
              </button>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Velocidad', val: `${selectedMachine.printSpeed}`, unit: 'm²/h' },
                  { label: 'Tinta', val: `${selectedMachine.inkCostPerM2.toFixed(2)}€`, unit: '/m²' },
                  { label: 'Secado', val: selectedMachine.dryTimeHours === 0 ? 'Inst.' : `${selectedMachine.dryTimeHours}h`, unit: '' },
                ].map(({ label: l, val, unit }) => (
                  <div key={l} className="bg-white/70 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-gray-500 font-semibold uppercase">{l}</p>
                    <p className={`text-sm font-black ${bs.text}`}>{val}</p>
                    <p className="text-[9px] text-gray-400">{unit}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-2 italic">* Ajustables en los campos de abajo.</p>
            </motion.div>
          )}
        </div>

        {/* Editable params */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Parámetros editables</h3>

          {/* Speed + Maintenance row */}
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

          {/* Ink cost + Dry time row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Coste Tinta</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 text-xs pointer-events-none">€</span>
                <input type="number" value={inkCost || ''} onChange={e => onParamChange('inkCost', Number(e.target.value))}
                  min="0" step="0.01" placeholder="0.84"
                  className={`w-full px-3 py-2.5 pl-6 rounded-xl border border-gray-200 ${accentFocus} text-gray-900 font-semibold bg-gray-50 focus:bg-white outline-none text-sm transition-all`}
                />
                <span className="absolute right-2 top-2.5 text-gray-400 text-xs pointer-events-none">/m²</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Secado</label>
              <div className="relative">
                <input type="number" value={dryTime || ''} onChange={e => onParamChange('dryTime', Number(e.target.value))}
                  min="0" step="1" placeholder="0"
                  className={`w-full px-3 py-2.5 rounded-xl border border-gray-200 ${accentFocus} text-gray-900 font-semibold bg-gray-50 focus:bg-white outline-none text-sm transition-all`}
                />
                <span className="absolute right-2 top-2.5 text-gray-400 text-xs pointer-events-none">h</span>
              </div>
            </div>
          </div>


          {/* Price — only shown for machine B (machine A is already paid) */}
          {showPrice && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Precio de la Máquina</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-semibold pointer-events-none">€</span>
                <input type="number" value={price || ''} onChange={e => onParamChange('price', Number(e.target.value))}
                  min="0" step="100" placeholder="15000"
                  className={`w-full px-3 py-2.5 pl-7 rounded-xl border border-gray-200 ${accentFocus} text-gray-900 font-semibold bg-gray-50 focus:bg-white outline-none text-sm transition-all`}
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

// ─── Main Calculator ──────────────────────────────────────────────────────────
const Calculator: React.FC = () => {
  const { data, updateData, calculate } = useData();
  const navigate = useNavigate();

  const handleMachineAChange = (model: string) => {
    const m = ALL_MACHINES.find(x => x.model === model);
    if (m) updateData({
      machineAModel: model,
      machineASpeed: m.printSpeed,
      machineAInkCost: m.inkCostPerM2,
      machineAMaintenance: m.weeklyMaintenance,
      machineADryTime: m.dryTimeHours,
      machineAPrice: m.referencePrice,
    });
  };

  const handleMachineBChange = (model: string) => {
    const m = ALL_MACHINES.find(x => x.model === model);
    if (m) updateData({
      machineBModel: model,
      machineBSpeed: m.printSpeed,
      machineBInkCost: m.inkCostPerM2,
      machineBMaintenance: m.weeklyMaintenance,
      machineBDryTime: m.dryTimeHours,
      machineBPrice: m.referencePrice,
    });
  };

  const handleAParam = (key: string, val: number) => updateData({ [`machineA${key.charAt(0).toUpperCase() + key.slice(1)}`]: val } as any);
  const handleBParam = (key: string, val: number) => updateData({ [`machineB${key.charAt(0).toUpperCase() + key.slice(1)}`]: val } as any);

  const handleCalculateAndNavigate = () => {
    calculate();
    Promise.resolve().then(() => navigate('/cost-breakdown'));
  };

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
          <p className="text-gray-500 mt-1 ml-13 pl-1">Selecciona dos máquinas y compara sus costes reales de producción.</p>
        </header>

        {/* ── Two machine columns ── */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <MachineColumn
              label="Máquina A"
              accent="indigo"
              selectedModel={data.machineAModel}
              onModelChange={handleMachineAChange}
              speed={data.machineASpeed}
              inkCost={data.machineAInkCost}
              maintenance={data.machineAMaintenance}
              dryTime={data.machineADryTime}
              price={data.machineAPrice}
              onParamChange={handleAParam}
              showPrice={false}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <MachineColumn
              label="Máquina B"
              accent="amber"
              selectedModel={data.machineBModel}
              onModelChange={handleMachineBChange}
              speed={data.machineBSpeed}
              inkCost={data.machineBInkCost}
              maintenance={data.machineBMaintenance}
              dryTime={data.machineBDryTime}
              price={data.machineBPrice}
              onParamChange={handleBParam}
            />
          </motion.div>
        </div>

        {/* ── Shared parameters ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="bg-gray-900 px-5 lg:px-6 py-4 flex items-center gap-3">
            <span className="w-2 h-6 bg-purple-400 rounded-full" />
            <h2 className="font-bold text-white text-lg">Parámetros Compartidos</h2>
          </div>

          <div className="p-5 lg:p-6 space-y-6">
            {/* Volume */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Volumen Mensual de Producción</label>
              <div className="relative max-w-xs">
                <input
                  type="number"
                  value={data.monthlyVolume || ''}
                  onChange={e => updateData({ monthlyVolume: Number(e.target.value) })}
                  min="0" step="100" placeholder="1500"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-900 font-semibold bg-gray-50 focus:bg-white outline-none transition-all"
                />
                <span className="absolute right-4 top-3.5 text-gray-400 font-semibold text-sm pointer-events-none">m²</span>
              </div>
            </div>

            {/* Mix + Sell prices */}
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

            {/* Financing */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Financiación Máquina B (Opcional)</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Plazo</label>
                  <div className="relative rounded-xl border border-gray-200 overflow-hidden">
                    <select
                      value={data.rentingMonths}
                      onChange={e => updateData({ rentingMonths: Number(e.target.value) })}
                      className="w-full px-4 py-3 pr-10 bg-gray-50 text-gray-900 font-semibold focus:outline-none appearance-none cursor-pointer"
                    >
                      {[12, 24, 36, 48, 60].map(m => <option key={m} value={m}>{m} Meses</option>)}
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

        {/* ── Action buttons ── */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleCalculateAndNavigate}
            className="flex-1 bg-gray-900 text-white font-black py-4 rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 shadow-lg text-base"
          >
            <GitCompare size={20} />
            <span>Calcular Comparativa</span>
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
