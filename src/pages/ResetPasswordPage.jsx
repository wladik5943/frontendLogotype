import React, { useEffect, useState } from 'react';
import api from '../api';
import Navbar from "../utils/Navbar";
export default function ResetPasswordPage() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');
        if (!token) {
            setIsAuthorized(false);
            setLoading(false);
            return;
        }

        api.get('/oauth/me')
            .then(res => {
                setIsAuthorized(true);
                setEmail(res.data.email);
            })
            .catch(() => {
                setIsAuthorized(false);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSendCode = async (e) => {
        e.preventDefault();
        if (!email) return setError('Введите email');
        try {
             await api.post('/password/send-code', { email: email });
            setError('');
            setStep(2);
        } catch (err) {
            const errMsg = err?.response?.data?.message || 'Ошибка авторизации';
            setError(errMsg);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        if (!code) return setError('Введите код');
        try {
            await api.post('/password/verify-code', { email, code });
            setError('');
            setStep(3);
        } catch (err) {
            setError('Неверный код.');
        }
    };

    const handleSetPassword = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            return setError('Пароль должен быть не менее 6 символов');
        }
        try {
              await api.post('/password/set-password', { email, newPassword });
            setError('');
            setSuccessMsg('Пароль успешно изменён!');
            setTimeout(() => window.location.href = '/', 2000);
        } catch (err) {
            const errMsg = err?.response?.data?.message || 'Ошибка авторизации';
            setError(errMsg);
        }
    };

    if (loading) return <div className="text-center mt-5">Загрузка...</div>;

    return (

        <>



        <div className="container mt-5" style={{ maxWidth: 400 }}>
            <div className="bg-white p-4 rounded shadow">
                <h4 className="text-center mb-3">🔐 Сброс пароля</h4>

                <div className="d-flex justify-content-between mb-3">
                    <span className={step >= 1 ? 'fw-bold text-primary' : 'text-muted'}>1. Email</span>
                    <span className={step >= 2 ? 'fw-bold text-primary' : 'text-muted'}>2. Код</span>
                    <span className={step >= 3 ? 'fw-bold text-primary' : 'text-muted'}>3. Новый пароль</span>
                </div>

                {error && <div className="alert alert-danger py-1">{error}</div>}
                {successMsg && <div className="alert alert-success py-1">{successMsg}</div>}

                {/* Step 1 */}
                {step === 1 && (
                    <form onSubmit={handleSendCode}>
                        {!isAuthorized && (
                            <div className="mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Введите email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        {isAuthorized && (
                            <div className="mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    disabled
                                />
                            </div>
                        )}
                        <button className="btn btn-primary w-100" type="submit">Отправить код</button>
                    </form>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <form onSubmit={handleVerifyCode}>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Введите код из письма"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn btn-primary w-100" type="submit">Подтвердить код</button>
                    </form>
                )}

                {/* Step 3 */}
                {step === 3 && (
                    <form onSubmit={handleSetPassword}>
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Новый пароль"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn btn-primary w-100" type="submit">Сменить пароль</button>
                    </form>
                )}
            </div>
        </div>
        </>
    );
}
