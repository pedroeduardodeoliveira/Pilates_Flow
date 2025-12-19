
import React, { useState, useEffect, useRef, useContext } from 'react';
import { AppContext } from '../AppContext';
import { Palette, DollarSign, Bell, Save, UploadCloud, Image, Loader2, CheckCircle } from 'lucide-react';

const Settings: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const { settings } = state;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const debounceTimeout = useRef<number | null>(null);

  const showSaveSuccess = () => {
    setSaveSuccess(true);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = window.setTimeout(() => {
        setSaveSuccess(false);
    }, 2000);
  };

  const handleSettingsChange = (updatedSettings: Partial<typeof settings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: updatedSettings });
    showSaveSuccess();
  };
  
  const handlePlanChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newPlans = [...settings.plans];
    newPlans[index] = { ...newPlans[index], value: e.target.value };
    handleSettingsChange({ plans: newPlans });
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleSettingsChange({ logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Limpa o timeout quando o componente é desmontado
  useEffect(() => {
    return () => {
        if(debounceTimeout.current) clearTimeout(debounceTimeout.current);
    }
  }, []);

  return (
    <div className="pt-8 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-slate-800 dark:text-gray-100 uppercase tracking-tighter">Ajustes Gerais</h1>
         {saveSuccess && (
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold animate-in fade-in">
              <CheckCircle size={14} />
              <span>Salvo!</span>
            </div>
          )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Esquerda: Informações do Estúdio */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-lg bg-sky-500/10 flex items-center justify-center overflow-hidden border border-sky-500/20`}>
                {settings.logo ? <img src={settings.logo} className="w-full h-full object-cover" /> : <Image size={24} className="text-sky-500" />}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-gray-100">{settings.appName}</h3>
                <p className="text-xs text-slate-500 dark:text-gray-400">Perfil do Estúdio</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
              Aqui você personaliza a identidade, os planos e as regras de negócio do seu estúdio. As alterações são salvas automaticamente.
            </p>
          </div>
        </div>

        {/* Coluna Direita: Configurações */}
        <div className="lg:col-span-2 space-y-8">
          {/* Identidade Visual */}
          <div className="bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="p-6 border-b border-slate-100 dark:border-gray-800 flex items-center gap-3">
              <Palette size={16} className="text-sky-500" />
              <h3 className="text-xs font-bold text-slate-800 dark:text-gray-300 uppercase tracking-wider">Identidade Visual</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Nome do Estúdio</label>
                <input 
                  type="text" 
                  value={settings.appName}
                  onChange={(e) => handleSettingsChange({ appName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-slate-700 dark:text-gray-200 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Logo</label>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 bg-slate-50 dark:bg-gray-800 border-2 border-dashed border-slate-200 dark:border-gray-700 hover:border-sky-500 rounded-xl px-4 py-3 text-sm text-slate-500 dark:text-gray-400 font-medium transition-all"
                >
                  <UploadCloud size={16} />
                  {settings.logo ? 'Alterar Logo' : 'Enviar Logo'}
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoChange} />
              </div>
            </div>
          </div>
          
          {/* Financeiro */}
          <div className="bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="p-6 border-b border-slate-100 dark:border-gray-800 flex items-center gap-3">
              <DollarSign size={16} className="text-emerald-500" />
              <h3 className="text-xs font-bold text-slate-800 dark:text-gray-300 uppercase tracking-wider">Financeiro</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settings.plans.map((plan, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">{plan.label}</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-gray-500">R$</span>
                      <input 
                        type="number" 
                        value={plan.value}
                        onChange={(e) => handlePlanChange(e, idx)}
                        className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-700 dark:text-gray-200 focus:outline-none focus:border-sky-500 font-medium"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-gray-800">
                 <div className="space-y-1.5 max-w-xs">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Comissão Padrão (Instrutores)</label>
                    <div className="relative">
                       <input 
                         type="number" 
                         value={settings.commission}
                         onChange={(e) => handleSettingsChange({ commission: e.target.value })}
                         className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl pr-12 pl-4 py-3 text-sm text-slate-700 dark:text-gray-200 focus:outline-none focus:border-sky-500 font-medium text-right"
                       />
                       <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-gray-500">%</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
          
          {/* Sistema */}
          <div className="bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="p-6 border-b border-slate-100 dark:border-gray-800 flex items-center gap-3">
              <Bell size={16} className="text-amber-500" />
              <h3 className="text-xs font-bold text-slate-800 dark:text-gray-300 uppercase tracking-wider">Sistema & Alertas</h3>
            </div>
            <div className="p-6">
              <div className="space-y-1.5 max-w-xs">
                <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Alertar vencimento com antecedência de</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={settings.alertDays}
                    onChange={(e) => handleSettingsChange({ alertDays: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl pr-16 pl-4 py-3 text-sm text-slate-700 dark:text-gray-200 focus:outline-none focus:border-sky-500 font-medium text-right"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-gray-500">dias</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;