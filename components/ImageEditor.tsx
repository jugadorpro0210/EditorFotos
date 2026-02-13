
import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { Wand2, Send, Clock, Download, Share2, Palette, Image as ImageIcon, Camera as CameraIcon, Sparkles } from 'lucide-react';

interface Props {
  image: GeneratedImage;
  onEdit: (prompt: string) => void;
  history: GeneratedImage[];
}

const PRESET_FILTERS = [
  {
    id: 'oil',
    name: 'Estilo Óleo',
    icon: <Palette size={16} />,
    prompt: 'Transforma esta imagen en una pintura al óleo clásica, con pinceladas visibles, texturas ricas y colores vibrantes de estilo impresionista.',
    color: 'bg-amber-500/20 text-amber-400'
  },
  {
    id: 'bw',
    name: 'Blanco y Negro',
    icon: <CameraIcon size={16} />,
    prompt: 'Convierte esta imagen a un blanco y negro artístico de alta gama, con contrastes profundos, sombras dramáticas y grano de película clásica.',
    color: 'bg-slate-500/20 text-slate-300'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    icon: <ImageIcon size={16} />,
    prompt: 'Aplica un efecto vintage de fotografía analógica de los años 70, con tonos cálidos ligeramente lavados, bordes desgastados y una atmósfera nostálgica.',
    color: 'bg-orange-500/20 text-orange-400'
  },
  {
    id: 'blur',
    name: 'Desenfoque Artístico',
    icon: <Sparkles size={16} />,
    prompt: 'Añade un desenfoque de fondo profundo (bokeh) para aislar al sujeto, creando una profundidad de campo cinematográfica y profesional.',
    color: 'bg-sky-500/20 text-sky-400'
  }
];

const ImageEditor: React.FC<Props> = ({ image, onEdit, history }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onEdit(prompt);
      setPrompt('');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `viaje-temporal-${image.era}.png`;
    link.click();
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      {/* Main Preview Area */}
      <div className="lg:col-span-3 space-y-6">
        <div className="glass p-2 rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src={image.url} 
            className="w-full aspect-square object-cover rounded-2xl" 
            alt="Resultado temporal" 
          />
        </div>
        
        {/* Predefined Filters Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1">Filtros Rápidos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRESET_FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => onEdit(filter.prompt)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border border-white/5 hover:border-white/20 transition-all hover:scale-[1.05] active:scale-95 ${filter.color} glass`}
              >
                <div className="mb-2">{filter.icon}</div>
                <span className="text-xs font-medium text-center leading-tight">{filter.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-4">
          <button 
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl transition-colors"
          >
            <Download size={20} />
            <span>Guardar</span>
          </button>
          <button 
            className="flex-1 flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl transition-colors"
          >
            <Share2 size={20} />
            <span>Compartir</span>
          </button>
        </div>
      </div>

      {/* Editing & History Controls */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass p-6 rounded-3xl space-y-4">
          <div className="flex items-center space-x-2 text-sky-400">
            <Wand2 size={20} />
            <h3 className="font-bold">Modificar Realidad</h3>
          </div>
          <p className="text-sm text-slate-400">Pide cambios específicos como "Añade una espada", "Ponme un sombrero de época" o "Cambia el clima a tormentoso".</p>
          
          <form onSubmit={handleSubmit} className="relative">
            <input 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ej: Haz que parezca una pintura al óleo..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 pr-12 focus:outline-none focus:border-sky-500 transition-colors text-sm"
            />
            <button 
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-3 bg-sky-500 text-white rounded-lg hover:bg-sky-400 transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>

        <div className="glass p-6 rounded-3xl space-y-4 overflow-hidden">
          <div className="flex items-center space-x-2 text-purple-400">
            <Clock size={20} />
            <h3 className="font-bold">Versiones de este Viaje</h3>
          </div>
          <div className="flex flex-col space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {history.map((h, i) => (
              <div 
                key={h.timestamp} 
                className={`flex items-center space-x-3 p-2 rounded-xl border transition-all ${i === 0 ? 'bg-sky-500/10 border-sky-500/30' : 'border-transparent hover:bg-slate-800/50'}`}
              >
                <img src={h.url} className="w-12 h-12 rounded-lg object-cover" alt="Historial" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate text-slate-300">{h.prompt}</p>
                  <p className="text-[10px] text-slate-500">{new Date(h.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            {history.length === 0 && (
              <p className="text-sm text-slate-500 italic text-center py-4">Aún no hay modificaciones.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
