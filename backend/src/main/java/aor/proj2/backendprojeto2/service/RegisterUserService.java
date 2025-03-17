package aor.proj2.backendprojeto2.service;

import aor.proj2.backendprojeto2.bean.RegisterUserBean;
import aor.proj2.backendprojeto2.dto.UserDto;
import aor.proj2.backendprojeto2.entity.UserEntity;
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

import java.time.LocalDate;

// o bean é criado no início da requisição e destruído automaticamente no final da requisição.
@RequestScoped
@Path("/users")
public class RegisterUserService {

  private static final Logger infoLogger = LogManager.getLogger("infoLogger");
  private static final Logger errorLogger = LogManager.getLogger("errorLogger");

    @Inject
    private RegisterUserBean registerUserBean;

    @Context
    private HttpServletRequest request;

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
            registerUserBean.registerUser(userDto);

            infoLogger.info("User registered successfully: " + userDto.getUsername());
            return Response.status(Response.Status.OK)
                    .entity("User registered successfully!")
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


    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(UserDto userDto) {
        UserEntity user = registerUserBean.getUserEntity(userDto.getUsername());
        if (user != null && "inativo".equalsIgnoreCase(user.getEstado())) {
            errorLogger.warn("Login failed for username: " + userDto.getUsername() + " - Account is inactive");
            return Response.status(403).entity("User account is inactive").build();
        }

        String token = registerUserBean.login(userDto.getUsername(), userDto.getPassword());
        if (token != null) {
            HttpSession session = request.getSession(true);
            session.setAttribute("user", userDto.getUsername());
            infoLogger.info("User '{}' logged in, Token generated.", userDto.getUsername());

            return Response.status(200).entity(token).build();
        }

        errorLogger.warn("Invalid credentials for user: " + userDto.getUsername());
        return Response.status(401).entity("Invalid credentials").build();
    }

    @GET
    @Path("/LoggedUser")
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
    }

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

    @DELETE
    @Path("/delete/{username}")
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

}