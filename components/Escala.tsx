
import React, { useState, useRef, useEffect, useContext } from 'react';
import { AppContext } from '../AppContext';
import { ChevronLeft, ChevronRight, Users, Clock, Check, Box } from 'lucide-react';
import EscalaCard from './EscalaCard';
import { EscalaItem, Instructor } from '../types';
import { escalaItemsData } from '../mockData';

const Escala: React.FC = () => {
  const { state } = useContext(AppContext);
  const { instructors } = state;
  
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 18)); // 18 de Dezembro, 2025
  const [isInstructorOpen, setIsInstructorOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const escalaItems: EscalaItem[] = escalaItemsData;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsInstructorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Gera horários das 06:00 às 22:00
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = i + 6;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const getFilteredEscala = (time: string, dayIdx: number) => {
    return escalaItems.filter(a => {
      const matchTime = a.time === time;
      const matchDay = a.day === dayIdx;
      const matchInstructor = selectedInstructor ? a.instructor === selectedInstructor : true;
      return matchTime && matchDay && matchInstructor;
    });
  };

  const navigate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (view === 'daily') newDate.setDate(currentDate.getDate() + direction);
    else if (view === 'weekly') newDate.setDate(currentDate.getDate() + (direction * 7));
    else if (view === 'monthly') newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDayName = (date: Date) => {
    const names = ['DOM.', 'SEG.', 'TER.', 'QUA.', 'QUI.', 'SEX.', 'SÁB.'];
    return names[date.getDay()];
  };

  const getFullMonthName = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const renderDaily = () => {
    const dayOfWeek = currentDate.getDay();
    const dayIdx = dayOfWeek === 0 ? 5 : dayOfWeek - 1;

    return (
      <div className="bg-white dark:bg-gray-900/40 rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="grid grid-cols-[80px_1fr]">
          <div className="p-4 border-b border-r border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-900/20 flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-sky-500 mb-1">{getDayName(currentDate)}</span>
            <span className="text-2xl font-bold text-slate-800 dark:text-white">{currentDate.getDate()}</span>
          </div>
          <div className="p-4 border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-900/20 flex items-center">
            <Box className="text-sky-500 mr-2" size={16} />
            <h3 className="font-bold text-slate-700 dark:text-gray-300 text-sm">Distribuição de Aparelhos</h3>
          </div>
          {timeSlots.map((time) => (
            <React.Fragment key={time}>
              <div className="p-4 text-center border-b border-r border-slate-200 dark:border-gray-800 flex items-center justify-center">
                <span className="text-xs font-bold text-slate-500 dark:text-gray-400">{time}</span>
              </div>
              <div className="p-4 border-b border-slate-200 dark:border-gray-800 min-h-[120px] transition-colors hover:bg-slate-50/50 dark:hover:bg-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {getFilteredEscala(time, dayIdx).map((item) => (
                    <EscalaCard key={item.id} item={item} />
                  ))}
                  {getFilteredEscala(time, dayIdx).length === 0 && (
                    <div className="h-full border border-dashed border-slate-200 dark:border-gray-700 rounded-xl flex items-center justify-center text-slate-400 dark:text-gray-600 text-xs italic">
                      Nenhum aparelho alocado
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderWeekly = () => {
    const current = new Date(currentDate);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(current.setDate(diff));

    const weekDays = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return {
        name: getDayName(d),
        date: d.getDate(),
        fullDate: d,
        active: d.toDateString() === currentDate.toDateString()
      };
    });

    return (
      <div className="bg-white dark:bg-gray-900/40 rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[80px_repeat(6,1fr)]">
              <div className="p-4 border-b border-r border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-900/20"></div>
              {weekDays.map((day, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setCurrentDate(day.fullDate)}
                  className={`p-4 border-b border-slate-200 dark:border-gray-800 text-center flex flex-col items-center justify-center transition-all cursor-pointer hover:bg-sky-500/5 ${
                    day.active ? 'bg-sky-500/10' : 'bg-slate-50 dark:bg-gray-900/20'
                  }`}
                >
                  <span className={`text-[10px] font-bold tracking-wider mb-1 ${day.active ? 'text-sky-500' : 'text-slate-500 dark:text-gray-400'}`}>
                    {day.name}
                  </span>
                  <span className={`text-xl font-bold ${day.active ? 'text-slate-800 dark:text-white' : 'text-slate-600 dark:text-gray-300'}`}>
                    {day.date}
                  </span>
                  {day.active && <div className="mt-2 w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]"></div>}
                </div>
              ))}

              {timeSlots.map((time) => (
                <React.Fragment key={time}>
                  <div className="p-4 text-center border-b border-r border-slate-200 dark:border-gray-800 flex items-center justify-center">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-gray-400">{time}</span>
                  </div>
                  {[0, 1, 2, 3, 4, 5].map((dayIdx) => (
                    <div key={`${time}-${dayIdx}`} className="p-1.5 border-b border-slate-200 dark:border-gray-800 min-h-[100px] relative transition-colors hover:bg-slate-50/50 dark:hover:bg-white/5">
                      <div className="flex flex-col gap-1.5 h-full">
                        {getFilteredEscala(time, dayIdx).map((item) => (
                          <EscalaCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMonthly = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();

    const monthDays = Array.from({ length: 42 }, (_, i) => {
      const day = i - startDay + 1;
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      return {
        date: d.getDate(),
        fullDate: d,
        isCurrentMonth: d.getMonth() === currentDate.getMonth(),
        isToday: d.toDateString() === currentDate.toDateString()
      };
    });

    const dayHeaders = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

    return (
      <div className="bg-white dark:bg-gray-900/40 rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-900/20">
          {dayHeaders.map(h => (
            <div key={h} className="p-2 md:p-4 text-center text-[10px] font-bold text-slate-500 dark:text-gray-400 tracking-widest uppercase">{h}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {monthDays.map((day, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentDate(day.fullDate)}
              className={`min-h-[60px] md:min-h-[100px] p-2 md:p-3 border-b border-r border-slate-200 dark:border-gray-800 transition-all cursor-pointer flex flex-col gap-2 ${
                !day.isCurrentMonth ? 'opacity-20 pointer-events-none' : 'hover:bg-slate-50 dark:hover:bg-white/5'
              } ${day.isToday ? 'bg-sky-500/5' : ''}`}
            >
              <span className={`text-xs md:text-sm font-bold ${day.isToday ? 'text-sky-500' : 'text-slate-500 dark:text-gray-400'}`}>
                {day.date}
              </span>
              <div className="hidden md:flex flex-wrap gap-1 mt-1">
                {day.isCurrentMonth && escalaItems.filter(a => a.day === (day.fullDate.getDay() - 1)).slice(0, 4).map(a => (
                  <div key={a.id} className={`h-1.5 w-1.5 rounded-full ${
                    a.color === 'orange' ? 'bg-orange-500' : a.color === 'blue' ? 'bg-blue-600' : a.color === 'pink' ? 'bg-rose-500' : 'bg-emerald-500'
                  }`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getTitle = () => {
    if (view === 'daily') return currentDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    if (view === 'weekly') {
      const start = new Date(currentDate);
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(start.setDate(diff));
      const saturday = new Date(monday);
      saturday.setDate(monday.getDate() + 5);
      return `${monday.getDate()} - ${saturday.getDate()} de ${getFullMonthName(saturday)}`;
    }
    return getFullMonthName(currentDate);
  };

  return (
    <div className="space-y-6 pt-24 lg:pt-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
          <div className="flex items-center bg-white dark:bg-gray-900/40 rounded-lg border border-slate-200 dark:border-gray-800 p-1 shadow-sm">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-md text-slate-500 dark:text-gray-400 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="px-2 sm:px-4 text-sm font-semibold text-slate-700 dark:text-gray-300 capitalize min-w-[140px] text-center">
              {getTitle()}
            </div>
            <button 
              onClick={() => navigate(1)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-md text-slate-500 dark:text-gray-400 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsInstructorOpen(!isInstructorOpen)}
              className={`flex w-full justify-between items-center gap-2 bg-white dark:bg-gray-900/40 border px-4 py-2.5 rounded-lg text-sm transition-all ${
                selectedInstructor ? 'border-sky-500/50 text-sky-500' : 'border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 hover:border-slate-300 dark:hover:border-gray-700'
              }`}
            >
              <Users size={16} className={selectedInstructor ? 'text-sky-500' : 'text-gray-500 dark:text-gray-400'} />
              <span className="font-medium">{selectedInstructor || 'Filtrar por Instrutor'}</span>
              <ChevronRight size={14} className={`transition-transform duration-200 ${isInstructorOpen ? '-rotate-90' : 'rotate-90 text-gray-500'}`} />
            </button>

            {isInstructorOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl shadow-2xl z-[60] overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-150">
                <button 
                  onClick={() => { setSelectedInstructor(null); setIsInstructorOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-sky-500 transition-colors"
                >
                  <span>Ver Escala Global</span>
                  {!selectedInstructor && <Check size={14} className="text-sky-500" />}
                </button>
                <div className="h-[1px] bg-slate-200 dark:bg-gray-800 mx-2 my-1"></div>
                {instructors.map(instr => (
                  <button 
                    key={instr.id}
                    onClick={() => { setSelectedInstructor(instr.name); setIsInstructorOpen(false); }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-sky-500 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${instr.avatarColor}`}></div>
                      <span>{instr.name}</span>
                    </div>
                    {selectedInstructor === instr.name && <Check size={14} className="text-sky-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center bg-white dark:bg-gray-900/40 rounded-lg border border-slate-200 dark:border-gray-800 p-1 shadow-sm">
          <button 
            onClick={() => setView('daily')}
            className={`px-4 py-1.5 text-xs font-bold transition-all rounded-md ${view === 'daily' ? 'bg-sky-500/10 text-sky-500' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300'}`}
          >
            Diário
          </button>
          <button 
            onClick={() => setView('weekly')}
            className={`px-4 py-1.5 text-xs font-bold transition-all rounded-md ${view === 'weekly' ? 'bg-sky-500/10 text-sky-500' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300'}`}
          >
            Semanal
          </button>
          <button 
            onClick={() => setView('monthly')}
            className={`px-4 py-1.5 text-xs font-bold transition-all rounded-md ${view === 'monthly' ? 'bg-sky-500/10 text-sky-500' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300'}`}
          >
            Mensal
          </button>
        </div>
      </div>

      <div className="relative min-h-[500px]">
        {view === 'daily' && renderDaily()}
        {view === 'weekly' && renderWeekly()}
        {view === 'monthly' && renderMonthly()}
      </div>
    </div>
  );
};

export default Escala;