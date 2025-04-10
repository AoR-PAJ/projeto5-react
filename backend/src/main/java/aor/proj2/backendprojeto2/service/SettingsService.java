package aor.proj2.backendprojeto2.service;

import aor.proj2.backendprojeto2.bean.SettingsBean;
import jakarta.inject.Inject;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Path("/settings")
public class SettingsService {
  @Inject
  private SettingsBean settingsBean;

  private static final Logger infoLogger = LogManager.getLogger("infoLogger");
  private static final Logger errorLogger = LogManager.getLogger("errorLogger");

  @PUT
  @Path("/session-expiration")
  public Response updateSessionExpiration(@QueryParam("minutes") int minutes) {
    if (minutes <= 0) {
      errorLogger.error("Tried to change the session expiration to a time equals or less than 0");
      return Response.status(Response.Status.BAD_REQUEST)
              .entity("O tempo de expiração deve ser maior que zero.")
              .build();
    }

    try {
      settingsBean.changeSessionExpiration(minutes); // Atualiza o registro com ID 1
      infoLogger.info("Session timeout changed to {} minutes", minutes);
      return Response.ok("Tempo de expiração da sessão atualizado com sucesso.").build();
    } catch (Exception e) {
      errorLogger.error("Error trying to change the session expiration time");
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
              .entity("Erro ao atualizar o tempo de expiração da sessão: " + e.getMessage())
              .build();
    }
  }
}
