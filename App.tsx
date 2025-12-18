import React, { useState, useEffect } from 'react';
// Importe o componente de Login que criamos (certifique-se de ter criado o arquivo components/Login.tsx)
import Login from './components/Login'; 

import { Layout } from './components/Layout';
import { HomeCards, ProspectForm, RoutePlannerForm } from './components/SearchForm';
import { ResultDisplay } from './components/ResultDisplay';
import { findProspects, optimizeRoute } from './services/geminiService';
import { GenerationResult, SearchParams, RouteParams, AppStatus, ViewMode } from './types';
import { AlertCircle, LogOut } from 'lucide-react'; // Adicionei o ícone de LogOut
import { SavedRoutes } from './components/SavedRoutes';

export default function App() {
  // --- ESTADOS DE AUTENTICAÇÃO ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  // --- ESTADOS DA APLICAÇÃO (Seu código original) ---
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.HOME);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // --- EFEITO PARA VERIFICAR LOGIN AO ABRIR O APP ---
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('userToken');
      if (token) {
        setIsAuthenticated(true);
      }
      setIsLoadingAuth(false);
    };
    checkAuth();
  }, []);

  // --- FUNÇÃO DE LOGOUT ---
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsAuthenticated(false);
    // Reseta os estados para quando logar novamente estar limpo
    goBack(); 
  };

  // --- SUAS FUNÇÕES ORIGINAIS ---
  const goBack = () => {
    setViewMode(ViewMode.HOME);
    setStatus(AppStatus.IDLE);
    setResult(null);
    setErrorMsg(null);
  };

  const handleProspectSearch = async (params: SearchParams) => {
    setStatus(AppStatus.LOADING);
    setResult(null);
    setErrorMsg(null);

    try {
      const data = await findProspects(
        params.businessType,
        params.location,
        params.count
      );
      setResult(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setErrorMsg("Falha ao gerar lista. Verifique sua conexão e tente novamente.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleRoutePlan = async (params: RouteParams) => {
    setStatus(AppStatus.LOADING);
    setResult(null);
    setErrorMsg(null);

    try {
        const data = await optimizeRoute(params.addresses);
        setResult(data);
        setStatus(AppStatus.SUCCESS);
    } catch (err) {
        console.error(err);
        setErrorMsg("Falha ao otimizar rota. Verifique sua conexão e tente novamente.");
        setStatus(AppStatus.ERROR);
    }
  };

  // --- RENDERIZAÇÃO CONDICIONAL ---

  // 1. Se estiver verificando o token, mostra uma tela branca ou loading simples
  if (isLoadingAuth) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  // 2. Se NÃO estiver autenticado, mostra APENAS a tela de Login
  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // 3. Se estiver autenticado, renderiza sua APLICAÇÃO NORMAL
  return (
    <Layout>
      {/* Botão de Logout (Adicionei no topo direito, dentro do Layout) */}
      <div className="flex justify-end mb-4 px-4">
        <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors"
        >
            <LogOut size={16} />
            Sair
        </button>
      </div>

      {/* Home Screen */}
      {viewMode === ViewMode.HOME && (
        <div className="py-8">
           <div className="text-center mb-12">
             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Bem-vindo ao SmartRoute</h2>
             <p className="text-slate-600 text-lg max-w-2xl mx-auto">
               Sua plataforma inteligente para otimizar vendas de campo. Escolha abaixo como deseja começar hoje.
             </p>
           </div>
           <HomeCards onSelectMode={setViewMode} />
        </div>
      )}

      {/* Prospecting Mode */}
      {viewMode === ViewMode.PROSPECT && (
        <>
            <ProspectForm 
                onSearch={handleProspectSearch} 
                isLoading={status === AppStatus.LOADING} 
                onBack={goBack}
            />
        </>
      )}

      {/* Route Mode */}
      {viewMode === ViewMode.ROUTE && (
        <>
            <RoutePlannerForm 
                onPlan={handleRoutePlan}
                isLoading={status === AppStatus.LOADING}
                onBack={goBack}
            />
        </>
      )}

      {/* History Mode (NOVO) */}
      {viewMode === ViewMode.HISTORY && (
          <SavedRoutes onBack={goBack} />
      )}

      {/* Error Message */}
      {status === AppStatus.ERROR && (
        <div className="max-w-2xl mx-auto mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-800 animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Results */}
      {status === AppStatus.SUCCESS && result && (
        <ResultDisplay result={result} />
      )}
    </Layout>
  );
}