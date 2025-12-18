import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-indigo-700 cursor-pointer" onClick={() => window.location.reload()}>
            <Navigation className="w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">SmartRoute <span className="text-indigo-600">Prospector</span></h1>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
             <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-indigo-500" /> Dados verificados pelo Google Maps</span>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {children}
        </div>
      </main>
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} SmartRoute Prospector. As rotas geradas por IA podem variar das condições de tráfego em tempo real.
        </div>
      </footer>
    </div>
  );
};