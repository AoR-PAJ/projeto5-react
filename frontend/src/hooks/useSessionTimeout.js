import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";

const useSessionTimeout = () => {
  const checkSession = useAuthStore((state) => state.checkSession);
  const logout = useAuthStore((state)=> state.logout);
  const navigate = useNavigate();  

useEffect(() => {
    const interval = setInterval(() => {
      const isSessionValid = checkSession();
      if (!isSessionValid) {
        logout(); // Faz logout se a sessão expirou
        navigate("/login"); // Redireciona para a página de login
      }
    }, 10000); // Verifica a cada 10 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, [checkSession, logout, navigate]);
};

export default useSessionTimeout;