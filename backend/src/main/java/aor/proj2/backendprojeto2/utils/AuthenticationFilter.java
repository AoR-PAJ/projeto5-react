package aor.proj2.backendprojeto2.utils;

import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import aor.proj2.backendprojeto2.dao.UserDao;

import java.io.IOException;

@Provider
@Priority(1)
public class AuthenticationFilter implements ContainerRequestFilter {

  @Inject
  private UserDao userDao;

  @Override
  public void filter(ContainerRequestContext requestContext) throws IOException {
    String authorizationHeader = requestContext.getHeaderString("Authorization");

    if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
      abortWithUnauthorized(requestContext, "Token de autorização ausente ou inválido.");
      return;
    }

    String token = authorizationHeader.substring("Bearer ".length()).trim();

    // Verifica se o token é válido
    if (!isTokenValid(token)) {
      abortWithUnauthorized(requestContext, "Token expirado ou inválido.");
    }
  }

  private boolean isTokenValid(String token) {
    // Lógica para verificar se o token é válido (ex.: consultar o banco de dados)
    return userDao.isTokenValid(token);
  }

  private void abortWithUnauthorized(ContainerRequestContext requestContext, String message) {
    requestContext.abortWith(
            Response.status(Response.Status.UNAUTHORIZED)
                    .entity(message)
                    .build()
    );
  }
}
