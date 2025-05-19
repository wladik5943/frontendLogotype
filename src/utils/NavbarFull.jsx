// src/components/NavbarFull.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth'; // переиспользуем logout

export default function NavbarFull({ user }) {


    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
            <div className="container">
                <a className="navbar-brand logotype fw-bold fs-4" href="/">
                    LOGO<span style={{ color: '#0d6efd' }}>TYPE</span>
                </a>
                <div className="collapse navbar-collapse justify-content-end">
                    <ul className="navbar-nav me-3">
                        <li className="nav-item">
                            <a className="nav-link" href="/fields">Fields</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/questionnaires">Responses</a>
                        </li>
                    </ul>
                    <div className="dropdown">
                        <a
                            className="nav-link dropdown-toggle"
                            href="#"
                            role="button"
                            data-bs-toggle="dropdown"
                        >
                            {user ? `${user.firstName} ${user.lastName}` : 'User'}
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><a className="dropdown-item" href="/edit-profile">Edit Profile</a></li>
                            <li><a className="dropdown-item" href="/change-password">Change Password</a></li>
                            <li><button className="dropdown-item" onClick={logout}>Log Out</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}
