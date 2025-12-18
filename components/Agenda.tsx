
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Users, Calendar as CalendarIcon } from 'lucide-react';
import AgendaCard from './AgendaCard';
import { AgendaItem } from '../types';

interface AgendaProps {
  notify: (msg: string) => void;
}

const Agenda: React.FC<AgendaProps> = ({ notify }) => {
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [currentWeek, setCurrentWeek] = useState(0);

  const days = [
    { name: 'SEG.', date: 15 + (currentWeek * 7) },
    { name: 'TER.', date: 16 + (currentWeek * 7) },
    { name: 'QUA.', date: 17 + (currentWeek * 7) },
    { name: 'QUI.', date: 18 + (currentWeek * 7), active: currentWeek === 0 },
    { name: 'SEX.', date: 19 + (currentWeek * 7) },
    { name: 'SÁB.', date: 20 + (currentWeek * 7) },
  ];

  const timeSlots = ['07:00', '08:00', '09:00', '10:00', '11:00'];

  const appointments: AgendaItem[] = [
    { id: '1', time: '07:00', day: 0, student: 'Fernanda Costa', instructor: 'Carla Dias', instructorInitials: 'CD', color: 'orange' },
    { id: '2', time: '07:00', day: 1, student: 'Gustavo Henrique', instructor: 'Bruno Santos', instructorInitials: 'BS', color: 'blue' },
    { id: '4', time: '07:00', day: 3, student: 'Gustavo Henrique', instructor: 'Bruno Santos', instructorInitials: 'BS', color: 'blue' },
    { id: '7', time: '08:00', day: 1, student: 'Amanda Vieira', instructor: 'Daniel Oliveira', instructorInitials: 'DO', color: 'green' },
    { id: '9', time: '08:00', day: 3, student: 'Amanda Vieira', instructor: 'Daniel Oliveira', instructorInitials: 'DO', color: 'green' },
    { id: '11', time: '09:00', day: 3, student: 'Juliana Pereira', instructor: 'Daniel Oliveira', instructorInitials: 'DO', color: 'green' },
  ];

  const getAppointments = (time: string, dayIdx: number) => {
    return appointments.filter(a => a.time === time && a.day === dayIdx);
  };

  const handleNavigate = (direction: number) => {
    setCurrentWeek(prev => prev + direction);
    notify(`Navegando para a ${direction > 0 ? 'próxima' : 'anterior'} semana`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#161b26] rounded-lg border border-gray-800/50 p-1">
            <button onClick={() => handleNavigate(-1)} className="p-2 hover:bg-white/5 rounded-md text-gray-400 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div className="px-4 text-sm font-semibold text-gray-200">
              {days[0].date} - {days[5].date} de Dezembro
            </div>
            <button onClick={() => handleNavigate(1)} className="p-2 hover:bg-white/5 rounded-md text-gray-400 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>

          <button onClick={() => notify("Filtrando por instrutor...")} className="flex items-center gap-2 bg-[#161b26] border border-gray-800/50 px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:border-gray-700 transition-all">
            <Users size={16} className="text-gray-500" />
            <span>Todos Instrutores</span>
            <ChevronRight size={14} className="rotate-90 text-gray-500" />
          </button>
        </div>

        <div className="flex items-center bg-[#161b26] rounded-lg border border-gray-800/50 p-1">
          <button 
            onClick={() => { setView('daily'); notify("Modo Diário"); }}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${view === 'daily' ? 'bg-sky-500/10 text-sky-500' : 'text-gray-500'}`}
          >
            Diário
          </button>
          <button 
            onClick={() => { setView('weekly'); notify("Modo Semanal"); }}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${view === 'weekly' ? 'bg-sky-500/10 text-sky-500' : 'text-gray-500'}`}
          >
            Semanal
          </button>
          <button 
            onClick={() => { setView('monthly'); notify("Modo Mensal"); }}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${view === 'monthly' ? 'bg-sky-500/10 text-sky-500' : 'text-gray-500'}`}
          >
            Mensal
          </button>
        </div>
      </div>

      <div className="bg-[#0f1420] rounded-2xl border border-gray-800/50 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-[80px_repeat(6,1fr)]">
          <div className="p-4 border-b border-r border-gray-800/50 bg-[#121826]"></div>
          {days.map((day, idx) => (
            <div key={idx} className={`p-4 border-b border-gray-800/50 text-center flex flex-col items-center justify-center ${day.active ? 'bg-sky-500/5' : 'bg-[#121826]'}`}>
              <span className={`text-[10px] font-bold tracking-wider mb-1 ${day.active ? 'text-sky-400' : 'text-gray-500'}`}>{day.name}</span>
              <span className={`text-xl font-bold ${day.active ? 'text-white' : 'text-gray-400'}`}>{day.date}</span>
            </div>
          ))}

          {timeSlots.map((time) => (
            <React.Fragment key={time}>
              <div className="p-4 text-center border-b border-r border-gray-800/50 flex items-center justify-center">
                <span className="text-[11px] font-bold text-gray-500">{time}</span>
              </div>
              {[0, 1, 2, 3, 4, 5].map((dayIdx) => (
                <div key={`${time}-${dayIdx}`} className="p-1.5 border-b border-gray-800/30 min-h-[100px] relative transition-colors hover:bg-white/[0.02]">
                  <div className="flex flex-col gap-1.5 h-full">
                    {getAppointments(time, dayIdx).map((item) => (
                      <AgendaCard key={item.id} item={item} onReschedule={() => notify(`Remarcando aula de ${item.student}...`)} />
                    ))}
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Agenda;
