package aor.proj2.backendprojeto2.bean;

import aor.proj2.backendprojeto2.dao.NotificationDao;
import aor.proj2.backendprojeto2.dto.NotificationDto;
import aor.proj2.backendprojeto2.entity.NotificationEntity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class NotificationBean {

  @Inject
  private NotificationDao notificationDao;

  public List<NotificationDto> getNotificationsByUserId(String userId) {
    List<NotificationEntity> notifications = notificationDao.getNotificationsByUserId(userId);
    return notifications.stream()
            .map(n -> new NotificationDto(n.getId(), n.getMessage(), n.isRead()))
            .collect(Collectors.toList());
  }

  public void markAllAsRead(String userId) {
    notificationDao.markAllAsRead(userId);
  }

  public void createNotification(String userId, String message) {
    NotificationEntity notification = new NotificationEntity(userId, message, false);
    notificationDao.saveNotification(notification);
  }
}
