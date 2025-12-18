
import React from 'react';
import { Home, Plus, Pencil, Trash2, Box, Search, List, Download } from 'lucide-react';
import { Room, Equipment } from '../types';
import EquipmentCard from './EquipmentCard';

// Define props interface for RoomsAndEquipment to include notify function
interface RoomsAndEquipmentProps {
  notify: (message: string, type?: 'success' | 'error') => void;
}

const RoomsAndEquipment: React.FC<RoomsAndEquipmentProps> = ({ notify }) => {
  const rooms: Room[] = [
    { id: '1', name: 'Sala Principal' },
    { id: '2', name: 'Sala Zen' },
  ];

  const equipments: Equipment[] = [
    { id: '1', name: 'Reformer 1', type: 'Reformer', roomName: 'Sala Principal' },
    { id: '2', name: 'Reformer 2', type: 'Reformer', roomName: 'Sala Principal' },
    { id: '3', name: 'Cadillac', type: 'Cadillac', roomName: 'Sala Principal' },
    { id: '4', name: 'Chair', type: 'Chair', roomName: 'Sala Zen' },
    { id: '5', name: 'Ladder Barrel', type: 'Barrel', roomName: 'Sala Zen' },
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Salas Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Home className="text-gray-400" size={20} />
            <h2 className="text-lg font-bold text-gray-100">Salas de Atendimento</h2>
          </div>
          <button 
            onClick={() => notify("Abrindo formulário de nova sala...")}
            className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-800 text-gray-300 font-bold py-2 px-4 rounded-xl text-sm transition-all border border-gray-700/50"
          >
            <Plus size={16} />
            Nova Sala
          </button>
        </div>

        <div className="bg-[#161b26] rounded-2xl border border-gray-800/50 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#121826] border-b border-gray-800/50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nome da Sala</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-gray-200">{room.name}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-white/5 rounded-md text-gray-400" onClick={() => notify(`Editando sala: ${room.name}`)}>
                        <Pencil size={14} />
                      </button>
                      <button className="p-1.5 hover:bg-rose-500/10 rounded-md text-gray-400 hover:text-rose-500" onClick={() => notify(`Excluindo sala: ${room.name}`)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Aparelhos Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Box className="text-gray-400" size={20} />
            <h2 className="text-lg font-bold text-gray-100">Aparelhos Cadastrados</h2>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Pesquisar aparelho..." 
                className="w-full bg-[#161b26] border border-gray-800/50 rounded-xl py-2 pl-10 pr-4 text-xs text-gray-300 focus:outline-none focus:border-sky-500/50 transition-colors"
              />
            </div>
            
            <div className="flex items-center bg-[#161b26] rounded-xl border border-gray-800/50 p-1">
              <button className="p-2 bg-sky-500/10 text-sky-500 rounded-lg" onClick={() => notify("Alterando visualização dos aparelhos...")}>
                <List size={16} />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-300 transition-colors" onClick={() => notify("Exportando lista de aparelhos...")}>
                <Download size={16} />
              </button>
            </div>

            <button 
              onClick={() => notify("Abrindo formulário de novo aparelho...")}
              className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-xl text-sm transition-all shadow-lg shadow-sky-600/20 whitespace-nowrap"
            >
              <Plus size={16} />
              Novo Aparelho
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
          {equipments.map((equipment) => (
            <EquipmentCard key={equipment.id} equipment={equipment} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default RoomsAndEquipment;
