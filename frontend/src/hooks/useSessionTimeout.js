import { useEffect, useRef } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";

const useSessionTimeout = () => {
  const sessionExpiration = useAuthStore((state) => state.sessionExpiration); // Obtém o tempo de expiração da sessão
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const inactivityTimeout = useRef(null); // Referência para o temporizador de inatividade

  useEffect(() => {
    // Função para desconectar o usuário
    const handleLogout = () => {
      alert("Sua sessão expirou devido à inatividade. Você será desconectado.");
      logout();
      navigate("/login");
    };

    // Função para redefinir o temporizador de inatividade
    const resetInactivityTimeout = () => {
      clearTimeout(inactivityTimeout.current);

      // Verifica se o `sessionExpiration` é válido
      if (!sessionExpiration) return;

      // Calcula o tempo restante até o `sessionExpiration`
      const timeRemaining = sessionExpiration - new Date().getTime();

      if (timeRemaining > 0) {
        // Define o temporizador de inatividade para 2 minutos
        inactivityTimeout.current = setTimeout(() => {
          handleLogout();
        }, 2 * 60 * 1000); // 2 minutos em milissegundos
      } else {
        // Se o tempo total de sessão já expirou, desconecta imediatamente
        handleLogout();
      }
    };

    // Verifica se o `sessionExpiration` é válido antes de adicionar os listeners
    if (!sessionExpiration) return;

    // Eventos que indicam atividade do usuário
    const activityEvents = ["mousemove", "keydown", "click", "scroll"];

    // Adiciona listeners para redefinir o timeout de inatividade
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetInactivityTimeout)
    );

    // Inicia o timeout ao carregar o componente
    resetInactivityTimeout();

    // Limpa os listeners e o timeout ao desmontar o componente
    return () => {
      clearTimeout(inactivityTimeout.current);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetInactivityTimeout)
      );
    };
  }, [sessionExpiration, logout, navigate]);

  return null;
};

export default useSessionTimeout;
