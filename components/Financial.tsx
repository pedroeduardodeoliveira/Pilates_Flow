
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

// Define props interface for Financial to include notify function
interface FinancialProps {
  notify: (message: string, type?: 'success' | 'error') => void;
}

const Financial: React.FC<FinancialProps> = ({ notify }) => {
  const overdueStudents = [
    { name: 'Fernanda Costa', days: 5 },
    { name: 'Patrícia Souza', days: 5 },
    { name: 'Beatriz Martins', days: 5 },
  ];

  const upcomingStudents = [
    { name: 'Maria Oliveira', days: 5 },
    { name: 'Carlos Mendes', days: 5 },
    { name: 'Ricardo Lima', days: 5 },
    { name: 'Lucas Ferreira', days: 5 },
    { name: 'Gustavo Henrique', days: 5 },
    { name: 'Felipe Gomes', days: 5 },
    { name: 'Eduardo Ribeiro', days: 5 },
    { name: 'Sofia Nogueira', days: 5 },
    { name: 'Amanda Vieira', days: 5 },
    { name: 'Eliana Carvalho', days: 5 },
    { name: 'Vitor Castro', days: 5 },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      
      {/* Pagamentos Vencidos Section */}
      <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-rose-500 mb-4 uppercase tracking-wider">Alunos com Pagamentos Vencidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {overdueStudents.map((student, idx) => (
            <div 
              key={idx} 
              className="bg-[#161b26] border border-rose-500/30 rounded-xl p-4 transition-all hover:bg-rose-500/10 cursor-pointer"
              onClick={() => notify(`Notificando atraso para ${student.name}...`)}
            >
              <h4 className="text-sm font-bold text-gray-100">{student.name}</h4>
              <p className="text-xs text-rose-500 font-medium mt-1">Vencido há {student.days} dia(s)</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vencimento Próximo Section */}
      <div className="bg-[#161b26] border border-gray-800/50 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">Alunos com Vencimento Próximo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingStudents.map((student, idx) => (
            <div 
              key={idx} 
              className="bg-[#1c222e] border border-gray-800/30 rounded-xl p-4 transition-all hover:bg-white/5 cursor-pointer"
              onClick={() => notify(`Enviando lembrete de pagamento para ${student.name}...`)}
            >
              <h4 className="text-sm font-bold text-gray-200">{student.name}</h4>
              <p className="text-xs text-gray-500 font-medium mt-1">Vence em {student.days} dia(s)</p>
            </div>
          ))}
        </div>
      </div>

      {/* Resumo Financeiro Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Receita Total */}
        <div className="bg-[#161b26] border border-gray-800/50 rounded-2xl p-6 flex items-center gap-5 cursor-help" onClick={() => notify("Informação de receita total")}>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Receita Total</p>
            <p className="text-2xl font-bold text-gray-100">R$ 0,00</p>
          </div>
        </div>

        {/* Despesa Total */}
        <div className="bg-[#161b26] border border-gray-800/50 rounded-2xl p-6 flex items-center gap-5 cursor-help" onClick={() => notify("Informação de despesa total")}>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1">Despesa Total</p>
            <p className="text-2xl font-bold text-gray-100">R$ 0,00</p>
          </div>
        </div>

        {/* Saldo Atual */}
        <div className="bg-[#161b26] border border-gray-800/50 rounded-2xl p-6 flex items-center gap-5 cursor-help" onClick={() => notify("Informação de saldo atual")}>
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1">Saldo Atual</p>
            <p className="text-2xl font-bold text-gray-100">R$ 0,00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financial;
