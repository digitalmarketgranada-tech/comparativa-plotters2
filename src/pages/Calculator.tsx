import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData, COMPETITOR_MACHINES, CompetitorMachine, HP_MACHINES } from '../context/DataContext';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator as CalcIcon, RefreshCw, ChevronDown, Info } from 'lucide-react';

const brandColors: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  Roland: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-600 text-white' },
  Mimaki: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-600 text-white' },
  Epson: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', badge: 'bg-slate-800 text-white' },
};

const groupedMachines = COMPETITOR_MACHINES.reduce<Record<string, CompetitorMachine[]>>((acc, machine) => {
  if (!acc[machine.brand]) acc[machine.brand] = [];
  acc[machine.brand].push(machine);
  return acc;
}, {});

const Calculator: React.FC = () => {
  const { data, updateData, calculate } = useData();
  const navigate = useNavigate();
  const [showMachineInfo, setShowMachineInfo] = useState(false);

  const selectedMachine = COMPETITOR_MACHINES.find(m => m.model === data.currentMachineModel);
  const selectedBrand = selectedMachine?.brand || 'Roland';
  const brandStyle = brandColors[selectedBrand];

  const handleMachineChange = (model: string) => {
    const machine = COMPETITOR_MACHINES.find(m => m.model === model);
    if (machine) {
      updateData({
        currentMachineModel: model,
        printSpeed: machine.printSpeed,
        maintenanceHours: machine.weeklyMaintenance,
        inkPrice: machine.inkPricePerLiter,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'hpMachineModel') {
      const hpMachine = HP_MACHINES.find(m => m.model === value);
      updateData({
        hpMachineModel: value,
        hpPrintSpeed: hpMachine?.printSpeed ?? data.hpPrintSpeed,
      });
    } else {
      const numValue = value === '' ? 0 : Number(value);
      updateData({ [name]: numValue });
    }
  };

  const handleCalculateAndNavigate = () => {
    calculate();
    Promise.resolve().then(() => navigate('/cost-breakdown'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <header className="pb-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center shadow-md shadow-sky-200">
              <CalcIcon size={20} className="text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">Calculadora ROI</h1>
          </div>
          <p className="text-gray-500 mt-1 ml-13 pl-1">Selecciona tu máquina actual e introduce los datos para obtener la comparativa precisa.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* ─── Máquina Actual ─── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="bg-gray-900 px-5 lg:px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-6 bg-rose-400 rounded-full"></span>
                <h2 className="font-bold text-white text-lg">Máquina Actual</h2>
              </div>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Competencia</span>
            </div>

            <div className="p-5 lg:p-6 space-y-5">
              {/* Brand + Model Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Modelo de Máquina</label>

                {/* Brand badge line */}
                <div className="flex gap-2 mb-3">
                  {Object.keys(groupedMachines).map(brand => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => {
                        const first = groupedMachines[brand][0];
                        handleMachineChange(first.model);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedBrand === brand
                        ? brandColors[brand].badge + ' border-transparent shadow-sm'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>

                {/* Model select */}
                <div className={`relative rounded-xl border-2 transition-all ${brandStyle.border} overflow-hidden`}>
                  <select
                    value={data.currentMachineModel}
                    onChange={(e) => handleMachineChange(e.target.value)}
                    className={`w-full px-4 py-3 pr-10 ${brandStyle.bg} ${brandStyle.text} font-semibold text-sm focus:outline-none appearance-none bg-no-repeat cursor-pointer`}
                  >
                    {Object.entries(groupedMachines).map(([brand, machines]) => (
                      <optgroup key={brand} label={`── ${brand} ──`}>
                        {machines.map(machine => (
                          <option key={machine.model} value={machine.model}>
                            {machine.model}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <ChevronDown size={18} className={brandStyle.text} />
                  </div>
                </div>

                {/* Machine info card */}
                {selectedMachine && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    key={selectedMachine.model}
                    className={`mt-3 p-3 rounded-xl border ${brandStyle.border} ${brandStyle.bg}`}
                  >
                    <button
                      onClick={() => setShowMachineInfo(!showMachineInfo)}
                      className={`flex items-center gap-1.5 text-xs font-bold ${brandStyle.text} mb-2`}
                    >
                      <Info size={13} />
                      Especificaciones: {selectedMachine.model}
                      <ChevronDown size={13} className={`transition-transform ${showMachineInfo ? 'rotate-180' : ''}`} />
                    </button>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white/70 rounded-lg p-2 text-center">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase">Velocidad</p>
                        <p className={`text-sm font-black ${brandStyle.text}`}>{selectedMachine.printSpeed}</p>
                        <p className="text-[9px] text-gray-400">m²/h</p>
                      </div>
                      <div className="bg-white/70 rounded-lg p-2 text-center">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase">Consumo</p>
                        <p className={`text-sm font-black ${brandStyle.text}`}>{(selectedMachine.inkConsumption * 1000).toFixed(0)}</p>
                        <p className="text-[9px] text-gray-400">ml/m²</p>
                      </div>
                      <div className="bg-white/70 rounded-lg p-2 text-center">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase">Mantenim.</p>
                        <p className={`text-sm font-black ${brandStyle.text}`}>{selectedMachine.weeklyMaintenance}h</p>
                        <p className="text-[9px] text-gray-400">semanal</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 italic">* Datos auto-rellenados. Puedes ajustarlos abajo.</p>
                  </motion.div>
                )}
              </div>

              {/* Monthly Volume */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Volumen Mensual</label>
                <div className="relative">
                  <input
                    type="number"
                    name="monthlyVolume"
                    value={data.monthlyVolume || ''}
                    onChange={handleChange}
                    min="0"
                    step="100"
                    placeholder="1500"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 text-gray-900 font-semibold placeholder-gray-300 bg-gray-50 focus:bg-white transition-all outline-none"
                  />
                  <span className="absolute right-4 top-3.5 text-gray-400 font-semibold text-sm pointer-events-none">m²</span>
                </div>
              </div>

              {/* Ink Price */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Precio Tinta</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-400 font-semibold text-sm pointer-events-none">€</span>
                  <input
                    type="number"
                    name="inkPrice"
                    value={data.inkPrice || ''}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    placeholder="75"
                    className="w-full px-4 py-3 pl-8 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 text-gray-900 font-semibold placeholder-gray-300 bg-gray-50 focus:bg-white transition-all outline-none"
                  />
                  <span className="absolute right-4 top-3.5 text-gray-400 font-semibold text-sm pointer-events-none">/L</span>
                </div>
              </div>

              {/* Print Speed + Maintenance row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Velocidad</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="printSpeed"
                      value={data.printSpeed || ''}
                      onChange={handleChange}
                      min="0"
                      step="0.5"
                      placeholder="20"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 text-gray-900 font-semibold placeholder-gray-300 bg-gray-50 focus:bg-white transition-all outline-none"
                    />
                    <span className="absolute right-3 top-3.5 text-gray-400 font-medium text-xs pointer-events-none">m²/h</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Mantenim./sem</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="maintenanceHours"
                      value={data.maintenanceHours || ''}
                      onChange={handleChange}
                      min="0"
                      step="0.5"
                      placeholder="2"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 text-gray-900 font-semibold placeholder-gray-300 bg-gray-50 focus:bg-white transition-all outline-none"
                    />
                    <span className="absolute right-3 top-3.5 text-gray-400 font-medium text-xs pointer-events-none">h</span>
                  </div>
                </div>
              </div>

              {/* Wait Hours */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Tiempo Desgasificación</label>
                <div className="relative">
                  <input
                    type="number"
                    name="waitHours"
                    value={data.waitHours || ''}
                    onChange={handleChange}
                    min="0"
                    step="0.5"
                    placeholder="36"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 text-gray-900 font-semibold placeholder-gray-300 bg-gray-50 focus:bg-white transition-all outline-none"
                  />
                  <span className="absolute right-4 top-3.5 text-gray-400 font-semibold text-sm pointer-events-none">h</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">Horas de secado/desgasificación antes de poder cortar</p>
              </div>
            </div>
          </motion.section>

          {/* ─── HP Latex ─── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border-2 border-sky-400 overflow-hidden ring-4 ring-sky-50"
          >
            <div className="bg-gradient-to-r from-sky-600 to-blue-700 px-5 lg:px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-6 bg-sky-200 rounded-full"></span>
                <h2 className="font-bold text-white text-lg">HP Latex</h2>
              </div>
              <span className="bg-emerald-400 text-emerald-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">RECOMENDADO</span>
            </div>

            <div className="p-5 lg:p-6 space-y-5">
              {/* HP Model */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Modelo HP</label>
                <div className="relative rounded-xl border-2 border-sky-200 overflow-hidden">
                  <select
                    name="hpMachineModel"
                    value={data.hpMachineModel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-10 bg-sky-50 text-sky-800 font-semibold text-sm focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="HP Latex 630 Print & Cut">HP Latex 630 Print &amp; Cut</option>
                    <option value="HP Latex 730">HP Latex 730</option>
                    <option value="HP Latex 830">HP Latex 830</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <ChevronDown size={18} className="text-sky-600" />
                  </div>
                </div>
              </div>

              {/* HP Machine Price */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Precio Solución</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-400 font-semibold text-sm pointer-events-none">€</span>
                  <input
                    type="number"
                    name="hpMachinePrice"
                    value={data.hpMachinePrice || ''}
                    onChange={handleChange}
                    min="0"
                    step="100"
                    placeholder="19900"
                    className="w-full px-4 py-3 pl-8 rounded-xl border border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 text-gray-900 font-semibold placeholder-gray-300 bg-gray-50 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>

              {/* HP Print Speed */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Velocidad de Impresión</label>
                <div className="relative">
                  <input
                    type="number"
                    name="hpPrintSpeed"
                    value={data.hpPrintSpeed || ''}
                    onChange={handleChange}
                    min="0"
                    step="0.5"
                    placeholder="18"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 text-gray-900 font-semibold placeholder-gray-300 bg-gray-50 focus:bg-white transition-all outline-none"
                  />
                  <span className="absolute right-4 top-3.5 text-gray-400 font-semibold text-sm pointer-events-none">m²/h</span>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-4 rounded-xl border border-sky-200 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="text-sm font-bold text-sky-900">Coste Tinta: <span className="text-red-600">1,2 €/m²</span></p>
                    <p className="text-xs text-sky-600">Estándar HP (12,5 ml/m²)</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white rounded-lg py-2">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Mantenim.</p>
                    <p className="text-base font-black text-emerald-600">0h</p>
                  </div>
                  <div className="bg-white rounded-lg py-2">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Secado</p>
                    <p className="text-base font-black text-emerald-600">0h</p>
                  </div>
                  <div className="bg-white rounded-lg py-2">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Print+Cut</p>
                    <p className="text-base font-black text-sky-600">✓</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* ─── Distribución y Precios ─── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="bg-gray-900 px-5 lg:px-6 py-4 flex items-center gap-3">
            <span className="w-2 h-6 bg-purple-400 rounded-full"></span>
            <h2 className="font-bold text-white text-lg">Distribución de Trabajos y Precios de Venta</h2>
          </div>

          <div className="p-5 lg:p-6 grid gap-6 md:grid-cols-2">
            {/* Percentages */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mezcla de Producción (%)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Lona</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="lonaPercentage"
                      value={data.lonaPercentage}
                      onChange={(e) => {
                        const val = Math.min(100, Math.max(0, Number(e.target.value)));
                        updateData({ lonaPercentage: val, viniloPercentage: 100 - val });
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-900 font-semibold bg-gray-50 focus:bg-white transition-all outline-none"
                    />
                    <span className="absolute right-3 top-3.5 text-gray-400 font-bold text-sm">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Vinilo</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="viniloPercentage"
                      value={data.viniloPercentage}
                      onChange={(e) => {
                        const val = Math.min(100, Math.max(0, Number(e.target.value)));
                        updateData({ viniloPercentage: val, lonaPercentage: 100 - val });
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-900 font-semibold bg-gray-50 focus:bg-white transition-all outline-none"
                    />
                    <span className="absolute right-3 top-3.5 text-gray-400 font-bold text-sm">%</span>
                  </div>
                </div>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
                <div
                  className="h-full bg-purple-600 transition-all duration-500 rounded-l-full"
                  style={{ width: `${data.lonaPercentage}%` }}
                />
                <div
                  className="h-full bg-purple-200 transition-all duration-500 rounded-r-full"
                  style={{ width: `${data.viniloPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 font-medium">
                <span>🟪 Lona {data.lonaPercentage}%</span>
                <span>Vinilo {data.viniloPercentage}% 🔷</span>
              </div>
            </div>

            {/* Sell Prices */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Precios de Venta (€/m²)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Venta Lona</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-gray-400 font-bold text-sm">€</span>
                    <input
                      type="number"
                      name="lonaSellPrice"
                      value={data.lonaSellPrice}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-7 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-900 font-semibold bg-gray-50 focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Venta Vinilo</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-gray-400 font-bold text-sm">€</span>
                    <input
                      type="number"
                      name="viniloSellPrice"
                      value={data.viniloSellPrice}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-7 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-900 font-semibold bg-gray-50 focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 italic">* Precios medios de mercado para el cálculo del ROI.</p>
            </div>
          </div>
        </motion.section>

        {/* ─── Renting ─── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="bg-gray-900 px-5 lg:px-6 py-4 flex items-center gap-3">
            <span className="w-2 h-6 bg-emerald-400 rounded-full"></span>
            <h2 className="font-bold text-white text-lg">Financiación / Renting <span className="text-gray-400 font-normal text-sm">(Opcional)</span></h2>
          </div>

          <div className="p-5 lg:p-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Plazo del Renting</label>
              <div className="relative rounded-xl border border-gray-200 overflow-hidden">
                <select
                  name="rentingMonths"
                  value={data.rentingMonths}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-10 bg-gray-50 text-gray-900 font-semibold focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="12">12 Meses</option>
                  <option value="24">24 Meses</option>
                  <option value="36">36 Meses</option>
                  <option value="48">48 Meses</option>
                  <option value="60">60 Meses</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <ChevronDown size={18} className="text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Interés Anual Estimado</label>
              <div className="relative">
                <input
                  type="number"
                  name="rentingInterest"
                  value={data.rentingInterest}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 text-gray-900 font-semibold bg-gray-50 focus:bg-white transition-all outline-none"
                />
                <span className="absolute right-4 top-3.5 text-gray-400 font-bold text-sm">%</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5 italic">* Media habitual: 6.0% – 7.5%</p>
            </div>
          </div>
        </motion.section>

        {/* ─── Action Buttons ─── */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleCalculateAndNavigate}
            className="flex-1 bg-gradient-to-r from-sky-600 to-blue-700 text-white font-black py-4 rounded-xl hover:from-sky-500 hover:to-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 shadow-lg shadow-sky-200 hover:shadow-xl hover:shadow-sky-200 text-base"
          >
            <CalcIcon size={20} />
            <span>Calcular Comparativa</span>
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
