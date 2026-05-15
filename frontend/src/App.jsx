import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Activities from "./pages/Activities";
import ActivityForm from "./pages/ActivityForm";
import Summary from "./pages/Summary";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/activities" element={
              <ProtectedRoute>
                <Layout><Activities /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/add" element={
              <ProtectedRoute>
                <Layout><ActivityForm /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/summary" element={
              <ProtectedRoute>
                <Layout><Summary /></Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}