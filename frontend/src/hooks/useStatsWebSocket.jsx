import { useEffect, useRef } from "react";

const useStatsWebSocket = (onMessage) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(
      "ws://localhost:8080/vanessa-vinicyus-proj3/estatisticas"
    );
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Conexão WebSocket aberta.");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data); // Chama a função de callback com os dados recebidos
      } catch (error) {
        console.error("Erro ao processar mensagem do WebSocket:", error);
      }
    };

    socket.onclose = () => {
      console.log("Conexão WebSocket fechada.");
    };

    socket.onerror = (error) => {
      console.error("Erro no WebSocket:", error);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [onMessage]);

  return socketRef.current;
};

export default useStatsWebSocket;
