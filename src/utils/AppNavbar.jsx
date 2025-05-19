// src/components/AppNavbar.jsx
import React, { useEffect, useState } from 'react';
import NavbarFull from './NavbarFull';
import Navbar from './Navbar';
import api from "../api";

export default function AppNavbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('accessToken');
        if (token) {
            const storedUser = sessionStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                api.get('/oauth/me')
                    .then(res => {
                        setUser(res.data)
                        sessionStorage.setItem("user", JSON.stringify(res.data));
                    }) // fallback
            }
        }
    }, []);

    return user ? <NavbarFull user={user} /> : <Navbar />;
}
