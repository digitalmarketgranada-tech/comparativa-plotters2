import React, { useRef, useState } from 'react';
import { useData, COMPETITOR_MACHINES } from '../context/DataContext';
import { Download, Printer, TrendingUp, Euro, Clock, Leaf, Monitor, BarChart3, CheckCircle, AlertTriangle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Report: React.FC = () => {
  const { data, results } = useData();
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const fc = (val: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  const fc2 = (val: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

  const competitorMachine = COMPETITOR_MACHINES.find(m => m.model === data.currentMachineModel);
  const solventSaving = results.currentMonthlyCost - results.hpMonthlyCost;
  const rentingCoversRatio = solventSaving / results.monthlyRentingQuota;
  const roiOk = results.hpNetMonthlyProfit >= results.currentMonthlyProfit;

  const handleDownloadPdf = async () => {
    setDownloading(true);
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff',
      });
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const ratio = Math.min(210 / imgWidth, 297 / imgHeight);
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Informe_ROI_DM_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Informe Final</h1>
          <p className="text-gray-400 text-sm mt-0.5">Generado el {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
        <button
          onClick={handleDownloadPdf}
          disabled={downloading}
          className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-700 transition-colors shadow-sm"
        >
          <Download size={16} />
          {downloading ? 'Generando...' : 'Descargar PDF'}
        </button>
      </div>

      {/* ══════════════ CONTENIDO DEL INFORME ══════════════ */}
      <div ref={reportRef} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">

        {/* CABECERA */}
        <div className="flex items-start justify-between pb-6 border-b-2 border-gray-900">
          <div className="flex items-center gap-4">
            <img src="/assets/logo-dm.png" alt="Digital Market" className="h-12 w-auto" />
            <div>
              <h2 className="text-xl font-black text-gray-900 leading-tight">Informe de Viabilidad ROI</h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">HP Latex Print & Cut — Análisis Comparativo</p>
            </div>
          </div>
          <div className="text-right text-xs text-gray-400">
            <p className="font-bold text-gray-600 text-sm">Digital Market</p>
            <p>Partner Especialista HP</p>
            <p className="mt-1">{new Date().toLocaleDateString('es-ES')}</p>
          </div>
        </div>

        {/* ── SECCIÓN 1: KPIs CLAVE ── */}
        <div>
          <SectionTitle icon={TrendingUp} label="Resultados Clave" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            <KpiCard label="Ahorro Anual" value={fc(results.annualSavings)} sub="operativo + tiempo" color="emerald" />
            <KpiCard label="Ahorro Mensual" value={fc(results.monthlySavings)} sub="vs situación actual" color="sky" />
            <KpiCard label="ROI — Retorno" value={`${results.roiMonths.toFixed(1)} meses`} sub="amortización inversión" color="violet" />
            <KpiCard label="Tiempo Liberado" value={`${Math.round(results.productionTimeSavings * 12)}h/año`} sub="sin esperas de desgasif." color="amber" />
          </div>
        </div>

        {/* ── SECCIÓN 2: DATOS DEL ANÁLISIS ── */}
        <div>
          <SectionTitle icon={Monitor} label="Datos Introducidos en el Análisis" />
          <div className="grid md:grid-cols-2 gap-4 mt-3">
            {/* Situación actual */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-rose-600 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider">Máquina Actual — Solvente</div>
              <div className="p-4 space-y-2">
                <DataRow label="Modelo" value={data.currentMachineModel} />
                <DataRow label="Volumen mensual" value={`${data.monthlyVolume} m²/mes`} />
                <DataRow label="Velocidad impresión" value={`${data.printSpeed} m²/h`} />
                <DataRow label="Precio tinta" value={`${fc2(data.inkPrice)}/L`} />
                <DataRow label="Mantenimiento semanal" value={`${data.maintenanceHours}h/semana`} />
                <DataRow label="Espera desgasificación" value={`${data.waitHours}h`} highlight="rose" />
                {competitorMachine && (
                  <DataRow label="Consumo tinta" value={`${(competitorMachine.inkConsumption * 1000).toFixed(0)} ml/m²`} />
                )}
              </div>
            </div>
            {/* Solución HP */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-sky-600 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider">Solución HP Latex</div>
              <div className="p-4 space-y-2">
                <DataRow label="Modelo HP" value={data.hpMachineModel} />
                <DataRow label="Velocidad HP (4 pasadas)" value={`${data.hpPrintSpeed} m²/h`} highlight="sky" />
                <DataRow label="Precio máquina" value={fc(data.hpMachinePrice)} />
                <DataRow label="Tinta HP (cartuchos 1L)" value={`${fc2(data.hpCartridgePrice)}/cartucho`} />
                <DataRow label="Coste tinta HP" value="1,20 €/m² (estándar)" />
                <DataRow label="Espera desgasificación" value="0h — curado instantáneo" highlight="emerald" />
                <DataRow label="Mantenimiento" value="0h/semana" highlight="emerald" />
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="mt-3 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-700 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider">Mix de Producción</div>
            <div className="p-4 grid md:grid-cols-4 gap-4">
              <DataRow label="Lona %" value={`${data.lonaPercentage}%`} />
              <DataRow label="Precio venta lona" value={`${fc2(data.lonaSellPrice)}/m²`} />
              <DataRow label="Vinilo %" value={`${data.viniloPercentage}%`} />
              <DataRow label="Precio venta vinilo" value={`${fc2(data.viniloSellPrice)}/m²`} />
            </div>
          </div>
        </div>

        {/* ── SECCIÓN 3: COMPARATIVA ECONÓMICA ── */}
        <div>
          <SectionTitle icon={Euro} label="Comparativa Económica Mensual" />
          <div className="mt-3 rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase w-1/2">Concepto</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-rose-500 uppercase">Solvente Actual</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-sky-600 uppercase">HP Latex</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-emerald-600 uppercase">Diferencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr className="bg-white">
                  <td className="px-4 py-3 text-gray-700 font-medium">Ventas estimadas</td>
                  <td className="px-4 py-3 text-right text-gray-900 font-bold">{fc(results.monthlyRevenue)}</td>
                  <td className="px-4 py-3 text-right text-gray-900 font-bold">{fc(results.monthlyRevenue)}</td>
                  <td className="px-4 py-3 text-right text-gray-400">—</td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-700 font-medium">Costes operativos (tinta + mano obra + esperas)</td>
                  <td className="px-4 py-3 text-right text-rose-600 font-bold">−{fc(results.currentMonthlyCost)}</td>
                  <td className="px-4 py-3 text-right text-emerald-600 font-bold">−{fc(results.hpMonthlyCost)}</td>
                  <td className="px-4 py-3 text-right text-emerald-600 font-bold">+{fc(solventSaving)}</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-3 text-gray-700 font-medium">Beneficio bruto</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">{fc(results.currentMonthlyProfit)}</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">{fc(results.hpMonthlyProfit)}</td>
                  <td className="px-4 py-3 text-right text-emerald-600 font-bold">+{fc(results.hpMonthlyProfit - results.currentMonthlyProfit)}</td>
                </tr>
                <tr className="bg-amber-50/60">
                  <td className="px-4 py-3 text-gray-700 font-medium">Cuota renting HP ({data.rentingMonths}m · {data.rentingInterest}%)</td>
                  <td className="px-4 py-3 text-right text-gray-400">No aplica</td>
                  <td className="px-4 py-3 text-right text-amber-600 font-bold">−{fc(results.monthlyRentingQuota)}</td>
                  <td className="px-4 py-3 text-right text-gray-400">Inversión</td>
                </tr>
                <tr className={`border-t-2 border-gray-200 ${roiOk ? 'bg-emerald-50' : 'bg-sky-50'}`}>
                  <td className="px-4 py-3 font-black text-gray-900">Beneficio neto final</td>
                  <td className="px-4 py-3 text-right font-black text-gray-900">{fc(results.currentMonthlyProfit)}</td>
                  <td className={`px-4 py-3 text-right font-black text-xl ${roiOk ? 'text-emerald-600' : 'text-sky-600'}`}>{fc(results.hpNetMonthlyProfit)}</td>
                  <td className={`px-4 py-3 text-right font-black ${roiOk ? 'text-emerald-600' : 'text-sky-500'}`}>
                    {roiOk ? '+' : ''}{fc(results.hpNetMonthlyProfit - results.currentMonthlyProfit)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Nota sobre el ROI */}
          <div className={`mt-3 rounded-xl p-4 flex gap-3 ${roiOk ? 'bg-emerald-50 border border-emerald-200' : 'bg-sky-50 border border-sky-200'}`}>
            {roiOk ? <CheckCircle className="text-emerald-600 flex-shrink-0 mt-0.5" size={18} /> : <AlertTriangle className="text-sky-600 flex-shrink-0 mt-0.5" size={18} />}
            <p className="text-sm text-gray-700 leading-relaxed">
              {roiOk
                ? <><strong>La máquina se amortiza sola:</strong> el ahorro operativo ({fc(solventSaving)}/mes) cubre la cuota de renting ({fc(results.monthlyRentingQuota)}/mes) con un excedente de <strong className="text-emerald-600">{fc(results.hpNetMonthlyProfit - results.currentMonthlyProfit)}/mes</strong>.</>
                : <><strong>El ahorro operativo ({fc(solventSaving)}/mes)</strong> no cubre íntegramente la cuota de renting ({fc(results.monthlyRentingQuota)}/mes). La diferencia de {fc(results.monthlyRentingQuota - solventSaving)}/mes se compensa con <strong>mayor capacidad productiva diaria</strong> (sin esperas de 24-48h) y la posibilidad de aceptar más pedidos al día.</>
              }
            </p>
          </div>
        </div>

        {/* ── SECCIÓN 4: FLUJO DE TRABAJO ── */}
        <div>
          <SectionTitle icon={Clock} label="Ventaja en Flujo de Trabajo" />
          <div className="mt-3 grid md:grid-cols-2 gap-4">
            <div className="border border-rose-100 rounded-xl overflow-hidden">
              <div className="bg-rose-50 px-4 py-2.5 text-xs font-black text-rose-700 uppercase">Proceso Actual (Solvente)</div>
              <div className="p-4 space-y-2 text-sm">
                <FlowStep num={1} label="Impresión" detail={`~${(data.monthlyVolume / (data.printSpeed * 168)).toFixed(0)}h producción mensual a ${data.printSpeed} m²/h`} bad />
                <FlowStep num={2} label={`Desgasificación — esperar ${data.waitHours}h`} detail="Plotter de corte bloqueado" bad />
                <FlowStep num={3} label="Laminado (si aplica)" detail="Solo posible tras desgasificación completa" bad />
                <FlowStep num={4} label="Corte" detail="Solo cuando ha terminado todo lo anterior" bad />
                <div className="mt-3 bg-rose-50 rounded-lg p-3 border border-rose-200">
                  <p className="text-xs font-bold text-rose-700">Tiempo total hasta entrega: 26-52h mínimo con laminado</p>
                </div>
              </div>
            </div>
            <div className="border-2 border-sky-300 rounded-xl overflow-hidden">
              <div className="bg-sky-600 text-white px-4 py-2.5 text-xs font-black uppercase">Proceso HP Latex (sin esperas)</div>
              <div className="p-4 space-y-2 text-sm">
                <FlowStep num={1} label="Impresión HP Latex" detail={`${data.hpPrintSpeed} m²/h — curado instantáneo en máquina`} ok />
                <FlowStep num={2} label="Plotter libre durante impresión" detail="Puede cortar otro pedido mientras se imprime" ok />
                <FlowStep num={3} label="Laminado (si aplica)" detail="Posible 1 min después de salir de impresora" ok />
                <FlowStep num={4} label="Corte inmediato" detail="Sin esperar desgasificación" ok />
                <div className="mt-3 bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                  <p className="text-xs font-bold text-emerald-700">Tiempo total hasta entrega: 2-5h mismo día</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECCIÓN 5: SOFTWARE HP PrintOS ── */}
        <div>
          <SectionTitle icon={BarChart3} label="HP PrintOS — Software Exclusivo en Nube" />
          <div className="mt-3 grid md:grid-cols-2 gap-3">
            {[
              { t: 'PrintOS Live — Monitorización Remota', d: 'Controla estado de la impresora, cola y tinta en tiempo real desde cualquier dispositivo.' },
              { t: 'Print Beat — Analíticas de Producción', d: 'Datos históricos y en tiempo real sobre rendimiento, consumo de tinta y KPIs de productividad.' },
              { t: 'PrintOS Box — Recepción Automatizada', d: 'Tus clientes envían archivos directamente; validación automática, preflight y enrutamiento a producción.' },
              { t: 'API Abierta — Sin Coste Adicional', d: 'Integración con MIS, ERP o web-to-print. Actualizaciones automáticas gestionadas por HP.' },
            ].map(({ t, d }, i) => (
              <div key={i} className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-black text-sky-700 mb-1">{t}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 italic">* Roland, Mimaki y Epson no ofrecen un ecosistema cloud equivalente de forma gratuita integrada.</p>
        </div>

        {/* ── SECCIÓN 6: SOSTENIBILIDAD ── */}
        <div>
          <SectionTitle icon={Leaf} label="Sostenibilidad y Certificaciones" />
          <div className="mt-3 grid md:grid-cols-3 gap-3">
            {[
              { badge: 'GREENGUARD Gold', desc: 'Certificado UL. Apto para instalación en escuelas, hospitales e interiores sensibles.' },
              { badge: 'UL ECOLOGO', desc: 'Sin COVs, sin olores. Tinta base agua 65%. No requiere ventilación forzada.' },
              { badge: 'Energy Star', desc: 'Menor consumo energético certificado. Sin residuos tóxicos — cartuchos reciclables HP.' },
            ].map(({ badge, desc }, i) => (
              <div key={i} className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
                <span className="inline-block text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded mb-2 uppercase">{badge}</span>
                <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECCIÓN 7: RENTING ── */}
        <div>
          <SectionTitle icon={Euro} label="Condiciones de Financiación (Renting)" />
          <div className="mt-3 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr><td className="px-4 py-2.5 text-gray-500">Precio máquina HP</td><td className="px-4 py-2.5 font-bold text-gray-900 text-right">{fc(data.hpMachinePrice)}</td></tr>
                <tr><td className="px-4 py-2.5 text-gray-500">Duración del renting</td><td className="px-4 py-2.5 font-bold text-gray-900 text-right">{data.rentingMonths} meses ({data.rentingMonths / 12} años)</td></tr>
                <tr><td className="px-4 py-2.5 text-gray-500">Tipo de interés anual</td><td className="px-4 py-2.5 font-bold text-gray-900 text-right">{data.rentingInterest}%</td></tr>
                <tr className="bg-amber-50"><td className="px-4 py-2.5 font-bold text-gray-700">Cuota mensual renting</td><td className="px-4 py-2.5 font-black text-amber-600 text-right text-lg">{fc(results.monthlyRentingQuota)}</td></tr>
                <tr><td className="px-4 py-2.5 text-gray-500">Ahorro operativo mensual HP vs Solvente</td><td className="px-4 py-2.5 font-bold text-emerald-600 text-right">{fc(solventSaving)}</td></tr>
                <tr className="bg-gray-100"><td className="px-4 py-2.5 font-bold text-gray-700">El ahorro cubre el {Math.min(100, Math.round(rentingCoversRatio * 100))}% de la cuota</td><td className="px-4 py-2.5 font-black text-right">{fc(results.monthlyRentingQuota * Math.min(1, rentingCoversRatio))} / {fc(results.monthlyRentingQuota)}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-400">
          <p>Digital Market · Partner Especialista HP Latex · <span className="font-bold">digital-market.es</span></p>
          <p>Informe generado automáticamente por Calculadora DM</p>
        </div>

      </div>
    </div>
  );
};

/* Componentes auxiliares */

const SectionTitle: React.FC<{ icon: React.ElementType; label: string }> = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 mb-1">
    <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center flex-shrink-0">
      <Icon size={13} className="text-white" />
    </div>
    <h3 className="font-black text-gray-900 text-base">{label}</h3>
  </div>
);

const KpiCard: React.FC<{ label: string; value: string; sub: string; color: string }> = ({ label, value, sub, color }) => {
  const bg: Record<string, string> = { emerald: 'bg-emerald-50 border-emerald-200', sky: 'bg-sky-50 border-sky-200', violet: 'bg-violet-50 border-violet-200', amber: 'bg-amber-50 border-amber-200' };
  const text: Record<string, string> = { emerald: 'text-emerald-700', sky: 'text-sky-700', violet: 'text-violet-700', amber: 'text-amber-700' };
  return (
    <div className={`rounded-xl border p-4 ${bg[color]}`}>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-black leading-tight ${text[color]}`}>{value}</p>
      <p className="text-[10px] text-gray-400 mt-1">{sub}</p>
    </div>
  );
};

const DataRow: React.FC<{ label: string; value: string; highlight?: string }> = ({ label, value, highlight }) => {
  const color = highlight === 'rose' ? 'text-rose-600 font-bold' : highlight === 'emerald' ? 'text-emerald-600 font-bold' : highlight === 'sky' ? 'text-sky-600 font-bold' : 'text-gray-900 font-medium';
  return (
    <div className="flex justify-between items-baseline gap-2">
      <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
      <span className={`text-xs text-right ${color}`}>{value}</span>
    </div>
  );
};

const FlowStep: React.FC<{ num: number; label: string; detail: string; ok?: boolean; bad?: boolean }> = ({ num, label, detail, ok, bad }) => (
  <div className="flex items-start gap-3">
    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5 ${ok ? 'bg-emerald-500 text-white' : bad ? 'bg-rose-400 text-white' : 'bg-gray-200 text-gray-500'}`}>{num}</div>
    <div>
      <p className={`text-xs font-bold leading-tight ${ok ? 'text-emerald-700' : bad ? 'text-rose-700' : 'text-gray-700'}`}>{label}</p>
      <p className="text-[10px] text-gray-400 mt-0.5">{detail}</p>
    </div>
  </div>
);

export default Report;
