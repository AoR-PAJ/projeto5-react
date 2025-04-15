import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";

const useSessionTimeout = () => {
  const checkSession = useAuthStore((state) => state.checkSession);
  const updateSessionExpiration = useAuthStore(
    (state) => state.updateSessionExpiration
  );
  const token = useAuthStore((state) => state.token);

  useEffect(() => {

    // Função para redefinir o tempo de expiração da sessão
    const resetSessionTimeout = () => {
      updateSessionExpiration(); // Atualiza o tempo de expiração
    };

    // Adiciona listeners para detectar atividade do usuário
    window.addEventListener("mousemove", resetSessionTimeout);
    window.addEventListener("keydown", resetSessionTimeout);
    window.addEventListener("click", resetSessionTimeout);

    const interval = setInterval(() => {
      const isSessionValid = checkSession();
      if (!isSessionValid) {
        clearInterval(interval); // Para o intervalo se a sessão expirou
      }
    }, 30000); // Verifica a cada 30 segundo

    return () => {
      clearInterval(interval); // Limpa o intervalo ao desmontar o componente
      window.removeEventListener("mousemove", resetSessionTimeout);
      window.removeEventListener("keydown", resetSessionTimeout);
      window.removeEventListener("click", resetSessionTimeout);
    };
  }, [checkSession, token, updateSessionExpiration]);
};

export default useSessionTimeout;
