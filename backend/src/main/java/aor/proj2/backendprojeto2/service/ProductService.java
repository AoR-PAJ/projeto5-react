package aor.proj2.backendprojeto2.service;

import aor.proj2.backendprojeto2.bean.ProductBean;
import aor.proj2.backendprojeto2.dto.Product;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.List;

// A classe ProductService define os endpoints que o frontend irá consumir.
// A anotação @Path("/rest/products") especifíca que todos os métodos da classe vão seguir caminhos que começam com /rest/products.
@Path("/products")
public class ProductService {

    private static final Logger infoLogger = LogManager.getLogger("infoLogger");
    private static final Logger errorLogger = LogManager.getLogger("errorLogger");

    @Inject
    ProductBean productBean;


    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> getProducts() {
        infoLogger.info("Visualized all products");
        return productBean.getProducts();
    }

    //A5 - Filtrar produtos por categoria
    @GET
    @Path("category/{category}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> filtrarProdutos(@PathParam("category") String category) {
        infoLogger.info("Visualized all products from category " + category);
        return productBean.findProductByCategory(category);
    }

    //A4 - Filtrar produtos de um utilizador
    @GET
    @Path("/user/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> filtrarProdutosUser(@PathParam("username") String username){
        infoLogger.info("Visualized all products from user " + username);
        return productBean.findProductByUsername(username);
    }


    // Endpoint para listar produtos modificados
    @GET
    @Path("/modified")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> getModifiedProducts() {
        infoLogger.info("Visualized all modified products");
        return productBean.getModifiedProducts();
    }

    @GET
    @Path("/inactive")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> getInactiveProducts() {
        // Obter a lista de produtos "inativos" com base no estado
        return productBean.getInactiveProducts();
    }

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
}