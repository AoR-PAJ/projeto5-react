package aor.proj2.backendprojeto2.service;

import aor.proj2.backendprojeto2.bean.MyAccountBean;
import aor.proj2.backendprojeto2.dto.UserDto;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.List;

// Serviço REST para gerir as operações de conta do utilizador

@Path("/users")
public class MyAccountService {

    private static final Logger infoLogger = LogManager.getLogger("infoLogger");
    private static final Logger errorLogger = LogManager.getLogger("errorLogger");

    @Inject
    MyAccountBean myAccountBean;

    // 1.obter os dados de um utilizador pelo nome de utilizador
    @GET
    @Path("/{username}")
    @Produces(MediaType.APPLICATION_JSON) // Retorna os dados em formato JSON
    public Response getUser(@PathParam("username") String username) {
        infoLogger.info("Fetching user data for username: " + username);
        UserDto userDto = myAccountBean.getUser(username);

        if (userDto == null) {
            errorLogger.error("User not found: " + username);
            return Response.status(404).entity("User not found").build();
        }

        infoLogger.info("User data fetched successfully for username: " + username);
        return Response.status(200).entity(userDto).build();
    }

    //2.Atualiza os dados de um utilizador
    @PATCH
    @Path("/{username}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUser(
            UserDto userDto,
            @HeaderParam("Authorization") String authHeader,
            @PathParam("username") String username
    ) {
        infoLogger.info("Updating user data for username: " + username);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            errorLogger.error("Invalid or missing token for username: " + username);
            return Response.status(400).entity("Invalid or missing token").build();
        }

        String token = authHeader.substring("Bearer ".length());

        if (userDto == null) {
            errorLogger.error("User data missing from request for username: " + username);
            return Response.status(400).entity("User data missing from request").build();
        }

        try {
            boolean updated = myAccountBean.updateUserByTokenAndUsername(token, username, userDto);

            if (!updated) {
                errorLogger.error("Failed to authenticate or update user: " + username);
                return Response.status(404).entity("Failed to authenticate or update user").build();
            }

            // Retorna os dados atualizados
            UserDto updatedUser = myAccountBean.getUser(username);
            infoLogger.info("User updated successfully: " + username);
            return Response.status(200).entity(updatedUser).build();
        } catch (Exception e) {
            errorLogger.error("Error updating user: " + e.getMessage(), e);
            return Response.status(500).entity("Error updating user: " + e.getMessage()).build();
        }
    }

    //3.Inativar conta
    @PATCH
    @Path("/{username}/deactivate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response inativarConta(@PathParam("username") String username, @HeaderParam("Authorization") String authorizationHeader) {
        infoLogger.info("Request to deactivate account for username: " + username);

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            errorLogger.error("Invalid or missing Authorization header for username: " + username);
            return Response.status(Response.Status.UNAUTHORIZED).entity("Invalid or missing Authorization header").build();
        }

        try {
            boolean contaInativada = myAccountBean.inativarConta(username);

            if (contaInativada) {
                infoLogger.info("Account successfully deactivated for username: " + username);
                return Response.ok("Account successfully deactivated.").build();
            } else {
                errorLogger.error("Failed to deactivate account for username: " + username);
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Failed to deactivate account.").build();
            }
        } catch (Exception e) {
            errorLogger.error("Error deactivating account for username: " + username, e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Unexpected error occurred while deactivating account.").build();
        }
    }

    //4. Ativar conta
    @PATCH
    @Path("/{username}/activate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    public Response ativarConta(@PathParam("username") String username, @HeaderParam("Authorization") String authorizationHeader) {
        infoLogger.info("Request to activate account for username: " + username);

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            errorLogger.error("Invalid or missing Authorization header for username: " + username);
            return Response.status(Response.Status.UNAUTHORIZED).entity("Invalid or missing Authorization header").build();
        }

        try {
            boolean contaAtivada = myAccountBean.ativarConta(username);

            if (contaAtivada) {
                infoLogger.info("Account successfully activated for username: " + username);
                return Response.ok("Account successfully activated.").build();
            } else {
                errorLogger.error("Failed to activate account for username: " + username);
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Failed to activate account.").build();
            }
        } catch (Exception e) {
            errorLogger.error("Error activating account for username: " + username, e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Unexpected error occurred while activating account.").build();
        }
    }

    //5.lista todos os users com suporte a filtro dinamico
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response listUsers(
            @HeaderParam("Authorization") String authHeader,
            @QueryParam("search") String search) {
        infoLogger.info("Listing all users");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            errorLogger.error("Missing or invalid Authorization header");
            return Response.status(401).entity("Error: Missing or invalid Authorization header").build();
        }
        // Remove "Bearer " do início
        String token = authHeader.substring(7);

        UserDto loggedUser = myAccountBean.getUserByToken(token);
        if (loggedUser == null ) {
            errorLogger.error("Access denied for token: " + token);
            return Response.status(403).entity("Error: Access denied").build();
        }

        try {
            List<UserDto> users = myAccountBean.listUsers(search);
            infoLogger.info("Users listed successfully");
            return Response.status(200).entity(users).build();
        } catch (Exception e) {
            errorLogger.error("Error listing users: " + e.getMessage());
            return Response.status(500).entity("Error listing users: " + e.getMessage()).build();
        }
    }
}