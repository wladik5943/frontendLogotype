

export function logout() {
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user')
    window.location.href = '/login';
}

export function getAccessToken() {
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
}

export function isLoggedIn() {
    return !!getAccessToken();
}

export function getUser(){
    const stored = sessionStorage.getItem("user");
    if(stored) {
        return JSON.parse(stored)

    }else {
        window.location.href = '/';
    }
}
