package aor.proj2.backendprojeto2.dao;

import aor.proj2.backendprojeto2.entity.NotificationEntity;
import java.util.List;
import jakarta.ejb.Stateless;
@Stateless
public class NotificationDao extends AbstractDao<NotificationEntity> {

  public NotificationDao() {
    super(NotificationEntity.class); // Passa a classe da entidade para o AbstractDao
  }

  public List<NotificationEntity> getNotificationsByUserId(String userId, boolean read) {
    String query = "SELECT n FROM NotificationEntity n WHERE n.userId = :userId AND n.read = :read";

    query += " ORDER BY n.id DESC";

    // Cria a query
    return em.createQuery(query, NotificationEntity.class)
            .setParameter("userId", userId)
            .setParameter("read", read) // Configura o parâmetro "read" com o valor recebido
            .getResultList();
  }

  // Método para marcar todas as notificações como lidas
  public void markAllAsRead(String username) {
    em.createQuery(
            "UPDATE NotificationEntity n SET n.read = true WHERE n.userId = :username"
    ).setParameter("username", username).executeUpdate();

    System.out.println("Notificações marcadas como lidas para o usuário: " + username);
  }

  public void saveNotification(NotificationEntity notification) {
    em.persist(notification); // Salva a notificação no banco de dados
  }
}
