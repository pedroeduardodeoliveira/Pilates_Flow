
import React from 'react';
import { EscalaItem } from '../types';

interface EscalaCardProps {
  item: EscalaItem;
}

const EscalaCard: React.FC<EscalaCardProps> = ({ item }) => {
  const colorMap = {
    orange: { bg: 'bg-orange-500', dot: 'bg-indigo-500' },
    blue: { bg: 'bg-blue-600', dot: 'bg-sky-500' },
    pink: { bg: 'bg-rose-500', dot: 'bg-emerald-500' },
    green: { bg: 'bg-emerald-500', dot: 'bg-indigo-500' },
  };

  const theme = colorMap[item.color];

  return (
    <div className="bg-white dark:bg-gray-900/30 rounded-lg overflow-hidden border border-slate-200 dark:border-gray-800 shadow-md shadow-slate-200/50 dark:shadow-none mb-1 h-full flex flex-col group transition-all duration-300 hover:border-sky-500/30">
      {/* Header com Instrutor */}
      <div className={`${theme.bg} px-2 py-1 flex items-center gap-1.5`}>
        <div className="w-5 h-5 rounded flex items-center justify-center bg-black/20 text-[10px] font-bold text-white">
          {item.instructorInitials}
        </div>
        <span className="text-[11px] font-bold text-white truncate">{item.instructor}</span>
      </div>
      
      {/* Body com Aparelho */}
      <div className="p-2 flex items-center justify-between gap-2 bg-white dark:bg-transparent flex-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className={`w-2 h-2 rounded-full ${theme.dot}`}></div>
          <span className="text-[11px] text-slate-700 dark:text-gray-300 font-medium truncate">{item.equipment}</span>
        </div>
        <button className="text-[10px] text-sky-600 dark:text-sky-500 hover:text-sky-400 font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Ajustar
        </button>
      </div>
    </div>
  );
};

export default EscalaCard;