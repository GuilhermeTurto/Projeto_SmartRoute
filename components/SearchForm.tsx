import React, { useState, useRef } from 'react';
import { Search, MapPin, Briefcase, Loader2, Users, Route, Plus, Trash2, ArrowRight, History, FileSpreadsheet } from 'lucide-react';
import { SearchParams, RouteParams, ViewMode } from '../types';
import * as XLSX from 'xlsx';

// --- Home Selection Cards ---

interface HomeCardsProps {
  onSelectMode: (mode: ViewMode) => void;
}

export const HomeCards: React.FC<HomeCardsProps> = ({ onSelectMode }) => {
  return (
    // Ajustado para grid-cols-3 e max-w-6xl para caber os 3 cards lado a lado
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto animate-fade-in-up px-4">
      
      {/* Route Card */}
      <button 
        onClick={() => onSelectMode(ViewMode.ROUTE)}
        className="group relative flex flex-col items-start p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 text-left"
      >
        <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-blue-600">
          <Route className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Roteirizar Rotas</h3>
        <p className="text-slate-500 leading-relaxed mb-6 text-sm">
          Insira múltiplos endereços manualmente ou via Excel e deixe a IA organizar a sequência.
        </p>
        <div className="mt-auto flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
          Começar Roteiro <ArrowRight className="ml-2 w-4 h-4" />
        </div>
      </button>

      {/* Prospect Card */}
      <button 
        onClick={() => onSelectMode(ViewMode.PROSPECT)}
        className="group relative flex flex-col items-start p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 text-left"
      >
        <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-indigo-600">
          <Users className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Prospecção</h3>
        <p className="text-slate-500 leading-relaxed mb-6 text-sm">
          Encontre leads qualificados por setor e região, gere ganchos de vendas e localize-os.
        </p>
        <div className="mt-auto flex items-center text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
          Buscar Leads <ArrowRight className="ml-2 w-4 h-4" />
        </div>
      </button>

      {/* History Card (Minhas Rotas) */}
      <button
        onClick={() => onSelectMode(ViewMode.HISTORY)}
        className="group relative flex flex-col items-start p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all duration-300 text-left"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <History className="w-24 h-24 text-indigo-600" />
        </div>
        <div className="relative z-10 flex flex-col h-full">
          <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <History className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Minhas Rotas</h3>
          <p className="text-slate-600 leading-relaxed mb-6 text-sm">
            Acesse o histórico das rotas e planejamentos que você já salvou anteriormente.
          </p>
          <div className="mt-auto flex items-center text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
            Ver Histórico <ArrowRight className="ml-2 w-4 h-4" />
          </div>
        </div>
      </button>
      
    </div>
  );
};

// --- Prospecting Form ---

interface ProspectFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
  onBack: () => void;
}

export const ProspectForm: React.FC<ProspectFormProps> = ({ onSearch, isLoading, onBack }) => {
  const [businessType, setBusinessType] = useState('');
  const [location, setLocation] = useState('');
  const [count, setCount] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (businessType && location) onSearch({ businessType, location, count });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <button onClick={onBack} className="text-sm text-slate-400 hover:text-indigo-600 mb-6 flex items-center gap-1 transition-colors">
        &larr; Voltar
      </button>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" /> Prospecção de Clientes
        </h2>
        <p className="text-slate-500 mt-1">Defina o perfil do cliente ideal e a região alvo.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Estabelecimento</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-indigo-700 placeholder-slate-400"
              placeholder="Ex: Padarias, Restaurantes, Dentistas..."
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Localização Alvo</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-indigo-700 placeholder-slate-400"
              placeholder="Ex: Centro, São Paulo - SP"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Quantidade de Resultados</label>
          <select 
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-indigo-700"
          >
            <option value={3}>3 leads (Rápido)</option>
            <option value={5}>5 leads (Padrão)</option>
            <option value={10}>10 leads (Detalhado)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-4"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          {isLoading ? "Gerando Lista..." : "Gerar Lista de Prospecção"}
        </button>
      </form>
    </div>
  );
};

// --- Route Planner Form ---

interface RoutePlannerFormProps {
  onPlan: (params: RouteParams) => void;
  isLoading: boolean;
  onBack: () => void;
}

export const RoutePlannerForm: React.FC<RoutePlannerFormProps> = ({ onPlan, isLoading, onBack }) => {
  const [addresses, setAddresses] = useState<string[]>(['', '']); 
  const [baseCity, setBaseCity] = useState(''); // <--- NOVO CAMPO: Cidade Padrão
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddressChange = (index: number, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[index] = value;
    setAddresses(newAddresses);
  };

  const addAddress = () => setAddresses([...addresses, '']);
  
  const removeAddress = (index: number) => {
    if (addresses.length > 2) {
      const newAddresses = addresses.filter((_, i) => i !== index);
      setAddresses(newAddresses);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const binaryStr = event.target?.result;
        if (binaryStr) {
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
            
            const extractedAddresses: string[] = [];
            data.forEach((row) => {
                if (row[0] && typeof row[0] === 'string' && row[0].length > 2) {
                    extractedAddresses.push(row[0]);
                }
            });

            if (extractedAddresses.length > 0) {
                if (extractedAddresses.length === 1) extractedAddresses.push('');
                setAddresses(extractedAddresses);
                alert(`${extractedAddresses.length} locais importados! Não esqueça de definir a Cidade de Referência.`);
            } else {
                alert('Nenhum endereço válido encontrado na primeira coluna.');
            }
        }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filtra endereços vazios
    const rawAddresses = addresses.filter(a => a.trim() !== '');
    
    // --- A MÁGICA ACONTECE AQUI ---
    // Se tiver uma cidade base, adiciona ela aos endereços que não a possuem
    const finalAddresses = rawAddresses.map(addr => {
        // Se a cidade base estiver preenchida E o endereço não contiver a cidade ainda
        if (baseCity.trim() && !addr.toLowerCase().includes(baseCity.toLowerCase())) {
            return `${addr} - ${baseCity}`;
        }
        return addr;
    });

    if (finalAddresses.length >= 2) {
      // Envia a lista tratada para a IA
      onPlan({ addresses: finalAddresses });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-sm text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors">
            &larr; Voltar
        </button>

        <div>
            <input 
                type="file" 
                accept=".xlsx, .xls" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileUpload}
            />
            <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-sm bg-green-50 text-green-700 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors font-medium border border-green-200"
            >
                <FileSpreadsheet size={16} />
                Importar Excel
            </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Route className="w-6 h-6 text-blue-600" /> Planejador de Rotas
        </h2>
        <p className="text-slate-500 mt-1 text-sm">A IA usará a cidade abaixo para encontrar endereços incompletos.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* --- NOVO CAMPO: CIDADE DE REFERÊNCIA --- */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
            <label className="block text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                <MapPin size={16} />
                Cidade/Região de Referência
            </label>
            <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 placeholder-slate-400 bg-white"
                placeholder="Ex: Bauru, SP"
                value={baseCity}
                onChange={(e) => setBaseCity(e.target.value)}
            />
            <p className="text-xs text-blue-600/80 mt-2">
                * Será adicionado automaticamente aos endereços da lista abaixo.
            </p>
        </div>

        {/* LISTA DE ENDEREÇOS */}
        <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {addresses.map((address, index) => (
            <div key={index} className="flex gap-2 items-center animate-fade-in">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex-shrink-0">
                {index + 1}
                </div>
                <input
                    type="text"
                    className="flex-grow px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-indigo-700 placeholder-slate-400"
                    placeholder={index === 0 ? "Ponto de partida" : `Parada ${index}`}
                    value={address}
                    onChange={(e) => handleAddressChange(index, e.target.value)}
                    required
                />
                <button
                    type="button"
                    onClick={() => removeAddress(index)}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={addresses.length <= 2}
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
            ))}
        </div>

        <div className="pt-2">
            <button
                type="button"
                onClick={addAddress}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
            >
                <Plus className="w-4 h-4" /> Adicionar novo endereço
            </button>
        </div>

        <div className="pt-4 border-t border-slate-100 mt-4">
            <button
            type="submit"
            disabled={isLoading || addresses.filter(a => a.trim() !== '').length < 2}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
            >
            {isLoading ? (
                <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Otimizando Rota...</span>
                </>
            ) : (
                <>
                <Route className="w-5 h-5" />
                <span>Gerar Rota Otimizada</span>
                </>
            )}
            </button>
        </div>
      </form>
    </div>
  );
};