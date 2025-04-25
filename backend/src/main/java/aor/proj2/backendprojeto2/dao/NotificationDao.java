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
  public List<NotificationEntity> getNotificationsByUserId(String userId) {
    return em.createQuery(
            "SELECT n FROM NotificationEntity n WHERE n.userId = :userId ORDER BY n.id DESC",
            NotificationEntity.class
    ).setParameter("userId", userId).getResultList();
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
