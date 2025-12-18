
import React from 'react';
import { 
  LayoutGrid, 
  Calendar, 
  Layers, 
  Users, 
  GraduationCap, 
  Dumbbell, 
  DollarSign,
  Moon,
  Sun,
  Settings,
  LifeBuoy,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isDarkMode, toggleTheme }) => {
  const mainNav = [
    { id: 'painel', label: 'Painel', icon: <LayoutGrid size={20} /> },
    { id: 'agenda', label: 'Agenda', icon: <Calendar size={20} /> },
    { id: 'escala', label: 'Escala', icon: <Layers size={20} /> },
    { id: 'alunos', label: 'Alunos', icon: <Users size={20} /> },
    { id: 'instrutores', label: 'Instrutores', icon: <GraduationCap size={20} /> },
    { id: 'sala', label: 'Sala / Aparelhos', icon: <Dumbbell size={20} /> },
    { id: 'financeiro', label: 'Financeiro', icon: <DollarSign size={20} /> },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 lg:w-72 bg-white dark:bg-[#0d121d] border-r border-slate-200 dark:border-gray-800 flex flex-col z-50 transition-colors duration-300">
      {/* Brand */}
      <div className="p-6 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-2xl font-bold text-sky-500">Pilates Flow</h2>
        </div>
        <p className="text-xs text-slate-400 dark:text-gray-500 uppercase tracking-widest font-medium">Gestão de Estúdio</p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {mainNav.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-sky-500/10 text-sky-600 dark:text-sky-500 shadow-sm' 
                : 'text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-gray-200'
            }`}
          >
            <span className={activeTab === item.id ? 'text-sky-600 dark:text-sky-500' : 'text-slate-400 dark:text-gray-400 group-hover:text-slate-600 dark:group-hover:text-gray-200'}>
              {item.icon}
            </span>
            <span className="text-[15px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <nav className="p-3 border-t border-slate-200 dark:border-gray-800 space-y-1">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-gray-200"
        >
          <span>{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</span>
          <span className="text-[15px] font-medium">{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('configuracoes')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
            activeTab === 'configuracoes'
              ? 'bg-sky-500/10 text-sky-600 dark:text-sky-500 shadow-sm' 
              : 'text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-gray-200'
          }`}
        >
          <span><Settings size={20} /></span>
          <span className="text-[15px] font-medium">Configurações</span>
        </button>
        
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-rose-500 hover:bg-rose-500/10">
          <span><LogOut size={20} /></span>
          <span className="text-[15px] font-medium">Sair</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
