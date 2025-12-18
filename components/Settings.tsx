
import React, { useState } from 'react';

interface SettingsProps {
  notify: (msg: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ notify }) => {
  const [appName, setAppName] = useState('Pilates Flow');

  const handleSave = (field: string) => {
    notify(`Configuração "${field}" salva com sucesso.`);
  };

  const planRows = [
    { label: 'Valor para 1 aula por semana', value: '150' },
    { label: 'Valor para 2 aulas por semana', value: '250' },
    { label: 'Valor para 3 aulas por semana', value: '320' },
    { label: 'Valor para 4 aulas por semana', value: '380' },
    { label: 'Valor para 5 aulas por semana', value: '420' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="bg-[#161b26] border border-gray-800/50 rounded-2xl p-8">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-sm font-bold text-gray-100 uppercase tracking-wider">Identidade Visual</h3>
          <button 
            onClick={() => handleSave("Identidade Visual")}
            className="text-xs bg-sky-500/10 text-sky-500 font-bold px-4 py-1.5 rounded-lg hover:bg-sky-500/20 transition-all"
          >
            Salvar Nome
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500">Nome do Aplicativo</label>
            <input 
              type="text" 
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full md:w-[400px] bg-[#242b3d]/50 border border-gray-800/80 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-sky-500/50"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-medium text-gray-500 block">Logo do Aplicativo</label>
            <button 
              onClick={() => notify("Abrindo seletor de arquivos...")}
              className="bg-gray-700/30 hover:bg-gray-700/50 border border-gray-700/50 text-gray-300 px-6 py-2 rounded-lg text-xs font-bold transition-all"
            >
              Enviar Logo
            </button>
            <p className="text-[10px] text-gray-500">Recomendado: imagem quadrada, como PNG ou SVG.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#161b26] border border-gray-800/50 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6 border-b border-gray-800/50 pb-4">
            <h3 className="text-sm font-bold text-gray-100 uppercase tracking-wider">Configuração de Planos</h3>
            <button onClick={() => handleSave("Planos")} className="text-xs text-emerald-500 font-bold">Salvar Planos</button>
          </div>
          
          <div className="space-y-4">
            {planRows.map((row, idx) => (
              <div key={idx} className="space-y-2">
                <label className="text-xs font-medium text-gray-500">{row.label}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">R$</span>
                  <input 
                    type="text" 
                    defaultValue={row.value}
                    className="w-full bg-[#242b3d]/50 border border-gray-800/80 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-sky-500/50 font-medium"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#161b26] border border-gray-800/50 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6 border-b border-gray-800/50 pb-4">
            <h3 className="text-sm font-bold text-gray-100 uppercase tracking-wider">Comissão e Alertas</h3>
            <button onClick={() => handleSave("Alertas")} className="text-xs text-sky-500 font-bold">Salvar Tudo</button>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500">Comissão Padrão (para todos)</label>
              <div className="relative">
                <input 
                  type="text" 
                  defaultValue="40"
                  className="w-full bg-[#242b3d]/50 border border-gray-800/80 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-sky-500/50 text-right pr-10 font-medium"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500">Alertar vencimento com antecedência de</label>
              <div className="relative">
                <input 
                  type="text" 
                  defaultValue="7"
                  className="w-full bg-[#242b3d]/50 border border-gray-800/80 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-sky-500/50 text-right pr-14 font-medium"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">dias</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
