import React, {useEffect, useState} from 'react';
import api from '../api';
import Navbar from "../utils/Navbar";
import axios from "axios";
export default function ResetPasswordPage() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
    });
    useEffect(() => {
        const stored = sessionStorage.getItem("signupForm");
        if (stored) {
            const formData = JSON.parse(stored);
            setForm(formData)
            sessionStorage.removeItem("signupForm")
        }
    }, []);


        const handleVerifyCode = async (e) => {
            e.preventDefault();
            if (!code) return setError('Введите код');
            try {
                const api = axios.create({
                    baseURL: process.env.REACT_APP_API_URL || '',
                });
                await api.post('/password/verify-code', {email: form.email, code});
                setError('');
                setSuccessMsg('Почта подтверждена');
                const response = await api.post('/oauth/sign-up', form);

                const accessToken = response.data.accessToken;
                sessionStorage.setItem('accessToken', accessToken);

                setTimeout(() => window.location.href = '/', 2000);
            } catch (err) {
                setError('Неверный код.');
            }
        };




        return (

            <>


                <div className="container mt-5" style={{maxWidth: 400}}>
                    <div className="bg-white p-4 rounded shadow">
                        <h4 className="text-center mb-3">🔐 Подтверждение почты</h4>

                        <div className="d-flex justify-content-between mb-3">
                            <span className={'fw-bold text-primary'}>На вашу почту был выслан код</span>
                        </div>

                        {error && <div className="alert alert-danger py-1">{error}</div>}
                        {successMsg && <div className="alert alert-success py-1">{successMsg}</div>}


                        {(
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

                    </div>
                </div>
            </>
        );
    }

