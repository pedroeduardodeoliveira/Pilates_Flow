import React, { useState, useEffect, useRef, useContext } from 'react';
import { AppContext } from '../AppContext';
import { Palette, DollarSign, Bell, Save, UploadCloud, Image, Loader2, CheckCircle, Phone, Mail, MapPin, FileText, AlertTriangle, ShieldAlert, CreditCard } from 'lucide-react';

const Settings: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const { settings, user } = state;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const debounceTimeout = useRef<number | null>(null);
  const [isLoadingCep, setIsLoadingCep] = useState(false);

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

  const maskPhone = (v: string) => v.replace(/\D/g, "").replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d)(\d{4})$/, "$1-$2");
  const maskCEP = (v: string) => v.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2");
  const maskCNPJ = (v: string) => v.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2");
  
  const handleCEPBlur = async () => {
    const cleaned = settings.address.cep.replace(/\D/g, "");
    if (cleaned.length === 8) {
      setIsLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
        const data = await response.json();
        if (!data.erro) {
            handleSettingsChange({ 
                address: {
                    ...settings.address,
                    street: data.logradouro,
                    neighborhood: data.bairro,
                    city: data.localidade,
                    state: data.uf
                }
            });
        }
      } catch (e) { console.error("Erro ao buscar CEP"); } finally { setIsLoadingCep(false); }
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
        {/* Coluna Esquerda: Informações do Estúdio e Licença */}
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
          
          {/* Card de Status da Licença */}
          {user?.license && (() => {
            const { license } = user;
            const expiresDate = new Date(license.expiresAt);

            let config = {
                icon: <CheckCircle size={24} />,
                borderColor: 'border-emerald-500/20',
                textColor: 'text-emerald-500',
                title: 'Licença Ativa',
                buttonClass: 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-gray-200 hover:bg-slate-300 dark:hover:bg-white/20'
            };

            if (license.status === 'expiring_soon') {
                config = {
                    icon: <AlertTriangle size={24} />,
                    borderColor: 'border-amber-500/20',
                    textColor: 'text-amber-500',
                    title: 'Licença Expirando',
                    buttonClass: 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20'
                };
            } else if (license.status === 'expired') {
                config = {
                    icon: <ShieldAlert size={24} />,
                    borderColor: 'border-rose-500/20',
                    textColor: 'text-rose-500',
                    title: 'Licença Expirada',
                    buttonClass: 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20'
                };
            }

            return (
                <div className={`bg-white dark:bg-gray-900/40 border ${config.borderColor} rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none animate-in fade-in`}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-lg ${config.textColor}/10 flex items-center justify-center`}>
                           <div className={config.textColor}>{config.icon}</div>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-gray-100">Status da Licença</h3>
                            <p className={`text-xs font-bold ${config.textColor}`}>{config.title}</p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed mb-4">
                        Sua assinatura é válida até{' '}
                        <strong className="text-slate-700 dark:text-gray-200">
                            {expiresDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </strong>.
                    </p>
                    <button className={`w-full py-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 ${config.buttonClass}`}>
                        <CreditCard size={14} /> Gerenciar Assinatura
                    </button>
                </div>
            );
          })()}
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
          
          {/* Contato e Endereço */}
          <div className="bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="p-6 border-b border-slate-100 dark:border-gray-800 flex items-center gap-3">
              <MapPin size={16} className="text-sky-500" />
              <h3 className="text-xs font-bold text-slate-800 dark:text-gray-300 uppercase tracking-wider">Contato & Endereço</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Telefone / WhatsApp</label><input value={settings.phone} onChange={e => handleSettingsChange({ phone: maskPhone(e.target.value) })} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-slate-700 dark:text-gray-200 outline-none focus:border-sky-500 text-sm" placeholder="(00) 00000-0000" maxLength={15} /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">E-mail de Contato</label><input type="email" value={settings.email} onChange={e => handleSettingsChange({ email: e.target.value })} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-slate-700 dark:text-gray-200 outline-none focus:border-sky-500 text-sm" placeholder="contato@seudominio.com"/></div>
              </div>
              <div className="grid grid-cols-12 gap-x-4 gap-y-4 pt-4 border-t border-slate-100 dark:border-gray-800">
                <div className="col-span-12 md:col-span-3 space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1 flex justify-between items-center">CEP {isLoadingCep && <Loader2 size={12} className="animate-spin" />}</label>
                  <input value={settings.address.cep} onChange={e => handleSettingsChange({ address: { ...settings.address, cep: maskCEP(e.target.value) }})} onBlur={handleCEPBlur} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-slate-700 dark:text-gray-200 outline-none focus:border-sky-500 text-sm" placeholder="00000-000" maxLength={9} />
                </div>
                <div className="col-span-12 md:col-span-7 space-y-1.5"><label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Rua / Logradouro</label><input value={settings.address.street} onChange={e => handleSettingsChange({ address: { ...settings.address, street: e.target.value } })} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-slate-700 dark:text-gray-200 outline-none focus:border-sky-500 text-sm" placeholder="Preenchido automaticamente"/></div>
                <div className="col-span-12 md:col-span-2 space-y-1.5"><label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Nº</label><input value={settings.address.number} onChange={e => handleSettingsChange({ address: { ...settings.address, number: e.target.value } })} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-slate-700 dark:text-gray-200 outline-none focus:border-sky-500 text-sm" placeholder="123"/></div>
                <div className="col-span-12 md:col-span-4 space-y-1.5"><label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Bairro</label><input value={settings.address.neighborhood} onChange={e => handleSettingsChange({ address: { ...settings.address, neighborhood: e.target.value } })} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-slate-700 dark:text-gray-200 outline-none focus:border-sky-500 text-sm" /></div>
                <div className="col-span-12 md:col-span-5 space-y-1.5"><label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Cidade</label><input value={settings.address.city} onChange={e => handleSettingsChange({ address: { ...settings.address, city: e.target.value } })} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-slate-700 dark:text-gray-200 outline-none focus:border-sky-500 text-sm" /></div>
                <div className="col-span-12 md:col-span-3 space-y-1.5"><label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Estado</label><input value={settings.address.state} onChange={e => handleSettingsChange({ address: { ...settings.address, state: e.target.value } })} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-slate-700 dark:text-gray-200 outline-none focus:border-sky-500 text-sm" maxLength={2} placeholder="SP"/></div>
              </div>
            </div>
          </div>
          
          {/* Dados Fiscais */}
          <div className="bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="p-6 border-b border-slate-100 dark:border-gray-800 flex items-center gap-3">
                <FileText size={16} className="text-sky-500" />
                <h3 className="text-xs font-bold text-slate-800 dark:text-gray-300 uppercase tracking-wider">Dados Fiscais</h3>
            </div>
            <div className="p-6">
                <div className="space-y-1.5 max-w-sm">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">CNPJ</label>
                    <input value={settings.cnpj} onChange={e => handleSettingsChange({ cnpj: maskCNPJ(e.target.value) })} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-slate-700 dark:text-gray-200 outline-none focus:border-sky-500 text-sm" placeholder="00.000.000/0000-00" maxLength={18}/>
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
                         className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl pl-4 pr-10 py-3 text-sm text-slate-700 dark:text-gray-200 focus:outline-none focus:border-sky-500 font-medium"
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
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Alertar vencimento com antecedência de</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={settings.alertDays}
                    onChange={(e) => handleSettingsChange({ alertDays: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl pl-4 pr-16 py-3 text-sm text-slate-700 dark:text-gray-200 focus:outline-none focus:border-sky-500 font-medium"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-gray-500">dias</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Inativar aluno automaticamente após</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={settings.autoInactiveDays}
                    onChange={(e) => handleSettingsChange({ autoInactiveDays: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl pl-4 pr-28 py-3 text-sm text-slate-700 dark:text-gray-200 focus:outline-none focus:border-sky-500 font-medium"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-gray-500">dias de vencido</span>
                </div>
              </div>
               <div className="md:col-span-2 pt-6 border-t border-slate-100 dark:border-gray-800">
                <div className="flex items-center justify-between bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3">
                    <div>
                        <label className="text-sm font-bold text-slate-700 dark:text-gray-200">Visão Ampla para Instrutores</label>
                        <p className="text-xs text-slate-500 dark:text-gray-400">Se ativado, instrutores podem ver todos os alunos do estúdio.</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={settings.instructorSeesAllStudents}
                      onClick={() => handleSettingsChange({ instructorSeesAllStudents: !settings.instructorSeesAllStudents })}
                      className={`${
                        settings.instructorSeesAllStudents ? 'bg-sky-500' : 'bg-slate-300 dark:bg-gray-600'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900/40`}
                    >
                      <span
                        aria-hidden="true"
                        className={`${
                          settings.instructorSeesAllStudents ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
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