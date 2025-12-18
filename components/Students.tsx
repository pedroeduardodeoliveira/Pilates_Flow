
import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, List, Download, Link, Plus } from 'lucide-react';
import StudentCard from './StudentCard';
import { Student } from '../types';

interface StudentsProps {
  notify: (msg: string, type?: 'success' | 'error') => void;
}

const Students: React.FC<StudentsProps> = ({ notify }) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'Ativo' | 'Inativo' | 'Todos'>('Todos');
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Maria Oliveira', initials: 'MA', status: 'Ativo', level: 'Intermediário', expiryDate: '23/12/2025', daysToExpiry: 5, schedule: ['Seg - 08:00', 'Qua - 08:00'], instructor: 'Ana Silva', phone: '11 98765-4321' },
    { id: '2', name: 'Carlos Mendes', initials: 'CA', status: 'Ativo', level: 'Iniciante', expiryDate: '23/12/2025', daysToExpiry: 5, schedule: ['Ter - 18:00'], instructor: 'Bruno Santos', phone: '11 99999-8888' },
    { id: '3', name: 'Fernanda Costa', initials: 'FE', status: 'Ativo', level: 'Avançado', expiryDate: '13/12/2025', daysToExpiry: -5, isExpired: true, schedule: ['Seg - 07:00', 'Qua - 07:00', 'Sex - 07:00'], instructor: 'Carla Dias', phone: '11 97777-6666' },
    { id: '4', name: 'Juliana Pereira', initials: 'JU', status: 'Ativo', level: 'Iniciante', expiryDate: '07/01/2026', daysToExpiry: 20, schedule: ['Ter - 09:00', 'Qui - 09:00'], instructor: 'Daniel Oliveira', phone: '11 91234-5678' },
    { id: '5', name: 'Ricardo Lima', initials: 'RI', status: 'Ativo', level: 'Avançado', expiryDate: '23/12/2025', daysToExpiry: 5, schedule: ['Seg - 19:00', 'Qua - 19:00'], instructor: 'Bruno Santos', phone: '11 92345-6789' },
    { id: '6', name: 'Patrícia Souza', initials: 'PA', status: 'Ativo', level: 'Iniciante', expiryDate: '13/12/2025', daysToExpiry: -5, isExpired: true, schedule: ['Seg - 10:00', 'Qua - 10:00', 'Sex - 10:00'], instructor: 'Ana Silva', phone: '11 93456-7890' },
  ]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === 'Todos' || s.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [students, search, filterStatus]);

  const handleDelete = (id: string) => {
    const student = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    notify(`Aluno ${student?.name} removido com sucesso.`);
  };

  const handleAction = (id: string, action: string) => {
    notify(`Ação "${action}" executada para o aluno.`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar aluno..." 
              className="w-full bg-[#161b26] border border-gray-800/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:border-sky-500/50 transition-colors"
            />
          </div>
          
          <button className="flex items-center gap-2 bg-[#161b26] border border-gray-800/50 px-4 py-2.5 rounded-xl text-sm text-gray-300 hover:border-gray-700 transition-all w-full md:w-auto">
            <div className={`w-2 h-2 rounded-full ${filterStatus === 'Inativo' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
            <span>{filterStatus === 'Todos' ? 'Status: Todos' : filterStatus}</span>
            <ChevronDown size={14} className="text-gray-500" />
          </button>

          <button className="flex items-center gap-2 bg-[#161b26] border border-gray-800/50 px-4 py-2.5 rounded-xl text-sm text-gray-300 hover:border-gray-700 transition-all w-full md:w-auto">
            <span>🔍 Todos Níveis</span>
            <ChevronDown size={14} className="text-gray-500" />
          </button>
        </div>

        <div className="flex items-center gap-2 w-full xl:w-auto justify-end">
          <div className="flex items-center bg-[#161b26] rounded-xl border border-gray-800/50 p-1">
            <button className="p-2 bg-sky-500/10 text-sky-500 rounded-lg" onClick={() => notify("Mudando para visualização em lista")}>
              <List size={18} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-300 transition-colors" onClick={() => notify("Exportando PDF...")}>
              <Download size={18} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-300 transition-colors" onClick={() => notify("Link de cadastro copiado!")}>
              <Link size={18} />
            </button>
          </div>
          <button 
            onClick={() => notify("Abrindo formulário de novo aluno...")}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all shadow-lg shadow-sky-600/20 whitespace-nowrap"
          >
            <Plus size={18} />
            Novo Aluno
          </button>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="text-center py-20 bg-[#161b26] rounded-2xl border border-dashed border-gray-800">
          <p className="text-gray-500">Nenhum aluno encontrado para sua busca.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard 
              key={student.id} 
              student={student} 
              onDelete={() => handleDelete(student.id)}
              onMarkPaid={() => notify(`Pagamento de ${student.name} confirmado!`)}
              onDeactivate={() => notify(`Aluno ${student.name} desativado.`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Students;
