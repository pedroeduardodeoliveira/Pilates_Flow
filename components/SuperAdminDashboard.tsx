import React, { useContext, useState } from 'react';
import { AppContext } from '../AppContext';
import { LogOut, DollarSign, Users, Activity, MoreVertical, Search, Plus, Settings2, ShieldQuestion, Trash2, X, AlertTriangle, Calendar, Award } from 'lucide-react';
import NeuralNetworkBackground from './NeuralNetworkBackground';
import { Client, License } from '../types';
import { superAdminClients } from '../superAdminMockData';

const SuperAdminDashboard: React.FC = () => {
    const { state, dispatch } = useContext(AppContext);
    const { settings, user } = state;
    
    const [clients, setClients] = useState<Client[]>(superAdminClients);
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [formData, setFormData] = useState<Partial<Client>>({});
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    const handleOpenModal = (client: Client | null) => {
        setEditingClient(client);
        setFormData(client ? { ...client, expiresAt: client.expiresAt.split('/').reverse().join('-') } : {
            studioName: '', adminName: '', licenseStatus: 'Teste', mrr: 0,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 dias a partir de hoje
        });
        setIsModalOpen(true);
    };

    const handleSaveClient = () => {
        if (!formData.studioName || !formData.adminName) return;

        const clientData = {
            ...formData,
            expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toLocaleDateString('pt-BR') : '',
        } as Client;

        if (editingClient) {
            setClients(clients.map(c => c.id === editingClient.id ? { ...c, ...clientData } : c));
        } else {
            const newClient: Client = {
                id: `CLI-${Math.floor(100 + Math.random() * 900)}`,
                studentCount: 0,
                instructorCount: 0,
                ...clientData
            };
            setClients([newClient, ...clients]);
        }
        setIsModalOpen(false);
    };

    const handleDeleteClick = (client: Client) => {
        setClientToDelete(client);
        setIsDeleteModalOpen(true);
    };
    
    const executeDelete = () => {
        if (clientToDelete) {
            setClients(clients.filter(c => c.id !== clientToDelete.id));
            setIsDeleteModalOpen(false);
            setClientToDelete(null);
        }
    };
    
    const handleImpersonate = (client: Client) => {
        const licenseStatusMap: { [key in Client['licenseStatus']]: License['status'] } = {
            'Ativa': 'active',
            'Teste': 'trial',
            'Expirada': 'expired',
            'Pendente': 'expiring_soon'
        };
        
        const [day, month, year] = client.expiresAt.split('/');
        const isoDate = new Date(`${year}-${month}-${day}`).toISOString();

        const impersonatedUser = {
            id: 'impersonated_admin',
            name: client.adminName,
            role: 'admin' as const,
            license: {
                status: licenseStatusMap[client.licenseStatus],
                expiresAt: isoDate,
            }
        };
        dispatch({ type: 'LOGIN', payload: impersonatedUser });
    };

    const filteredClients = clients.filter(c => 
        c.studioName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.adminName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const summary = {
        mrr: filteredClients.reduce((acc, client) => acc + (client.licenseStatus === 'Ativa' || client.licenseStatus === 'Pendente' ? client.mrr : 0), 0),
        totalClients: filteredClients.length,
        activeSubscriptions: filteredClients.filter(c => c.licenseStatus === 'Ativa').length,
    };
    
    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    const statusStyles: { [key in Client['licenseStatus']]: string } = {
        'Ativa': 'bg-emerald-500/10 text-emerald-500',
        'Teste': 'bg-sky-500/10 text-sky-500',
        'Expirada': 'bg-rose-500/10 text-rose-500',
        'Pendente': 'bg-amber-500/10 text-amber-500',
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-[#06080b] text-slate-800 dark:text-gray-200">
            <NeuralNetworkBackground isDarkMode={settings.isDarkMode} />
            
            <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl border-b border-slate-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold">SA</div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-800 dark:text-white">Super Admin</h1>
                                <p className="text-[10px] font-medium text-slate-500 dark:text-gray-400 uppercase tracking-widest">Painel de Gestão SaaS</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className="text-xs font-bold text-slate-600 dark:text-gray-300 hidden md:block">Bem-vindo, {user?.name}!</span>
                           <button onClick={handleLogout} className="flex items-center gap-2 bg-rose-500/10 text-rose-500 font-bold py-2 px-4 rounded-lg text-xs transition-all hover:bg-rose-500 hover:text-white">
                                <LogOut size={14} /> Sair
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-lg shadow-slate-200/30 dark:shadow-none">
                        <div className="flex justify-between items-start">
                           <div>
                             <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">Receita Mensal (MRR)</p>
                             <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{formatCurrency(summary.mrr)}</p>
                           </div>
                           <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center"><DollarSign size={20}/></div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-lg shadow-slate-200/30 dark:shadow-none">
                        <div className="flex justify-between items-start">
                           <div>
                             <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">Total de Clientes</p>
                             <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{summary.totalClients}</p>
                           </div>
                           <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center"><Users size={20}/></div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-lg shadow-slate-200/30 dark:shadow-none">
                        <div className="flex justify-between items-start">
                           <div>
                             <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">Assinaturas Ativas</p>
                             <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{summary.activeSubscriptions}</p>
                           </div>
                           <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center"><Activity size={20}/></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-2xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="text" placeholder="Buscar estúdio ou administrador..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-slate-100 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-700 dark:text-gray-300 focus:outline-none focus:border-sky-500/50" />
                        </div>
                        <button onClick={() => handleOpenModal(null)} className="w-full md:w-auto flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all shadow-lg shadow-sky-600/20">
                            <Plus size={14} /> Novo Cliente
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest border-b border-slate-200 dark:border-gray-800">
                                <tr>
                                    <th className="px-6 py-4">Estúdio</th>
                                    <th className="px-6 py-4">Status da Licença</th>
                                    <th className="px-6 py-4">Expira em</th>
                                    <th className="px-6 py-4 text-center">Alunos</th>
                                    <th className="px-6 py-4 text-center">Instrutores</th>
                                    <th className="px-6 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                                {filteredClients.map(client => (
                                    <tr key={client.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-800 dark:text-gray-100">{client.studioName}</p>
                                            <p className="text-xs text-slate-500 dark:text-gray-400">{client.adminName}</p>
                                        </td>
                                        <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusStyles[client.licenseStatus]}`}>{client.licenseStatus}</span></td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-gray-300">{client.expiresAt}</td>
                                        <td className="px-6 py-4 text-center text-sm font-bold text-slate-700 dark:text-gray-200">{client.studentCount}</td>
                                        <td className="px-6 py-4 text-center text-sm font-bold text-slate-700 dark:text-gray-200">{client.instructorCount}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleOpenModal(client)} className="p-2 text-slate-400 hover:text-sky-500" title="Gerenciar"><Settings2 size={14}/></button>
                                                <button onClick={() => handleImpersonate(client)} className="p-2 text-slate-400 hover:text-amber-500" title="Personificar"><ShieldQuestion size={14}/></button>
                                                <button onClick={() => handleDeleteClick(client)} className="p-2 text-slate-400 hover:text-rose-500" title="Remover"><Trash2 size={14}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <footer className="mt-12 text-center text-xs text-slate-400 dark:text-gray-600 pb-8 relative z-10">
                © 2025 Powered by <a href="https://cod3-ss.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-semibold text-sky-500 hover:underline">COD3 Software Solution</a>
            </footer>

            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
                <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95">
                  <div className="p-6 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 dark:text-gray-100">{editingClient ? 'Editar Cliente' : 'Novo Cliente'}</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-rose-500"><X size={20} /></button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Nome do Estúdio</label><input value={formData.studioName} onChange={e => setFormData({...formData, studioName: e.target.value})} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-slate-700 dark:text-gray-200 outline-none focus:border-sky-500 text-sm" /></div>
                      <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Nome do Admin</label><input value={formData.adminName} onChange={e => setFormData({...formData, adminName: e.target.value})} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-slate-700 dark:text-gray-200 outline-none focus:border-sky-500 text-sm" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1 flex items-center gap-1.5"><Award size={12}/> Status da Licença</label><select value={formData.licenseStatus} onChange={e => setFormData({...formData, licenseStatus: e.target.value as Client['licenseStatus']})} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-slate-700 dark:text-gray-200 outline-none focus:border-sky-500 text-sm">{Object.keys(statusStyles).map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                      <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1 flex items-center gap-1.5"><Calendar size={12}/> Data de Expiração</label><input type="date" value={formData.expiresAt} onChange={e => setFormData({...formData, expiresAt: e.target.value})} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-slate-700 dark:text-gray-200 outline-none focus:border-sky-500 text-sm" /></div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-gray-800/50 flex justify-end gap-3">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5">Cancelar</button>
                    <button onClick={handleSaveClient} className="px-6 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs">Salvar</button>
                  </div>
                </div>
              </div>
            )}
            
            {isDeleteModalOpen && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                  <div className="p-8 text-center"><div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6"><AlertTriangle size={32} /></div><h3 className="text-xl font-bold text-slate-800 dark:text-gray-100 mb-2">Remover Cliente?</h3><p className="text-sm text-slate-500 dark:text-gray-400">Esta ação removerá permanentemente o estúdio <span className="font-bold text-slate-700 dark:text-gray-200">{clientToDelete?.studioName}</span>. Deseja continuar?</p></div>
                  <div className="p-6 bg-slate-50 dark:bg-gray-800/50 flex gap-3">
                    <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 uppercase tracking-widest">Cancelar</button>
                    <button onClick={executeDelete} className="flex-1 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/20 uppercase tracking-widest text-xs">Sim, Remover</button>
                  </div>
                </div>
              </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;
