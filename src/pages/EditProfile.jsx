import React, { useState, useEffect } from 'react';
import api from "../api";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {getUser} from '../utils/auth';
import AppNavbar from "../utils/AppNavbar";

export default function EditProfile() {

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });


    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');



    useEffect(() => {



            const saveUser = getUser();
            setForm(saveUser)
    }, []);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const res =  await api.post('/user/edit-profile', form)

                    setSuccessMsg("изменения сохранены")
                    setForm(res.data)
            sessionStorage.setItem("user", JSON.stringify(res.data));


            setTimeout(() => setSuccessMsg(''), 2000);

        } catch (error) {
            const errMsg = error?.response?.data?.message || 'Ошибка авторизации';
            setError(errMsg);
        }
    };

    return (
        <>


            <div className="container">
                <div className="form-box bg-white p-4 rounded border mt-5" style={{ maxWidth: '500px', margin: '80px auto' }}>
                    <h5 className="mb-4">Edit Profile</h5>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            {error && <div className="alert alert-danger py-1">{error}</div>}
                            {successMsg && <div className="alert alert-success py-1">{successMsg}</div>}
                            <label className="form-label">First Name</label>
                            <input
                                name="firstName"
                                type="text"
                                className="form-control"
                                value={form.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Last Name</label>
                            <input
                                name="lastName"
                                type="text"
                                className="form-control"
                                value={form.lastName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">
                                Email <span className="text-danger">*</span>
                            </label>
                            <input
                                name="email"
                                type="email"
                                className="form-control"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Phone Number</label>
                            <input
                                name="phone"
                                type="tel"
                                className="form-control"
                                value={form.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            SAVE
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
