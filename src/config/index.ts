import axios from 'axios';
import { getEnvVariables } from '../helpers/getEnvVariables';

const baseUrl = getEnvVariables().VITE_AUTH_API;

export const backofficeApi = axios.create({
    baseURL: baseUrl,
});

//TODO: agregar interceptor en el request para agregar el token

// Todo: configurar interceptores
backofficeApi.interceptors.request.use((config) => {

    // config.headers = {
    //     ...config.headers,
    //     'x-token': localStorage.getItem('token')
    // }
    config.headers.set('channel', 'backoffice', false);

    return config;
})
