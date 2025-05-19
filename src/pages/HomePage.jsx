import React, { useEffect, useState } from 'react';
import api from '../api';
import { logout } from '../utils/auth';
import Navbar from "../utils/NavbarFull";
export default function HomePage() {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    // Проверка токена при входе
    useEffect(() => {

        const item = sessionStorage.getItem('user');
        if(!item) {
            // Запрашиваем пользователя с backend
            api.get('/oauth/me') // путь зависит от твоего backend
                .then(res => {
                    setUser(res.data)
                    sessionStorage.setItem("user", JSON.stringify(res.data));
                })
        }

    }, []);



    return (
        <>
            <style>{`
        body {
          background-color: #f8f9fa;
        }
        .home-container {
          max-width: 600px;
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
                <div className="home-container">
                    <h2 className="text-center logotype">LOGO<span>TYPE</span></h2>
                    <h5 className="text-center mb-4">Добро пожаловать{user ? `, ${user.firstName}` : ''}!</h5>

                    <ul className="list-group">
                        <li className="list-group-item">
                            <a href="/fields" className="text-decoration-none">🗂 Manage Fields</a>
                        </li>
                        <li className="list-group-item">
                            <a href="/responses" className="text-decoration-none">📋 View Responses</a>
                        </li>

                    </ul>
                </div>
            </div>
        </>
    );
}
