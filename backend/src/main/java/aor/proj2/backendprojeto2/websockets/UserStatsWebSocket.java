package aor.proj2.backendprojeto2.websockets;

import aor.proj2.backendprojeto2.dao.CategoryDao;
import aor.proj2.backendprojeto2.dao.UserDao;
import aor.proj2.backendprojeto2.entity.UserEntity;
import jakarta.inject.Inject;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@ServerEndpoint("/user-stats")
public class UserStatsWebSocket {
  @Inject
  UserDao userDao;

  @Inject
  CategoryDao categoryDao;

  // Lista de sessões WebSocket ativas
  private static final Set<Session> sessions = ConcurrentHashMap.newKeySet();

  @OnOpen
  public void onOpen(Session session) {
    System.out.println("web aberto");
    sessions.add(session);
    System.out.println("Nova conexão WebSocket aberta: " + session.getId());

    // Enviar estatísticas de usuários
    sendUserStats(session);

    // Enviar estatísticas de categorias
    sendCategoryStats(session);

    // Enviar estatísticas para o cliente que acabou de se conectar
    try {
      int totalUsers = userDao.countAllUsers();
      int verifiedUsers = userDao.countVerifiedUsers();
      int unverifiedUsers = totalUsers - verifiedUsers;

      String statsMessage = String.format(
              "{\"total\": %d, \"verified\": %d, \"unverified\": %d}",
              totalUsers, verifiedUsers, unverifiedUsers
      );

      session.getBasicRemote().sendText(statsMessage); // Envia apenas para o cliente atual
      System.out.println("Estatísticas enviadas para a nova conexão: " + statsMessage);
    } catch (IOException e) {
      System.err.println("Erro ao enviar estatísticas para a sessão: " + session.getId());
      e.printStackTrace();
    }
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

    System.out.println("Enviando estatísticas: " + statsMessage);

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

  private void sendUserStats(Session session) {
    try {
      int totalUsers = userDao.countAllUsers();
      int verifiedUsers = userDao.countVerifiedUsers();
      int unverifiedUsers = totalUsers - verifiedUsers;

      String statsMessage = String.format(
              "{\"type\": \"userStats\", \"total\": %d, \"verified\": %d, \"unverified\": %d}",
              totalUsers, verifiedUsers, unverifiedUsers
      );

      session.getBasicRemote().sendText(statsMessage);
    } catch (IOException e) {
      System.err.println("Erro ao enviar estatísticas de usuários: " + e.getMessage());
    }
  }

  private void sendCategoryStats(Session session) {
    try {
      // Buscar categorias reais do banco de dados
      List<Object[]> categories = categoryDao.getCategoriesWithProductCount();

      // Converter os resultados para JSON
      StringBuilder statsMessage = new StringBuilder("{\"type\": \"categoryStats\", \"payload\": [");
      for (int i = 0; i < categories.size(); i++) {
        Object[] category = categories.get(i);
        String categoryName = (String) category[0];
        Long productCount = (Long) category[1];

        statsMessage.append(String.format(
                "{\"category\": \"%s\", \"productCount\": %d}",
                categoryName, productCount
        ));

        if (i < categories.size() - 1) {
          statsMessage.append(",");
        }
      }
      statsMessage.append("]}");

      // Enviar a mensagem para a sessão específica
      session.getBasicRemote().sendText(statsMessage.toString());
      System.out.println("Estatísticas de categorias enviadas: " + statsMessage);
    } catch (IOException e) {
      System.err.println("Erro ao enviar estatísticas de categorias: " + e.getMessage());
      e.printStackTrace();
    }
  }
}
