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

    // Endpoint para obter os dados de um utilizador pelo nome de utilizador
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

    //Atualiza os dados de um utilizador
    @POST
    @Path("/{username}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
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

            infoLogger.info("User updated successfully: " + username);
            return Response.status(200).entity("User updated successfully").build();
        } catch (Exception e) {
            errorLogger.error("Error updating user: " + e.getMessage(), e);
            return Response.status(500).entity("Error updating user: " + e.getMessage()).build();
        }
    }

    //lista todos os users
    @GET
    @Path("/list")
    @Produces(MediaType.APPLICATION_JSON)
    public Response listUsers(@HeaderParam("Authorization") String authHeader) {
        infoLogger.info("Listing all users");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            errorLogger.error("Missing or invalid Authorization header");
            return Response.status(401).entity("Error: Missing or invalid Authorization header").build();
        }

        String token = authHeader.substring(7); // Remove "Bearer " do início

        UserDto loggedUser = myAccountBean.getUserByToken(token);
        if (loggedUser == null || !loggedUser.getAdmin()) {
            errorLogger.error("Access denied for token: " + token);
            return Response.status(403).entity("Error: Access denied").build();
        }

        try {
            List<UserDto> users = myAccountBean.listUsers();
            infoLogger.info("Users listed successfully");
            return Response.status(200).entity(users).build();
        } catch (Exception e) {
            errorLogger.error("Error listing users: " + e.getMessage());
            return Response.status(500).entity("Error listing users: " + e.getMessage()).build();
        }
    }
}