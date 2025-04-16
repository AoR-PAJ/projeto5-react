package aor.proj2.backendprojeto2.service;

import aor.proj2.backendprojeto2.bean.RegisterUserBean;
import aor.proj2.backendprojeto2.dao.SettingsDao;
import aor.proj2.backendprojeto2.dao.UserDao;
import aor.proj2.backendprojeto2.dto.UserDto;
import aor.proj2.backendprojeto2.entity.UserEntity;
import aor.proj2.backendprojeto2.websockets.UserStatsWebSocket;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;

// o bean é criado no início da requisição e destruído automaticamente no final da requisição.
@RequestScoped
@Path("/auth")
public class RegisterUserService {

  private static final Logger infoLogger = LogManager.getLogger("infoLogger");
  private static final Logger errorLogger = LogManager.getLogger("errorLogger");
  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  @Inject
  private RegisterUserBean registerUserBean;

  @Inject
  UserDao userDao;

  @Inject
  SettingsDao settingsDao;

  @Context
  private HttpServletRequest request;

  //1. Registar um user
  @POST
  @Path("/register")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response register(UserDto userDto) {
    try {
      infoLogger.info("Registering new user: " + userDto.getUsername());
      if (userDto.getUsername() == null || userDto.getPassword() == null || userDto.getEmail() == null) {
        errorLogger.error("Missing mandatory fields for user: " + userDto.getUsername());
        return Response.status(Response.Status.BAD_REQUEST)
                .entity("Missing mandatory fields: username, password, or email.")
                .build();
      }

      userDto.setDataCriacao(LocalDate.now());
      UserEntity user= registerUserBean.registerUser(userDto);

      String verificationToken = user.getVerificationToken();

      infoLogger.info("User registered successfully: " + userDto.getUsername());

      // Atualizar as estatísticas de utilizadores
      updateUserStats();

      return Response.status(Response.Status.OK)
              .entity(verificationToken)
              .build();
    } catch (IllegalArgumentException e) {
      errorLogger.error("Error registering user: " + e.getMessage());
      return Response.status(Response.Status.BAD_REQUEST)
              .entity(e.getMessage())
              .build();
    } catch (Exception e) {
      errorLogger.error("Unexpected error occurred while registering user: " + e.getMessage());
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
              .entity("Unexpected error occurred.")
              .build();
    }
  }

  //2.Torna o estado de uma conta para verificada
  @GET
  @Path("/verifyAccount")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response verifyAccount(@QueryParam("token") String token) {
    try {
      infoLogger.info("Verifying user account with token: " + token);

      // Encontre o usuário pelo token de verificação
      UserEntity user = userDao.findUserByVerificationToken(token);

      if (user == null) {
        errorLogger.error("Invalid verification token.");
        return Response.status(Response.Status.BAD_REQUEST)
                .entity("Token inválido ou expirado.")
                .build();
      }

      // Verifique se o token expirou
      if (user.getTokenExpiration().isBefore(LocalDateTime.now())) {
        errorLogger.error("Verification token expired.");
        return Response.status(Response.Status.BAD_REQUEST)
                .entity("Token de verificação expirado.")
                .build();
      }

      // Altere o estado do usuário para "verificado"
      user.setVerified(true);
      user.setVerificationToken(null); // Limpa o token após a verificação
      userDao.merge(user);

      infoLogger.info("User account verified successfully.");
      return Response.status(Response.Status.OK)
              .entity("Conta verificada com sucesso!")
              .build();

    } catch (Exception e) {
      errorLogger.error("Error during account verification: " + e.getMessage());
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
              .entity("Erro inesperado durante a verificação.")
              .build();
    }
  }

  //3.Verifica se um user tem a conta verificada
  @GET
  @Path("/verifyUser")
  @Produces(MediaType.APPLICATION_JSON)
  public Response checkUserVerified(@QueryParam("username") String username) {
    try {
      boolean isVerified = userDao.isUserVerified(username);

      if (isVerified) {
        infoLogger.info("User {} has a verified account", username);
        return Response.status(Response.Status.OK).entity("Usuário verificado").build();
      } else {
        errorLogger.error("User {} dosent have a verified account", username);
        return Response.status(Response.Status.FORBIDDEN).entity("Conta não verificada").build();
      }

    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao verificar usuário").build();
    }
  }

  //4. Realiza login
  @POST
  @Path("/login")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response login(UserDto userDto) {
    UserEntity user = registerUserBean.getUserEntity(userDto.getUsername());

    // Verificar se a conta está inativa
    if (user != null && "inativo".equalsIgnoreCase(user.getEstado())) {
      errorLogger.warn("Login failed for username: " + userDto.getUsername() + " - Account is inactive");
      return Response.status(403).entity(Map.of("message", "User account is inactive")).build();
    }

    // Verificar se a conta não está verificada
    if (user != null && Boolean.FALSE.equals(user.getIsVerified())) {
      errorLogger.error("User '{}' tried to login with a not verified account", userDto.getUsername());
      return Response.status(403).entity(Map.of("message", "User account not verified")).build();
    }

    // Realizar o login e gerar o token
    String token = registerUserBean.login(userDto.getUsername(), userDto.getPassword());
    if (token != null) {
      // Obter o tempo de expiração da sessão da tabela de configurações
      int sessionExpirationMinutes = settingsDao.getSessionExpirationMinutes();

      // Criar a sessão HTTP
      HttpSession session = request.getSession(true);
      session.setAttribute("user", userDto.getUsername());
      infoLogger.info("User '{}' logged in, Token generated.", userDto.getUsername());

      // Retornar o token e o tempo de expiração
      return Response.status(200).entity(Map.of(
              "token", token,
              "sessionExpirationMinutes", sessionExpirationMinutes,
              "isVerified", user.getIsVerified(),
              "isActive", !"inativo".equalsIgnoreCase(user.getEstado()),
              "admin", user.getAdmin()
      )).build();
    }

    // Credenciais inválidas
    errorLogger.warn("Invalid credentials for user: " + userDto.getUsername());
    return Response.status(401).entity(Map.of("message", "Invalid credentials")).build();
  }

  //5.Realiza logout
  @POST
  @Path("/logout")
  public Response logout(@HeaderParam("Authorization") String token) {

    if (token == null || token.isEmpty()) {
      errorLogger.warn("Token ausente ou inválido no cabeçalho Authorization.");
      return Response.status(400).entity("Token ausente ou inválido").build();
    }

    if (token != null && token.startsWith("Bearer ")) {
      token = token.replace("Bearer ", "").trim();
    }

    if (registerUserBean.logout(token)) {
      HttpSession session = request.getSession(false);
      if (session != null) {
        session.invalidate();
        infoLogger.info("Session invalidated.");
      }
      return Response.status(200).entity("Logout successful").build();
    }
    errorLogger.warn("Invalid or expired token for logout.");
    return Response.status(401).entity("Invalid or expired token").build();
  }

  //6.Cria o token para alteracao de password e gera o link que permitirá acessar a página para alteracao de password
  @POST
  @Path("/resetPassword")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response resetPassword(Map<String, String> request) {
    if (request == null || !request.containsKey("username")) {
      return Response.status(Response.Status.BAD_REQUEST)
              .entity(Map.of("message", "Um e-mail foi enviado com as instruções para redefinir sua senha."))
              .build();
    }

    String username = request.get("username");
    infoLogger.info("{} tried to change password" ,username);

    try {
      // Verificar se o usuário existe no banco de dados
      UserEntity user = userDao.findUserByUsername(username);
      if (user != null) {
        // Gerar um token único para redefinição de senha
        String resetToken = generateNewToken();
        user.setAlterationPasswordToken(resetToken);
        user.setAlterationTokenExpiration(LocalDateTime.now().plusHours(1)); // Token válido por 1 hora
        userDao.merge(user);

        // Gerar o link para redefinição de senha
        String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;

        // Exibir o link no console do IntelliJ
        System.out.println("Link para redefinição de senha: " + resetLink);
      }

      // Retornar uma mensagem genérica, mesmo que o usuário não exista
      return Response.status(Response.Status.OK)
              .entity(Map.of("message", "Um e-mail foi enviado com as instruções para redefinir sua senha."))
              .build();
    } catch (Exception e) {
      e.printStackTrace();
      errorLogger.error("Error trying to change password");
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
              .entity(Map.of("message", "Erro ao processar o pedido."))
              .build();
    }
  }

  //7.altera a password do user, encripta e salva no banco de dados
  @POST
  @Path("/updatePassword")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response updatePassword(Map<String, String> request) {
    if (request == null || !request.containsKey("token") || !request.containsKey("password")) {
      return Response.status(Response.Status.BAD_REQUEST)
              .entity(Map.of("message", "O corpo da requisição está vazio ou inválido."))
              .build();
    }

    String token = request.get("token");
    String newPassword = request.get("password");

    try {
      // Verificar se o token é válido
      UserEntity user = userDao.findUserByAlterationPasswordToken(token);
      if (user == null) {
        return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("message", "Token inválido ou expirado."))
                .build();
      }

      // Verificar se o token expirou
      if (user.getAlterationTokenExpiration().isBefore(LocalDateTime.now())) {
        return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of("message", "Token expirado."))
                .build();
      }

      // Verificar se o usuário tem a conta verificada
      if (!user.isVerified()) {
        return Response.status(Response.Status.FORBIDDEN)
                .entity(Map.of("message", "Conta não verificada."))
                .build();
      }

      //Encriptando a senha
      String encodedPassword = passwordEncoder.encode(newPassword);

      // Atualizar a senha do usuário
      user.setPassword(encodedPassword);
      user.setAlterationPasswordToken(null);
      user.setAlterationTokenExpiration(null);
      userDao.merge(user);

      return Response.status(Response.Status.OK)
              .entity(Map.of("message", "Senha redefinida com sucesso!"))
              .build();
    } catch (Exception e) {
      e.printStackTrace();
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
              .entity(Map.of("message", "Erro ao processar o pedido."))
              .build();
    }
  }

  //8. apaga definitivamente um user
  @DELETE
  @Path("/{username}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response deleteUser(@PathParam("username") String username) {
    infoLogger.info("Received request to delete user: {}", username);
    boolean isDeleted = registerUserBean.deleteUser(username);
    if (isDeleted) {
      infoLogger.info("User '{}' successfully deleted.", username);
      return Response.status(Response.Status.OK).entity("User successfully deleted.").build();
    } else {
      errorLogger.warn("User '{}' not found for deletion.", username);
      return Response.status(Response.Status.NOT_FOUND).entity("User not found.").build();
    }
  }

  //WEBSOCKETS

  // Método para atualizar estatísticas
  private void updateUserStats() {
    // Obter o número total de utilizadores
    int totalUsers = userDao.countAllUsers();

    // Obter o número de utilizadores verificados
    int verifiedUsers = userDao.countVerifiedUsers();

    // Calcular o número de utilizadores não verificados
    int unverifiedUsers = totalUsers - verifiedUsers;

    // Criar uma mensagem JSON com as estatísticas
    String statsMessage = String.format("{\"total\": %d, \"verified\": %d, \"unverified\": %d}",
            totalUsers, verifiedUsers, unverifiedUsers);

    // Enviar a mensagem para os clientes conectados via WebSocket
    UserStatsWebSocket.broadcastStats(totalUsers, verifiedUsers, unverifiedUsers);
  }

  /*@GET
  @Path("/me")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getLoggedUser() {
    HttpSession session = request.getSession(false);
    if (session != null) {
      String username = (String) session.getAttribute("user");
      infoLogger.info("Session ID: {}, Username in session: {}", session.getId(), username);
      if (username != null) {
        UserDto userDto = registerUserBean.getUser(username);
        if (userDto != null) {
          return Response.ok(userDto).build();
        }
      }
    }
    errorLogger.warn("No authenticated user found.");
    return Response.status(401).entity("No authenticated user").build();
  }*/


  // Método para gerar um novo token
  private String generateNewToken() {
    SecureRandom secureRandom = new SecureRandom();
    Base64.Encoder base64Encoder = Base64.getUrlEncoder();
    byte[] randomBytes = new byte[24];
    secureRandom.nextBytes(randomBytes);
    return base64Encoder.encodeToString(randomBytes);
  }


}