import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calculator, 
  Workflow, 
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
    { path: '/', label: 'Inicio', icon: LayoutDashboard },
    { path: '/calculator', label: 'Calculadora', icon: Calculator },
    { path: '/cost-breakdown', label: 'Costes', icon: DollarSign },
    { path: '/workflow', label: 'Flujo de Trabajo', icon: Workflow },
    { path: '/technical', label: 'Detalle Técnico', icon: Settings },
    { path: '/sustainability', label: 'Sostenibilidad', icon: Leaf },
    { path: '/report', label: 'Informe Final', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sky-600 rounded flex items-center justify-center text-white font-bold">HP</div>
          <span className="font-bold text-gray-800">Herramienta Comercial</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation (Desktop) */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">HP</div>
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">Herramienta<br/>Comercial</h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium",
                  isActive 
                    ? "bg-sky-50 text-sky-700" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon size={20} className={cn(isActive ? "text-sky-600" : "text-gray-400 group-hover:text-gray-600")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Versión Actual</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">v2.5.0</span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
