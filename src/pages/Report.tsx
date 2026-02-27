import React, { useRef, useState } from 'react';
import { useData, ALL_MACHINES } from '../context/DataContext';
import { Download, Printer, TrendingUp, Euro, Clock, Leaf, Monitor, BarChart3, CheckCircle, AlertTriangle } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const HEX_COLORS = {
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    900: '#111827',
  },
  emerald: {
    50: '#ecfdf5',
    200: '#a7f3d0',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
  },
  sky: {
    50: '#f0f9ff',
    200: '#bae6fd',
    300: '#7dd3fc',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
  },
  rose: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    400: '#fb7185',
    600: '#e11d48',
    700: '#be123c',
  },
  amber: {
    50: '#fffbeb',
    600: '#d97706',
    700: '#b45309',
  },
  violet: {
    50: '#f5f3ff',
    200: '#ddd6fe',
    700: '#7c3aed',
  },
};

const Report: React.FC = () => {
  const { data, results } = useData();
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const fc = (val: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  const fc2 = (val: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

  const machineA = ALL_MACHINES.find(m => m.model === data.machineAModel);
  const machineB = ALL_MACHINES.find(m => m.model === data.machineBModel);
  const solventSaving = results.machineACost - results.machineBCost;
  const rentingCoversRatio = results.monthlyRentingQuota > 0 ? solventSaving / results.monthlyRentingQuota : 0;
  const roiOk = results.machineBNetProfit >= results.machineAProfit;

  const handleDownloadPdf = async () => {
    setDownloading(true);
    if (!reportRef.current) {
      setDownloading(false);
      return;
    }

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: reportRef.current.scrollWidth,
        windowHeight: reportRef.current.scrollHeight
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/png', 1.0);

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      pdf.save(`Informe_ROI_DM_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Hubo un error al generar el PDF. Asegúrate de que todos los elementos se cargaron correctamente.');
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
          style={{ backgroundColor: HEX_COLORS.gray[900] }}
        >
          <Download size={16} />
          {downloading ? 'Generando...' : 'Descargar PDF'}
        </button>
      </div>

      {/* ══════════════ CONTENIDO DEL INFORME ══════════════ */}
      <div
        ref={reportRef}
        className="space-y-6 bg-white p-8 rounded-2xl border shadow-sm"
        style={{ backgroundColor: '#ffffff', borderColor: HEX_COLORS.gray[100] }}
      >

        {/* CABECERA */}
        <div
          className="flex items-start justify-between pb-6 border-b-2"
          style={{ borderBottomColor: HEX_COLORS.gray[900] }}
        >
          <div className="flex items-center gap-4">
            <img src="/assets/logo-dm.png" alt="Digital Market" className="h-12 w-auto" />
            <div>
              <h2 className="text-xl font-black text-gray-900 leading-tight">Informe de Viabilidad ROI</h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Comparativa de Impresoras — Análisis de Costes</p>
            </div>
          </div>
          <div className="text-right text-xs text-gray-400">
            <p className="font-bold text-gray-600 text-sm" style={{ color: HEX_COLORS.gray[600] }}>Digital Market</p>
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
            <div
              className="rounded-xl border overflow-hidden"
              style={{ backgroundColor: HEX_COLORS.gray[50], borderColor: HEX_COLORS.gray[200] }}
            >
              <div
                className="text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider"
                style={{ backgroundColor: HEX_COLORS.rose[600] }}
              >
                Máquina A — {machineA?.brand ?? ''}
              </div>
              <div className="p-4 space-y-2">
                <DataRow label="Modelo" value={data.machineAModel} />
                <DataRow label="Volumen mensual" value={`${data.monthlyVolume} m²/mes`} />
                <DataRow label="Velocidad impresión" value={`${data.machineASpeed} m²/h`} />
                <DataRow label="Coste tinta" value={`${fc2(data.machineAInkCost)}/m²`} />
                <DataRow label="Mantenimiento semanal" value={`${data.machineAMaintenance}h/semana`} />
                <DataRow label="Secado" value={data.machineADryTime === 0 ? '0h — instantáneo' : `${data.machineADryTime}h`} highlight={data.machineADryTime === 0 ? 'emerald' : 'rose'} />
              </div>
            </div>
            {/* Solución HP */}
            <div
              className="rounded-xl border overflow-hidden"
              style={{ backgroundColor: HEX_COLORS.gray[50], borderColor: HEX_COLORS.gray[200] }}
            >
              <div
                className="text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider"
                style={{ backgroundColor: HEX_COLORS.sky[600] }}
              >
                Máquina B — {machineB?.brand ?? ''}
              </div>
              <div className="p-4 space-y-2">
                <DataRow label="Modelo" value={data.machineBModel} />
                <DataRow label="Velocidad" value={`${data.machineBSpeed} m²/h`} highlight="sky" />
                <DataRow label="Precio máquina" value={fc(data.machineBPrice)} />
                <DataRow label="Coste tinta" value={`${fc2(data.machineBInkCost)}/m²`} />
                <DataRow label="Secado" value={data.machineBDryTime === 0 ? '0h — instantáneo' : `${data.machineBDryTime}h`} highlight={data.machineBDryTime === 0 ? 'emerald' : 'rose'} />
                <DataRow label="Mantenimiento" value={`${data.machineBMaintenance}h/semana`} highlight={data.machineBMaintenance === 0 ? 'emerald' : undefined} />
              </div>
            </div>
          </div>

          {/* Productos */}
          <div
            className="mt-3 rounded-xl border overflow-hidden"
            style={{ backgroundColor: HEX_COLORS.gray[50], borderColor: HEX_COLORS.gray[200] }}
          >
            <div
              className="text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider"
              style={{ backgroundColor: HEX_COLORS.gray[700] }}
            >
              Mix de Producción
            </div>
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
          <div
            className="mt-3 rounded-xl border overflow-hidden"
            style={{ borderColor: HEX_COLORS.gray[200] }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ backgroundColor: HEX_COLORS.gray[100], borderBottomColor: HEX_COLORS.gray[200] }}>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase w-1/2">Concepto</th>
                  <th className="text-right px-4 py-3 text-xs font-bold uppercase" style={{ color: HEX_COLORS.rose[500] }}>Solvente Actual</th>
                  <th className="text-right px-4 py-3 text-xs font-bold uppercase" style={{ color: HEX_COLORS.sky[600] }}>HP Latex</th>
                  <th className="text-right px-4 py-3 text-xs font-bold uppercase" style={{ color: HEX_COLORS.emerald[600] }}>Diferencia</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ divideColor: HEX_COLORS.gray[50] }}>
                <tr className="bg-white">
                  <td className="px-4 py-3 text-gray-700 font-medium">Ventas estimadas</td>
                  <td className="px-4 py-3 text-right text-gray-900 font-bold">{fc(results.monthlyRevenue)}</td>
                  <td className="px-4 py-3 text-right text-gray-900 font-bold">{fc(results.monthlyRevenue)}</td>
                  <td className="px-4 py-3 text-right text-gray-400">—</td>
                </tr>
                <tr style={{ backgroundColor: HEX_COLORS.gray[50] }}>
                  <td className="px-4 py-3 text-gray-700 font-medium">Costes operativos (tinta + mano obra + esperas)</td>
                  <td className="px-4 py-3 text-right font-bold" style={{ color: HEX_COLORS.rose[600] }}>−{fc(results.machineACost)}</td>
                  <td className="px-4 py-3 text-right font-bold" style={{ color: HEX_COLORS.emerald[600] }}>−{fc(results.machineBCost)}</td>
                  <td className="px-4 py-3 text-right font-bold" style={{ color: solventSaving > 0 ? HEX_COLORS.emerald[600] : HEX_COLORS.rose[600] }}>{solventSaving > 0 ? '+' : ''}{fc(solventSaving)}</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-3 text-gray-700 font-medium">Beneficio bruto</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">{fc(results.machineAProfit)}</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">{fc(results.machineBProfit)}</td>
                  <td className="px-4 py-3 text-right font-bold" style={{ color: results.machineBProfit >= results.machineAProfit ? HEX_COLORS.emerald[600] : HEX_COLORS.rose[600] }}>{results.machineBProfit >= results.machineAProfit ? '+' : ''}{fc(results.machineBProfit - results.machineAProfit)}</td>
                </tr>
                <tr style={{ backgroundColor: HEX_COLORS.amber[50] }}>
                  <td className="px-4 py-3 text-gray-700 font-medium">Cuota renting HP ({data.rentingMonths}m · {data.rentingInterest}%)</td>
                  <td className="px-4 py-3 text-right text-gray-400">No aplica</td>
                  <td className="px-4 py-3 text-right font-bold" style={{ color: HEX_COLORS.amber[600] }}>−{fc(results.monthlyRentingQuota)}</td>
                  <td className="px-4 py-3 text-right text-gray-400">Inversión</td>
                </tr>
                <tr
                  className="border-t-2"
                  style={{
                    backgroundColor: roiOk ? HEX_COLORS.emerald[50] : HEX_COLORS.sky[50],
                    borderTopColor: HEX_COLORS.gray[200]
                  }}
                >
                  <td className="px-4 py-3 font-black text-gray-900">Beneficio neto final</td>
                  <td className="px-4 py-3 text-right font-black text-gray-900">{fc(results.machineAProfit)}</td>
                  <td
                    className="px-4 py-3 text-right font-black text-xl"
                    style={{ color: roiOk ? HEX_COLORS.emerald[600] : HEX_COLORS.sky[600] }}
                  >
                    {fc(results.machineBNetProfit)}
                  </td>
                  <td
                    className="px-4 py-3 text-right font-black"
                    style={{ color: roiOk ? HEX_COLORS.emerald[600] : HEX_COLORS.sky[500] }}
                  >
                    {roiOk ? '+' : ''}{fc(results.machineBNetProfit - results.machineAProfit)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Nota sobre el ROI */}
          <div
            className="mt-3 rounded-xl p-4 flex gap-3 border"
            style={{
              backgroundColor: roiOk ? HEX_COLORS.emerald[50] : HEX_COLORS.sky[50],
              borderColor: roiOk ? HEX_COLORS.emerald[200] : HEX_COLORS.sky[200]
            }}
          >
            {roiOk
              ? <CheckCircle style={{ color: HEX_COLORS.emerald[600] }} className="flex-shrink-0 mt-0.5" size={18} />
              : <AlertTriangle style={{ color: HEX_COLORS.sky[600] }} className="flex-shrink-0 mt-0.5" size={18} />
            }
            <p className="text-sm text-gray-700 leading-relaxed">
              {roiOk
                ? <><strong>La máquina se amortiza sola:</strong> el ahorro operativo ({fc(solventSaving)}/mes) cubre la cuota de renting ({fc(results.monthlyRentingQuota)}/mes) con un excedente de <strong style={{ color: HEX_COLORS.emerald[600] }}>{fc(results.hpNetMonthlyProfit - results.currentMonthlyProfit)}/mes</strong>.</>
                : <><strong>El ahorro operativo ({fc(solventSaving)}/mes)</strong> no cubre íntegramente la cuota de renting ({fc(results.monthlyRentingQuota)}/mes). La diferencia de {fc(results.monthlyRentingQuota - solventSaving)}/mes se compensa con <strong>mayor capacidad productiva diaria</strong> (sin esperas de 24-48h) y la posibilidad de aceptar más pedidos al día.</>
              }
            </p>
          </div>
        </div>

        {/* ── SECCIÓN 4: FLUJO DE TRABAJO ── */}
        <div>
          <SectionTitle icon={Clock} label="Ventaja en Flujo de Trabajo" />
          <div className="mt-3 grid md:grid-cols-2 gap-4">
            <div
              className="border rounded-xl overflow-hidden"
              style={{ borderColor: HEX_COLORS.rose[100] }}
            >
              <div
                className="px-4 py-2.5 text-xs font-black uppercase"
                style={{ backgroundColor: HEX_COLORS.rose[50], color: HEX_COLORS.rose[700] }}
              >
                Proceso Actual (Solvente)
              </div>
              <div className="p-4 space-y-2 text-sm">
                <FlowStep num={1} label="Impresión" detail={`~${(data.monthlyVolume / (data.machineASpeed * 168)).toFixed(0)}h producción mensual a ${data.machineASpeed} m²/h`} bad />
                <FlowStep num={2} label={`Secado — esperar ${data.machineADryTime}h`} detail="Plotter de corte bloqueado" bad />
                <FlowStep num={3} label="Laminado (si aplica)" detail="Solo posible tras desgasificación completa" bad />
                <FlowStep num={4} label="Corte" detail="Solo cuando ha terminado todo lo anterior" bad />
                <div
                  className="mt-3 rounded-lg p-3 border"
                  style={{ backgroundColor: HEX_COLORS.rose[50], borderColor: HEX_COLORS.rose[200] }}
                >
                  <p className="text-xs font-bold" style={{ color: HEX_COLORS.rose[700] }}>Tiempo total hasta entrega: 26-52h mínimo con laminado</p>
                </div>
              </div>
            </div>
            <div
              className="border-2 rounded-xl overflow-hidden"
              style={{ borderColor: HEX_COLORS.sky[300] }}
            >
              <div
                className="text-white px-4 py-2.5 text-xs font-black uppercase"
                style={{ backgroundColor: HEX_COLORS.sky[600] }}
              >
                Proceso HP Latex (sin esperas)
              </div>
              <div className="p-4 space-y-2 text-sm">
                <FlowStep num={1} label={`Impresión ${machineB?.model ?? 'Máquina B'}`} detail={`${data.machineBSpeed} m²/h — secado: ${data.machineBDryTime === 0 ? 'instantáneo' : data.machineBDryTime + 'h'}`} ok />
                <FlowStep num={2} label="Plotter libre durante impresión" detail="Puede cortar otro pedido mientras se imprime" ok />
                <FlowStep num={3} label="Laminado (si aplica)" detail="Posible 1 min después de salir de impresora" ok />
                <FlowStep num={4} label="Corte inmediato" detail="Sin esperar desgasificación" ok />
                <div
                  className="mt-3 rounded-lg p-3 border"
                  style={{ backgroundColor: HEX_COLORS.emerald[50], borderColor: HEX_COLORS.emerald[200] }}
                >
                  <p className="text-xs font-bold" style={{ color: HEX_COLORS.emerald[700] }}>Tiempo total hasta entrega: 2-5h mismo día</p>
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
              <div
                key={i}
                className="rounded-xl border p-4"
                style={{ backgroundColor: HEX_COLORS.gray[50], borderColor: HEX_COLORS.gray[200] }}
              >
                <p className="text-xs font-black mb-1" style={{ color: HEX_COLORS.sky[700] }}>{t}</p>
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
              <div
                key={i}
                className="rounded-xl border p-4"
                style={{ backgroundColor: HEX_COLORS.emerald[50], borderColor: HEX_COLORS.emerald[200] }}
              >
                <span
                  className="inline-block text-[10px] font-black text-white px-2 py-0.5 rounded mb-2 uppercase"
                  style={{ backgroundColor: HEX_COLORS.emerald[600] }}
                >
                  {badge}
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECCIÓN 7: RENTING ── */}
        <div>
          <SectionTitle icon={Euro} label="Condiciones de Financiación (Renting)" />
          <div
            className="mt-3 rounded-xl border overflow-hidden"
            style={{ backgroundColor: HEX_COLORS.gray[50], borderColor: HEX_COLORS.gray[200] }}
          >
            <table className="w-full text-sm">
              <tbody className="divide-y" style={{ divideColor: HEX_COLORS.gray[100] }}>
                <tr><td className="px-4 py-2.5 text-gray-500">Precio Máquina B ({data.machineBModel})</td><td className="px-4 py-2.5 font-bold text-gray-900 text-right">{fc(data.machineBPrice)}</td></tr>
                <tr><td className="px-4 py-2.5 text-gray-500">Duración del renting</td><td className="px-4 py-2.5 font-bold text-gray-900 text-right">{data.rentingMonths} meses ({data.rentingMonths / 12} años)</td></tr>
                <tr><td className="px-4 py-2.5 text-gray-500">Tipo de interés anual</td><td className="px-4 py-2.5 font-bold text-gray-900 text-right">{data.rentingInterest}%</td></tr>
                <tr style={{ backgroundColor: HEX_COLORS.amber[50] }}><td className="px-4 py-2.5 font-bold text-gray-700">Cuota mensual renting</td><td className="px-4 py-2.5 font-black text-right text-lg" style={{ color: HEX_COLORS.amber[600] }}>{fc(results.monthlyRentingQuota)}</td></tr>
                <tr><td className="px-4 py-2.5 text-gray-500">Diferencia de costes operativos (A − B)</td><td className="px-4 py-2.5 font-bold text-right" style={{ color: solventSaving > 0 ? HEX_COLORS.emerald[600] : HEX_COLORS.rose[600] }}>{fc(solventSaving)}</td></tr>
                <tr style={{ backgroundColor: HEX_COLORS.gray[100] }}><td className="px-4 py-2.5 font-bold text-gray-700">El ahorro cubre el {Math.min(100, Math.round(rentingCoversRatio * 100))}% de la cuota</td><td className="px-4 py-2.5 font-black text-right">{fc(results.monthlyRentingQuota * Math.min(1, rentingCoversRatio))} / {fc(results.monthlyRentingQuota)}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="pt-4 border-t flex justify-between items-center text-xs text-gray-400"
          style={{ borderTopColor: HEX_COLORS.gray[200] }}
        >
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
    <div
      className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: HEX_COLORS.gray[900] }}
    >
      <Icon size={13} className="text-white" />
    </div>
    <h3 className="font-black text-gray-900 text-base">{label}</h3>
  </div>
);

const KpiCard: React.FC<{ label: string; value: string; sub: string; color: string }> = ({ label, value, sub, color }) => {
  const bg = HEX_COLORS[color as keyof typeof HEX_COLORS][50];
  const border = HEX_COLORS[color as keyof typeof HEX_COLORS][200];
  const textColor = HEX_COLORS[color as keyof typeof HEX_COLORS][700];

  return (
    <div className="rounded-xl border p-4" style={{ backgroundColor: bg, borderColor: border }}>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black leading-tight" style={{ color: textColor }}>{value}</p>
      <p className="text-[10px] text-gray-400 mt-1">{sub}</p>
    </div>
  );
};

const DataRow: React.FC<{ label: string; value: string; highlight?: string }> = ({ label, value, highlight }) => {
  let colorClass = 'text-gray-900 font-medium';
  let inlineStyle = {};

  if (highlight === 'rose') inlineStyle = { color: HEX_COLORS.rose[600], fontWeight: 'bold' };
  else if (highlight === 'emerald') inlineStyle = { color: HEX_COLORS.emerald[600], fontWeight: 'bold' };
  else if (highlight === 'sky') inlineStyle = { color: HEX_COLORS.sky[600], fontWeight: 'bold' };

  return (
    <div className="flex justify-between items-baseline gap-2">
      <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
      <span className="text-xs text-right" style={inlineStyle}>{value}</span>
    </div>
  );
};

const FlowStep: React.FC<{ num: number; label: string; detail: string; ok?: boolean; bad?: boolean }> = ({ num, label, detail, ok, bad }) => {
  const circleBg = ok ? HEX_COLORS.emerald[500] : bad ? HEX_COLORS.rose[400] : HEX_COLORS.gray[200];
  const textColor = ok ? HEX_COLORS.emerald[700] : bad ? HEX_COLORS.rose[700] : HEX_COLORS.gray[700];

  return (
    <div className="flex items-start gap-3">
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5"
        style={{ backgroundColor: circleBg, color: ok || bad ? '#ffffff' : HEX_COLORS.gray[500] }}
      >
        {num}
      </div>
      <div>
        <p className="text-xs font-bold leading-tight" style={{ color: textColor }}>{label}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">{detail}</p>
      </div>
    </div>
  );
};

export default Report;
