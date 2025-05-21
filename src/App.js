import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import EditProfile from './pages/EditProfile';
import HomePage from './pages/HomePage';
import ChangePassword from './pages/ResetPasswordPage';
import VerifyEmail from './pages/VerifyEmailPage'
import FieldPage from "./pages/FieldPage";
import QuestionnairePage from "./pages/QuestionnairePage";
import AppNavbar from "./utils/AppNavbar";
import SuccessPage from "./pages/SuccessPage";
import CreateTestPage from "./pages/CreateTestPage";
import TestSelectionPage from "./pages/TestSelectionPage";
import ResponsesPage from "./pages/ResponsesPage";


function App() {
    const isAuthenticated = !!sessionStorage.getItem("accessToken");
    return (
        <Router>
            <AppNavbar/>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/"
                    element={
                        isAuthenticated ? <HomePage /> : <Navigate to="/login" />
                    }
                />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/verify-email" element={<VerifyEmail/>}/>
                <Route path='/field' element={<FieldPage/>}/>
                <Route path="/questionnaires/:id" element={<QuestionnairePage />} />
                <Route path="/questionnaires/success" element={<SuccessPage />} />
                <Route path="/questionnaires/create" element={<CreateTestPage/>}/>
                <Route path="/questionnaires/" element={<TestSelectionPage />} />
                <Route path="/answers/:testId" element={<ResponsesPage />} />

                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
