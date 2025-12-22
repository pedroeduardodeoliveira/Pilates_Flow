import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../AppContext';
import { Settings, Calendar, CheckCircle, CreditCard, Package, ToggleLeft, ToggleRight, Percent, Bell, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { SubscriptionPlan } from '../types';

const SuperAdminSettings: React.FC = () => {
    const { state, dispatch } = useContext(AppContext);
    const { superAdminSettings, subscriptionPlans } = state;

    const [localSettings, setLocalSettings] = useState(superAdminSettings);
    const [plans, setPlans] = useState(subscriptionPlans);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const debounceTimeout = useRef<number | null>(null);

    useEffect(() => {
        setLocalSettings(superAdminSettings);
        setPlans(subscriptionPlans);
    }, [superAdminSettings, subscriptionPlans]);

    const showSaveSuccess = () => {
        setSaveSuccess(true);
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = window.setTimeout(() => {
            setSaveSuccess(false);
        }, 2000);
    };

    const handleSettingsChange = <K extends keyof typeof superAdminSettings>(key: K, value: (typeof superAdminSettings)[K]) => {
        const updatedSettings = { ...localSettings, [key]: value };
        setLocalSettings(updatedSettings);
        dispatch({ type: 'UPDATE_SUPER_ADMIN_SETTINGS', payload: { [key]: value } });
        showSaveSuccess();
    };

    const handlePlanChange = (planId: string, field: 'price' | keyof SubscriptionPlan['features'], value: any) => {
        const updatedPlans = plans.map(p => {
            if (p.id === planId) {
                if (field === 'price') {
                    return { ...p, price: parseFloat(value) || 0 };
                }
                return { ...p, features: { ...p.features, [field]: value } };
            }
            return p;
        });
        setPlans(updatedPlans);
        dispatch({ type: 'UPDATE_SUBSCRIPTION_PLANS', payload: updatedPlans });
        showSaveSuccess();
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(localSettings.supportLink).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }).catch(err => {
            console.error('Falha ao copiar:', err);
        });
    };
    
    return (
        <div className="max-w-4xl mx-auto animate-in fade-in">
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
            
            <div className="space-y-8">
                {/* Planos de Assinatura */}
                <div className="bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-xl">
                    <div className="p-6 border-b border-slate-100 dark:border-gray-800 flex items-center gap-3">
                        <CreditCard size={16} className="text-sky-500" />
                        <h3 className="text-xs font-bold text-slate-800 dark:text-gray-300 uppercase tracking-wider">Planos de Assinatura</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {plans.map(plan => (
                            <div key={plan.id} className="bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-xl p-4 space-y-4">
                                <div>
                                    <p className="text-sm font-bold text-slate-700 dark:text-gray-200">{plan.name}</p>
                                    <div className="relative mt-2">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-gray-500">R$</span>
                                        <input
                                            type="number"
                                            value={plan.price}
                                            onChange={(e) => handlePlanChange(plan.id, 'price', e.target.value)}
                                            className="w-full bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm font-medium"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-gray-500">/mês</span>
                                    </div>
                                </div>
                                <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-gray-700">
                                    <p className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Funcionalidades Inclusas</p>
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-medium text-slate-600 dark:text-gray-300">Módulo Financeiro</label>
                                        <button onClick={() => handlePlanChange(plan.id, 'financialModule', !plan.features.financialModule)}>
                                            {plan.features.financialModule ? <ToggleRight size={24} className="text-sky-500"/> : <ToggleLeft size={24} className="text-slate-300 dark:text-gray-600"/>}
                                        </button>
                                    </div>
                                     <div className="flex items-center justify-between">
                                        <label className="text-xs font-medium text-slate-600 dark:text-gray-300">Alocação Rápida em Lote</label>
                                        <button onClick={() => handlePlanChange(plan.id, 'bulkAllocation', !plan.features.bulkAllocation)}>
                                            {plan.features.bulkAllocation ? <ToggleRight size={24} className="text-sky-500"/> : <ToggleLeft size={24} className="text-slate-300 dark:text-gray-600"/>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-xl">
                    <div className="p-6 border-b border-slate-100 dark:border-gray-800 flex items-center gap-3">
                        <Package size={16} className="text-sky-500" />
                        <h3 className="text-xs font-bold text-slate-800 dark:text-gray-300 uppercase tracking-wider">Padrões para Novos Clientes</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Duração do Teste</label><div className="relative"><input type="number" value={localSettings.defaultTrialDays} onChange={(e) => handleSettingsChange('defaultTrialDays', parseInt(e.target.value) || 0)} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm" min="1"/><span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-gray-500">dias</span></div></div>
                        <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Comissão Padrão</label><div className="relative"><input type="number" value={localSettings.defaultCommission} onChange={(e) => handleSettingsChange('defaultCommission', parseInt(e.target.value) || 0)} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm" min="0"/><span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-gray-500">%</span></div></div>
                        <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Alerta de Vencimento</label><div className="relative"><input type="number" value={localSettings.defaultAlertDays} onChange={(e) => handleSettingsChange('defaultAlertDays', parseInt(e.target.value) || 0)} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm" min="1"/><span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-gray-500">dias</span></div></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-xl">
                     <div className="p-6 border-b border-slate-100 dark:border-gray-800 flex items-center gap-3">
                        <LinkIcon size={16} className="text-sky-500" />
                        <h3 className="text-xs font-bold text-slate-800 dark:text-gray-300 uppercase tracking-wider">Marca e Suporte</h3>
                    </div>
                     <div className="p-6">
                        <div className="space-y-1.5 max-w-sm">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Link de Suporte Global</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={localSettings.supportLink}
                                    onChange={(e) => handleSettingsChange('supportLink', e.target.value)}
                                    placeholder="https://wa.me/..."
                                    className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm pr-12"
                                />
                                <button
                                    onClick={handleCopyLink}
                                    className="absolute right-0 top-0 h-full px-4 flex items-center text-slate-400 dark:text-gray-500 hover:text-sky-500 transition-colors"
                                    title={copySuccess ? "Copiado!" : "Copiar Link"}
                                >
                                    {copySuccess ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminSettings;