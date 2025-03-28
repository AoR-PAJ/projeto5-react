package aor.proj2.backendprojeto2.bean;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import aor.proj2.backendprojeto2.dao.CategoryDao;
import aor.proj2.backendprojeto2.dao.ProductDao;
import aor.proj2.backendprojeto2.dao.UserDao;
import aor.proj2.backendprojeto2.entity.CategoryEntity;
import aor.proj2.backendprojeto2.entity.ProductEntity;
import aor.proj2.backendprojeto2.entity.UserEntity;
import aor.proj2.backendprojeto2.utils.State;

import jakarta.ejb.EJB;
import jakarta.ejb.TransactionAttribute;
import jakarta.ejb.TransactionAttributeType;
import jakarta.enterprise.context.ApplicationScoped;
import aor.proj2.backendprojeto2.dto.Product;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@ApplicationScoped
public class ProductBean {

    private static final Logger infoLogger = LogManager.getLogger(ProductBean.class);
    private static final Logger errorLogger = LogManager.getLogger(ProductBean.class);

    @EJB
    private CategoryDao categoryDao;

    @EJB
    private ProductDao productDao;

    @EJB
    private UserDao userDao;

    @PersistenceContext
    private EntityManager em;

    public ProductBean() {
    }

    // Valida o token do cabeçalho de autorização
    public String validateAuthorizationToken(String authorizationHeader, String paramUsername) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return "Token ausente ou inválido.";
        }

        return null; // Retorna null se o token for válido
    }


    public List<Product> getInactiveProducts() {
        List<ProductEntity> inactiveEntities = em.createQuery(
                        "SELECT p FROM ProductEntity p WHERE p.estado = :estado", ProductEntity.class)
                .setParameter("estado", "INATIVO")
                .getResultList();

        return inactiveEntities.stream()
                .map(this::convertProductEntityToProductDto)
                .collect(Collectors.toList());
    }

    public ArrayList<Product> getUserProducts(String token) {
        infoLogger.info("Fetching products for user identified by token.");

        UserEntity user = userDao.findUserByToken(token);
        if (user == null) {
            errorLogger.error("Invalid token. User not authenticated.");
            return new ArrayList<>();
        }

        List<ProductEntity> productsByUser = productDao.findProductByUser(user);
        ArrayList<Product> userProducts = new ArrayList<>();

        if (productsByUser != null) {
            for (ProductEntity productEntity : productsByUser) {
                userProducts.add(convertProductEntityToProductDto(productEntity));
            }
            infoLogger.info("Found " + userProducts.size() + " products for user.");
        } else {
            infoLogger.info("No products found for user.");
        }

        return userProducts;
    }

    public ArrayList<Product> getProducts() {
        infoLogger.info("Fetching all products from the database.");

        ArrayList<Product> allProducts = new ArrayList<>();
        List<ProductEntity> allProductEntities = productDao.findProductsByActiveUsers();

        for (ProductEntity productEntity : allProductEntities) {
            allProducts.add(convertProductEntityToProductDto(productEntity));
        }

        infoLogger.info("Found " + allProducts.size() + " products in total.");
        return allProducts;
    }

    //Filtra os produtos que estejam associados a uma categoria
    public ArrayList<Product> findProductByCategory(String category) {
        infoLogger.info("Fetching products from category: " + category);

        if (category == null || category.trim().isEmpty()) {
            infoLogger.warn("Category parameter is null or empty.");
            return new ArrayList<>();
        }

        try {
            // Executa a NamedQuery e passa o parâmetro
            List<ProductEntity> productEntities = em
                    .createNamedQuery("Product.findProductByCategory", ProductEntity.class)
                    .setParameter("category", category)
                    .getResultList();

            if (productEntities.isEmpty()) {
                infoLogger.info("No products found for username: " + category);
                return new ArrayList<>();
            }

            // Converte ProductEntity para Product
            ArrayList<Product> products = new ArrayList<>();

            for (ProductEntity entity : productEntities) {
                Product productFiltered = convertProductEntityToProductDto(entity);
                products.add(productFiltered);
            }
            return products;

        } catch (Exception e) {
            errorLogger.error("Error fetching products by category", e);
            return new ArrayList<>(); // Retorna lista vazia em caso de erro
        }
    }

    public ArrayList<Product> findProductByUsername(String username) {
        infoLogger.info("Fetching products from username: " + username);
        if (username == null || username.trim().isEmpty()) {
            infoLogger.warn("Category parameter is null or empty.");
            return new ArrayList<>();
        }

        try {
            List<ProductEntity> produtosUser = em.
                    createNamedQuery("Product.findProductByUsername", ProductEntity.class)
                    .setParameter("owner", username)
                    .getResultList();
            if (produtosUser.isEmpty()) {
                infoLogger.info("No products found for username: " + username);
                return new ArrayList<>();
            }

            // Converte ProductEntity para Product
            ArrayList<Product> products = new ArrayList<>();

            for (ProductEntity entity : produtosUser) {
                Product productFiltered = convertProductEntityToProductDto(entity);
                products.add(productFiltered);
            }

            return products;
        } catch (Exception e) {
            errorLogger.error("Error fetching products from user", e);
            return new ArrayList<>(); // Retorna lista vazia em caso de erro
        }

    }

    public boolean addProduct(Product product, String token) {
        infoLogger.info("Attempting to add a new product for user identified by token.");

        UserEntity user = userDao.findUserByToken(token);
        if (user == null) {
            errorLogger.error("Invalid token. User not authenticated.");
            return false;
        }

        CategoryEntity category = categoryDao.find(product.getCategory());
        if (category == null) {
            errorLogger.error("Category " + product.getCategory() + " does not exist.");
            return false;
        }

        ProductEntity productEntity = new ProductEntity();
        productEntity.setCategoria(category);
        productEntity.setDescricao(product.getDescription());
        productEntity.setLocalizacao(product.getLocation());
        productEntity.setPreco(product.getPrice());
        productEntity.setPhoto(product.getPicture());
        productEntity.setTitulo(product.getTitle());
        productEntity.setEstado(product.getStatus().toString());
        productEntity.setDataPublicacao(Timestamp.valueOf(LocalDateTime.now()));
        productEntity.setOwner(user);

        try {
            productDao.persist(productEntity);
            infoLogger.info("Product added successfully: " + product.getTitle());
            return true;
        } catch (Exception e) {
            errorLogger.error("Error while adding product: " + e.getMessage());
            return false;
        }
    }

    public boolean updateProduct(String token, int productId, Product updatedData) {
        infoLogger.info("Attempting to update product with ID: " + productId);

        UserEntity user = userDao.findUserByToken(token);
        if (user == null) {
            errorLogger.error("Invalid token. User not authenticated.");
            return false;
        }

        ProductEntity existingProduct = productDao.find((long) productId);
        System.out.println("existing produto " + existingProduct.getTitulo());
        if (existingProduct == null || !existingProduct.getOwner().getUsername().equals(user.getUsername())) {
            System.out.println("produto id: " +productId);
            System.out.println("descricao " + existingProduct.getDescricao());
            System.out.println("user: " + user.getUsername());
            System.out.println("owner: " + existingProduct.getOwner().getUsername());
            errorLogger.error("Product not found or access denied.");
            return false;
        }

        if (updatedData.getCategory() != null) {
            CategoryEntity category = categoryDao.find(updatedData.getCategory());
            if (category == null) {
                errorLogger.error("Category " + updatedData.getCategory() + " does not exist.");
                return false;
            }
            existingProduct.setCategoria(category);
        }

        existingProduct.setDescricao(updatedData.getDescription());
        existingProduct.setLocalizacao(updatedData.getLocation());
        existingProduct.setPreco(updatedData.getPrice());
        existingProduct.setTitulo(updatedData.getTitle());
        existingProduct.setDataModificacao(Timestamp.valueOf(LocalDateTime.now()));
        existingProduct.setPhoto(updatedData.getPicture());
        existingProduct.setEstado(updatedData.getStatus().toString());

        productDao.merge(existingProduct);
        infoLogger.info("Product updated successfully, ID: " + productId);
        return true;
    }

    public boolean updateProductOther(String token, int productId, Product updatedData) {
        infoLogger.info("Attempting to update product with ID: " + productId);

        UserEntity user = userDao.findUserByToken(token);
        if (user == null) {
            errorLogger.error("Invalid token. User not authenticated.");
            return false;
        }

        ProductEntity existingProduct = productDao.find((long) productId);
        System.out.println("existing produto " + existingProduct.getTitulo());
        if (existingProduct == null) {
            System.out.println("produto id: " +productId);
            System.out.println("descricao " + existingProduct.getDescricao());
            System.out.println("user: " + user.getUsername());
            System.out.println("owner: " + existingProduct.getOwner().getUsername());
            errorLogger.error("Product not found or access denied.");
            return false;
        }

        if (updatedData.getCategory() != null) {
            CategoryEntity category = categoryDao.find(updatedData.getCategory());
            if (category == null) {
                errorLogger.error("Category " + updatedData.getCategory() + " does not exist.");
                return false;
            }
            existingProduct.setCategoria(category);
        }

        existingProduct.setDescricao(updatedData.getDescription());
        existingProduct.setLocalizacao(updatedData.getLocation());
        existingProduct.setPreco(updatedData.getPrice());
        existingProduct.setTitulo(updatedData.getTitle());
        existingProduct.setDataModificacao(Timestamp.valueOf(LocalDateTime.now()));
        existingProduct.setPhoto(updatedData.getPicture());
        existingProduct.setEstado(updatedData.getStatus().toString());

        productDao.merge(existingProduct);
        infoLogger.info("Product updated successfully, ID: " + productId);
        return true;
    }

    public boolean removeProduct(String token, int productId) {
        infoLogger.info("Attempting to remove product with ID: " + productId);

        UserEntity user = userDao.findUserByToken(token);
        if (user == null) {
            errorLogger.error("Invalid token. User not authenticated.");
            return false;
        }

        ProductEntity product = productDao.find((long) productId);
        if (product == null ) {
            errorLogger.error("Product not found or access denied.");
            return false;
        }

        productDao.remove(product);
        infoLogger.info("Product removed successfully, ID: " + productId);
        return true;
    }

    public Product getProduct(int id) {
        infoLogger.info("Fetching product with ID: " + id);

        ProductEntity productEntity = productDao.find((long) id);
        if (productEntity == null) {
            errorLogger.error("Product with ID " + id + " not found.");
            return null;
        }

        infoLogger.info("Product with ID " + id + " found.");
        return convertProductEntityToProductDto(productEntity);
    }

    // obter produtos modificados
    public List<Product> getModifiedProducts() {
        List<ProductEntity> productEntities = productDao.findModifiedProducts();
        return productEntities.stream()
                .map(this::convertProductEntityToProductDto)
                .collect(Collectors.toList());
    }


    public boolean buyProduct(String token, int productId) {
        infoLogger.info("Attempting to mark product as bought with ID: " + productId);

        UserEntity user = userDao.findUserByToken(token);
        if (user == null) {
            errorLogger.error("Invalid token. User not authenticated.");
            return false;
        }

        ProductEntity productEntity = productDao.find((long) productId);


        productEntity.setEstado(State.COMPRADO.toString());
        productEntity.setDataModificacao(Timestamp.valueOf(LocalDateTime.now()));

        productDao.merge(productEntity);
        infoLogger.info("Product with ID " + productId + " marked as bought.");
        return true;
    }

    public boolean alterProductState(String estado, Long productId) {
        infoLogger.info("Attempting to alter state of product with ID: " + productId);

        // Busca o produto pelo ID fornecido
        ProductEntity productEntity = productDao.find(productId);
        if (productEntity == null) {
            errorLogger.error("Product with ID " + productId + " not found.");
            return false;
        }

        // Verifica se o novo estado é válido
        try {
            State novoEstado = State.valueOf(estado.toUpperCase());
            productEntity.setEstado(novoEstado.toString());
            productEntity.setDataModificacao(Timestamp.valueOf(LocalDateTime.now())); // Atualiza a data de modificação

            // Persiste as alterações
            productDao.merge(productEntity);
            infoLogger.info("Product state updated successfully. ID: " + productId + ", New State: " + estado);
            return true;
        } catch (IllegalArgumentException e) {
            errorLogger.error("Invalid state provided: " + estado);
            return false; // Retorna falha se o estado for inválido
        }
    }

//Se já existir uma transação ativa, será executado dentro dessa mesma transação caso contrario é criada uma
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public boolean removeAllUserProducts(String token, String targetUsername) {
        infoLogger.info("Attempting to remove all products for user: " + targetUsername);

        // 1. Localizar o utilizador autenticado pelo token
        UserEntity loggedUser = userDao.findUserByToken(token);
        if (loggedUser == null) {
            errorLogger.error("Invalid token. User not authenticated.");
            return false;
        }

        // 2. Verificar se o utilizador autenticado tem acesso de administrador
        if (!Boolean.TRUE.equals(loggedUser.getAdmin())) {
            errorLogger.error("User does not have administrative privileges.");
            return false;
        }

        // 3. Localizar o utilizador alvo cujos produtos serão apagados
        UserEntity targetUser = userDao.findUserByUsername(targetUsername);
        if (targetUser == null) {
            errorLogger.error("Target user not found.");
            return false;
        }

        // 4. Obter todos os produtos do utilizador destino
        List<ProductEntity> userProducts = productDao.findProductByUser(targetUser);
        if (userProducts == null || userProducts.isEmpty()) {
            infoLogger.info("No products found for user " + targetUsername + ". No deletion required.");
            return true; // Alterado para retornar true quando não há produtos
        }

        // 5. Remover todos os produtos pertencentes ao utilizzador destino
        for (ProductEntity product : userProducts) {
            try {
                productDao.remove(product);
            } catch (Exception e) {
                errorLogger.error("Error removing product ID: " + product.getIdProduto(), e);
                return false;
            }
        }

        productDao.flush(); // Garantir persistência imediata
        infoLogger.info("Successfully removed all products for user: " + targetUsername);
        return true;
    }

    private Product convertProductEntityToProductDto(ProductEntity productEntity) {
        Product productDto = new Product();
        productDto.setCategory(productEntity.getCategoria().getNome());
        productDto.setDate(productEntity.getDataPublicacao().toString());
        productDto.setDescription(productEntity.getDescricao());
        productDto.setId((int) productEntity.getIdProduto());
        productDto.setPicture(productEntity.getPhoto());
        productDto.setLocation(productEntity.getLocalizacao());
        productDto.setPrice(productEntity.getPreco());
        productDto.setSeller(productEntity.getOwner().getUsername());
        productDto.setStatus(State.valueOf(productEntity.getEstado()));
        productDto.setTitle(productEntity.getTitulo());

        if(productEntity.getDataModificacao() != null) {
            productDto.setAlterationDate(productEntity.getDataModificacao().toString());
        } else {
            productDto.setAlterationDate("N/A");
        }

        return productDto;
    }

    //verifica se um produto pertence a um utilizador
    public boolean isProductOwner(String username, Long id) {
        TypedQuery<Long> query = em.createQuery("select count(p) from ProductEntity p where p.owner.username = :username AND p.idProduto = :id", Long.class);
        query.setParameter("id", id);
        query.setParameter("username", username);
        long count = query.getSingleResult();

        if(count > 0) {
            return true;
        }

        return false;
    }

    public boolean isUserAdmin(String username) {
        try {
            UserEntity user = userDao.findUserByUsername(username);
            return user != null && user.getAdmin(); // Supondo que a entidade UserEntity tenha um campo boolean 'isAdmin'
        } catch (Exception e) {
            errorLogger.error("Failed to check if user is admin", e);
            return false;
        }
    }
}