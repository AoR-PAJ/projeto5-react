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
        alert("Excedeu o tempo de sessão. Você será desconectado.");
        logout(); 
        navigate("/login"); 
      }
    }, 10000); // Verifica a cada 10 segundos

    return () => clearInterval(interval); 
  }, [checkSession, logout, navigate]);
};

export default useSessionTimeout;