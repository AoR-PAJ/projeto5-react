package aor.proj2.backendprojeto2.websockets;

import aor.proj2.backendprojeto2.dao.ProductDao;
import jakarta.inject.Inject;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint("/product-stats")
public class ProductStatsWebSocket {
  @Inject
  ProductDao productDao;
  private static final Set<Session> sessions = ConcurrentHashMap.newKeySet();

  @OnOpen
  public void onOpen(Session session) {
    sessions.add(session);
    System.out.println("Nova conexão WebSocket para produtos aberta: " + session.getId());

    // Enviar estatísticas de produtos para o cliente que acabou de se conectar
    try {
      int totalProducts = productDao.countAllProducts();
      Map<String, Integer> productStates = productDao.countProductsByState();

      // Formatar as estatísticas como JSON
      StringBuilder statesJson = new StringBuilder("{");
      productStates.forEach((state, count) -> {
        statesJson.append(String.format("\"%s\": %d,", state, count));
      });
      if (statesJson.length() > 1) {
        statesJson.setLength(statesJson.length() - 1);
      }
      statesJson.append("}");

      String statsMessage = String.format(
              "{\"total\": %d, \"states\": %s}",
              totalProducts, statesJson.toString()
      );

      // Enviar apenas para o cliente atual
      session.getBasicRemote().sendText(statsMessage);
      System.out.println("Estatísticas enviadas para a nova conexão: " + statsMessage);
    } catch (IOException e) {
      System.err.println("Erro ao enviar estatísticas para a sessão: " + session.getId());
      e.printStackTrace();
    }
  }

  @OnClose
  public void onClose(Session session, CloseReason reason) {
    sessions.remove(session);
    System.out.println("Conexão WebSocket para produtos fechada: " + session.getId());
  }

  @OnError
  public void onError(Session session, Throwable throwable) {
    System.err.println("Erro na conexão WebSocket para produtos: " + throwable.getMessage());
  }

  public void broadcastProductStats() {
    try {
      // Obter estatísticas de produtos
      int totalProducts = productDao.countAllProducts();
      Map<String, Integer> productStates = productDao.countProductsByState();

      // Formatar as estatísticas como JSON
      StringBuilder statesJson = new StringBuilder("{");
      productStates.forEach((state, count) -> {
        statesJson.append(String.format("\"%s\": %d,", state, count));
      });
      if (statesJson.length() > 1) {
        statesJson.setLength(statesJson.length() - 1);
      }
      statesJson.append("}");

      String statsMessage = String.format(
              "{\"total\": %d, \"states\": %s}",
              totalProducts, statesJson.toString()
      );

      System.out.println("Enviando estatísticas de produtos: " + statsMessage);

      // Enviar para todas as sessões conectadas
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
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
