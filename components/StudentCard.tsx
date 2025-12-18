
import React from 'react';
import { Pencil, Trash2, Calendar, User, Phone, CheckCircle } from 'lucide-react';
import { Student } from '../types';

interface StudentCardProps {
  student: Student;
  onDelete?: () => void;
  onMarkPaid?: () => void;
  onDeactivate?: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onDelete, onMarkPaid, onDeactivate }) => {
  const levelStyles = {
    'Iniciante': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'Intermediário': 'bg-sky-500/10 text-sky-500 border-sky-500/20',
    'Avançado': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  };

  return (
    <div className="bg-[#161b26] rounded-2xl border border-gray-800/50 p-5 hover:border-sky-500/30 transition-all duration-300 group flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-sky-500/20">
            {student.initials}
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-gray-100 flex items-center gap-2">
              {student.name}
              <span className={`flex items-center gap-1 text-[10px] font-medium ${student.status === 'Ativo' ? 'text-emerald-500' : 'text-rose-500'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${student.status === 'Ativo' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                {student.status}
              </span>
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 hover:bg-white/5 rounded-md text-gray-400" title="Editar">
            <Pencil size={14} />
          </button>
          <button onClick={onDelete} className="p-1.5 hover:bg-rose-500/10 rounded-md text-gray-400 hover:text-rose-500" title="Excluir">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Level Badge */}
      <div>
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${levelStyles[student.level]}`}>
          <span className="mr-1">📊</span> {student.level}
        </span>
      </div>

      {/* Info Rows */}
      <div className="space-y-3 py-1">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Calendar size={14} className={student.isExpired ? 'text-rose-500' : 'text-gray-500'} />
          <span>Vencimento: <span className="text-gray-200 font-medium">{student.expiryDate}</span> 
            <span className={student.isExpired ? 'text-rose-500 ml-1' : 'text-gray-500 ml-1'}>
              ({student.isExpired ? `Vencido há ${Math.abs(student.daysToExpiry)} dia(s)` : `Vence em ${student.daysToExpiry} dia(s)`})
            </span>
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Calendar size={14} className="text-gray-500 mr-0.5" />
          {student.schedule.map((item, idx) => (
            <span key={idx} className="bg-gray-800/50 text-[10px] text-gray-300 font-bold px-2 py-0.5 rounded border border-gray-700/50">
              {item}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <User size={14} className="text-sky-500" />
          <span className="text-sky-500 font-medium">{student.instructor}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Phone size={14} className="text-gray-500" />
          <span>{student.phone}</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-gray-800/50 flex items-center justify-between">
        <button onClick={onMarkPaid} className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold hover:text-emerald-400 transition-colors">
          <CheckCircle size={14} />
          Marcar como Pago
        </button>
        <button onClick={onDeactivate} className="text-xs text-sky-500 font-bold hover:text-sky-400 transition-colors">
          Desativar Aluno
        </button>
      </div>
    </div>
  );
};

export default StudentCard;
