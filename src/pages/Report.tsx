import React, { useRef, useState } from 'react';
import { useData } from '../context/DataContext';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Report: React.FC = () => {
  const { data, results } = useData();
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const handleDownloadPdf = async () => {
    setDownloading(true);
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const ratio = Math.min(210 / imgWidth, 297 / imgHeight);
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * ratio, imgHeight * ratio);

      pdf.save(`Informe_ROI_DigitalMarket_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert("Error al generar el PDF. Por favor, usa la opción 'Imprimir' del navegador como alternativa.");
    } finally {
      setDownloading(false);
    }
  };

  // Paleta de colores HEX garantizada para html2canvas
  const colors = {
    white: '#ffffff',
    black: '#000000',
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray800: '#1f2937',
    gray900: '#111827',
    sky50: '#f0f9ff',
    sky100: '#e0f2fe',
    sky600: '#0284c7',
    sky900: '#0c4a6e',
    emerald50: '#ecfdf5',
    emerald100: '#d1fae5',
    emerald500: '#10b981',
    emerald600: '#059669',
    amber50: '#fffbeb',
    amber100: '#fef3c7',
    amber600: '#d97706',
    rose50: '#fff1f2',
    rose100: '#ffe4e6',
    rose600: '#e11d48',
  };

  // Estilos base para evitar Tailwind v4 oklch
  const s = {
    container: { fontFamily: 'Arial, sans-serif', width: '210mm', minHeight: '297mm', padding: '15mm', backgroundColor: colors.white, margin: '0 auto', position: 'relative' as const, boxSizing: 'border-box' as const, color: colors.gray900 },
    topBar: { position: 'absolute' as const, top: 0, left: 0, right: 0, height: '6px', backgroundColor: colors.sky600 },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: `1px solid ${colors.gray100}` },
    logoBox: { width: '45px', height: '45px', backgroundColor: colors.sky600, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.white, fontWeight: '900', fontSize: '20px' },
    kpiGrid: { display: 'flex', gap: '15px', marginBottom: '30px' },
    kpiCard: { flex: 1, padding: '20px', borderRadius: '12px', border: '1px solid', textAlign: 'center' as const },
    compGrid: { display: 'flex', gap: '25px', marginBottom: '30px' },
    compCol: { flex: 1, borderRadius: '12px', border: '1px solid', overflow: 'hidden' },
    compHeader: { padding: '10px 15px', borderBottom: '1px solid', color: colors.white, fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '1px' },
    compBody: { padding: '18px', fontSize: '12px' },
    profitBox: { backgroundColor: colors.gray900, borderRadius: '16px', padding: '25px', color: colors.white, marginBottom: '30px', position: 'relative' as const, overflow: 'hidden' },
    benefitRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    tag: { fontSize: '8px', fontWeight: 'bold', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '5px' },
    footer: { position: 'absolute' as const, bottom: '15mm', left: '15mm', right: '15mm', borderTop: `1px solid ${colors.gray100}`, paddingTop: '15px', display: 'flex', justifyContent: 'space-between', opacity: 0.6, fontSize: '9px' }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center no-print">
        <h1 className="text-xl font-bold text-gray-800">Previsualización de Informe Final</h1>
        <button
          onClick={handleDownloadPdf}
          className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg flex items-center gap-2 transition-all"
          disabled={downloading}
        >
          <Download size={18} />
          {downloading ? 'Procesando...' : 'Descargar PDF (1 Pág)'}
        </button>
      </div>

      {/* REPORTE FISICO (A4) - SIN TAILWIND INTERNO */}
      <div ref={reportRef} style={s.container}>
        <div style={s.topBar}></div>

        {/* Encabezado */}
        <div style={s.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={s.logoBox}>HP</div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>Informe de Viabilidad ROI</div>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: colors.sky600, textTransform: 'uppercase', letterSpacing: '1px' }}>HP Latex Print & Cut Solutions</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '9px', fontWeight: 'bold', color: colors.gray400, textTransform: 'uppercase' }}>Analizado por</div>
            <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Digital Market</div>
            <div style={{ fontSize: '9px', color: colors.gray500 }}>{new Date().toLocaleDateString('es-ES')}</div>
          </div>
        </div>

        {/* KPI Row */}
        <div style={s.kpiGrid}>
          <div style={{ ...s.kpiCard, backgroundColor: colors.sky50, borderColor: colors.sky100 }}>
            <div style={{ fontSize: '9px', fontWeight: 'bold', color: colors.sky600, textTransform: 'uppercase', marginBottom: '8px' }}>Ahorro Anual</div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: colors.sky900 }}>{formatCurrency(results.annualSavings)}</div>
            <div style={{ ...s.tag, backgroundColor: colors.emerald100, color: colors.emerald600, marginTop: '8px' }}>Margen Optimizado</div>
          </div>
          <div style={{ ...s.kpiCard, backgroundColor: colors.emerald50, borderColor: colors.emerald100 }}>
            <div style={{ fontSize: '9px', fontWeight: 'bold', color: colors.emerald600, textTransform: 'uppercase', marginBottom: '8px' }}>Retorno (ROI)</div>
            <div style={{ fontSize: '28px', fontWeight: '900' }}>{results.roiMonths.toFixed(1)} <span style={{ fontSize: '14px' }}>Meses</span></div>
            <div style={{ ...s.tag, backgroundColor: colors.sky100, color: colors.sky600, marginTop: '8px' }}>Inversión Segura</div>
          </div>
          <div style={{ ...s.kpiCard, backgroundColor: colors.amber50, borderColor: colors.amber100 }}>
            <div style={{ fontSize: '9px', fontWeight: 'bold', color: colors.amber600, textTransform: 'uppercase', marginBottom: '8px' }}>Productividad</div>
            <div style={{ fontSize: '28px', fontWeight: '900' }}>10x <span style={{ fontSize: '14px' }}>Rápido</span></div>
            <div style={{ ...s.tag, backgroundColor: colors.amber100, color: colors.amber600, marginTop: '8px' }}>Sin Esperas</div>
          </div>
        </div>

        {/* Comparativa Detallada */}
        <div style={s.compGrid}>
          {/* Competencia */}
          <div style={{ ...s.compCol, borderColor: colors.rose100 }}>
            <div style={{ ...s.compHeader, backgroundColor: colors.rose600 }}>Tecnología Actual (Solvente)</div>
            <div style={s.compBody}>
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: colors.gray500 }}>Tinta Mensual:</span>
                <span style={{ fontWeight: 'bold' }}>{formatCurrency((0.012 * data.inkPrice) * data.monthlyVolume)}</span>
              </div>
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: colors.gray500 }}>Mano de Obra + Mant:</span>
                <span style={{ fontWeight: 'bold' }}>{formatCurrency(((data.monthlyVolume / data.printSpeed) + (data.maintenanceHours * 4)) * 20)}</span>
              </div>
              <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', color: colors.rose600, fontWeight: 'bold' }}>
                <span>Pérdida por Esperas:</span>
                <span>{formatCurrency((data.monthlyVolume / 50) * 0.5 * 20)}</span>
              </div>
              <div style={{ paddingTop: '12px', borderTop: `1px solid ${colors.rose100}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: colors.rose600, textTransform: 'uppercase' }}>Total Operativo</span>
                <span style={{ fontSize: '18px', fontWeight: '900', color: colors.rose600 }}>{formatCurrency(results.currentMonthlyCost)}</span>
              </div>
            </div>
          </div>

          {/* HP */}
          <div style={{ ...s.compCol, borderColor: colors.emerald500, borderWidth: '2px' }}>
            <div style={{ ...s.compHeader, backgroundColor: colors.emerald600 }}>Solución HP Latex + Summa</div>
            <div style={s.compBody}>
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: colors.gray500 }}>Tinta Mensual:</span>
                <span style={{ fontWeight: 'bold' }}>{formatCurrency(1.2 * data.monthlyVolume)}</span>
              </div>
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: colors.gray500 }}>Carga Operario (Eficiente):</span>
                <span style={{ fontWeight: 'bold' }}>{formatCurrency((data.monthlyVolume / data.hpPrintSpeed) * 20)}</span>
              </div>
              <div style={{ marginBottom: '15px', color: colors.emerald600, fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase' }}>
                ✓ 0€ en Esperas y Mantenimiento
              </div>
              <div style={{ paddingTop: '12px', borderTop: `1px solid ${colors.emerald100}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: colors.emerald600, textTransform: 'uppercase' }}>Total Operativo HP</span>
                <span style={{ fontSize: '18px', fontWeight: '900', color: colors.emerald600 }}>{formatCurrency(results.hpMonthlyCost)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Flow */}
        <div style={s.profitBox}>
          <div style={s.benefitRow}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '18px' }}>Análisis de Flujo de Caja</div>
              <div style={{ display: 'flex', gap: '30px' }}>
                <div>
                  <div style={{ fontSize: '9px', color: colors.gray500, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>Ventas Est.</div>
                  <div style={{ fontSize: '22px', fontWeight: '900' }}>{formatCurrency(results.monthlyRevenue)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '9px', color: '#fbbf24', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>Renting (60m)</div>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: '#fbbf24' }}>-{formatCurrency(results.monthlyRentingQuota)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: colors.emerald500, fontWeight: '900', textTransform: 'uppercase', marginBottom: '4px' }}>Beneficio Neto</div>
                  <div style={{ fontSize: '38px', fontWeight: '900', color: colors.emerald500, lineHeight: '1' }}>{formatCurrency(results.hpNetMonthlyProfit)}</div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', paddingLeft: '25px', borderLeft: '1px solid #374151' }}>
              <div style={{ backgroundColor: colors.emerald500, padding: '5px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginBottom: '8px' }}>
                Ganas {formatCurrency(results.hpNetMonthlyProfit - results.currentMonthlyProfit)} más/mes
              </div>
              <div style={{ fontSize: '9px', color: colors.gray500, fontWeight: 'bold', lineHeight: '1.4' }}>
                El ahorro paga la cuota.<br />La máquina te sale gratis.
              </div>
            </div>
          </div>
        </div>

        {/* Benefits & Notes */}
        <div style={{ display: 'flex', gap: '40px', marginBottom: '30px' }}>
          <div style={{ flex: 1.2 }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', borderBottom: `2px solid ${colors.sky600}`, paddingBottom: '6px', marginBottom: '12px', textTransform: 'uppercase' }}>Valor Añadido HP Latex</div>
            <div style={{ fontSize: '10px', lineHeight: '1.8', fontWeight: 'bold' }}>
              • Secado instantáneo: Trabajos listos para entregar en el acto.<br />
              • Summa Technology: Impresión y corte sincronizados.<br />
              • Certificación Ecológica: Sin olores, apto para interiores delicados.<br />
              • Fiabilidad: Cabezales sustituibles por el usuario en minutos.
            </div>
          </div>
          <div style={{ flex: 1, backgroundColor: colors.amber50, padding: '18px', borderRadius: '12px', border: `1px solid ${colors.amber100}` }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#92400e', marginBottom: '8px', textTransform: 'uppercase' }}>Coste de Oportunidad</div>
            <div style={{ fontSize: '10px', color: '#b45309', fontWeight: 'bold', lineHeight: '1.5' }}>
              Mantener el sistema actual te cuesta 4600€ al año en ineficiencias y te obliga a esperar 24h para terminar cada pedido. Con HP Latex, ese tiempo es facturación neta.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={s.footer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: colors.sky600 }}></div>
            <div style={{ fontWeight: 'bold' }}>Digital Market • Partner Especialista HP Latex</div>
          </div>
          <div style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Soluciones HP 2024</div>
        </div>
      </div>
    </div>
  );
};

export default Report;
