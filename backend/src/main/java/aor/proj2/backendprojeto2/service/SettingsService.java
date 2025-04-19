package aor.proj2.backendprojeto2.service;

import aor.proj2.backendprojeto2.bean.SettingsBean;
import aor.proj2.backendprojeto2.dao.SettingsDao;
import aor.proj2.backendprojeto2.dao.UserDao;
import aor.proj2.backendprojeto2.entity.UserEntity;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.LocalDateTime;

@Path("/settings")
public class SettingsService {
  @Inject
  private SettingsBean settingsBean;

  @Inject
  UserDao userDao;

  @Inject
  SettingsDao settingsDao;

  private static final Logger infoLogger = LogManager.getLogger("infoLogger");
  private static final Logger errorLogger = LogManager.getLogger("errorLogger");

  @PUT
  @Path("/session-expiration")
  public Response updateSessionExpiration(@QueryParam("minutes") int minutes, @HeaderParam("Authorization") String authorizationHeader) {
    String timestamp = LocalDateTime.now().toString();
    //valida o tempo informado
    if (minutes <= 0) {
      errorLogger.error("[{}] - Tried to change the session expiration to a time equals or less than 0.", timestamp);
      return Response.status(Response.Status.BAD_REQUEST)
              .entity("O tempo de expiração deve ser maior que zero.")
              .build();
    }

    //verificacao do token
    if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
      errorLogger.error("[{}] - Authorization token is missing or invalid.", timestamp);
      return Response.status(Response.Status.UNAUTHORIZED)
              .entity("Token de autorização ausente ou inválido.")
              .build();
    }

    String token = authorizationHeader.substring("Bearer ".length());

    // Verificar o status do usuário pelo token
    Object[] userStatus = userDao.checkUserStatusByToken(token);

    if (userStatus == null) {
      errorLogger.error("[{}] - Tried to change session expiration by a user with no token.", timestamp);
      return Response.status(Response.Status.UNAUTHORIZED)
              .entity("Token inválido ou usuário não encontrado.")
              .build();
    }

    boolean isAdmin = (boolean) userStatus[0];
    boolean isVerified = (boolean) userStatus[1];
    String estado = (String) userStatus[2];

    if (!isAdmin || !isVerified || !"ativo".equalsIgnoreCase(estado)) {
      errorLogger.error("[{}] - Unauthorized user tried to change session expiration. Admin: {}, Verified: {}, State: {}.",
              timestamp, isAdmin, isVerified, estado);
      return Response.status(Response.Status.FORBIDDEN)
              .entity("Acesso negado. Usuário não autorizado.")
              .build();
    }

    //realiza o servico
    try {
      settingsBean.changeSessionExpiration(minutes); // Atualiza o registro com ID 1
      infoLogger.info("[{}] - Session timeout changed to {} minutes by an admin user.", timestamp, minutes);
      return Response.ok("Tempo de expiração da sessão atualizado com sucesso.").build();
    } catch (Exception e) {
      errorLogger.error("[{}] - Error trying to change the session expiration time: {}", timestamp, e.getMessage(), e);
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
              .entity("Erro ao atualizar o tempo de expiração da sessão: " + e.getMessage())
              .build();
    }
  }

  @GET
  @Path("session-expiration")
  public Response getSessionExpiration() {
    String timestamp = LocalDateTime.now().toString();
    infoLogger.info("[{}] - Retrieving session expiration time.", timestamp);
    try {
      int sessionExpirationMinutes = settingsDao.getSessionExpirationMinutes();

      return Response.ok()
              .entity("{\"sessionExpirationMinutes\": " + sessionExpirationMinutes + "}")
              .build();
    } catch(Exception e) {
      errorLogger.error("[{}] - Error while retrieving session expiration time: {}", timestamp, e.getMessage(), e);
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
              .entity("{\"error\": \"Erro ao obter o valor de sessionExpiration.\"}")
              .build();
    }
  }
}
