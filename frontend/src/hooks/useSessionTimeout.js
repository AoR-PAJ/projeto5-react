import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";

const useSessionTimeout = () => {
  const checkSession = useAuthStore((state) => state.checkSession);
  const token = useAuthStore((state)=> state.token);

  useEffect(() => {
    console.log("useSessionTimeout montado");

    const interval = setInterval(() => {
      const isSessionValid = checkSession();
      if (!isSessionValid) {
        clearInterval(interval); // Para o intervalo se a sessão expirou
      }
    }, 1 * 60 * 1000); // Verifica a cada 1 minuto

    return () => {
      clearInterval(interval); // Limpa o intervalo ao desmontar o componente
    };
  }, [checkSession, token]);
};

export default useSessionTimeout;
