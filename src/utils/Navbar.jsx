import React from 'react';
import { useNavigate } from 'react-router-dom';
import {logout} from "./auth";

export default function Navbar({ user }) {
    const navigate = useNavigate();

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
            <div className="container">
                <a className="navbar-brand logotype fw-bold fs-4" href="/">
                    LOGO<span style={{color: '#0d6efd'}}>TYPE</span>
                </a>
                <div className="collapse navbar-collapse justify-content-end">
                    <ul className="navbar-nav me-3">
                        <li className="nav-item">
                            <a className="nav-link" href="/login">Login</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
