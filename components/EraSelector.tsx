
import React from 'react';
import { Era } from '../types';
import { Landmark, Swords, Crown, Music, Zap, Anchor, ShieldCheck } from 'lucide-react';

interface Props {
  onSelect: (era: Era) => void;
}

const erasWithIcons = [
  { id: Era.ANCIENT_EGYPT, icon: <Landmark />, color: 'from-orange-500 to-yellow-600', desc: 'Faraones y Pirámides' },
  { id: Era.RENAISSANCE, icon: <Crown />, color: 'from-amber-400 to-red-500', desc: 'Arte y Humanismo' },
  { id: Era.VIKING_AGE, icon: <ShieldCheck />, color: 'from-blue-600 to-slate-500', desc: 'Guerreros del Norte' },
  { id: Era.SAMURAI_JAPAN, icon: <Swords />, color: 'from-red-600 to-rose-900', desc: 'Honor y Bushido' },
  { id: Era.ROARING_20S, icon: <Music />, color: 'from-slate-400 to-slate-900', desc: 'Jazz y Glamour' },
  { id: Era.PIRATE_GOLDEN_AGE, icon: <Anchor />, color: 'from-sky-700 to-emerald-800', desc: 'Tesoros y Mares' },
  { id: Era.CYBERPUNK_FUTURE, icon: <Zap />, color: 'from-purple-500 to-pink-500', desc: 'Neón y Cromo' },
];

const EraSelector: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {erasWithIcons.map((e) => (
        <button
          key={e.id}
          onClick={() => onSelect(e.id)}
          className="group relative p-6 glass rounded-2xl text-left hover:scale-[1.02] transition-all overflow-hidden"
        >
          {/* Fix: cast icon to React.ReactElement<any> to allow 'size' prop in cloneElement */}
          <div className={`mb-4 w-12 h-12 rounded-xl bg-gradient-to-br ${e.color} flex items-center justify-center text-white shadow-lg`}>
            {React.cloneElement(e.icon as React.ReactElement<any>, { size: 24 })}
          </div>
          <h3 className="text-xl font-bold mb-1">{e.id}</h3>
          <p className="text-sm text-slate-400">{e.desc}</p>
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${e.color} opacity-0 group-hover:opacity-5 blur-2xl transition-opacity`}></div>
        </button>
      ))}
    </div>
  );
};

export default EraSelector;
