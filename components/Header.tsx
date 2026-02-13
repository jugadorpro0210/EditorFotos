
import React from 'react';
import { Camera } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-8 glass sticky top-0 z-50 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-tr from-sky-500 to-purple-600 p-2 rounded-xl">
          <Camera className="text-white" size={24} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Cabina<span className="text-sky-400">Temporal</span></h1>
      </div>
      <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-400">
        <span className="hover:text-white cursor-pointer transition-colors">Historia</span>
        <span className="hover:text-white cursor-pointer transition-colors">Galería</span>
        <button className="bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-sky-500/20">
          Versión Pro
        </button>
      </div>
    </header>
  );
};

export default Header;
