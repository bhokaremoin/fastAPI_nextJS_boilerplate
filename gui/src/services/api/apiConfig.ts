import axios, {AxiosInstance, InternalAxiosRequestConfig} from 'axios';
import {getCookie} from '@/utils/cookies';

export const API_BASE_URL = 'http://localhost:8001/api';

const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 300000,
    headers: {
        common: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
        const accessToken = getCookie('accessToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
    }
    return config;
});

export default api;
