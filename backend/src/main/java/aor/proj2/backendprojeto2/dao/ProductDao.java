package aor.proj2.backendprojeto2.dao;

import aor.proj2.backendprojeto2.entity.ProductEntity;
import aor.proj2.backendprojeto2.entity.UserEntity;
import jakarta.ejb.Stateless;

import java.math.BigDecimal;
import java.util.*;

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

    //Apagar produto de um utilizador pelo id do produto
    public void deleteById(Long productId) {
        ProductEntity product = em.find(ProductEntity.class, productId);
        if (product != null) {
            em.remove(product);
            em.flush(); // Garante que a remoção seja persistida imediatamente
        }
    }

    // Obter produtos de utilizadores com contas ativas
    public List<ProductEntity> findProductsByActiveUsers() {
        try {
            // suprimir avisos do compilador relacionados a operações não verificadas
            // (unchecked operations), normalmente em situações que envolvem "raw types" (tipos brutos) no Java.
            @SuppressWarnings("unchecked")
            List<ProductEntity> products = em.createQuery(
                    "SELECT p FROM ProductEntity p WHERE p.owner.estado = 'ativo' order by p.dataPublicacao DESC"
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

    public List<ProductEntity> findProductsByState(String estado) {
        try {
            return em.createQuery(
                            "SELECT p FROM ProductEntity p WHERE p.estado = :estado",
                            ProductEntity.class
                    )
                    .setParameter("estado", estado)
                    .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    //Contar todos os produto
    public int countAllProducts() {
        try {
            Long count = (Long) em.createQuery("SELECT COUNT(p) FROM ProductEntity p").getSingleResult();
            return count.intValue();
        } catch (Exception e) {
            e.printStackTrace();
            return 0; // Retorna 0 em caso de erro
        }
    }

    // Contar produtos agrupados por estado
    public Map<String, Integer> countProductsByState() {
        try {
            @SuppressWarnings("unchecked")
            List<Object[]> results = em.createQuery(
                    "SELECT p.estado, COUNT(p) FROM ProductEntity p GROUP BY p.estado"
            ).getResultList();

            // Converter a lista de resultados em um mapa
            Map<String, Integer> productStates = new HashMap<>();
            for (Object[] result : results) {
                String state = (String) result[0];
                Long count = (Long) result[1];
                productStates.put(state, count.intValue());
            }

            return productStates;
        } catch (Exception e) {
            e.printStackTrace();
            return new HashMap<>(); // Retorna um mapa vazio em caso de erro
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

    //Contar os produtos contados ao longo do tempo
    public List<Object[]> countCumulativePurchasesByDate() {
        return em.createQuery(
                "SELECT FUNCTION('DATE', p.dataCompra), COUNT(p) " +
                        "FROM ProductEntity p " +
                        "WHERE p.estado = 'COMPRADO' " +
                        "GROUP BY FUNCTION('DATE', p.dataCompra) " +
                        "ORDER BY FUNCTION('DATE', p.dataCompra)", Object[].class
        ).getResultList();
    }

    //calcula o tempo médio entre a data de publicao de um produto e a data da compra
    public Double calculateAverageTimeToPurchase() {
        try {
            String sql = """
            SELECT ROUND(AVG(EXTRACT(EPOCH FROM AGE(data_compra, data_publicacao)) / 86400), 2)
            FROM produto
            WHERE data_compra IS NOT NULL AND estado = 'COMPRADO'
        """;

            Object result = em.createNativeQuery(sql).getSingleResult();
            if (result != null) {
                return ((BigDecimal) result).doubleValue(); // Converte BigDecimal para Double
            }
            return null; // Retorna null se não houver resultado
        } catch (Exception e) {
            e.printStackTrace();
            return -1.0; // Retorna -1.0 em caso de erro
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