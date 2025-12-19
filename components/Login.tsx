import React, { useState, useContext } from 'react';
import { AppContext } from '../AppContext';
import { Fingerprint, Lock, LogIn, Loader2, Eye, EyeOff } from 'lucide-react';
import NeuralNetworkBackground from './NeuralNetworkBackground';

const Login: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const { settings } = state;
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Função para aplicar máscara de CPF (000.000.000-00)
  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, '') // Remove tudo o que não é dígito
      .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto entre o terceiro e o quarto dígitos
      .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto entre o sexto e o sétimo dígitos
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2') // Coloca hífen entre o nono e o décimo dígitos
      .substring(0, 14); // Limita o tamanho
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCPF(e.target.value);
    setCpf(maskedValue);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulando um atraso de rede para UX
    setTimeout(() => {
      dispatch({ type: 'LOGIN' });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b0e14] px-4 py-12 relative overflow-hidden transition-colors duration-300">
      {/* Fundo Animado */}
      <NeuralNetworkBackground isDarkMode={settings.isDarkMode} />

      {/* Elementos decorativos de fundo com opacidade reduzida para destacar o NeuralLink */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-sky-500 tracking-tighter mb-2">{settings.appName}</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-gray-400 uppercase tracking-widest">Gestão Inteligente de Estúdio</p>
        </div>

        <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-2xl border border-slate-200 dark:border-gray-800 rounded-3xl p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1 tracking-wider">CPF de Acesso</label>
              <div className="relative">
                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500" size={18} />
                <input 
                  type="text" 
                  required
                  value={cpf}
                  onChange={handleCpfChange}
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  className="w-full bg-slate-50/50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-700 dark:text-gray-200 focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase ml-1 tracking-wider">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500" size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50/50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-2xl py-4 pl-12 pr-12 text-sm text-slate-700 dark:text-gray-200 focus:outline-none focus:border-sky-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 hover:text-sky-500 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 dark:border-gray-700 text-sky-500 focus:ring-sky-500" />
                <span className="text-xs text-slate-500 dark:text-gray-400 group-hover:text-sky-500 transition-colors">Lembrar de mim</span>
              </label>
              <button type="button" className="text-xs font-bold text-sky-500 hover:text-sky-400 transition-colors">Esqueceu a senha?</button>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 rounded-2xl text-sm transition-all shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Entrar no Sistema
                  <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center relative z-10">
          <p className="text-xs text-slate-400 dark:text-gray-600 font-medium tracking-tight">
            © 2025 Powered by <span className="font-bold text-sky-500/80">COD3 Software Solution</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;