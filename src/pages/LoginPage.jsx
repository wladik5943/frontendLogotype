import React, { useState } from 'react';
import api from '../api';

export default function LoginPage() {
    const [form, setForm] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setMessageType('');

        try {
            const response = await api.post('/oauth/sign-in', {
                email: form.email,
                password: form.password,
            });

            const accessToken = response.data.accessToken;
            const refreshToken = response.data.refreshToken;

            if (form.rememberMe) {
                sessionStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
            } else {
                sessionStorage.setItem('accessToken', accessToken);
            }





                window.location.href = '/';

        } catch (error) {
            const status = error?.response?.status;
            const errMsg = error?.response?.data?.message || 'Ошибка авторизации';

            if (status === 401) {
                setMessage(errMsg);
                setMessageType('error');
            } else {
                setMessage('Неизвестная ошибка');
                setMessageType('error');
            }
        }
    };

    return (
        <>
            <style>{`
        body {
          background-color: #f8f9fa;
        }
        .login-container {
          max-width: 400px;
          margin: 100px auto;
          padding: 30px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .logotype {
          font-weight: bold;
        }
        .logotype span {
          color: #0d6efd;
        }
      `}</style>

            <div className="container">
                <div className="login-container">
                    <h2 className="text-center logotype">LOGO<span>TYPE</span></h2>
                    <h5 className="text-center mb-4">Log In</h5>

                    {/* 🔔 Сообщение об ошибке */}
                    {message && (
                        <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="remember"
                                    name="rememberMe"
                                    checked={form.rememberMe}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label" htmlFor="remember">Remember me</label>
                            </div>
                            <a href="/change-password" className="text-decoration-none">Forgot password?</a>
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">LOG IN</button>
                        </div>
                    </form>
                    <div className="text-center mt-3">
                        Don't have an account? <a href="/signup" className="text-decoration-none text-primary">Sign Up</a>
                    </div>
                </div>
            </div>
        </>
    );
}
