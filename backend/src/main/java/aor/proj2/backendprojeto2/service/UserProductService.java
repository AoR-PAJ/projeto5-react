package aor.proj2.backendprojeto2.service;

import aor.proj2.backendprojeto2.bean.MyAccountBean;
import aor.proj2.backendprojeto2.bean.ProductBean;
import aor.proj2.backendprojeto2.dto.Product;
import aor.proj2.backendprojeto2.entity.ProductEntity;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.List;

@Path("/users")
public class UserProductService {
    private static final Logger infoLogger = LogManager.getLogger("infoLogger");
    private static final Logger errorLogger = LogManager.getLogger("errorLogger");

    @Inject
    ProductBean productBean;

    @Inject
    MyAccountBean myAccountBean;

    @GET
    @Path("/{username}/products")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserProducts(@PathParam("username") String paramUser, @HeaderParam("Authorization") String authorizationHeader) {
        String tokenValidationResponse = productBean.validateAuthorizationToken(authorizationHeader, paramUser);
        if (tokenValidationResponse != null) {
            errorLogger.error("Invalid token");
            return Response.status(401).entity(tokenValidationResponse).build(); // Retorna erro de autenticação caso o token seja inválido
        }

        List<Product> products = productBean.getUserProducts(authorizationHeader.substring("Bearer ".length()));
        return Response.ok(products).build();
    }

    // C2 - Add product to user products
    @POST
    @Path("/{username}/addProducts")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addProduct(Product product, @PathParam("username") String username, @HeaderParam("Authorization") String authorizationHeader) {
        String tokenValidationResponse = productBean.validateAuthorizationToken(authorizationHeader, username);
        if (tokenValidationResponse != null) {
            errorLogger.error("Invalid token");
            return Response.status(401).entity(tokenValidationResponse).build();
        }

        String token = authorizationHeader.substring("Bearer ".length()); // Extrai o token do cabeçalho de autorização
        boolean added = productBean.addProduct(product, token);
        if (!added) {
            errorLogger.error("Failed to create product: " + product.getTitle());
            return Response.status(400).entity("Failed to create product").build();
        } else {
            infoLogger.info("A new product was created: " + product.getTitle());
            return Response.status(200).entity("A new product was created").build();
        }
    }

    // C4 - Update product state
    @PUT
    @Path("/{username}/products/{productId}/{estado}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response alterProductState(@PathParam("estado") String estado, @PathParam("productId") Long productId, @PathParam("username") String username, @HeaderParam("Authorization") String authorizationHeader) {

        String tokenValidationResponse = productBean.validateAuthorizationToken(authorizationHeader, username);
        if (tokenValidationResponse != null) {
            errorLogger.error("Invalid token");
            return Response.status(401).entity(tokenValidationResponse).build();
        }

        String requisitoEstado = "^(RASCUNHO|PUBLICADO|COMPRADO|RESERVADO|INATIVO)$";

        if (estado.toUpperCase().matches(requisitoEstado)) {
            boolean produtoAlterado = productBean.alterProductState(estado, productId);
            System.out.println("produto alterado:  " + produtoAlterado);

            if (produtoAlterado) {
                infoLogger.info("Produto com ID " + productId + " teve seu estado alterado para " + estado.toUpperCase());
                return Response.status(200).entity("Estado do produto alterado com sucesso").build();
            }
        } else {
            errorLogger.error("Falha ao tentar alterar o estado do produto com ID " + productId + ": estado inválido.");
            return Response.status(400).entity("Estado inválido").build();
        }

        errorLogger.error("Tentativa de alterar o estado de um produto que não existe (ID: " + productId + ").");
        return Response.status(404).entity("Produto não existe").build();
    }

    //A1. Editar produtos de outros utilizadores
    @PUT
    @Path("/{username}/products/updateProductOther/{productId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateProductOther(@PathParam("username") String paramUser, @PathParam("productId") int productId,
                                  @HeaderParam("Authorization") String authorizationHeader,Product updatedData) {
        String tokenValidationResponse = productBean.validateAuthorizationToken(authorizationHeader, paramUser);

        if (tokenValidationResponse != null) {
            errorLogger.error("Invalid token");
            return Response.status(401).entity(tokenValidationResponse).build();
        }

        boolean updated = productBean.updateProductOther(authorizationHeader.substring("Bearer ".length()), productId, updatedData);

        if (!updated){
            errorLogger.error("Failed to update product");
            return Response.status(400).entity("Failed to update product").build();
        }

        infoLogger.info("Product updated successfully");
        return Response.status(200).entity("Product updated successfully").build();
    }


    // A8 - Inativar conta de utilizador
    @PUT
    @Path("/{username}/inativarConta")
    public Response inativarConta(@PathParam("username") String username, @HeaderParam("Authorization") String authorizationHeader) {
        String tokenValidationResponse = productBean.validateAuthorizationToken(authorizationHeader, username);
        if (tokenValidationResponse != null) {
            errorLogger.error("Invalid token");
            return Response.status(401).entity(tokenValidationResponse).build();
        }

        boolean contaInativada = myAccountBean.inativarConta(username);

        if (contaInativada) {
            infoLogger.info("Username " + username + " got account innactivated.");
            return Response.status(200).entity("Account succesfully inactivated.").build();
        }

        errorLogger.error("Failed to inactivate account from username:  " + username + ".");
        return Response.status(500).entity("Failed to inactivate account from username: " + username + ".").build();
    }

    // A8 - Reativar conta de utilizador
    @PUT
    @Path("/{username}/ativarConta")
    public Response ativarConta(@PathParam("username") String username, @HeaderParam("Authorization") String authorizationHeader) {
        String tokenValidationResponse = productBean.validateAuthorizationToken(authorizationHeader, username);
        if (tokenValidationResponse != null) {
            errorLogger.error("Invalid token");
            return Response.status(401).entity(tokenValidationResponse).build();
        }

        boolean contaAtivada = myAccountBean.ativarConta(username);

        if (contaAtivada) {
            infoLogger.info("Username " + username + " teve a conta reativada.");
            return Response.status(200).entity("Conta reativada com sucesso.").build();
        }

        errorLogger.error("Falha ao reativar a conta para o username " + username + ".");
        return Response.status(500).entity("Falha ao reativar a conta para o username " + username + ".").build();
    }

    // C3 - Update product of user products
    @PUT
    @Path("/{username}/products/{productId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateProduct(@PathParam("username") String paramUser, @PathParam("productId") int productId,
                                  @HeaderParam("Authorization") String authorizationHeader, Product updatedData) {
        String tokenValidationResponse = productBean.validateAuthorizationToken(authorizationHeader, paramUser);
        if (tokenValidationResponse != null) {
            errorLogger.error("Invalid token");
            return Response.status(401).entity(tokenValidationResponse).build();
        }

        boolean updated = productBean.updateProduct(authorizationHeader.substring("Bearer ".length()), productId, updatedData);

        if (!updated){
            errorLogger.error("Failed to update product");
            return Response.status(400).entity("Failed to update product").build();
        }

        infoLogger.info("Product updated successfully");
        return Response.status(200).entity("Product updated successfully").build();
    }

    // A10 - Apagar permanentemente um produto
    @DELETE
    @Path("/{username}/products/{productId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeProduct(@PathParam("username") String paramUser, @PathParam("productId") int productId,
                                  @HeaderParam("Authorization") String authorizationHeader) {
        String tokenValidationResponse = productBean.validateAuthorizationToken(authorizationHeader, paramUser);
        if (tokenValidationResponse != null) {
            errorLogger.error("Invalid token");
            return Response.status(401).entity(tokenValidationResponse).build();
        }

        boolean deleted = productBean.removeProduct(authorizationHeader.substring("Bearer ".length()), productId);

        if (!deleted) {
            errorLogger.error("Failed to remove product");
            return Response.status(400).entity("Failed to remove product").build();
        }

        infoLogger.info("Product removed successfully");
        return Response.status(200).entity("Product removed successfully").build();
    }

    @DELETE
    @Path("/{username}/products/all")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeAllProducts(@PathParam("username") String targetUsername,
                                      @HeaderParam("Authorization") String authorizationHeader) {
        String tokenValidationResponse = productBean.validateAuthorizationToken(authorizationHeader, targetUsername);
        if (tokenValidationResponse != null) {
            errorLogger.error("Invalid token");
            return Response.status(Response.Status.UNAUTHORIZED).entity(tokenValidationResponse).build();
        }

        String token = authorizationHeader.substring("Bearer ".length());

        // Chama a lógica no ProductBean
        boolean removedAll = productBean.removeAllUserProducts(token, targetUsername);
        if (!removedAll) {
            errorLogger.error("Failed to remove all products for user: " + targetUsername);
            return Response.status(Response.Status.BAD_REQUEST).entity("Failed to remove all products").build();
        }

        infoLogger.info("Successfully removed all products for user: " + targetUsername);
        return Response.status(Response.Status.OK).entity("All products removed successfully").build();
    }


    // EX1 - Get one product by ID
    @GET
    @Path("/products/{productId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProduct(@PathParam("productId") int id) {
        Product product = productBean.getProduct(id);

        if (product == null) {
            errorLogger.error("Product not found");
            return Response.status(404).entity("Product not found").build();
        }
        infoLogger.info("Visualized product with id "+ id );
        return Response.status(200).entity(product).build();
    }

    @PATCH
    @Path("/{username}/products/{productId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response buyProduct(@PathParam("username") String paramUser, @PathParam("productId") int productId, @HeaderParam("Authorization") String authorizationHeader) {
        String tokenValidationResponse = productBean.validateAuthorizationToken(authorizationHeader, paramUser);
        if (tokenValidationResponse != null) {
            errorLogger.error("Invalid token");
            return Response.status(401).entity(tokenValidationResponse).build();
        }

        boolean bought = productBean.buyProduct(authorizationHeader.substring("Bearer ".length()), productId);

        if (!bought) {
            errorLogger.error("Failed to buy product");
            return Response.status(400).entity("Failed to buy product").build();
        }

        infoLogger.info("Product bought successfully");
        return Response.status(200).entity("Product bought successfully").build();
    }

    @PUT
    @Path("/{username}/products/{productId}/inactivate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response inactivateProduct(@PathParam("username") String username,
                                      @PathParam("productId") Long productId,
                                      @HeaderParam("Authorization") String token) {
        infoLogger.info("Attempting to inactivate product for user: " + username);

        // Valida o token
        String validationMessage = productBean.validateAuthorizationToken(token, username);
        if (validationMessage != null) {
            errorLogger.error("Token validation failed: " + validationMessage);
            return Response.status(Response.Status.UNAUTHORIZED).entity(validationMessage).build();
        }

        // Verifica se o utilizador é dono OU se é administrador
        boolean isOwner = productBean.isProductOwner(username, productId);
        boolean isAdmin = productBean.isUserAdmin(username);

        if (!isOwner && !isAdmin) {
            errorLogger.error("User does not have permission to inactivate product. Username: " + username);
            return Response.status(Response.Status.FORBIDDEN).entity("Product does not belong to user.").build(); // Mensagem ajustada
        }

        //alterar o estado do produto
        boolean result = productBean.alterProductState("INATIVO", productId);
        if (!result) {
            errorLogger.error("Failed to inactivate product with ID: " + productId);
            return Response.status(Response.Status.BAD_REQUEST).entity("Failed to inactivate product.").build();
        }

        infoLogger.info("Product with ID " + productId + " successfully inactivated.");
        return Response.status(Response.Status.OK).entity("Product successfully inactivated.").build();
    }


    //verifica se um determinado produto pertence a um user

    @GET
    @Path("/{username}/products/{productId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response isProductOwner(@PathParam("username") String username, @PathParam("productId") int productId) {
        boolean isOwner = productBean.isProductOwner(username, (long) productId);
        try {
            if (isOwner) {
                infoLogger.info("username " + username + " is the owner of the product with id " + productId);
                return Response.status(200).entity("{\"message\": \"Utilizador é dono do produto.\"}").build();
            } else {
                infoLogger.error("username " + username + " is not the owner of the product with id " + productId);
                return Response.status(403).entity("{\"message\": \"Utilizador não é dono do produto.\"}").build();
            }

        } catch (Exception e) {
            e.printStackTrace();
            errorLogger.error("Error occurred with the server");
            return Response.status(500).entity("{\"error\": \"Ocorreu um erro no servidor.\"}").build();
        }
    }
}