import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../stores/useAuthStore";

const useUserStats = () => {
  const [stats, setStats] = useState({ total: 0, verified: 0, unverified: 0 });
  const token = useAuthStore((state) => state.token);
  const socketRef = useRef(null); // Usar ref para manter a instância do WebSocket

  useEffect(() => {
    console.log("Token de autenticação:", token);

    // Verificar se o token está disponível
    if (!token) {
      console.error("Token de autenticação não disponível.");
      return;
    }

    // Fechar conexão existente antes de criar uma nova
    if (socketRef.current) {
      console.log(
        "Fechando conexão WebSocket existente antes de criar uma nova..."
      );
      socketRef.current.close();
      socketRef.current = null;
    }

    console.log("Tentando conectar ao WebSocket com o token:", token);

    // Criar uma nova conexão WebSocket
    const socket = new WebSocket(
      `ws://localhost:8080/vanessa-vinicyus-proj3/user-stats?token=${token}`
    );

    socketRef.current = socket; // Armazena a instância do WebSocket

    console.log("Estado inicial do socket:", socket.readyState);

    // Evento disparado quando a conexão é aberta
    socket.onopen = () => {
      console.log("Conexão WebSocket aberta.");
      console.log("Estado do socket após abrir:", socket.readyState);
    };

    // Evento disparado ao receber uma mensagem do WebSocket
    socket.onmessage = (event) => {
      console.log("Mensagem recebida do WebSocket:", event.data);

      try {
        // Processar a mensagem como JSON
        const parsedMessage = JSON.parse(event.data);

        setStats(parsedMessage); // Atualizar o estado com os dados processados
      } catch (error) {
        console.warn("Mensagem não é JSON. Conteúdo:", event.data);
      }
    };

    // Evento disparado quando a conexão é fechada
    socket.onclose = (event) => {
      console.log(
        `Conexão WebSocket fechada. Código: ${event.code}, Motivo: ${
          event.reason || "Nenhum motivo especificado"
        }`
      );
      socketRef.current = null; // Limpa a referência ao WebSocket
    };

    // Evento disparado quando ocorre um erro na conexão
    socket.onerror = (error) => {
      console.error("Erro no WebSocket:", error);
    };

    // Limpeza ao desmontar o componente ou ao atualizar o token
    return () => {
      console.log("Fechando conexão WebSocket...");
      if (socketRef.current) {
        socketRef.current = null;
      }
    };
  }, [token]); // Dependência no token para recriar a conexão quando ele mudar

  return stats;
};

export default useUserStats;
