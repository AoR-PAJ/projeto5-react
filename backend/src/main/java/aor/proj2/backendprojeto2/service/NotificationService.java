package aor.proj2.backendprojeto2.service;

import aor.proj2.backendprojeto2.bean.NotificationBean;
import aor.proj2.backendprojeto2.dto.NotificationDto;
import aor.proj2.backendprojeto2.entity.NotificationEntity;
import aor.proj2.backendprojeto2.dao.NotificationDao;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Path("/notifications")
public class NotificationService {

  @Inject
  private NotificationDao notificationDao;

  @Inject
  private NotificationBean notificationBean;

  private static final Logger infoLogger = LogManager.getLogger("infoLogger");
  private static final Logger errorLogger = LogManager.getLogger("errorLogger");

  //1.Obter notificacoes
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response getNotifications(@QueryParam("userId") String userId,
                                   @QueryParam("read") boolean read) {
    String timestamp = LocalDateTime.now().toString();

    infoLogger.info("[{}] Request to fetch notifications for userId: '{}', read: {}", timestamp, userId, read);

    try {
      // Busca as notificações do usuário
      List<NotificationEntity> notifications = notificationDao.getNotificationsByUserId(userId, read);

      // Converte as notificações para DTOs
      List<NotificationDto> notificationDTOs = notifications.stream()
              .map(n -> new NotificationDto(n.getId(), n.getUserId(), n.getMessage(), n.isRead()))
              .collect(Collectors.toList());

      infoLogger.info("[{}] Successfully fetched {} notifications for userId: '{}', read: {}", timestamp, notificationDTOs.size(), userId, read);
      return Response.ok(notificationDTOs).build();
    } catch (Exception e) {
      errorLogger.error("[{}] Error fetching notifications for userId: '{}', read: {}: {}", timestamp, userId, read, e.getMessage(), e);
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
              .entity("Erro ao buscar notificações: " + e.getMessage())
              .build();
    }
  }

  //2.Cria uma notificacao
  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response createNotification(NotificationDto notificationDto) {
    String timestamp = LocalDateTime.now().toString();

    infoLogger.info("[{}] Request to create notification for userId: '{}', message: '{}'", timestamp, notificationDto.getUserId(), notificationDto.getMessage());

    try {
      // Cria a notificação usando o NotificationBean
      notificationBean.createNotification(notificationDto.getUserId(), notificationDto.getMessage());
      infoLogger.info("[{}] Notification successfully created for userId: '{}'", timestamp, notificationDto.getUserId());
      return Response.ok("Notificação criada com sucesso").build();
    } catch (Exception e) {
      errorLogger.error("[{}] Error creating notification for userId: '{}': {}", timestamp, notificationDto.getUserId(), e.getMessage(), e);
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
              .entity("Erro ao criar notificação: " + e.getMessage())
              .build();
    }
  }

  //3.Marcar notificacoes como nao lidas
  @POST
  @Path("{username}/mark-as-read")
  public Response markNotificationsAsRead(@PathParam("username") String username) {
    String timestamp = LocalDateTime.now().toString();

    infoLogger.info("[{}] Request to mark all notifications as read for username: '{}'", timestamp, username);

    try {
      if (username == null || username.isEmpty()) {
        errorLogger.error("[{}] Missing or empty 'username' parameter in request to mark notifications as read.", timestamp);
        return Response.status(Response.Status.BAD_REQUEST)
                .entity("O parâmetro 'username' é obrigatório.")
                .build();
      }

      // Marca todas as notificações do usuário como lidas
      notificationDao.markAllAsRead(username);

      infoLogger.info("[{}] Successfully marked all notifications as read for username: '{}'", timestamp, username);
      return Response.ok("Notificações marcadas como lidas").build();
    } catch (Exception e) {
      errorLogger.error("[{}] Error marking notifications as read for username: '{}': {}", timestamp, username, e.getMessage(), e);
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
              .entity("Erro ao marcar notificações como lidas: " + e.getMessage())
              .build();
    }
  }
}
