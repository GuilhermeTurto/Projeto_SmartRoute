import React, { useState } from 'react';
import { login, register } from '../services/authService';
import { Route, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

interface LoginProps {
    onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLoginMode) {
                await login(username, password);
                onLoginSuccess();
            } else {
                await register(username, password);
                // Auto-login após registro
                await login(username, password);
                onLoginSuccess();
            }
        } catch (err: any) {
            console.error("Erro:", err);
            let msg = 'Erro de conexão.';
            if (err.response?.data) {
                // Tenta simplificar a mensagem de erro do Django
                const data = err.response.data;
                msg = typeof data === 'object' 
                    ? Object.values(data).flat().join(' ') 
                    : String(data);
            }
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            
            {/* --- BRANDING / LOGO --- */}
            <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 mb-4 transform rotate-3">
                    <Route className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">SmartRoute</h1>
                <p className="text-slate-500 mt-2 text-lg">Inteligência Artificial para Logística</p>
            </div>

            {/* --- CARD DE LOGIN --- */}
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-6 border-l-4 border-blue-600 pl-3">
                    {isLoginMode ? 'Acessar Painel' : 'Criar Nova Conta'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Usuário</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input 
                                type="text" 
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Seu nome de usuário"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Senha</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input 
                                type="password" 
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                             AlertCircle size={16} 
                             <span>{error}</span>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : (isLoginMode ? 'Entrar no Sistema' : 'Cadastrar e Entrar')}
                        {!isLoading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-slate-100">
                    <button 
                        onClick={() => {
                            setIsLoginMode(!isLoginMode);
                            setError('');
                        }}
                        className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors"
                    >
                        {isLoginMode ? 'Não tem acesso? Crie uma conta' : 'Já possui conta? Faça login'}
                    </button>
                </div>
            </div>
            
            <p className="mt-8 text-xs text-slate-400">© 2025 SmartRoute Systems • Bauru, SP</p>
        </div>
    );
};

export default Login;