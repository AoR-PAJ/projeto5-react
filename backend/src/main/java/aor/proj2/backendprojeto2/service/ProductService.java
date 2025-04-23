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
        Product product = productBean.getProduct(productId);

        if (product == null) {
            errorLogger.error("Product not found");
            return Response.status(404).entity("Product not found").build();
        }

        infoLogger.info("Product with ID " + productId + " retrieved successfully.");
        return Response.status(200).entity(product).build();
    }

    //1.Obtem todos os produtos
    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> getProducts() {
        infoLogger.info("Visualized all products");
        return productBean.getProducts();
    }

    //2.Filtrar produtos por categoria
    @GET
    @Path("category/{category}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> filtrarProdutos(@PathParam("category") String category) {
        infoLogger.info("Visualized all products from category " + category);
        return productBean.findProductByCategory(category);
    }

    //3.Filtrar produtos de um utilizador
    @GET
    @Path("/user/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> filtrarProdutosUser(@PathParam("username") String username){
        infoLogger.info("Visualized all products from user " + username);
        return productBean.findProductByUsername(username);
    }


    // 4.Listar produtos modificados
    @GET
    @Path("/modified")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> getModifiedProducts() {
        infoLogger.info("Visualized all modified products");
        return productBean.getModifiedProducts();
    }

    //5.Produtos Inativos
    @GET
    @Path("/inactive")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> getInactiveProducts() {
        // Obter a lista de produtos "inativos" com base no estado
        return productBean.getInactiveProducts();
    }

    //6.Obter produto por id
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProductById(@PathParam("id") int id) {
        Product product = productBean.getProduct(id);

        if (product == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("{\"error\": \"Produto não encontrado.\"}").build();
        }
        return Response.ok(product).build();
    }

    @GET
    @Path("/average-time-to-purchase")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAverageTimeToPurchase() {
        try {
            Double averageTime = productDao.calculateAverageTimeToPurchase();
            if (averageTime == null) {
                return Response.status(Response.Status.NO_CONTENT).entity("No data available").build();
            }
            return Response.ok(Map.of("averageTime", averageTime)).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error calculating average time").build();
        }
    }
}