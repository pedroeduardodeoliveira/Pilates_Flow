import React from 'react';
import { Users2, Settings, LogOut, X } from 'lucide-react';

interface SuperAdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({ activeTab, setActiveTab, onLogout, isOpen, setIsOpen }) => {
  const mainNav = [
    { id: 'clients', label: 'Clientes', icon: <Users2 size={20} /> },
    { id: 'settings', label: 'Configurações', icon: <Settings size={20} /> },
  ];

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setIsOpen(false); // Fecha a sidebar na navegação em mobile
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen w-72 bg-white dark:bg-[#0d121d] border-r border-slate-200 dark:border-gray-800 flex flex-col z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="p-6 mb-4 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">SA</div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-white">Super Admin</h1>
            <p className="text-[10px] font-medium text-slate-500 dark:text-gray-400 uppercase tracking-widest">Painel SaaS</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-rose-500">
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {mainNav.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
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

      <div className="p-3 border-t border-slate-200 dark:border-gray-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-rose-500 hover:bg-rose-500/10"
        >
          <span><LogOut size={20} /></span>
          <span className="text-[15px] font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default SuperAdminSidebar;