
import React from 'react';
import StatCard from './StatCard';
import { Users, TrendingUp, Medal, Puzzle, Cake, Clock } from 'lucide-react';
import ScheduleItem from './ScheduleItem';

// Define props interface for Dashboard to include notify function
interface DashboardProps {
  notify: (message: string, type?: 'success' | 'error') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ notify }) => {
  const classes = [
    { id: '1', time: '07:00', student: 'Gustavo Henrique', instructor: 'Bruno Santos' },
    { id: '2', time: '08:00', student: 'Amanda Vieira', instructor: 'Daniel Oliveira' },
    { id: '3', time: '09:00', student: 'Juliana Pereira', instructor: 'Daniel Oliveira' },
    { id: '4', time: '10:00', student: 'Lucas Mendes', instructor: 'Mariana Costa' },
    { id: '5', time: '11:00', student: 'Beatriz Silva', instructor: 'Mariana Costa' },
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Alunos Ativos" 
          value="18" 
          icon={<Users size={20} />} 
          iconBg="bg-sky-500/10" 
          iconColor="text-sky-600 dark:text-sky-500" 
        />
        <StatCard 
          label="Receita do Mês" 
          value="R$ 0,00" 
          icon={<TrendingUp size={20} />} 
          iconBg="bg-emerald-500/10" 
          iconColor="text-emerald-600 dark:text-emerald-500" 
        />
        <StatCard 
          label="Instrutores" 
          value="4" 
          icon={<Medal size={20} />} 
          iconBg="bg-amber-500/10" 
          iconColor="text-amber-600 dark:text-amber-500" 
        />
        <StatCard 
          label="Aparelhos" 
          value="5" 
          icon={<Puzzle size={20} />} 
          iconBg="bg-indigo-500/10" 
          iconColor="text-indigo-600 dark:text-indigo-500" 
        />
      </div>

      {/* Main Grid Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Birthdays Card */}
        <div className="lg:col-span-2 bg-white dark:bg-[#161b26] rounded-2xl p-6 border border-slate-200 dark:border-gray-800/50 min-h-[400px] flex flex-col shadow-sm dark:shadow-none transition-colors duration-300">
          <div className="flex items-center gap-2 mb-8">
            <Cake size={20} className="text-rose-500" />
            <h3 className="font-semibold text-slate-800 dark:text-gray-200">Aniversariantes do Mês</h3>
          </div>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-gray-800 rounded-xl">
            <p className="text-slate-400 dark:text-gray-500 text-sm">Nenhum aniversariante este mês.</p>
          </div>
        </div>

        {/* Classes Card */}
        <div className="bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-gray-800/50 flex flex-col overflow-hidden h-[400px] shadow-sm dark:shadow-none transition-colors duration-300">
          <div className="p-6 border-b border-slate-100 dark:border-gray-800/50 flex items-center gap-2">
            <Clock size={20} className="text-sky-500" />
            <h3 className="font-semibold text-slate-800 dark:text-gray-200">Aulas de Hoje (Quinta)</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
            {classes.map((cls) => (
              <ScheduleItem key={cls.id} item={cls} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
