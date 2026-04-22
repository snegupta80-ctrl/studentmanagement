// API Configuration based on environment
const getApiConfig = () => {
    const isDevelopment = import.meta.env.DEV;
    const isProduction = import.meta.env.PROD;

    const config = {
        development: {
            baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
            socketURL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
            timeout: 10000
        },
        production: {
            baseURL: import.meta.env.VITE_API_BASE_URL || 'https://your-api.onrender.com/api',
            socketURL: import.meta.env.VITE_SOCKET_URL || 'https://your-api.onrender.com',
            timeout: 15000
        }
    };

    return isProduction ? config.production : config.development;
};

export const apiConfig = getApiConfig();
export default apiConfig;
