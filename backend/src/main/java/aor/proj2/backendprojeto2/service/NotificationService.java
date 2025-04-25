package aor.proj2.backendprojeto2.service;

import aor.proj2.backendprojeto2.dto.NotificationDto;
import aor.proj2.backendprojeto2.entity.NotificationEntity;
import aor.proj2.backendprojeto2.dao.NotificationDao;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.stream.Collectors;

@Path("/notifications")
public class NotificationService {

  @Inject
  private NotificationDao notificationDao;

  //1.Obter notificacoes
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response getNotifications() {
    try {
      // Simulação de um userId fixo
      String userId = "user123";

      // Busca as notificações do usuário
      List<NotificationEntity> notifications = notificationDao.getNotificationsByUserId(userId);

      // Converte as notificações para DTOs
      List<NotificationDto> notificationDTOs = notifications.stream()
              .map(n -> new NotificationDto(n.getId(), n.getMessage(), n.isRead()))
              .collect(Collectors.toList());

      return Response.ok(notificationDTOs).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
              .entity("Erro ao buscar notificações: " + e.getMessage())
              .build();
    }
  }

  //2.Marcar notificacoes como nao lidas
  @POST
  @Path("/mark-as-read")
  public Response markNotificationsAsRead() {
    try {
      // Simulação de um userId fixo
      String userId = "user123";

      // Marca todas as notificações do usuário como lidas
      notificationDao.markAllAsRead(userId);

      return Response.ok("Notificações marcadas como lidas").build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
              .entity("Erro ao marcar notificações como lidas: " + e.getMessage())
              .build();
    }
  }
}
