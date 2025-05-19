import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
});
api.interceptors.request.use(config => {
    const token =  sessionStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Если access истёк, и это не попытка обновить токен
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                const res = await axios.post('http://localhost:8080/oauth/refresh-token', {
                    refreshToken: refreshToken
                });

                const newAccessToken = res.data.accessToken;

                sessionStorage.setItem('accessToken', newAccessToken);

                // Повторить запрос с новым токеном
                originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
                return axios(originalRequest);

            } catch (e) {
                console.error('Refresh token не сработал');
                // window.location.href = '/login'; // отправляем на логин
            }
        }

        return Promise.reject(error);
    }
);
export default api;