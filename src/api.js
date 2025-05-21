import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '',
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


        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                const res = await axios.post('/oauth/refresh-token', {
                    refreshToken: refreshToken
                });

                const newAccessToken = res.data.accessToken;

                sessionStorage.setItem('accessToken', newAccessToken);
                window.location.reload();

                originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
                return axios(originalRequest);

            } catch (e) {
                console.error('Refresh token не сработал');
                sessionStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                sessionStorage.removeItem('user');
                if(window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
);
export default api;