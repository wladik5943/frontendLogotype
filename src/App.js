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


function App() {
  return (
      <Router>
          <AppNavbar/>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/verify-email" element={<VerifyEmail/>}/>
            <Route path='/fields' element={<FieldPage/>}/>
            <Route path="/questionnaires" element={<QuestionnairePage />} />
            <Route path="/questionnaires/:id" element={<QuestionnairePage />} />
            <Route path="/questionnaires/success" element={<SuccessPage />} />
          {/* Добавляй остальные маршруты, когда создашь страницы */}
          {/* <Route path="/profile" element={<ProfilePage />} /> */}
          {/* <Route path="/fields" element={<FieldsPage />} /> */}
          {/* <Route path="/questionnaires/:id" element={<QuestionnairePage />} /> */}
          {/* <Route path="/success" element={<SuccessPage />} /> */}
          {/* <Route path="/responses" element={<ResponsesPage />} /> */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
  );
}

export default App;
