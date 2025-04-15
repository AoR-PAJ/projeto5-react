import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";

const useSessionTimeout = () => {
  const checkSession = useAuthStore((state) => state.checkSession);
  const updateSessionExpiration = useAuthStore(
    (state) => state.updateSessionExpiration
  );
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    console.log("useSessionTimeout montado ou token alterado");

    // Função para redefinir o tempo de expiração da sessão
    const resetSessionTimeout = () => {
      console.log(
        "Atividade detectada. Redefinindo o tempo de expiração da sessão."
      );
      updateSessionExpiration(); // Atualiza o tempo de expiração
    };

    // Adiciona listeners para detectar atividade do usuário
    window.addEventListener("mousemove", resetSessionTimeout);
    window.addEventListener("keydown", resetSessionTimeout);
    window.addEventListener("click", resetSessionTimeout);

    const interval = setInterval(() => {
      const isSessionValid = checkSession();
      if (!isSessionValid) {
        console.log("Sessão expirada. Limpando intervalo.");
        clearInterval(interval); // Para o intervalo se a sessão expirou
      }
    }, 30000); // Verifica a cada 30 segundo

    return () => {
      console.log(
        "useSessionTimeout desmontado ou token alterado. Limpando intervalo e removendo listeners."
      );
      clearInterval(interval); // Limpa o intervalo ao desmontar o componente
      window.removeEventListener("mousemove", resetSessionTimeout);
      window.removeEventListener("keydown", resetSessionTimeout);
      window.removeEventListener("click", resetSessionTimeout);
    };
  }, [checkSession, token, updateSessionExpiration]);
};

export default useSessionTimeout;
