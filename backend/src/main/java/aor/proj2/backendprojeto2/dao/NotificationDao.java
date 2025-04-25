package aor.proj2.backendprojeto2.dao;

import aor.proj2.backendprojeto2.entity.NotificationEntity;
import java.util.List;
import jakarta.ejb.Stateless;
@Stateless
public class NotificationDao extends AbstractDao<NotificationEntity> {

  public NotificationDao() {
    super(NotificationEntity.class); // Passa a classe da entidade para o AbstractDao
  }

  // Método para buscar notificações por ID do usuário
  // Método para buscar notificações com filtro
  public List<NotificationEntity> getNotificationsByUserId(String userId, boolean onlyUnread) {
    String query = "SELECT n FROM NotificationEntity n WHERE n.userId = :userId";
    if (onlyUnread) {
      query += " AND n.read = false"; // Adiciona o filtro para notificações não lidas
    }
    query += " ORDER BY n.id DESC"; // Ordena por ID em ordem decrescente

    return em.createQuery(query, NotificationEntity.class)
            .setParameter("userId", userId)
            .getResultList();
  }

  // Método para marcar todas as notificações como lidas
  public void markAllAsRead(String userId) {
    em.createQuery(
            "UPDATE NotificationEntity n SET n.read = true WHERE n.userId = :userId"
    ).setParameter("userId", userId).executeUpdate();
  }

  public void saveNotification(NotificationEntity notification) {
    em.persist(notification); // Salva a notificação no banco de dados
  }
}
