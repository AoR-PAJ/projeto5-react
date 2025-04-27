package aor.proj2.backendprojeto2.service;

import aor.proj2.backendprojeto2.bean.MyAccountBean;
import aor.proj2.backendprojeto2.bean.ProductBean;
import aor.proj2.backendprojeto2.dao.UserDao;
import aor.proj2.backendprojeto2.dto.UserDto;
import aor.proj2.backendprojeto2.entity.UserEntity;
import jakarta.inject.Inject;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

// Serviço REST para gerir as operações de conta do utilizador

@Path("/users")
public class MyAccountService {

    private static final Logger infoLogger = LogManager.getLogger("infoLogger");
    private static final Logger errorLogger = LogManager.getLogger("errorLogger");

    @Inject
    MyAccountBean myAccountBean;

    @Inject
    UserDao userDao;

    @Inject
    ProductBean productBean;

    @PersistenceContext
    EntityManager em;

    // 1.obter os dados de um utilizador pelo nome de utilizador
    @GET
    @Path("/{username}")
    @Produces(MediaType.APPLICATION_JSON) // Retorna os dados em formato JSON
    public Response getUser(@PathParam("username") String username, @HeaderParam("Authorization") String authorizationHeader) {
        String timestamp = LocalDateTime.now().toString();

        // Verificar se o token de autorização está presente
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer")) {
            errorLogger.error("[{}] Missing or invalid token while fetching user data for username: {}", timestamp, username);
            return Response.status(401).entity("Missing or invalid token").build();
        }

        String token = authorizationHeader.substring("Bearer ".length());
        UserEntity requester = userDao.findUserByToken(token);

        if (requester == null) {
            errorLogger.error("[{}] Invalid token: user not found while fetching data for username: {}", timestamp, username);
            return Response.status(401).entity("Invalid token").build();
        }

        infoLogger.info("[{}] User '{}' is fetching data for username: {}", timestamp, requester.getUsername(), username);

        UserDto userDto = myAccountBean.getUser(username);

        if (userDto == null) {
            errorLogger.error("[{}] User '{}' attempted to fetch data for a non-existent username: {}", timestamp, requester.getUsername(), username);
            return Response.status(404).entity("User not found").build();
        }

        infoLogger.info("[{}] User '{}' successfully fetched data for username: {}", timestamp, requester.getUsername(), username);
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
        String timestamp = LocalDateTime.now().toString();

        // Verificar se o token de autorização está presente
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            errorLogger.error("[{}] Invalid or missing token for username: {}", timestamp, username);
            return Response.status(400).entity("Invalid or missing token").build();
        }

        String token = authHeader.substring("Bearer ".length());

        // Verificar se os dados do usuário estão presentes
        if (userDto == null) {
            errorLogger.error("[{}] User data missing from request for username: {}", timestamp, username);
            return Response.status(400).entity("User data missing from request").build();
        }

        try {
            // Identificar o solicitante com base no token
            UserEntity requester = userDao.findUserByToken(token);
            if (requester == null) {
                errorLogger.error("[{}] Invalid token: user not found while updating data for username: {}", timestamp, username);
                return Response.status(401).entity("Invalid token").build();
            }

            infoLogger.info("[{}] User '{}' is attempting to update data for username: {}", timestamp, requester.getUsername(), username);

            // Atualizar os dados do usuário
            boolean updated = myAccountBean.updateUserByTokenAndUsername(token, username, userDto);

            if (!updated) {
                errorLogger.error("[{}] User '{}' failed to authenticate or update data for username: {}", timestamp, requester.getUsername(), username);
                return Response.status(404).entity("Failed to authenticate or update user").build();
            }

            // Retorna os dados atualizados
            UserDto updatedUser = myAccountBean.getUser(username);
            infoLogger.info("[{}] User '{}' successfully updated data for username: {}", timestamp, requester.getUsername(), username);
            return Response.status(200).entity(updatedUser).build();
        } catch (Exception e) {
            errorLogger.error("[{}] Error updating user '{}': {}", timestamp, username, e.getMessage(), e);
            return Response.status(500).entity("Error updating user: " + e.getMessage()).build();
        }
    }

    //3.Inativar conta
    @PATCH
    @Path("/{username}/deactivate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response inativarConta(@PathParam("username") String username, @HeaderParam("Authorization") String authorizationHeader) {
        String timestamp = LocalDateTime.now().toString();

        // Verificar se o cabeçalho de autorização está presente
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            errorLogger.error("[{}] Invalid or missing Authorization header for username: {}", timestamp, username);
            return Response.status(Response.Status.UNAUTHORIZED).entity("Invalid or missing Authorization header").build();
        }

        String token = authorizationHeader.substring("Bearer ".length());

        // Identificar o solicitante com base no token
        UserEntity requester = userDao.findUserByToken(token);
        if (requester == null) {
            errorLogger.error("[{}] Invalid token: user not found while attempting to deactivate account for username: {}", timestamp, username);
            return Response.status(Response.Status.UNAUTHORIZED).entity("Invalid token").build();
        }

        infoLogger.info("[{}] User '{}' is attempting to deactivate account for username: {}", timestamp, requester.getUsername(), username);

        try {
            boolean contaInativada = myAccountBean.inativarConta(username);

            if (contaInativada) {
                infoLogger.info("[{}] Account successfully deactivated for username: {}", timestamp, username);

                return Response.ok("Account successfully deactivated.").build();
            } else {
                errorLogger.error("[{}] Failed to deactivate account for username: {}", timestamp, username);
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Failed to deactivate account.").build();
            }
        } catch (Exception e) {
            errorLogger.error("[{}] Error deactivating account for username: {}", timestamp, username, e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Unexpected error occurred while deactivating account.").build();
        }
    }

    //4. Ativar conta
    @PATCH
    @Path("/{username}/activate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    public Response ativarConta(@PathParam("username") String username, @HeaderParam("Authorization") String authorizationHeader) {
        String timestamp = LocalDateTime.now().toString();

        // Verificar se o cabeçalho de autorização está presente
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            errorLogger.error("[{}] Invalid or missing Authorization header for username: {}", timestamp, username);
            return Response.status(Response.Status.UNAUTHORIZED).entity("Invalid or missing Authorization header").build();
        }

        String token = authorizationHeader.substring("Bearer ".length());

        // Identificar o solicitante com base no token
        UserEntity requester = userDao.findUserByToken(token);
        if (requester == null) {
            errorLogger.error("[{}] Invalid token: user not found while attempting to activate account for username: {}", timestamp, username);
            return Response.status(Response.Status.UNAUTHORIZED).entity("Invalid token").build();
        }

        infoLogger.info("[{}] User '{}' is attempting to activate account for username: {}", timestamp, requester.getUsername(), username);

        try {
            boolean contaAtivada = myAccountBean.ativarConta(username);

            if (contaAtivada) {
                infoLogger.info("[{}] Account successfully activated for username: {}", timestamp, username);

                return Response.ok("Account successfully activated.").build();
            } else {
                errorLogger.error("[{}] Failed to activate account for username: {}", timestamp, username);
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Failed to activate account.").build();
            }
        } catch (Exception e) {
            errorLogger.error("[{}] Error activating account for username: {}", timestamp, username, e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Unexpected error occurred while activating account.").build();
        }
    }

    //5.lista todos os users com suporte a filtro dinamico
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response listUsers(
            @HeaderParam("Authorization") String authHeader,
            @QueryParam("search") String search) {
        String timestamp = LocalDateTime.now().toString();

        infoLogger.info("[{}] Request to list users with search parameter: '{}'", timestamp, search);

        // Verificar se o cabeçalho de autorização está presente
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            errorLogger.error("[{}] Missing or invalid Authorization header", timestamp);
            return Response.status(401).entity("Error: Missing or invalid Authorization header").build();
        }

        // Remove "Bearer " do início
        String token = authHeader.substring(7);

        // Identificar o solicitante com base no token
        UserDto loggedUser = myAccountBean.getUserByToken(token);
        if (loggedUser == null) {
            errorLogger.error("[{}] Access denied for token: {}", timestamp, token);
            return Response.status(403).entity("Error: Access denied").build();
        }

        infoLogger.info("[{}] User '{}' is attempting to list users with search parameter: '{}'", timestamp, loggedUser.getUsername(), search);

        try {
            List<UserDto> users = myAccountBean.listUsers(search);
            infoLogger.info("[{}] User '{}' successfully listed {} users", timestamp, loggedUser.getUsername(), users.size());
            return Response.status(200).entity(users).build();
        } catch (Exception e) {
            errorLogger.error("[{}] Error listing users for user '{}': {}", timestamp, loggedUser.getUsername(), e.getMessage(), e);
            return Response.status(500).entity("Error listing users: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/registrations")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserRegistrationsOverTime() {
        try {
            List<Object[]> results = userDao.countUsersByDate();
            List<Map<String, Object>> response = new ArrayList<>();

            int cumulativeCount = 0; // Inicializa o contador cumulativo
            for (Object[] row : results) {
                cumulativeCount += ((Number) row[1]).intValue(); // Soma os registos do dia atual
                response.add(Map.of(
                        "date", row[0],
                        "cumulativeCount", cumulativeCount // Adiciona o valor cumulativo
                ));
            }

            return Response.ok(response).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao buscar registros de utilizadores").build();
        }
    }

    @GET
    @Path("/stats")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUsersWithProductStats(@QueryParam("page") int page, @QueryParam("size") @DefaultValue("10") int size) {
        System.out.println("banana");

        try {
            // Valida os parâmetros
            if (page < 1 || size < 1) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Os parâmetros 'page' e 'size' devem ser maiores que 0.")
                        .build();
            }

            int offset = (page - 1) * size;

            System.out.println("Page: " + page + ", Size: " + size);

            // Busca os usuários paginados
            List<UserEntity> users = em.createQuery(
                            "SELECT u FROM UserEntity u ORDER BY u.username ASC", UserEntity.class)
                    .setFirstResult(offset)
                    .setMaxResults(size)
                    .getResultList();

            System.out.println("Users Retrieved: " + users.size());

            // Calcula o total de usuários
            long totalUsers = em.createQuery("SELECT COUNT(u) FROM UserEntity u", Long.class).getSingleResult();

            // Verifica se há usuários
            if (totalUsers == 0) {
                Map<String, Object> response = new HashMap<>();
                response.put("users", Collections.emptyList());
                response.put("totalPages", 0);
                return Response.ok(response).build();
            }

            System.out.println("Total Users: " + totalUsers);


            // Calcula o número total de páginas
            int totalPages = (int) Math.ceil((double) totalUsers / size);

            // Monta as estatísticas dos usuários
            List<Map<String, Object>> userStats = users.stream().map(user -> {
                Map<String, Object> stats = new HashMap<>();
                stats.put("username", user.getUsername());
                stats.put("totalProducts", productBean.getTotalProducts(user.getUsername()));
                stats.put("draft", productBean.getProductsByState(user.getUsername(), "RASCUNHO"));
                stats.put("available", productBean.getProductsByState(user.getUsername(), "DISPONIVEL"));
                stats.put("reserved", productBean.getProductsByState(user.getUsername(), "RESERVADO"));
                stats.put("purchased", productBean.getProductsByState(user.getUsername(), "COMPRADO"));
                stats.put("published", productBean.getProductsByState(user.getUsername(), "PUBLICADO"));
                stats.put("inactive", productBean.getProductsByState(user.getUsername(), "INATIVO"));
                return stats;
            }).collect(Collectors.toList());

            // Monta a resposta
            Map<String, Object> response = new HashMap<>();
            response.put("users", userStats);
            response.put("totalPages", totalPages);

            return Response.ok(response).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao buscar estatísticas de usuários").build();
        }
    }

}