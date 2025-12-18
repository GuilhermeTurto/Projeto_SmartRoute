import React, { useState } from 'react'; // Adicionei useState
import ReactMarkdown from 'react-markdown';
import { MapPin, ExternalLink, Quote, Save, Check } from 'lucide-react'; // Adicionei ícones Save e Check
import { GenerationResult, GroundingChunk } from '../types';
import { saveRoute } from '../services/routeService';

interface ResultDisplayProps {
  result: GenerationResult;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  // Estados para controlar o botão de salvar
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Filter for valid map chunks
  const mapChunks = result.groundingChunks.filter(c => c.maps?.uri);

  // Função para salvar a rota
  const handleSave = async () => {
    setSaving(true);
    try {
        const title = `Rota - ${new Date().toLocaleString()}`;
        // Salva o texto gerado (Markdown)
        await saveRoute(title, result.text);
        setSaved(true);
    } catch (err) {
        console.error("Erro ao salvar:", err);
        alert('Erro ao salvar rota. Verifique se está logado.');
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in mt-8">
      
      {/* Main Content Area - The Route & List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            
            {/* CABEÇALHO COM O BOTÃO DE SALVAR */}
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                <h3 className="text-lg font-semibold text-slate-800">Resultado Gerado</h3>
                
                {!saved ? (
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all shadow-sm active:scale-95"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Salvando...' : 'Salvar Rota'}
                    </button>
                ) : (
                    <span className="flex items-center gap-2 text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200 animate-in fade-in">
                        <Check className="w-4 h-4" />
                        Rota Salva!
                    </span>
                )}
            </div>

            <div className="prose prose-slate prose-indigo max-w-none prose-headings:font-bold prose-h3:text-indigo-600 prose-strong:text-slate-900">
                <ReactMarkdown
                    components={{
                        a: ({node, ...props}) => (
                            <a 
                                {...props} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-indigo-600 hover:text-indigo-800 font-medium underline decoration-indigo-200 underline-offset-2 hover:decoration-indigo-500 transition-colors inline-flex items-center gap-1"
                            >
                                {props.children} <ExternalLink className="w-3 h-3 inline" />
                            </a>
                        ),
                        li: ({node, ...props}) => <li className="my-3 pl-1" {...props} />,
                        strong: ({node, ...props}) => <span className="font-semibold text-slate-800" {...props} />
                    }}
                >
                    {result.text}
                </ReactMarkdown>
            </div>
        </div>
      </div>

      {/* Sidebar - Detected Locations (Grounding) */}
      <div className="space-y-6">
        <div className="bg-slate-900 rounded-2xl shadow-lg p-6 text-white sticky top-24">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
                <MapPin className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-lg">Locais Verificados</h3>
            </div>
            
            {mapChunks.length === 0 ? (
                <p className="text-slate-400 text-sm italic">
                    Nenhuma localização específica do Maps foi retornada nos metadados. Verifique o texto.
                </p>
            ) : (
                <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
                    {mapChunks.map((chunk, index) => (
                        <PlaceCard key={index} chunk={chunk} index={index + 1} />
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const PlaceCard: React.FC<{ chunk: GroundingChunk; index: number }> = ({ chunk, index }) => {
    if (!chunk.maps) return null;

    const { title, uri, placeAnswerSources } = chunk.maps;
    const review = placeAnswerSources?.[0]?.reviewSnippets?.[0]?.content;

    return (
        <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-4 border border-slate-700 backdrop-blur-sm group">
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
                            {index}
                        </span>
                        <h4 className="font-medium text-slate-100 text-sm leading-tight group-hover:text-indigo-300 transition-colors">{title}</h4>
                    </div>
                    {review && (
                        <div className="mt-3 flex gap-2 items-start text-slate-400 text-xs bg-slate-800/50 p-2 rounded">
                             <Quote className="w-3 h-3 flex-shrink-0 mt-0.5 opacity-50" />
                             <p className="line-clamp-2 italic">{review}</p>
                        </div>
                    )}
                </div>
                <a 
                    href={uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors shadow-lg"
                    title="Abrir no Google Maps"
                >
                    <ExternalLink className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
}