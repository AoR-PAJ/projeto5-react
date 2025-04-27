package aor.proj2.backendprojeto2.service;

import aor.proj2.backendprojeto2.bean.ProductBean;
import aor.proj2.backendprojeto2.dao.ProductDao;
import aor.proj2.backendprojeto2.dto.Product;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

// A classe ProductService define os endpoints que o frontend irá consumir.
// A anotação @Path("/rest/products") especifíca que todos os métodos da classe vão seguir caminhos que começam com /rest/products.
@Path("/products")
public class ProductService {

    private static final Logger infoLogger = LogManager.getLogger("infoLogger");
    private static final Logger errorLogger = LogManager.getLogger("errorLogger");

    @Inject
    ProductBean productBean;

    @Inject
    ProductDao productDao;


    //todo: adicionei aqui este endpoint na refatoracao
    @GET
    @Path("/products/{productId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProduct(@PathParam("productId") int productId) {
        String timestamp = LocalDateTime.now().toString();

        infoLogger.info("[{}] Request to fetch product with ID: {}", timestamp, productId);

        try {
            Product product = productBean.getProduct(productId);

            if (product == null) {
                errorLogger.error("[{}] Product with ID '{}' not found.", timestamp, productId);
                return Response.status(404).entity("Product not found").build();
            }

            infoLogger.info("[{}] Product with ID '{}' retrieved successfully.", timestamp, productId);
            return Response.status(200).entity(product).build();
        } catch (Exception e) {
            errorLogger.error("[{}] Error fetching product with ID '{}': {}", timestamp, productId, e.getMessage(), e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error fetching product: " + e.getMessage())
                    .build();
        }
    }

    //1.Obtem todos os produtos
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> getProducts(@QueryParam("estado") String estado) {
        String timestamp = LocalDateTime.now().toString();

        if (estado != null && !estado.isEmpty()) {
            infoLogger.info("[{}] Request to fetch products with estado: '{}'", timestamp, estado);
            List<Product> products = productBean.getProductsByState(estado);
            infoLogger.info("[{}] Successfully fetched {} products with estado: '{}'", timestamp, products.size(), estado);
            return products;
        } else {
            infoLogger.info("[{}] Request to fetch all products", timestamp);
            List<Product> products = productBean.getProducts();
            infoLogger.info("[{}] Successfully fetched {} products", timestamp, products.size());
            return products;
        }
    }

    //2.Filtrar produtos por categoria
    @GET
    @Path("category/{category}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> filtrarProdutos(@PathParam("category") String category) {
        String timestamp = LocalDateTime.now().toString();

        infoLogger.info("[{}] Request to fetch products from category: '{}'", timestamp, category);

        try {
            List<Product> products = productBean.findProductByCategory(category);

            infoLogger.info("[{}] Successfully fetched {} products from category: '{}'", timestamp, products.size(), category);
            return products;
        } catch (Exception e) {
            errorLogger.error("[{}] Error fetching products from category: '{}': {}", timestamp, category, e.getMessage(), e);
            throw new WebApplicationException("Erro ao buscar produtos da categoria: " + category, Response.Status.INTERNAL_SERVER_ERROR);
        }
    }

    //3.Filtrar produtos de um utilizador
    @GET
    @Path("/user/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> filtrarProdutosUser(@PathParam("username") String username) {
        String timestamp = LocalDateTime.now().toString();

        infoLogger.info("[{}] Request to fetch all products from user: '{}'", timestamp, username);

        try {
            List<Product> products = productBean.findProductByUsername(username);

            infoLogger.info("[{}] Successfully fetched {} products from user: '{}'", timestamp, products.size(), username);
            return products;
        } catch (Exception e) {
            errorLogger.error("[{}] Error fetching products from user: '{}': {}", timestamp, username, e.getMessage(), e);
            throw new WebApplicationException("Erro ao buscar produtos do usuário: " + username, Response.Status.INTERNAL_SERVER_ERROR);
        }
    }


    // 4.Listar produtos modificados
    @GET
    @Path("/modified")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> getModifiedProducts() {
        String timestamp = LocalDateTime.now().toString();

        infoLogger.info("[{}] Request to fetch all modified products", timestamp);

        try {
            List<Product> modifiedProducts = productBean.getModifiedProducts();

            infoLogger.info("[{}] Successfully fetched {} modified products", timestamp, modifiedProducts.size());
            return modifiedProducts;
        } catch (Exception e) {
            errorLogger.error("[{}] Error fetching modified products: {}", timestamp, e.getMessage(), e);
            throw new WebApplicationException("Erro ao buscar produtos modificados", Response.Status.INTERNAL_SERVER_ERROR);
        }
    }

    //5.Produtos Inativos
    @GET
    @Path("/inactive")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> getInactiveProducts() {
        String timestamp = LocalDateTime.now().toString();

        infoLogger.info("[{}] Request to fetch all inactive products", timestamp);

        try {
            // Obter a lista de produtos "inativos" com base no estado
            List<Product> inactiveProducts = productBean.getInactiveProducts();

            infoLogger.info("[{}] Successfully fetched {} inactive products", timestamp, inactiveProducts.size());
            return inactiveProducts;
        } catch (Exception e) {
            errorLogger.error("[{}] Error fetching inactive products: {}", timestamp, e.getMessage(), e);
            throw new WebApplicationException("Erro ao buscar produtos inativos", Response.Status.INTERNAL_SERVER_ERROR);
        }
    }

    //6.Obter produto por id
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProductById(@PathParam("id") int id) {
        String timestamp = LocalDateTime.now().toString();

        infoLogger.info("[{}] Request to fetch product with ID: {}", timestamp, id);

        try {
            Product product = productBean.getProduct(id);

            if (product == null) {
                errorLogger.error("[{}] Product with ID '{}' not found.", timestamp, id);
                return Response.status(Response.Status.NOT_FOUND).entity("{\"error\": \"Produto não encontrado.\"}").build();
            }

            infoLogger.info("[{}] Product with ID '{}' retrieved successfully.", timestamp, id);
            return Response.ok(product).build();
        } catch (Exception e) {
            errorLogger.error("[{}] Error fetching product with ID '{}': {}", timestamp, id, e.getMessage(), e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"Erro ao buscar produto.\"}")
                    .build();
        }
    }

    @GET
    @Path("/average-time-to-purchase")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAverageTimeToPurchase() {
        String timestamp = LocalDateTime.now().toString();

        infoLogger.info("[{}] Request to calculate average time to purchase", timestamp);

        try {
            Double averageTime = productDao.calculateAverageTimeToPurchase();

            if (averageTime == null) {
                infoLogger.info("[{}] No data available to calculate average time to purchase", timestamp);
                return Response.status(Response.Status.NO_CONTENT).entity("No data available").build();
            }

            infoLogger.info("[{}] Successfully calculated average time to purchase: {}", timestamp, averageTime);
            return Response.ok(Map.of("averageTime", averageTime)).build();
        } catch (Exception e) {
            errorLogger.error("[{}] Error calculating average time to purchase: {}", timestamp, e.getMessage(), e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error calculating average time").build();
        }
    }
}