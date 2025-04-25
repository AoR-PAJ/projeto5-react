package aor.proj2.backendprojeto2.websockets;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint("/notifications")
@ApplicationScoped
public class NotificationsWebSocket {
  private static final Set<Session> sessions = ConcurrentHashMap.newKeySet();

  @OnOpen
  public void onOpen(Session session) {
    sessions.add(session);
  }

  @OnClose
  public void onClose(Session session) {
    sessions.remove(session);
  }

  public void sendNotification(String message) {
    for(Session session: sessions) {
      if(session.isOpen()) {
        try {
          session.getBasicRemote().sendText(message);
        } catch(IOException e) {
          e.printStackTrace();
        }
      }
    }
  }
}
