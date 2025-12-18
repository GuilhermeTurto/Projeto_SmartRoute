import axios from 'axios';
// Importamos os tipos definidos no projeto (types.ts)
// Se você ainda não tem GroundingChunk no types.ts, pode manter a interface abaixo
import { GroundingChunk } from '../types'; 

const API_URL = 'http://localhost:8000/api';

// Interface de Retorno (Mantendo a compatibilidade com o que você já usava)
export interface AppGenerationResult {
  text: string;
  groundingChunks: GroundingChunk[];
}

// Helper para pegar o Token de Autenticação
const getHeaders = () => {
    const token = localStorage.getItem('userToken');
    return { 
        headers: { 
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json'
        } 
    };
};

/**
 * Busca de Leads/Prospects
 * Envia os parâmetros para o Django, que executa a IA
 */
export const findProspects = async (
  businessType: string,
  location: string,
  count: number
): Promise<AppGenerationResult> => {
  try {
    // Chama o endpoint seguro do Django
    const response = await axios.post(
        `${API_URL}/ai/prospect/`, 
        { businessType, location, count }, 
        getHeaders()
    );

    return {
      text: response.data.result, // O texto Markdown gerado pelo Python
      // Como o endpoint Python simples ainda não retorna metadados de mapa estruturados,
      // retornamos vazio para não quebrar a tela.
      groundingChunks: [] 
    };

  } catch (error) {
    console.error("Erro ao conectar com o Backend (Prospect):", error);
    throw error;
  }
};

/**
 * Otimização de Rotas
 * Envia a lista de endereços para o Django roteirizar
 */
export const optimizeRoute = async (
  addresses: string[]
): Promise<AppGenerationResult> => {
  try {
    // Chama o endpoint seguro do Django
    const response = await axios.post(
        `${API_URL}/ai/route/`, 
        { addresses }, 
        getHeaders()
    );

    return {
      text: response.data.result,
      groundingChunks: [] 
    };

  } catch (error) {
    console.error("Erro ao conectar com o Backend (Route):", error);
    throw error;
  }
};