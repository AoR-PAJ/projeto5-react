import { useEffect, useState, useRef } from "react";

const useProductStats = () => {
  const [stats, setStats] = useState({ total: 0, states: {} });
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(
      "ws://localhost:8080/vanessa-vinicyus-proj3/product-stats"
    );

    socketRef.current = socket;

    console.log("Conectando ao WebSocket de estatísticas de produtos...");

    socket.onopen = () => {
      console.log("Conexão WebSocket de produtos aberta.");
    };

    socket.onmessage = (event) => {
      console.log("Mensagem recebida do WebSocket de produtos:", event.data);

      try {
        const parsedMessage = JSON.parse(event.data);
        setStats(parsedMessage);
      } catch (error) {
        console.warn("Mensagem não é JSON. Conteúdo:", event.data);
      }
    };

    socket.onclose = (event) => {
      console.log(
        `Conexão WebSocket de produtos fechada. Código: ${
          event.code
        }, Motivo: ${event.reason || "Nenhum motivo especificado"}`
      );
      socketRef.current = null;
    };

    socket.onerror = (error) => {
      console.error("Erro no WebSocket de produtos:", error);
    };

    return () => {
      console.log("Fechando conexão WebSocket de produtos...");
      if (socketRef.current) {
        if (socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.close();
        }
        socketRef.current = null;
      }
    };
  }, []);

  return stats;
};

export default useProductStats;
