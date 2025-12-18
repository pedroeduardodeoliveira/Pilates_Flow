
import React from 'react';
import { AgendaItem } from '../types';

interface AgendaCardProps {
  item: AgendaItem;
  onReschedule?: () => void;
}

const AgendaCard: React.FC<AgendaCardProps> = ({ item, onReschedule }) => {
  const colorMap = {
    orange: { bg: 'bg-orange-500', dot: 'bg-indigo-400' },
    blue: { bg: 'bg-blue-600', dot: 'bg-sky-300' },
    pink: { bg: 'bg-rose-500', dot: 'bg-emerald-400' },
    green: { bg: 'bg-emerald-500', dot: 'bg-indigo-300' },
  };

  const theme = colorMap[item.color];

  return (
    <div className="bg-[#1a212e] rounded-lg overflow-hidden border border-gray-800/50 shadow-lg mb-1 h-full flex flex-col">
      {/* Header com Instrutor */}
      <div className={`${theme.bg} px-2 py-1 flex items-center gap-1.5`}>
        <div className="w-5 h-5 rounded flex items-center justify-center bg-black/20 text-[10px] font-bold text-white">
          {item.instructorInitials}
        </div>
        <span className="text-[11px] font-bold text-white truncate">{item.instructor}</span>
      </div>
      
      {/* Body com Aluno */}
      <div className="p-2 flex items-center justify-between gap-2 bg-[#161b26] flex-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className={`w-2 h-2 rounded-full ${theme.dot}`}></div>
          <span className="text-[11px] text-gray-300 font-medium truncate">{item.student}</span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onReschedule?.(); }} 
          className="text-[10px] text-sky-500 hover:text-sky-400 font-semibold whitespace-nowrap"
        >
          Remarcar
        </button>
      </div>
    </div>
  );
};

export default AgendaCard;
