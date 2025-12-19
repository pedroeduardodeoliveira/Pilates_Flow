
import React, { useMemo, useContext } from 'react';
import { AppContext } from '../AppContext';
import StatCard from './StatCard';
import { Users, UserX, Medal, Activity, Cake, Clock, Ban, AlertTriangle } from 'lucide-react';
import { agendaItemsData } from '../mockData'; // Mantém dados de agenda estáticos por enquanto

const Dashboard: React.FC = () => {
  const { state } = useContext(AppContext);
  const { students, instructors, transactions } = state;

  const currentDate = new Date(2025, 11, 18); // Quinta, 18 de Dezembro de 2025

  const kpis = useMemo(() => {
    const activeStudents = students.filter(s => s.status === 'Ativo').length;
    const inactiveStudents = students.filter(s => s.status === 'Inativo').length;
    const activeInstructors = instructors.length;
    const todayDayIndex = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
    const todaysClassesCount = agendaItemsData.filter(a => a.day === todayDayIndex).length;
    
    return { activeStudents, inactiveStudents, activeInstructors, todaysClassesCount };
  }, [students, instructors]);
  
  const expiringStudents = useMemo(() => {
    return students
      .filter(s => s.status === 'Ativo' && s.daysToExpiry >= 0 && s.daysToExpiry <= 7)
      .sort((a, b) => a.daysToExpiry - b.daysToExpiry);
  }, [students]);

  const expiredStudents = useMemo(() => {
    return students
      .filter(s => s.status === 'Ativo' && s.isExpired)
      .sort((a, b) => a.daysToExpiry - b.daysToExpiry);
  }, [students]);

  const monthlyBirthdays = useMemo(() => {
    return students
      .filter(s => s.birthDate && new Date(s.birthDate).getUTCMonth() === currentDate.getMonth())
      .sort((a,b) => new Date(a.birthDate!).getUTCDate() - new Date(b.birthDate!).getUTCDate());
  }, [students]);

  const todaysClasses = useMemo(() => {
    const todayDayIndex = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
    return agendaItemsData
      .filter(a => a.day === todayDayIndex)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, []);

  return (
    <div className="space-y-8 pt-8">
      {/* Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Alunos Ativos" value={kpis.activeStudents} icon={<Users size={20} />} iconBg="bg-sky-500/10" iconColor="text-sky-500" />
        <StatCard label="Alunos Inativos" value={kpis.inactiveStudents} icon={<UserX size={20} />} iconBg="bg-rose-500/10" iconColor="text-rose-500" />
        <StatCard label="Instrutores" value={kpis.activeInstructors} icon={<Medal size={20} />} iconBg="bg-amber-500/10" iconColor="text-amber-500" />
        <StatCard label="Aulas de Hoje" value={kpis.todaysClassesCount} icon={<Activity size={20} />} iconBg="bg-indigo-500/10" iconColor="text-indigo-500" />
      </div>

      {/* Main Grid Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Alerts Column */}
        <div className="lg:col-span-2 grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Expiring Soon Card */}
            <div className="bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><AlertTriangle size={16} className="text-amber-500" /> Próximos Vencimentos</h3>
                  <span className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-md text-[10px] font-bold">{expiringStudents.length}</span>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                    {expiringStudents.length > 0 ? expiringStudents.map(s => (
                        <div key={s.id} className="flex items-center justify-between bg-slate-50 dark:bg-white/5 p-2 rounded-lg">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center font-bold text-sky-400 text-xs flex-shrink-0">{s.initials}</div>
                                <div className="min-w-0">
                                    <p className="font-medium text-slate-700 dark:text-gray-200 text-sm truncate">{s.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-gray-400 truncate">{s.instructor}</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md flex-shrink-0">Vence em {s.daysToExpiry}d</span>
                        </div>
                    )) : <p className="text-xs text-slate-500 dark:text-gray-400 italic text-center py-4">Nenhum aluno com vencimento próximo.</p>}
                </div>
            </div>

            {/* Expired Payments Card */}
            <div className="bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><Ban size={16} className="text-rose-500" /> Pagamentos Vencidos</h3>
                  <span className="bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-md text-[10px] font-bold">{expiredStudents.length}</span>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                    {expiredStudents.length > 0 ? expiredStudents.map(s => (
                         <div key={s.id} className="flex items-center justify-between bg-slate-50 dark:bg-white/5 p-2 rounded-lg">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center font-bold text-sky-400 text-xs flex-shrink-0">{s.initials}</div>
                                <div className="min-w-0">
                                    <p className="font-medium text-slate-700 dark:text-gray-200 text-sm truncate">{s.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-gray-400 truncate">{s.instructor}</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-1 rounded-md flex-shrink-0">Vencido há {Math.abs(s.daysToExpiry)}d</span>
                        </div>
                    )) : <p className="text-xs text-slate-500 dark:text-gray-400 italic text-center py-4">Nenhum pagamento vencido. Ótimo trabalho!</p>}
                </div>
            </div>
        </div>

        {/* Side Column */}
        <div className="space-y-8">
          {/* Today's Classes */}
          <div className="bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4"><Clock size={16} /> Aulas de Hoje</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
              {todaysClasses.length > 0 ? todaysClasses.map(c => (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="font-bold text-sky-500 text-xs w-12">{c.time}</span>
                  <div className="flex-1 bg-slate-100 dark:bg-white/5 rounded-md p-2 text-xs flex justify-between items-center">
                    <span className="font-medium text-slate-700 dark:text-gray-200">{c.student}</span>
                    <span className="text-slate-500 dark:text-gray-400 font-bold">{c.instructorInitials}</span>
                  </div>
                </div>
              )) : <p className="text-xs text-slate-500 dark:text-gray-400 italic text-center py-4">Nenhuma aula hoje.</p>}
            </div>
          </div>
          {/* Birthdays */}
          <div className="bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4"><Cake size={16} /> Aniversariantes do Mês</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
              {monthlyBirthdays.length > 0 ? monthlyBirthdays.map(s => (
                <div key={s.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center font-bold text-sky-400 text-xs">{s.initials}</div>
                    <span className="font-medium text-slate-700 dark:text-gray-200 text-sm">{s.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md">{new Date(s.birthDate!).getUTCDate()} / {currentDate.getMonth()+1}</span>
                </div>
              )) : <p className="text-xs text-slate-500 dark:text-gray-400 italic text-center py-4">Nenhum aniversariante em Dezembro.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;