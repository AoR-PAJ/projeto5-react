package aor.proj2.backendprojeto2.dao;

import aor.proj2.backendprojeto2.entity.MessageEntity;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;

@Stateless
public class MessageDao {

  @PersistenceContext
  private EntityManager em;

  public void saveMessage(MessageEntity message) {
    em.persist(message);
  }

  public List<MessageEntity> getMessagesBetweenUsers(String user1, String user2) {
    return em.createQuery(
                    "SELECT m FROM MessageEntity m WHERE " +
                            "(m.sender.username = :user1 AND m.receiver.username = :user2) OR " +
                            "(m.sender.username = :user2 AND m.receiver.username = :user1) " +
                            "ORDER BY m.timestamp ASC", MessageEntity.class)
            .setParameter("user1", user1)
            .setParameter("user2", user2)
            .getResultList();
  }

  public void markMessagesAsRead(String sender, String receiver) {
    em.createQuery(
                    "UPDATE MessageEntity m SET m.read = true WHERE m.sender.username = :sender AND m.receiver.username = :receiver")
            .setParameter("sender", sender)
            .setParameter("receiver", receiver)
            .executeUpdate();
  }
}
