import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Calculator, GitCompare, Leaf, FileText, Settings,
  DollarSign, Menu, X, LayoutDashboard, Award,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { useData } from '../context/DataContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data } = useData();

  const navItems = [
    { path: '/',               label: 'Comparador',     icon: Calculator,      group: 'setup' },
    { path: '/dashboard',      label: 'Resumen',        icon: LayoutDashboard, group: 'results' },
    { path: '/cost-breakdown', label: 'Costes & TCO',   icon: DollarSign,      group: 'results' },
    { path: '/workflow',       label: 'Flujo de Trabajo', icon: GitCompare,    group: 'results' },
    { path: '/technical',      label: 'Detalle Técnico', icon: Settings,       group: 'results' },
    { path: '/sustainability',  label: 'Sostenibilidad', icon: Leaf,           group: 'results' },
    { path: '/report',         label: 'Informe PDF',    icon: FileText,        group: 'report' },
  ];

  const groups = [
    { key: 'setup',   label: 'Configuración' },
    { key: 'results', label: 'Análisis' },
    { key: 'report',  label: 'Exportar' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col md:flex-row" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>

      {/* ── Mobile Header ── */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <img src="/assets/logo-dm.png" alt="Digital Market" className="h-7 w-auto" onError={e => (e.currentTarget.style.display = 'none')} />
          {data.clientCompany && (
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg truncate max-w-[120px]">
              {data.clientCompany}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Sidebar ── */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-58 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen flex flex-col shadow-sm",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )} style={{ width: 224 }}>

        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <img src="/assets/logo-dm.png" alt="Digital Market" className="h-10 w-auto" onError={e => (e.currentTarget.style.display = 'none')} />
          <p className="text-[10px] text-gray-400 font-medium mt-1.5 uppercase tracking-widest">Comparador HP Latex</p>
        </div>

        {/* Cliente activo */}
        {data.clientCompany && (
          <div className="px-4 py-3 border-b border-gray-100 bg-blue-50">
            <p className="text-[9px] text-blue-400 font-bold uppercase tracking-wider mb-0.5">Cliente activo</p>
            <p className="text-sm font-black text-blue-900 truncate">{data.clientCompany}</p>
            {data.clientSector && <p className="text-[10px] text-blue-600 truncate">{data.clientSector}</p>}
          </div>
        )}

        {/* Nav agrupado */}
        <nav className="flex-1 py-3 px-2.5 overflow-y-auto space-y-4">
          {groups.map(group => {
            const items = navItems.filter(n => n.group === group.key);
            return (
              <div key={group.key}>
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest px-2 mb-1">{group.label}</p>
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150",
                          isActive
                            ? "bg-gray-900 text-white shadow-sm"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                        )}
                      >
                        <Icon size={15} className="flex-shrink-0" />
                        <span className="font-medium text-sm">{item.label}</span>
                        {item.path === '/report' && (
                          <Award size={11} className={cn("ml-auto", isActive ? "text-amber-400" : "text-amber-500")} />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer sidebar */}
        <div className="px-4 py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 mb-1">
            <img src="/assets/logo-hp.png" alt="HP" className="h-5 w-auto" onError={e => (e.currentTarget.style.display = 'none')} />
            <span className="text-[10px] text-gray-400 font-bold">Distribuidor Oficial HP Latex</span>
          </div>
          <p className="text-[9px] text-gray-300 leading-relaxed">
            Digital Market · Líderes en España desde 2017 · digital-market.es
          </p>
        </div>
      </aside>

      {/* ── Mobile overlay ── */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-57px)] md:h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
