package aor.proj2.backendprojeto2.service;

import aor.proj2.backendprojeto2.bean.MyAccountBean;
import aor.proj2.backendprojeto2.bean.ProductBean;
import aor.proj2.backendprojeto2.dao.ProductDao;
import aor.proj2.backendprojeto2.dao.UserDao;
import aor.proj2.backendprojeto2.dto.Product;
import aor.proj2.backendprojeto2.entity.UserEntity;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Path("/users")
public class UserProductService {
    private static final Logger infoLogger = LogManager.getLogger("infoLogger");
    private static final Logger errorLogger = LogManager.getLogger("errorLogger");

    @Inject
    ProductBean productBean;

    @Inject
    MyAccountBean myAccountBean;

    @Inject
    ProductDao productDao;

    @Inject
    UserDao userDao;

    //organizandos os servicos:

    //1.obter produtos de um user
    @GET
    @Path("/{username}/products")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserProducts(@PathParam("username") String paramUser, @HeaderParam("Authorization") String authorizationHeader) {
        String timestamp = LocalDateTime.now().toString();

        infoLogger.info("[{}] Request to fetch products for user: '{}'", timestamp, paramUser);

        try {
            // Valida o token de autorização
            String tokenValidationResponse = productBean.validateAuthorizationToken(authorizationHeader, paramUser);
            if (tokenValidationResponse != null) {
                errorLogger.error("[{}] Invalid token for user: '{}'", timestamp, paramUser);
                return Response.status(401).entity(tokenValidationResponse).build(); // Retorna erro de autenticação caso o token seja inválido
            }

            // Busca os produtos do usuário
            List<Product> products = productBean.getUserProducts(authorizationHeader.substring("Bearer ".length()), paramUser);

            infoLogger.info("[{}] Successfully fetched {} products for user: '{}'", timestamp, products.size(), paramUser);
            return Response.ok(products).build();
        } catch (Exception e) {
            errorLogger.error("[{}] Error fetching products for user '{}': {}", timestamp, paramUser, e.getMessage(), e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao buscar produtos do usuário.").build();
        }
    }


    //2.obter estatisticas dos produtos de um user
    @GET
    @Path("/{username}/products/stats")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserProductStats(@PathParam("username") String username) {
        String timestamp = LocalDateTime.now().toString();

        infoLogger.info("[{}] Request to fetch product statistics for user: '{}'", timestamp, username);

        try {
            int total = productBean.getTotalProducts(username);
            int draft = productBean.getProductsByState(username, "RASCUNHO");
            int published = productBean.getProductsByState(username, "PUBLICADO");
            int reserved = productBean.getProductsByState(username, "RESERVADO");
            int purchased = productBean.getProductsByState(username, "COMPRADO");
            int inactive = productBean.getProductsByState(username, "INATIVO");
            int available = productBean.getProductsByState(username, "DISPONIVEL");

            infoLogger.info("[{}] Successfully fetched product statistics for user '{}': Total: {}, Draft: {}, Published: {}, Reserved: {}, Purchased: {}, Inactive: {}, Available: {}",
                    timestamp, username, total, draft, published, reserved, purchased, inactive, available);

            return Response.ok(Map.of(
                    "total", total,
                    "draft", draft,
                    "published", published,
                    "reserved", reserved,
                    "purchased", purchased,
                    "inactive", inactive,
                    "available", available
            )).build();
        } catch (Exception e) {
            errorLogger.error("[{}] Error fetching product statistics for user '{}': {}", timestamp, username, e.getMessage(), e);
            return Response.status(500).entity("{\"message\": \"Erro interno no servidor.\"}").build();
        }
    }

    //3.obter um produto esspecifico de um user
    @GET
    @Path("/{username}/products/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProductDetails(@PathParam("id") int id) {
        String timestamp = LocalDateTime.now().toString();

        infoLogger.info("[{}] Request to fetch product details for product ID: {}", timestamp, id);

        try {
            Product product = productBean.getProduct(id);

            if (product == null) {
                errorLogger.warn("[{}] Product with ID '{}' not found.", timestamp, id);
                return Response.status(Response.Status.NOT_FOUND).entity("{\"error\": \"Produto não encontrado.\"}").build();
            }

            infoLogger.info("[{}] Product with ID '{}' retrieved successfully.", timestamp, id);
            return Response.ok(product).build();
        } catch (Exception e) {
            errorLogger.error("[{}] Error fetching product details for product ID '{}': {}", timestamp, id, e.getMessage(), e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("{\"error\": \"Erro interno no servidor.\"}").build();
        }
    }


    //4.adicionar um produto a um user
    @POST
    @Path("/{username}/products")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addProduct(Product product, @PathParam("username") String username, @HeaderParam("Authorization") String authorizationHeader) {
        String timestamp = LocalDateTime.now().toString();

        infoLogger.info("[{}] Request to add a new product for user: '{}', Product Title: '{}'", timestamp, username, product.getTitle());

        try {
            // Valida o token de autorização
            String tokenValidationResponse = productBean.validateAuthorizationToken(authorizationHeader, username);
            if (tokenValidationResponse != null) {
                errorLogger.error("[{}] Invalid token for user: '{}'", timestamp, username);
                return Response.status(401).entity(tokenValidationResponse).build();
            }

            String token = authorizationHeader.substring("Bearer ".length()); // Extrai o token do cabeçalho de autorização

            // Adiciona o produto
            boolean added = productBean.addProduct(product, token);
            if (!added) {
                errorLogger.error("[{}] Failed to create product: '{}' for user: '{}'", timestamp, product.getTitle(), username);
                return Response.status(400).entity("Failed to create product").build();
            } else {
                infoLogger.info("[{}] A new product was created: '{}' for user: '{}'", timestamp, product.getTitle(), username);
                return Response.status(200).entity("A new product was created").build();
            }
        } catch (Exception e) {
            errorLogger.error("[{}] Error creating product '{}' for user '{}': {}", timestamp, product.getTitle(), username, e.getMessage(), e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao criar produto").build();
        }
    }

    //5.atualizar um produto especifico de um user
    @PUT
    @Path("/{username}/products/{productId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateProduct(@PathParam("username") String paramUser, @PathParam("productId") int productId,
                                  @HeaderParam("Authorization") String authorizationHeader, Product updatedData) {
        String timestamp = LocalDateTime.now().toString();

        infoLogger.info("[{}] Request to update product with ID '{}' for user: '{}'", timestamp, productId, paramUser);

        try {
            // Valida o token de autorização
            String tokenValidationResponse = productBean.validateAuthorizationToken(authorizationHeader, paramUser);
            if (tokenValidationResponse != null) {
                errorLogger.error("[{}] Invalid token for user: '{}'", timestamp, paramUser);
                return Response.status(401).entity(tokenValidationResponse).build();
            }

            // Atualiza o produto
            boolean updated = productBean.updateProduct(authorizationHeader.substring("Bearer ".length()), productId, updatedData);

            if (!updated) {
                errorLogger.error("[{}] Failed to update product with ID '{}' for user: '{}'", timestamp, productId, paramUser);
                return Response.status(400).entity("Failed to update product").build();
            }

            infoLogger.info("[{}] Product with ID '{}' updated successfully for user: '{}'", timestamp, productId, paramUser);
            return Response.status(200).entity("Product updated successfully").build();
        } catch (Exception e) {
            errorLogger.error("[{}] Error updating product with ID '{}' for user '{}': {}", timestamp, productId, paramUser, e.getMessage(), e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao atualizar produto").build();
        }
    }

    //6.alterar o estado de um produto
    @PUT
    @Path("/{username}/products/{productId}/{estado}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response alterProductState(@PathParam("estado") String estado,
                                      @PathParam("productId") Long productId,
                                      @PathParam("username") String username,
                                      @HeaderParam("Authorization") String authorizationHeader) {
        String timestamp = LocalDateTime.now().toString();

        infoLogger.info("[{}] Request to alter product state. User: '{}', Product ID: '{}', New State: '{}'",
                timestamp, username, productId, estado);

        try {
            // Valida o token de autorização
            String tokenValidationResponse = productBean.validateAuthorizationToken(authorizationHeader, username);
            if (tokenValidationResponse != null) {
                errorLogger.error("[{}] Invalid token for user: '{}'", timestamp, username);
                return Response.status(401).entity(tokenValidationResponse).build();
            }

            // Valida o estado fornecido
            String validStatesRegex = "^(RASCUNHO|PUBLICADO|COMPRADO|RESERVADO|INATIVO)$";
            if (!estado.toUpperCase().matches(validStatesRegex)) {
                errorLogger.error("[{}] Invalid state '{}' provided for product ID '{}'", timestamp, estado, productId);
                return Response.status(400).entity("Estado inválido").build();
            }

            // Tenta alterar o estado do produto
            boolean produtoAlterado = productBean.alterProductState(estado.toUpperCase(), productId);
            if (produtoAlterado) {
                infoLogger.info("[{}] Product with ID '{}' successfully updated to state '{}'",
                        timestamp, productId, estado.toUpperCase());
                return Response.status(200).entity("Estado do produto alterado com sucesso").build();
            } else {
                errorLogger.error("[{}] Product with ID '{}' not found or could not be updated.", timestamp, productId);
                return Response.status(404).entity("Produto não existe").build();
            }
        } catch (Exception e) {
            errorLogger.error("[{}] Error updating product state for product ID '{}': {}",
                    timestamp, productId, e.getMessage(), e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao alterar o estado do produto").build();
        }
    }

    //7.excluir  um produto específico de um user
    @DELETE
    @Path("/{username}/products/{productId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeProduct(@PathParam("username") String paramUser, @PathParam("productId") int productId,
                                  @HeaderParam("Authorization") String authorizationHeader) {
        String timestamp = LocalDateTime.now().toString();

        infoLogger.info("[{}] Request to remove product with ID '{}' for user: '{}'", timestamp, productId, paramUser);

        try {
            // Valida o token de autorização
            String tokenValidationResponse = productBean.validateAuthorizationToken(authorizationHeader, paramUser);
            if (tokenValidationResponse != null) {
                errorLogger.error("[{}] Invalid token for user: '{}'", timestamp, paramUser);
                return Response.status(401).entity(tokenValidationResponse).build();
            }

            String token = authorizationHeader.substring("Bearer ".length());
            UserEntity user = userDao.findUserByToken(token);

            // Verifica se o usuário é administrador
            if (!user.getAdmin()) {
                errorLogger.warn("[{}] User '{}' is not an admin and attempted to remove product with ID '{}'", timestamp, paramUser, productId);
                return Response.status(401).entity("Not an admin").build();
            }

            // Remove o produto
            boolean deleted = productBean.removeProduct(token, productId);
            if (!deleted) {
                errorLogger.error("[{}] Failed to remove product with ID '{}' for user: '{}'", timestamp, productId, paramUser);
                return Response.status(400).entity("Failed to remove product").build();
            }

            infoLogger.info("[{}] Product with ID '{}' removed successfully for user: '{}'", timestamp, productId, paramUser);
            return Response.status(200).entity("Product removed successfully").build();
        } catch (Exception e) {
            errorLogger.error("[{}] Error removing product with ID '{}' for user '{}': {}", timestamp, productId, paramUser, e.getMessage(), e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao remover produto").build();
        }
    }

    //8.excluir todos os produtos de um user
    @DELETE
    @Path("/{username}/products")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeAllProducts(@PathParam("username") String targetUsername,
                                      @HeaderParam("Authorization") String authorizationHeader) {
        String timestamp = LocalDateTime.now().toString();

        infoLogger.info("[{}] Request to remove all products for user: '{}'", timestamp, targetUsername);

        try {
            // Valida o token de autorização
            String tokenValidationResponse = productBean.validateAuthorizationToken(authorizationHeader, targetUsername);
            if (tokenValidationResponse != null) {
                errorLogger.error("[{}] Invalid token for user: '{}'", timestamp, targetUsername);
                return Response.status(Response.Status.UNAUTHORIZED).entity(tokenValidationResponse).build();
            }

            String token = authorizationHeader.substring("Bearer ".length());

            // Chama a lógica no ProductBean para remover todos os produtos
            boolean removedAll = productBean.removeAllUserProducts(token, targetUsername);
            if (!removedAll) {
                errorLogger.error("[{}] Failed to remove all products for user: '{}'", timestamp, targetUsername);
                return Response.status(Response.Status.BAD_REQUEST).entity("Failed to remove all products").build();
            }

            infoLogger.info("[{}] Successfully removed all products for user: '{}'", timestamp, targetUsername);
            return Response.status(Response.Status.OK).entity("All products removed successfully").build();
        } catch (Exception e) {
            errorLogger.error("[{}] Error removing all products for user '{}': {}", timestamp, targetUsername, e.getMessage(), e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao remover todos os produtos").build();
        }
    }

    //9.verifica se um determinado produto pertence a um user

    @GET
    @Path("/{username}/products/{productId}/ownership")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response isProductOwner(@PathParam("username") String username, @PathParam("productId") int productId) {
        String timestamp = LocalDateTime.now().toString();

        infoLogger.info("[{}] Request to check ownership of product ID '{}' for user: '{}'", timestamp, productId, username);

        try {
            boolean isOwner = productBean.isProductOwner(username, (long) productId);

            if (isOwner) {
                infoLogger.info("[{}] User '{}' is the owner of product ID '{}'", timestamp, username, productId);
                return Response.status(200).entity("{\"message\": \"Utilizador é dono do produto.\"}").build();
            } else {
                infoLogger.warn("[{}] User '{}' is not the owner of product ID '{}'", timestamp, username, productId);
                return Response.status(403).entity("{\"message\": \"Utilizador não é dono do produto.\"}").build();
            }
        } catch (Exception e) {
            errorLogger.error("[{}] Error occurred while checking ownership for user '{}' and product ID '{}': {}",
                    timestamp, username, productId, e.getMessage(), e);
            return Response.status(500).entity("{\"error\": \"Ocorreu um erro no servidor.\"}").build();
        }
    }

    //10. inativar conta
    @PATCH
    @Path("/{username}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response inativarConta(@PathParam("username") String username, @HeaderParam("Authorization") String authorizationHeader) {
        String timestamp = LocalDateTime.now().toString();

        infoLogger.info("[{}] Request to inactivate account for user: '{}'", timestamp, username);

        try {
            // Valida o token de autorização
            String tokenValidationResponse = productBean.validateAuthorizationToken(authorizationHeader, username);
            if (tokenValidationResponse != null) {
                errorLogger.error("[{}] Invalid token for user: '{}'", timestamp, username);
                return Response.status(401).entity(tokenValidationResponse).build();
            }

            // Tenta inativar a conta
            boolean contaInativada = myAccountBean.inativarConta(username);

            if (contaInativada) {
                infoLogger.info("[{}] Account for user '{}' successfully inactivated.", timestamp, username);
                return Response.status(200).entity("Account successfully inactivated.").build();
            }

            errorLogger.error("[{}] Failed to inactivate account for user: '{}'", timestamp, username);
            return Response.status(500).entity("Failed to inactivate account.").build();
        } catch (Exception e) {
            errorLogger.error("[{}] Error inactivating account for user '{}': {}", timestamp, username, e.getMessage(), e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao inativar conta.").build();
        }
    }

    //11.Reativar conta
    @PATCH
    @Path("/{username}/activate")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response ativarConta(@PathParam("username") String username, @HeaderParam("Authorization") String authorizationHeader) {
        String timestamp = LocalDateTime.now().toString();

        infoLogger.info("[{}] Request to activate account for user: '{}'", timestamp, username);

        try {
            // Valida o token de autorização
            String tokenValidationResponse = productBean.validateAuthorizationToken(authorizationHeader, username);
            if (tokenValidationResponse != null) {
                errorLogger.error("[{}] Invalid token for user: '{}'", timestamp, username);
                return Response.status(401).entity(tokenValidationResponse).build();
            }

            // Tenta ativar a conta
            boolean contaAtivada = myAccountBean.ativarConta(username);

            if (contaAtivada) {
                infoLogger.info("[{}] Account for user '{}' successfully activated.", timestamp, username);
                return Response.status(200).entity("Account successfully activated.").build();
            }

            errorLogger.error("[{}] Failed to activate account for user: '{}'", timestamp, username);
            return Response.status(500).entity("Failed to activate account.").build();
        } catch (Exception e) {
            errorLogger.error("[{}] Error activating account for user '{}': {}", timestamp, username, e.getMessage(), e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao ativar conta.").build();
        }
    }

    //12. comprar um produto
    @PATCH
    @Path("/{username}/products/{productId}/buy")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response buyProduct(@PathParam("username") String username, @PathParam("productId") int productId,
                               @HeaderParam("Authorization") String authorizationHeader) {
        String timestamp = LocalDateTime.now().toString();

        infoLogger.info("[{}] Request to buy product with ID '{}' for user: '{}'", timestamp, productId, username);

        try {
            // Valida o token de autorização
            String tokenValidationResponse = productBean.validateAuthorizationToken(authorizationHeader, username);
            if (tokenValidationResponse != null) {
                errorLogger.error("[{}] Invalid token for user: '{}'", timestamp, username);
                return Response.status(401).entity(tokenValidationResponse).build();
            }

            // Tenta comprar o produto
            boolean bought = productBean.buyProduct(authorizationHeader.substring("Bearer ".length()), productId);

            if (!bought) {
                errorLogger.error("[{}] Failed to buy product with ID '{}' for user: '{}'", timestamp, productId, username);
                return Response.status(400).entity("Failed to buy product").build();
            }

            infoLogger.info("[{}] Product with ID '{}' bought successfully by user: '{}'", timestamp, productId, username);
            return Response.status(200).entity("Product bought successfully.").build();
        } catch (Exception e) {
            errorLogger.error("[{}] Error buying product with ID '{}' for user '{}': {}", timestamp, productId, username, e.getMessage(), e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao comprar produto.").build();
        }
    }

    //13. inativar produto
    @PATCH
    @Path("/{username}/products/{productId}/inactivate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response inactivateProduct(@PathParam("username") String username,
                                      @PathParam("productId") Long productId,
                                      @HeaderParam("Authorization") String token) {
        String timestamp = LocalDateTime.now().toString();

        infoLogger.info("[{}] Attempting to inactivate product with ID '{}' for user: '{}'", timestamp, productId, username);

        try {
            // Valida o token
            String validationMessage = productBean.validateAuthorizationToken(token, username);
            if (validationMessage != null) {
                errorLogger.error("[{}] Token validation failed for user '{}': {}", timestamp, username, validationMessage);
                return Response.status(Response.Status.UNAUTHORIZED).entity(validationMessage).build();
            }

            // Verifica se o utilizador é dono OU se é administrador
            boolean isOwner = productBean.isProductOwner(username, productId);
            boolean isAdmin = productBean.isUserAdmin(username);

            if (!isOwner && !isAdmin) {
                errorLogger.warn("[{}] User '{}' does not have permission to inactivate product with ID '{}'", timestamp, username, productId);
                return Response.status(Response.Status.FORBIDDEN).entity("Product does not belong to user.").build();
            }

            // Alterar o estado do produto
            boolean result = productBean.alterProductState("INATIVO", productId);
            if (!result) {
                errorLogger.error("[{}] Failed to inactivate product with ID '{}' for user '{}'", timestamp, productId, username);
                return Response.status(Response.Status.BAD_REQUEST).entity("Failed to inactivate product.").build();
            }

            infoLogger.info("[{}] Product with ID '{}' successfully inactivated for user '{}'", timestamp, productId, username);
            return Response.status(Response.Status.OK).entity("Product successfully inactivated.").build();
        } catch (Exception e) {
            errorLogger.error("[{}] Error inactivating product with ID '{}' for user '{}': {}", timestamp, productId, username, e.getMessage(), e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao inativar produto.").build();
        }
    }

    //14. exibe as estatisticas das compras
    @GET
    @Path("/purchases")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCumulativeProductPurchases() {
        String timestamp = LocalDateTime.now().toString();

        infoLogger.info("[{}] Request to fetch cumulative product purchases.", timestamp);

        try {
            // Busca os resultados do banco de dados
            List<Object[]> results = productDao.countCumulativePurchasesByDate();
            List<Map<String, Object>> response = new ArrayList<>();

            int cumulativeCount = 0;
            for (Object[] row : results) {
                cumulativeCount += ((Number) row[1]).intValue();
                response.add(Map.of(
                        "date", row[0],
                        "cumulativeCount", cumulativeCount
                ));
            }

            infoLogger.info("[{}] Successfully fetched cumulative product purchases. Total records: {}", timestamp, response.size());
            return Response.ok(response).build();
        } catch (Exception e) {
            errorLogger.error("[{}] Error fetching cumulative product purchases: {}", timestamp, e.getMessage(), e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao buscar dados cumulativos").build();
        }
    }
}