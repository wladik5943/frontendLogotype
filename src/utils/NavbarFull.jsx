import React, { useState } from 'react';
import { logout } from '../utils/auth';

export default function NavbarFull({ user }) {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleNavbar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
            <div className="container">
                <a className="navbar-brand logotype fw-bold fs-4" href="/">
                    LOGO<span style={{ color: '#0d6efd' }}>TYPE</span>
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleNavbar}
                    aria-controls="navbarSupportedContent"
                    aria-expanded={!isCollapsed}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`} id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link" href="/field">Fields</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                id="questionnaireDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Questionnaire
                            </a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="/questionnaires?mode=mine">My questionnaires</a></li>
                                <li><a className="dropdown-item" href="/questionnaires?mode=all">All questionnaires</a></li>
                                <li><a className="dropdown-item" href="/questionnaires/create">Create questionnaire</a></li>
                            </ul>
                        </li>
                    </ul>

                    <ul className="navbar-nav mb-2 mb-lg-0">
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                id="userDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {user ? `${user.firstName} ${user.lastName}` : 'User'}
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                <li><a className="dropdown-item" href="/edit-profile">Edit Profile</a></li>
                                <li><a className="dropdown-item" href="/change-password">Change Password</a></li>
                                <li>
                                    <button className="dropdown-item" onClick={logout}>Log Out</button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
