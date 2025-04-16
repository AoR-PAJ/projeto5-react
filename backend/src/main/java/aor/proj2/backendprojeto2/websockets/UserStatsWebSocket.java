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
  private static final Set<Session> sessions = new CopyOnWriteArraySet<>();
  private static final Map<Session, String> sessionUserMap = new ConcurrentHashMap<>();

  @Inject
  UserDao userDao;

  @OnOpen
  public void onOpen(Session session) {
    System.out.println("Tentando abrir conexão WebSocket...");
    String token = session.getRequestParameterMap().get("token") != null
            ? session.getRequestParameterMap().get("token").get(0)
            : null;

    System.out.println("o token recebido é " + token);

    if (token == null) {
      System.out.println("Token inválido. Fechando conexão.");
      try {
        session.close(new CloseReason(CloseReason.CloseCodes.VIOLATED_POLICY, "Token inválido"));
      } catch (IOException e) {
        e.printStackTrace();
      }
      return;
    }

    UserEntity user = userDao.findUserByToken(token);
    if (user == null) {
      System.out.println("Usuário não encontrado para o token fornecido. Fechando conexão.");
      try {
        session.close(new CloseReason(CloseReason.CloseCodes.VIOLATED_POLICY, "Token inválido"));
      } catch (IOException e) {
        e.printStackTrace();
      }
      return;
    }

    String userId = user.getToken();
    sessionUserMap.put(session, userId);
    sessions.add(session);
    System.out.println("Conexão WebSocket aberta com sucesso: " + session.getId() + " para o usuário: " + userId);
    sendUserStats(session);
  }

  @OnClose
  public void onClose(Session session, CloseReason reason) {
    sessions.remove(session);
    sessionUserMap.remove(session);
    System.out.println("Conexão WebSocket encerrada: " + session.getId());
    System.out.println("Motivo do fechamento: " + reason.getReasonPhrase());
  }

  /*@OnMessage
  public void onMessage(String message, Session session) {
    System.out.println("Mensagem recebida do cliente: " + message);

    // Exemplo de envio de uma mensagem de resposta
    try {
      String response = "{\"total\": 10, \"verified\": 7, \"unverified\": 3}";
      session.getBasicRemote().sendText(response);
      System.out.println("Mensagem enviada para o cliente: " + response);
    } catch (IOException e) {
      e.printStackTrace();
    }
  }*/

  private void sendUserStats(Session session) {
    try {
      // Obter estatísticas do banco de dados
      int totalUsers = userDao.countAllUsers();
      int verifiedUsers = userDao.countVerifiedUsers();
      int unverifiedUsers = totalUsers - verifiedUsers;

      // Criar mensagem JSON
      String statsMessage = String.format(
              "{\"total\": %d, \"verified\": %d, \"unverified\": %d}",
              totalUsers, verifiedUsers, unverifiedUsers
      );

      // Enviar mensagem para o cliente conectado
      session.getBasicRemote().sendText(statsMessage);
      System.out.println("enviei as estatiticas da sessao: " + session.getId());
    } catch (IOException e) {
      System.err.println("Erro ao enviar estatísticas para a sessão: " + session.getId());
      e.printStackTrace();
    }
  }

  public static void broadcast(String message) {
    System.out.println("Enviando mensagem para os clientes: " + message);
    for (Session session : sessions) {
      String userId = sessionUserMap.get(session);
      if (userId != null) {
        try {
          String jsonMessage = "{\"message\": \"" + message + "\"}";
          session.getBasicRemote().sendText(jsonMessage);
          System.out.println("Mensagem enviada para sessão: " + session.getId());
        } catch (IOException e) {
          System.err.println("Erro ao enviar mensagem para sessão: " + session.getId());
          e.printStackTrace();
        }
      } else {
        System.out.println("Sessão sem usuário associado: " + session.getId());
      }
    }
  }

}
