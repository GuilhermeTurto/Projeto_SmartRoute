import React, { useEffect, useState } from 'react';
import { getMyRoutes } from '../services/routeService';
import { ArrowLeft, Map, Calendar, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface SavedRoute {
    id: number;
    title: string;
    route_data: string;
    created_at: string;
}

interface SavedRoutesProps {
    onBack: () => void;
}

export const SavedRoutes: React.FC<SavedRoutesProps> = ({ onBack }) => {
    const [routes, setRoutes] = useState<SavedRoute[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoute, setSelectedRoute] = useState<SavedRoute | null>(null);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const data = await getMyRoutes();
                setRoutes(data);
            } catch (error) {
                console.error("Erro ao carregar rotas", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoutes();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 animate-in fade-in">
            {/* Cabeçalho */}
            <button 
                onClick={selectedRoute ? () => setSelectedRoute(null) : onBack}
                className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                {selectedRoute ? 'Voltar para lista' : 'Voltar para Home'}
            </button>

            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Map className="text-indigo-600" />
                {selectedRoute ? selectedRoute.title : 'Minhas Rotas Salvas'}
            </h2>

            {loading ? (
                <div className="text-center py-10 text-slate-500">Carregando histórico...</div>
            ) : routes.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-500">Você ainda não salvou nenhuma rota.</p>
                </div>
            ) : selectedRoute ? (
                // VISUALIZAÇÃO DA ROTA SELECIONADA
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 prose prose-slate max-w-none">
                    <div className="text-sm text-slate-400 mb-4 flex gap-4">
                        <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(selectedRoute.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock size={14}/> {new Date(selectedRoute.created_at).toLocaleTimeString()}</span>
                    </div>
                    <ReactMarkdown>{selectedRoute.route_data}</ReactMarkdown>
                </div>
            ) : (
                // LISTA DAS ROTAS
                <div className="grid gap-4">
                    {routes.map((route) => (
                        <div 
                            key={route.id}
                            onClick={() => setSelectedRoute(route)}
                            className="bg-white p-5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all group"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg text-slate-800 group-hover:text-indigo-600">
                                        {route.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                        <Calendar size={14} />
                                        {new Date(route.created_at).toLocaleDateString()} às {new Date(route.created_at).toLocaleTimeString().slice(0,5)}
                                    </p>
                                </div>
                                <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
                                    Ver detalhes
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};