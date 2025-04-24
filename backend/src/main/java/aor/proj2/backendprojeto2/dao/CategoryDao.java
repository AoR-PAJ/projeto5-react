package aor.proj2.backendprojeto2.dao;

import aor.proj2.backendprojeto2.entity.CategoryEntity;
import jakarta.ejb.Stateless;

import java.util.List;

@Stateless
public class CategoryDao extends AbstractDao<CategoryEntity> {

  private static final long serialVersionUID = 1L;
  public CategoryDao() {
    super(CategoryEntity.class);
  }

  public List<Object[]> getCategoriesWithProductCount() {
    return em.createQuery(
            "SELECT c.nome, COUNT(p) " +
                    "FROM CategoryEntity c LEFT JOIN c.produtos p " +
                    "GROUP BY c.nome " +
                    "ORDER BY COUNT(p) DESC", Object[].class
    ).getResultList();
  }
}
