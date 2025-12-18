
import React from 'react';
import { Pencil, Trash2, Users, Phone, FileText } from 'lucide-react';
import { Instructor } from '../types';

interface InstructorCardProps {
  instructor: Instructor;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ instructor }) => {
  return (
    <div className="bg-[#161b26] rounded-2xl border border-gray-800/50 p-6 hover:border-sky-500/30 transition-all duration-300 group flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-full ${instructor.avatarColor} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
            {instructor.initials}
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-gray-100">
              {instructor.name}
            </h3>
            <p className="text-xs text-gray-500 font-medium">Instrutor(a)</p>
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

      <div className="h-[1px] bg-gray-800/50 w-full"></div>

      {/* Info Rows */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <Users size={16} className="text-gray-500" />
          <span className="font-medium text-gray-300">{instructor.studentsCount} alunos</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <Phone size={16} className="text-gray-500" />
          <span className="font-medium text-gray-300">{instructor.phone}</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <FileText size={16} className="text-gray-500" />
          <span className="font-medium text-gray-300 leading-relaxed">{instructor.specialties}</span>
        </div>
      </div>
    </div>
  );
};

export default InstructorCard;
