
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Agenda from './components/Agenda';
import Students from './components/Students';
import Instructors from './components/Instructors';
import RoomsAndEquipment from './components/RoomsAndEquipment';
import Financial from './components/Financial';
import Settings from './components/Settings';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('painel');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const notify = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    notify(isDarkMode ? "Modo Claro ativado" : "Modo Escuro ativado");
  };

  const renderContent = () => {
    const commonProps = { notify };
    switch (activeTab) {
      case 'painel': return <Dashboard {...commonProps} />;
      case 'agenda': return <Agenda {...commonProps} />;
      case 'alunos': return <Students {...commonProps} />;
      case 'instrutores': return <Instructors {...commonProps} />;
      case 'sala': return <RoomsAndEquipment {...commonProps} />;
      case 'financeiro': return <Financial {...commonProps} />;
      case 'configuracoes': return <Settings {...commonProps} />;
      default: return <div className="p-8 text-center text-gray-500">Em desenvolvimento...</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0b0e14] text-slate-900 dark:text-gray-100 transition-colors duration-300 overflow-hidden bg-pattern">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <main className="flex-1 overflow-y-auto h-screen p-8 ml-64 lg:ml-72">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-slate-800 dark:text-gray-100 capitalize">
            {activeTab.replace(/([A-Z])/g, ' $1').trim()}
          </h1>
          <div className="flex items-center gap-4">
             <span className="text-sm font-medium text-slate-500 dark:text-gray-400">
               {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
             </span>
          </div>
        </header>
        
        {renderContent()}

        <footer className="mt-12 text-center text-xs text-slate-400 dark:text-gray-600 pb-8">
          © 2025 Powered by COD3 Software Solution
        </footer>
      </main>

      {/* Notification Toast System */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        {notifications.map(n => (
          <div key={n.id} className={`flex items-center gap-3 p-4 rounded-xl shadow-2xl border transition-all animate-slide-up ${
            n.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
              : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
          } backdrop-blur-md`}>
            {n.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-bold">{n.message}</span>
            <button onClick={() => removeNotification(n.id)} className="ml-4 hover:opacity-70">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
