import React, { useState, useContext } from 'react';
import { AppContext } from './AppContext';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
import Dashboard from './components/Dashboard';
import Agenda from './components/Agenda';
import Escala from './components/Escala';
import Students from './components/Students';
import Instructors from './components/Instructors';
import InstructorProfile from './components/InstructorProfile';
import RoomsAndEquipment from './components/RoomsAndEquipment';
import Financial from './components/Financial';
import Settings from './components/Settings';
import NeuralNetworkBackground from './components/NeuralNetworkBackground';
import Login from './components/Login';
import SuperAdminDashboard from './components/SuperAdminDashboard';

const App: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const { activeTab, settings, isAuthenticated, user } = state;
  const { isDarkMode, appName } = settings;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const setActiveTab = (tab: string) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
    setIsSidebarOpen(false); // Fecha a sidebar ao navegar
  };
  
  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const pageTitles: { [key: string]: string } = {
    painel: 'Painel de Controle',
    agenda: 'Agenda de Aulas',
    escala: 'Escala de Aparelhos',
    alunos: 'Gestão de Alunos',
    instrutores: 'Corpo Docente',
    perfil: 'Meu Perfil Profissional',
    sala: 'Salas & Aparelhos',
    financeiro: 'Controle Financeiro',
    configuracoes: 'Ajustes Gerais',
  };

  if (!isAuthenticated) {
    return <Login />;
  }
  
  // Rota para o Super Admin
  if (user?.role === 'superadmin') {
    return <SuperAdminDashboard />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'painel':
        return <Dashboard />;
      case 'agenda':
        return <Agenda />;
      case 'escala':
        return <Escala />;
      case 'alunos':
        return <Students />;
      case 'instrutores':
        return <Instructors />;
      case 'perfil':
        return <InstructorProfile />;
      case 'sala':
        return <RoomsAndEquipment />;
      case 'financeiro':
        return <Financial />;
      case 'configuracoes':
        return <Settings />;
      default:
        return (
          <div className="flex items-center justify-center h-[60vh] text-gray-500">
            Módulo {activeTab} em desenvolvimento...
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen text-slate-900 dark:text-gray-100 transition-colors duration-300 overflow-hidden relative bg-slate-50 dark:bg-[#0b0e14]">
      <NeuralNetworkBackground isDarkMode={isDarkMode} />
      
      <Sidebar 
        appName={appName}
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />}

      <main className="flex-1 overflow-y-auto h-screen lg:ml-72 relative custom-scrollbar">
        <MobileHeader 
          pageTitle={pageTitles[activeTab]} 
          onToggleSidebar={() => setIsSidebarOpen(true)} 
        />
        <div className="px-4 md:px-8 pb-8">
          {renderContent()}

          <footer className="mt-12 text-center text-xs text-slate-400 dark:text-gray-600 pb-8">
            © 2025 Powered by <a href="https://cod3-ss.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-semibold text-sky-500 hover:underline">COD3 Software Solution</a>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;