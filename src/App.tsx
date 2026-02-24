import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { FolderBoard } from './pages/FolderBoard';
import { ProjectTimeline } from './pages/ProjectTimeline';
import { AdminPanel } from './pages/AdminPanel';
import { DiskProvider } from './contexts/DiskContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <DiskProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/folders" element={<FolderBoard />} />
                <Route path="/project/:id" element={<ProjectTimeline />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </DiskProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
