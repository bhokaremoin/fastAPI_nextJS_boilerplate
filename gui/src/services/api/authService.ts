import api from './apiConfig';
import {authPayload} from '@/types/auth';

export const checkHealth = () => {
    return api.get(`/health`);
};

// Auth APIS
export const checkUserEmailExists = (user_email: string) => {
    return api.get(`/auth/check_user`, {
        params: {user_email},
    });
};

export const login = (payload: authPayload) => {
    return api.post(`/auth/sign_in`, payload);
};

export const signUp = (payload: authPayload) => {
    return api.post(`/auth/sign_up`, payload);
};

export const testAPI = () => {
    return api.get('/test');
}