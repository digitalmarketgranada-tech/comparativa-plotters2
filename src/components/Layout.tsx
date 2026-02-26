import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Calculator,
  GitCompare,
  Leaf,
  FileText,
  Settings,
  DollarSign,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Calculadora', icon: Calculator },
    { path: '/cost-breakdown', label: 'Costes', icon: DollarSign },
    { path: '/workflow', label: 'Flujo de Trabajo', icon: GitCompare },
    { path: '/technical', label: 'Detalle Técnico', icon: Settings },
    { path: '/sustainability', label: 'Sostenibilidad', icon: Leaf },
    { path: '/report', label: 'Informe Final', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col md:flex-row" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <img src="/assets/logo-dm.png" alt="Digital Market" className="h-8 w-auto" />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-56 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen flex flex-col shadow-sm",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <img src="/assets/logo-dm.png" alt="Digital Market" className="h-10 w-auto" />
          <p className="text-[10px] text-gray-400 font-medium mt-2 uppercase tracking-widest">Calculadora ROI</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative",
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                )}
              >
                <Icon size={16} className="flex-shrink-0" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
            Calculadora DM — Digital Market<br />
            Herramienta de Análisis ROI HP Latex
          </p>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-57px)] md:h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
