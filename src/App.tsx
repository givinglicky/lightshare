import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar, Footer } from './components/Layout';
import { Feed } from './pages/Feed';
import { PostDetail } from './pages/PostDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { EditProfile } from './pages/EditProfile';
import { NotificationSettings } from './pages/NotificationSettings';
import { CreatePost } from './pages/CreatePost';
import { About } from './pages/About';
import { Success } from './pages/Success';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
          <Navbar />
          <div className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<Navigate to="/feed" replace />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/profile/notifications" element={<NotificationSettings />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/about" element={<About />} />
              <Route path="/success" element={<Success />} />
              <Route path="*" element={<div className="p-10 text-center">404 - 頁面不存在</div>} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
