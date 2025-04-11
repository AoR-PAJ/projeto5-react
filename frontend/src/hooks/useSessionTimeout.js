import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";

const useSessionTimeout = () => {
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    const interval = setInterval(() => {
      const isSessionValid = checkSession();
      if (!isSessionValid) {
        clearInterval(interval); // Para o intervalo se a sessão expirou
      }
    }, 2 * 60 * 1000); // Verifica a cada 5 minutos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, [checkSession]);
};

export default useSessionTimeout;
