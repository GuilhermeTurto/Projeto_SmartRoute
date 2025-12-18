import axios from 'axios';

// Garanta que esta URL está correta (sem barra no final aqui, colocamos na chamada)
const API_URL = 'https://projeto-smartroute.onrender.com/api'; 

export const login = async (username, password) => {
    // Adicionei logs para ajudar a debugar se der erro
    console.log("Tentando logar com:", username); 
    try {
        const response = await axios.post(`${API_URL}/login/`, { username, password });
        if (response.data.token) {
            localStorage.setItem('userToken', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error("Erro detalhado do login:", error);
        throw error;
    }
};

export const register = async (username, password) => {
    console.log("Tentando cadastrar:", username);
    try {
        // Chama a rota nova que criamos no Django
        const response = await axios.post(`${API_URL}/register/`, { username, password });
        return response.data;
    } catch (error) {
        console.error("Erro detalhado do cadastro:", error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('userToken');
};