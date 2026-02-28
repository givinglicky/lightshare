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
import { Success } from './pages/Success';
import { ProtectedRoute } from './components/ProtectedRoute';
import { TrafficLightTest } from './pages/TrafficLightTest';
import { About } from './pages/About';
import { Notifications } from './pages/Notifications';
import { SearchResults } from './pages/SearchResults';
import { ForgotPassword } from './pages/ForgotPassword';
import { LegalPage } from './pages/Legal';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 italic-none">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Routes>
            <Route path="/" element={<Navigate to="/feed" replace />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/tos" element={<LegalPage title="服務條款" />} />
            <Route path="/privacy" element={<LegalPage title="隱私權政策" />} />
            <Route path="/contact" element={<div className="p-20 text-center">聯繫我們：support@lightshare.com</div>} />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />

            {/* 公開路由 */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* 保護路由 */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/profile/edit" element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } />
            <Route path="/profile/notifications" element={
              <ProtectedRoute>
                <NotificationSettings />
              </ProtectedRoute>
            } />
            <Route path="/create" element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            } />
            <Route path="/success" element={
              <ProtectedRoute>
                <Success />
              </ProtectedRoute>
            } />
            <Route path="/test" element={<TrafficLightTest />} />

            <Route path="*" element={<div className="p-10 text-center text-slate-500">404 - 頁面不存在</div>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
