import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getHeaders = () => {
    const token = localStorage.getItem('userToken');
    return { headers: { Authorization: `Token ${token}` } };
};

export const saveRoute = async (title: string, routeData: string) => {
    try {
        const response = await axios.post(
            `${API_URL}/routes/`, 
            { title, route_data: routeData }, 
            getHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao salvar rota:", error);
        throw error;
    }
};

export const getMyRoutes = async () => {
    try {
        const response = await axios.get(`${API_URL}/routes/`, getHeaders());
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar rotas:", error);
        throw error;
    }
};