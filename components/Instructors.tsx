
import React from 'react';
import { Search, List, Download, Plus } from 'lucide-react';
import InstructorCard from './InstructorCard';
import { Instructor } from '../types';

// Define props interface for Instructors to include notify function
interface InstructorsProps {
  notify: (message: string, type?: 'success' | 'error') => void;
}

const Instructors: React.FC<InstructorsProps> = ({ notify }) => {
  const mockInstructors: Instructor[] = [
    {
      id: '1',
      name: 'Ana Silva',
      initials: 'AS',
      studentsCount: 6,
      phone: '11 91111-1111',
      specialties: 'Fisioterapia, Pilates Clássico',
      avatarColor: 'bg-rose-600'
    },
    {
      id: '2',
      name: 'Bruno Santos',
      initials: 'BS',
      studentsCount: 5,
      phone: '11 92222-2222',
      specialties: 'Ed. Física, Pilates Contemporâneo',
      avatarColor: 'bg-blue-600'
    },
    {
      id: '3',
      name: 'Carla Dias',
      initials: 'CD',
      studentsCount: 5,
      phone: '11 93333-3333',
      specialties: 'Fisioterapia',
      avatarColor: 'bg-orange-500'
    },
    {
      id: '4',
      name: 'Daniel Oliveira',
      initials: 'DO',
      studentsCount: 4,
      phone: '11 94444-4444',
      specialties: 'Ed. Física',
      avatarColor: 'bg-emerald-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar instrutor por nome..." 
            className="w-full bg-[#161b26] border border-gray-800/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:border-sky-500/50 transition-colors shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full xl:w-auto justify-end">
          <div className="flex items-center bg-[#161b26] rounded-xl border border-gray-800/50 p-1">
            <button className="p-2 bg-sky-500/10 text-sky-500 rounded-lg" onClick={() => notify("Alternando visualização...")}>
              <List size={18} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-300 transition-colors" onClick={() => notify("Exportando lista de instrutores...")}>
              <Download size={18} />
            </button>
          </div>
          <button 
            onClick={() => notify("Abrindo formulário de novo instrutor...")}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all shadow-lg shadow-sky-600/20 whitespace-nowrap"
          >
            <Plus size={18} />
            Novo Instrutor
          </button>
        </div>
      </div>

      {/* Grid of Instructor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {mockInstructors.map((instructor) => (
          <InstructorCard key={instructor.id} instructor={instructor} />
        ))}
      </div>
    </div>
  );
};

export default Instructors;
