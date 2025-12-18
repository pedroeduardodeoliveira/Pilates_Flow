
import React from 'react';
import { Pencil, Trash2, Box, Home } from 'lucide-react';
import { Equipment } from '../types';

interface EquipmentCardProps {
  equipment: Equipment;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment }) => {
  return (
    <div className="bg-[#161b26] rounded-xl border border-gray-800/50 p-4 hover:border-sky-500/30 transition-all duration-300 group flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-800/50 flex items-center justify-center text-gray-400">
            <Box size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-100">{equipment.name}</h4>
            <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-medium border border-gray-700/50">
              {equipment.type}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 hover:bg-white/5 rounded-md text-gray-400">
            <Pencil size={14} />
          </button>
          <button className="p-1.5 hover:bg-rose-500/10 rounded-md text-gray-400 hover:text-rose-500">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-800/30 px-3 py-1.5 rounded-lg w-fit">
        <Home size={14} />
        <span>{equipment.roomName}</span>
      </div>
    </div>
  );
};

export default EquipmentCard;
