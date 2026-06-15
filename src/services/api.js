import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Servicio de Empresas
export const getEmpresas = () => api.get('/empresas');
export const crearEmpresa = (data) => api.post('/empresas', data);

// Servicio de IRO
export const calcularIRO = (data) => api.post('/iro', data);
export const guardarIRO = (data) => api.post('/iro/guardar', data);
export const getEvaluacionesIRO = (empresaId) => api.get(`/iro/empresa/${empresaId}`);

// Servicio de ICI
export const calcularICI = (data) => api.post('/ici', data);
export const guardarICI = (data) => api.post('/ici/guardar', data);
export const getEvaluacionesICI = (empresaId) => api.get(`/ici/empresa/${empresaId}`);

export default api;