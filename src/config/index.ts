import axios from 'axios';
import { getEnvVariables } from '../helpers/getEnvVariables';

const fallbackApi = 'https://fieldpartner-deltree-eabc2f88.koyeb.app';
const envApi = getEnvVariables().VITE_AUTH_API as string | undefined;
const baseUrl = !envApi || envApi.includes('localhost') ? fallbackApi : envApi;
export const baseUrlImg = getEnvVariables().VITE_IMAGES_URL;

export const urlImg = `${baseUrlImg}/general/files/`;

export const imagesAPI = axios.create({
    baseURL: baseUrlImg
});

export const backofficeApi = axios.create({
    baseURL: baseUrl,
});

//TODO: agregar interceptor en el request para agregar el token

// Todo: configurar interceptores
backofficeApi.interceptors.request.use((config) => {
    config.headers.set('channel', 'backoffice', false);
    const accessToken = localStorage.getItem('t_bo') || '';
    const authHeader = accessToken
        ? (accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`)
        : '';
    if (authHeader) config.headers.set('Authorization', authHeader);
    return config;
})
