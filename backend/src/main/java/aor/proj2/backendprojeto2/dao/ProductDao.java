package aor.proj2.backendprojeto2.dao;

import aor.proj2.backendprojeto2.entity.ProductEntity;
import aor.proj2.backendprojeto2.entity.UserEntity;
import jakarta.ejb.Stateless;
import java.util.ArrayList;
import java.util.List;

@Stateless
public class ProductDao extends AbstractDao<ProductEntity> {

    private static final long serialVersionUID = 1L;

    public ProductDao() {
        super(ProductEntity.class);
    }

    // Obter produtos de um utilizador
    public ArrayList<ProductEntity> findProductByUser(UserEntity userEntity) {
        try {
            @SuppressWarnings("unchecked")
            ArrayList<ProductEntity> activityEntityEntities =
                    (ArrayList<ProductEntity>) em.createNamedQuery("Product.findProductByUser")
                            .setParameter("owner", userEntity)
                            .getResultList();
            return activityEntityEntities;
        } catch (Exception e) {
            return null;
        }
    }

    // Obter produtos de utilizadores com contas ativas
    public List<ProductEntity> findProductsByActiveUsers() {
        try {
            // suprimir avisos do compilador relacionados a operações não verificadas
            // (unchecked operations), normalmente em situações que envolvem "raw types" (tipos brutos) no Java.
            @SuppressWarnings("unchecked")
            List<ProductEntity> products = em.createQuery(
                    "SELECT p FROM ProductEntity p WHERE p.owner.estado = 'ativo'"
            ).getResultList();
            return products;
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    // Obter um produto pelo ID do tipo Long
    public ProductEntity find(Long productId) {
        try {
            return em.find(ProductEntity.class, productId);
        } catch (IllegalArgumentException e) {
            return null; // Retorna null caso o ID seja inválido
        }
    }

    // Obter produtos modificados
    public List<ProductEntity> findModifiedProducts() {
        try {
            @SuppressWarnings("unchecked")
            List<ProductEntity> products = em.createQuery(
                    "SELECT p FROM ProductEntity p WHERE p.dataModificacao IS NOT NULL"
            ).getResultList();
            return products;
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    // Obter produtos com estado "inativo"
    public List<ProductEntity> findInactiveProducts() {
        try {
            @SuppressWarnings("unchecked")
            List<ProductEntity> inactiveProducts = em.createQuery(
                    "SELECT p FROM ProductEntity p WHERE p.estado = 'inativo'"
            ).getResultList();
            return inactiveProducts;
        } catch (Exception e) {
            return new ArrayList<>(); // Retorna uma lista vazia em caso de erro
        }
    }

    // Persistir alterações no produto
    public void merge(ProductEntity productEntity) {
        em.merge(productEntity); // Atualiza a entidade na base de dados
    }

    // Remover um produto
    public void remove(ProductEntity product) {
        if (!em.contains(product)) {
            product = em.merge(product);
        }
        em.remove(product);
    }
}