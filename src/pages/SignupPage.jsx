import React, { useState} from 'react';
import api from '../api'; // убедись, что путь правильный

export default function SignupPage() {
    const [error, setError] = useState('');
      const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
    });


    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert('Пароли не совпадают!');
            return;
        }

        try {
             await api.post('/password/verify-email', {email:form.email,firstName:form.firstName} );
            setError('');
            sessionStorage.setItem("signupForm", JSON.stringify(form));

            window.location.href = '/verify-email';
        } catch (error) {

            const errMsg = error?.response?.data?.message || 'Ошибка авторизации';
            setError(errMsg);
        }
    };

    return (
        <>
            <style>{`
        body {
          background-color: #f8f9fa;
        }
        .signup-container {
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
        .form-label-required::after {
          content: ' *';
          color: red;
        }
      `}</style>

            <div className="container">
                <div className="signup-container">
                    <h2 className="text-center logotype">LOGO<span>TYPE</span></h2>
                    <h5 className="text-center mb-4">Sign Up</h5>
                    {error && <div className="alert alert-danger py-1">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input
                                name="email"
                                type="email"
                                className="form-control"
                                placeholder="Email *"
                                required
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                name="password"
                                type="password"
                                className="form-control"
                                placeholder="Password *"
                                required
                                value={form.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                name="confirmPassword"
                                type="password"
                                className="form-control"
                                placeholder="Confirm Password *"
                                required
                                value={form.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                name="firstName"
                                type="text"
                                className="form-control"
                                placeholder="First Name"
                                value={form.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                name="lastName"
                                type="text"
                                className="form-control"
                                placeholder="Last Name"
                                value={form.lastName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                name="phone"
                                type="tel"
                                className="form-control"
                                placeholder="Phone Number"
                                value={form.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">SIGN UP</button>
                        </div>
                    </form>
                    <div className="text-center mt-3">
                        Already have account? <a href="/login" className="text-decoration-none text-primary">Log In</a>
                    </div>
                </div>
            </div>
        </>
    );
}
