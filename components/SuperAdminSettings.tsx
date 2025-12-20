import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../AppContext';
import { Settings, Calendar, CheckCircle } from 'lucide-react';

const SuperAdminSettings: React.FC = () => {
    const { state, dispatch } = useContext(AppContext);
    const { superAdminSettings } = state;

    const [trialDays, setTrialDays] = useState(superAdminSettings.defaultTrialDays);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const debounceTimeout = useRef<number | null>(null);

    useEffect(() => {
        setTrialDays(superAdminSettings.defaultTrialDays);
    }, [superAdminSettings.defaultTrialDays]);

    const showSaveSuccess = () => {
        setSaveSuccess(true);
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = window.setTimeout(() => {
            setSaveSuccess(false);
        }, 2000);
    };

    const handleTrialDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setTrialDays(value);
        if (!isNaN(value) && value > 0) {
            dispatch({ type: 'UPDATE_SUPER_ADMIN_SETTINGS', payload: { defaultTrialDays: value } });
            showSaveSuccess();
        }
    };
    
    return (
        <div className="max-w-3xl mx-auto animate-in fade-in">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-gray-100">Configurações Globais</h2>
                {saveSuccess && (
                    <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold animate-in fade-in">
                        <CheckCircle size={14} />
                        <span>Salvo Automaticamente!</span>
                    </div>
                )}
            </div>
            <p className="text-sm text-slate-500 dark:text-gray-400 mb-8">
                Ajuste as regras de negócio e parâmetros padrão para todos os clientes da plataforma.
            </p>

            <div className="bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-xl">
                <div className="p-6 border-b border-slate-100 dark:border-gray-800 flex items-center gap-3">
                    <Calendar size={16} className="text-sky-500" />
                    <h3 className="text-xs font-bold text-slate-800 dark:text-gray-300 uppercase tracking-wider">Licenciamento e Testes</h3>
                </div>
                <div className="p-6">
                    <div className="max-w-sm space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Duração do Período de Teste (dias)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={trialDays}
                                onChange={handleTrialDaysChange}
                                className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-slate-700 dark:text-gray-200 focus:outline-none focus:border-sky-500 font-medium"
                                min="1"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-gray-500">dias</span>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-gray-500 ml-1 mt-2">
                            Define o tempo padrão que um novo cliente terá ao iniciar com uma licença de teste.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminSettings;