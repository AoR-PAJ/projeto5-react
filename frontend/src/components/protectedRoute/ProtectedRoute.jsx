import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const isAuthenticated = useAuthStore((state) => !!state.token);
  const isAdmin = useAuthStore((state) => state.admin);

  if (!isAuthenticated) {
    // Redireciona para a página de login se o usuário não estiver autenticado
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    // Redireciona para uma página de acesso negado se o usuário não for administrador
    return <Navigate to="/access-denied" replace />;
  }

  // Permite o acesso à rota protegida
  return children;
};

export default ProtectedRoute;
