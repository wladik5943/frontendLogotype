import React, { useEffect, useState } from 'react';
import api from '../api';
import { logout } from '../utils/auth';
import Navbar from "../utils/NavbarFull";
import axios from "axios";
import async from "async";
export default function HomePage() {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });


    useEffect(() => {

        const token = sessionStorage.getItem('accessToken');

        const item = sessionStorage.getItem('user');
        if(!item || !token) {
           api.get('/oauth/me')
                .then(res => {
                    setUser(res.data)
                    sessionStorage.setItem("user", JSON.stringify(res.data));
                })
        }else{
            setUser(JSON.parse(item))
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
                            <a href="/field" className="text-decoration-none">⚙️ Manage Fields</a>
                        </li>
                        <li className="list-group-item">
                            <a href="/questionnaires?mode=mine" className="text-decoration-none">🗂 Manage Questionnaire</a>
                        </li>
                        <li className="list-group-item">
                            <a href="/questionnaires?mode=all" className="text-decoration-none">📝 Answer the Questionnaire</a>
                        </li>

                    </ul>
                </div>
            </div>
        </>
    );
}
