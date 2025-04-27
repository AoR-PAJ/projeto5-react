package aor.proj2.backendprojeto2.websockets;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.concurrent.CopyOnWriteArraySet;

@ServerEndpoint("/estatisticas")
@ApplicationScoped
public class StatsWebSocket {

  // Lista de sessões conectadas
  private static final CopyOnWriteArraySet<Session> sessions = new CopyOnWriteArraySet<>();

  @OnOpen
  public void onOpen(Session session) {
    sessions.add(session);
    System.out.println("Nova conexão WebSocket aberta: " + session.getId());

    // Enviar dados para o cliente que acabou de se conectar
    try {
      String statsMessage = "{\"type\": \"categoryStats\", \"payload\": [" +
              "{\"category\": \"Eletrônicos\", \"productCount\": 15}," +
              "{\"category\": \"Roupas\", \"productCount\": 8}" +
              "]}";
      session.getBasicRemote().sendText(statsMessage); // Envia os dados para o cliente
      System.out.println("Mensagem enviada para a nova conexão: " + statsMessage);
    } catch (IOException e) {
      System.err.println("Erro ao enviar mensagem para a sessão: " + session.getId());
      e.printStackTrace();
    }
  }

  @OnClose
  public void onClose(Session session) {
    sessions.remove(session);
    System.out.println("Conexão WebSocket encerrada: " + session.getId());
  }

  @OnMessage
  public void onMessage(String message, Session session) {
    System.out.println("Mensagem recebida do cliente: " + message);
  }

  @OnError
  public void onError(Session session, Throwable throwable) {
    System.err.println("Erro no WebSocket: " + throwable.getMessage());
  }

  // Método para enviar mensagens para todos os clientes conectados
  public static void broadcast(String message) {
    System.out.println("Enviando mensagem via WebSocket: " + message);
    for (Session session : sessions) {
      try {
        session.getBasicRemote().sendText(message);
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }
}
