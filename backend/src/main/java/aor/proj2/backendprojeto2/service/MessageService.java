package aor.proj2.backendprojeto2.service;

import aor.proj2.backendprojeto2.bean.MessageBean;
import aor.proj2.backendprojeto2.dto.MessageDto;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Path("/messages")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MessageService {

  @Inject
  private MessageBean messageBean;

  private EntityManager em;

  private static final Logger infoLogger = LogManager.getLogger("infoLogger");
  private static final Logger errorLogger = LogManager.getLogger("errorLogger");


  // 1.Cria uma nova mensagem
  @POST
  public Response createMessage(MessageDto messageDto) {
    String timestamp = LocalDateTime.now().toString();
    infoLogger.info("[{}] Received request to create message: {}", timestamp, messageDto);

    try {
      messageBean.createMessage(messageDto.getSender(), messageDto.getReceiver(), messageDto.getContent());
      infoLogger.info("[{}] Message created successfully: {}", timestamp, messageDto);
      return Response.status(Response.Status.CREATED)
              .entity(Map.of("message", "Message created successfully"))
              .build();
    } catch (IllegalArgumentException e) {
      errorLogger.error("[{}] Invalid input for creating message: {}", timestamp, e.getMessage(), e);
      return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
    } catch (Exception e) {
      errorLogger.error("[{}] Error creating message: {}", timestamp, e.getMessage(), e);
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error creating message").build();
    }
  }

  // 2.Busca mensagens trocadas entre 2 users
  @GET
  public Response getMessages(@QueryParam("user1") String user1, @QueryParam("user2") String user2) {
    String timestamp = LocalDateTime.now().toString();
    infoLogger.info("[{}] Received request to fetch messages between users: user1={}, user2={}", timestamp, user1, user2);

    try {
      List<MessageDto> messages = messageBean.getMessagesBetweenUsers(user1, user2);
      infoLogger.info("[{}] Successfully fetched {} messages between users: user1={}, user2={}", timestamp, messages.size(), user1, user2);
      return Response.ok(messages).build();
    } catch (Exception e) {
      errorLogger.error("[{}] Error fetching messages between users: user1={}, user2={}: {}", timestamp, user1, user2, e.getMessage(), e);
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error fetching messages").build();
    }
  }

  //3.Marca mensagens como lidas
  @PATCH
  @Path("/mark-as-read")
  public Response markMessagesAsRead(@QueryParam("sender") String sender, @QueryParam("receiver") String receiver) {
    String timestamp = LocalDateTime.now().toString();
    infoLogger.info("[{}] Received request to mark messages as read: sender={}, receiver={}", timestamp, sender, receiver);

    try {
      messageBean.markMessagesAsRead(sender, receiver);
      infoLogger.info("[{}] Messages marked as read: sender={}, receiver={}", timestamp, sender, receiver);
      return Response.ok(Map.of("message", "Messages marked as read")).build();
    } catch (Exception e) {
      errorLogger.error("[{}] Error marking messages as read: sender={}, receiver={}: {}", timestamp, sender, receiver, e.getMessage(), e);
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error marking messages as read").build();
    }
  }

  //4. Busca as mensagens nao lidas de um user
  @GET
  @Path("/unread-count")
  public Response getUnreadMessageCounts(@QueryParam("receiver") String receiver) {
    String timestamp = LocalDateTime.now().toString();
    infoLogger.info("[{}] Received request to fetch unread message counts for user: {}", timestamp, receiver);

    try {
      List<Object[]> unreadCounts = em.createQuery(
                      "SELECT m.sender.username, COUNT(m) " +
                              "FROM MessageEntity m " +
                              "WHERE m.receiver.username = :receiver AND m.read = false " +
                              "GROUP BY m.sender.username", Object[].class)
              .setParameter("receiver", receiver)
              .getResultList();

      // Converte o resultado para um mapa de { remetente: quantidade }
      Map<String, Long> unreadCountMap = unreadCounts.stream()
              .collect(Collectors.toMap(
                      result -> (String) result[0], // Nome do remetente
                      result -> (Long) result[1]    // Contagem de mensagens não lidas
              ));

      infoLogger.info("[{}] Successfully fetched unread message counts for user: {}", timestamp, receiver);
      return Response.ok(unreadCountMap).build();
    } catch (Exception e) {
      errorLogger.error("[{}] Error fetching unread message counts for user: {}: {}", timestamp, receiver, e.getMessage(), e);
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error fetching unread message counts").build();
    }
  }

}
