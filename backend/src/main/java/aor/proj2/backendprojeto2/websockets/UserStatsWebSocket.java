package aor.proj2.backendprojeto2.websockets;

import aor.proj2.backendprojeto2.dao.UserDao;
import aor.proj2.backendprojeto2.entity.UserEntity;
import jakarta.inject.Inject;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@ServerEndpoint("/user-stats")
public class UserStatsWebSocket {

  // Lista de sessões WebSocket ativas
  private static final Set<Session> sessions = ConcurrentHashMap.newKeySet();

  @OnOpen
  public void onOpen(Session session) {
    sessions.add(session);
    System.out.println("Nova conexão WebSocket aberta: " + session.getId());
  }

  @OnClose
  public void onClose(Session session, CloseReason reason) {
    sessions.remove(session);
    System.out.println("Conexão WebSocket fechada: " + session.getId());
  }

  @OnError
  public void onError(Session session, Throwable throwable) {
    System.err.println("Erro na conexão WebSocket: " + throwable.getMessage());
  }

  // Método para enviar estatísticas para todos os clientes conectados
  public static void broadcastStats(int total, int verified, int unverified) {
    String statsMessage = String.format(
            "{\"total\": %d, \"verified\": %d, \"unverified\": %d}",
            total, verified, unverified
    );

    for (Session session : sessions) {
      if (session.isOpen()) {
        try {
          session.getBasicRemote().sendText(statsMessage);
        } catch (IOException e) {
          System.err.println("Erro ao enviar mensagem para a sessão: " + session.getId());
          e.printStackTrace();
        }
      }
    }
  }
}
