import React, { useState, useMemo, useContext } from 'react';
import { AppContext } from '../AppContext';
import { Plus, Pencil, Trash2, X, AlertTriangle, ArrowUpRight, ArrowDownLeft, DollarSign, CheckCircle2, Clock, Filter, Check, Briefcase } from 'lucide-react';
import { Transaction } from '../types';

const Financial: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const { transactions, instructors, students, settings } = state;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  
  const initialFormState = { description: '', amount: '', date: new Date().toISOString().split('T')[0], type: 'Receita' as 'Receita' | 'Despesa', category: '', status: 'Pago' as 'Pago' | 'Pendente' };
  const [formData, setFormData] = useState(initialFormState);

  const [typeFilter, setTypeFilter] = useState<'Todas' | 'Receita' | 'Despesa'>('Todas');
  const [statusFilter, setStatusFilter] = useState<'Todas' | 'Pago' | 'Pendente'>('Todas');
  
  const handleOpenModal = (transaction: Transaction | null, type: 'Receita' | 'Despesa' = 'Receita') => {
    setEditingTransaction(transaction);
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: String(transaction.amount),
        date: transaction.date,
        type: transaction.type,
        category: transaction.category,
        status: transaction.status,
      });
    } else {
      setFormData({ ...initialFormState, type });
    }
    setIsModalOpen(true);
  };

  const handleSaveTransaction = () => {
    if (!formData.description || !formData.amount) return;
    const newTransactionData: Transaction = {
      id: editingTransaction ? editingTransaction.id : Date.now().toString(),
      description: formData.description,
      amount: parseFloat(formData.amount),
      date: formData.date,
      type: formData.type,
      category: formData.category,
      status: formData.status,
      // Manter o vínculo se já existir
      studentId: editingTransaction?.studentId,
      sourceType: editingTransaction?.sourceType || 'manual'
    };

    let updatedTransactions;
    if (editingTransaction) {
      updatedTransactions = transactions.map(t => t.id === editingTransaction.id ? newTransactionData : t);
    } else {
      updatedTransactions = [newTransactionData, ...transactions];
    }
    dispatch({ type: 'UPDATE_TRANSACTIONS', payload: updatedTransactions });
    setIsModalOpen(false);
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteModalOpen(true);
  };
  
  const executeDelete = () => {
    if (!transactionToDelete) return;

    // 1. Lógica de reversão do vencimento do aluno
    if (transactionToDelete.studentId && transactionToDelete.sourceType === 'student_payment') {
      const studentToRevert = students.find(s => s.id === transactionToDelete.studentId);
      
      if (studentToRevert) {
        const updatedStudents = students.map(s => {
          if (s.id === studentToRevert.id) {
            const [day, month, year] = s.expiryDate.split('/').map(Number);
            const currentExpiry = new Date(year, month - 1, day);
            currentExpiry.setMonth(currentExpiry.getMonth() - 1); // Reverte um mês
            const revertedExpiryDateStr = currentExpiry.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
            
            // Recalcula os dias restantes com base na data "congelada" do app
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const revertedExpiryDate = new Date(currentExpiry);
            revertedExpiryDate.setHours(0,0,0,0);
            const diffTime = revertedExpiryDate.getTime() - today.getTime();
            const newDaysToExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return { ...s, expiryDate: revertedExpiryDateStr, daysToExpiry: newDaysToExpiry, isExpired: newDaysToExpiry < 0 };
          }
          return s;
        });
        dispatch({ type: 'UPDATE_STUDENTS', payload: updatedStudents });
      }
    }

    // 2. Exclusão da transação financeira (ação original)
    const updatedTransactions = transactions.filter(t => t.id !== transactionToDelete.id);
    dispatch({ type: 'UPDATE_TRANSACTIONS', payload: updatedTransactions });
    
    setIsDeleteModalOpen(false);
    setTransactionToDelete(null);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesType = typeFilter === 'Todas' || t.type === typeFilter;
      const matchesStatus = statusFilter === 'Todas' || t.status === statusFilter;
      return matchesType && matchesStatus;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, typeFilter, statusFilter]);

  const financialSummary = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date + 'T00:00:00'); // Tratar como UTC para evitar problemas de fuso
      return transactionDate.getUTCMonth() === currentMonth && transactionDate.getUTCFullYear() === currentYear;
    });

    const revenue = monthlyTransactions.filter(t => t.type === 'Receita' && t.status === 'Pago').reduce((acc, t) => acc + t.amount, 0);
    const expense = monthlyTransactions.filter(t => t.type === 'Despesa' && t.status === 'Pago').reduce((acc, t) => acc + t.amount, 0);
    const balance = revenue - expense;
    return { revenue, expense, balance };
  }, [transactions]);

  const instructorEarnings = useMemo(() => {
    return instructors.map(instructor => {
        const instructorStudents = students.filter(
            student => student.instructor === instructor.name && student.status === 'Ativo'
        );

        let totalRevenue = 0;
        instructorStudents.forEach(student => {
            if (student.planType) {
                const frequency = student.planType.split('x')[0];
                const plan = settings.plans.find(p => p.label.includes(`${frequency} aula`));
                if (plan && plan.value) {
                    totalRevenue += parseFloat(plan.value);
                }
            }
        });

        const commissionRate = parseFloat(settings.commission) / 100;
        const earnings = totalRevenue * commissionRate;

        return {
            ...instructor,
            earnings,
        };
    }).sort((a, b) => b.earnings - a.earnings);
  }, [instructors, students, settings]);
  
  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  
  return (
    <div className="relative pt-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800 dark:text-gray-100 uppercase tracking-tighter">Controle Financeiro</h1>
          <span className="bg-sky-500/10 text-sky-500 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase">{filteredTransactions.length} Lançamentos</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenModal(null, 'Receita')} className="flex items-center gap-1.5 bg-emerald-600/80 hover:bg-emerald-600 text-white font-bold py-2 px-3 rounded-lg text-[10px] transition-all whitespace-nowrap">
            <Plus size={12} /> Nova Receita
          </button>
          <button onClick={() => handleOpenModal(null, 'Despesa')} className="flex items-center gap-1.5 bg-rose-600/80 hover:bg-rose-600 text-white font-bold py-2 px-3 rounded-lg text-[10px] transition-all whitespace-nowrap">
            <Plus size={12} /> Nova Despesa
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-8">
        {/* Resumo Financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 flex items-start justify-between shadow-lg shadow-slate-200/50 dark:shadow-none">
            <div>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Receita do Mês</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-gray-100">{formatCurrency(financialSummary.revenue)}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><ArrowUpRight size={20} /></div>
          </div>
          <div className="bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 flex items-start justify-between shadow-lg shadow-slate-200/50 dark:shadow-none">
            <div>
              <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1">Despesa do Mês</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-gray-100">{formatCurrency(financialSummary.expense)}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500"><ArrowDownLeft size={20} /></div>
          </div>
          <div className="bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 flex items-start justify-between shadow-lg shadow-slate-200/50 dark:shadow-none">
            <div>
              <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1">Saldo do Mês</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-gray-100">{formatCurrency(financialSummary.balance)}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500"><DollarSign size={20} /></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tabela de Lançamentos */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800 rounded-2xl">
            <div className="p-4 border-b border-slate-200 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2"><Filter size={14} /> Lançamentos Recentes</h3>
              <div className="flex gap-2">
                <div className="flex items-center bg-slate-100 dark:bg-gray-900/30 rounded-lg border border-slate-200 dark:border-gray-700 p-1 shadow-sm">
                  {['Todas', 'Receita', 'Despesa'].map(type => (
                    <button key={type} onClick={() => setTypeFilter(type as any)} className={`px-3 py-1 text-[10px] font-bold transition-all rounded-md ${typeFilter === type ? 'bg-sky-500/10 text-sky-500' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'}`}>{type}</button>
                  ))}
                </div>
                <div className="flex items-center bg-slate-100 dark:bg-gray-900/30 rounded-lg border border-slate-200 dark:border-gray-700 p-1 shadow-sm">
                  {['Todas', 'Pago', 'Pendente'].map(status => (
                    <button key={status} onClick={() => setStatusFilter(status as any)} className={`px-3 py-1 text-[10px] font-bold transition-all rounded-md ${statusFilter === status ? 'bg-sky-500/10 text-sky-500' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'}`}>{status}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-3">Descrição</th>
                    <th className="px-6 py-3 text-right">Valor</th>
                    <th className="px-6 py-3">Categoria</th>
                    <th className="px-6 py-3">Data</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map(t => (
                    <tr key={t.id} className="border-t border-slate-100 dark:border-gray-800 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-gray-200">{t.description}</td>
                      <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === 'Receita' ? 'text-emerald-500' : 'text-rose-500'}`}>{formatCurrency(t.amount)}</td>
                      <td className="px-6 py-4"><span className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 dark:border-gray-700">{t.category}</span></td>
                      <td className="px-6 py-4 text-xs text-slate-500 dark:text-gray-400 font-medium">{new Date(t.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase ${t.status === 'Pago' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {t.status === 'Pago' ? <CheckCircle2 size={12} /> : <Clock size={12} />} {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleOpenModal(t)} className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-sky-500"><Pencil size={14} /></button>
                          <button onClick={() => handleDeleteClick(t)} className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-rose-500"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Ganhos por Instrutor */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800 rounded-2xl h-fit">
            <div className="p-4 border-b border-slate-200 dark:border-gray-800">
              <h3 className="text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <Briefcase size={14} /> Ganhos Estimados por Instrutor
              </h3>
            </div>
            <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
              {instructorEarnings.map(instructor => (
                <div key={instructor.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${instructor.avatarColor} flex items-center justify-center text-white font-bold text-[10px]`}>
                      {instructor.initials}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-gray-200">{instructor.name}</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-500">
                    {formatCurrency(instructor.earnings)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal Lançamento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-gray-100">{editingTransaction ? 'Editar Lançamento' : 'Novo Lançamento'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-rose-500"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Tipo de Lançamento</label>
                  <div className="flex items-center bg-slate-100 dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-1">
                    <button onClick={() => setFormData({...formData, type: 'Receita'})} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.type === 'Receita' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-400'}`}>Receita</button>
                    <button onClick={() => setFormData({...formData, type: 'Despesa'})} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.type === 'Despesa' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-gray-400'}`}>Despesa</button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Valor</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-400 font-medium">R$</span>
                    <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} autoFocus className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 pl-10 text-slate-700 dark:text-gray-200 outline-none focus:border-sky-500 text-sm" />
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Descrição</label>
                <input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-slate-700 dark:text-gray-200 outline-none focus:border-sky-500 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Categoria</label>
                  <input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-slate-700 dark:text-gray-200 outline-none focus:border-sky-500 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Data</label>
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-slate-700 dark:text-gray-200 outline-none focus:border-sky-500 text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Status</label>
                <div className="flex items-center bg-slate-100 dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-1">
                  <button onClick={() => setFormData({...formData, status: 'Pago'})} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.status === 'Pago' ? 'bg-sky-500 text-white' : 'text-slate-500'}`}>Pago</button>
                  <button onClick={() => setFormData({...formData, status: 'Pendente'})} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.status === 'Pendente' ? 'bg-amber-500 text-white' : 'text-slate-500'}`}>Pendente</button>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-gray-800/50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5">Cancelar</button>
              <button onClick={handleSaveTransaction} className="px-6 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Exclusão */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6"><AlertTriangle size={32} /></div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-gray-100 mb-2">Confirmar Exclusão?</h3>
              <p className="text-sm text-slate-500 dark:text-gray-400">A ação removerá permanentemente o lançamento "{transactionToDelete?.description}" e não pode ser desfeita.</p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-gray-800/50 flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors uppercase tracking-widest">Cancelar</button>
              <button onClick={executeDelete} className="flex-1 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-600/20 uppercase tracking-widest text-xs">Sim, Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financial;