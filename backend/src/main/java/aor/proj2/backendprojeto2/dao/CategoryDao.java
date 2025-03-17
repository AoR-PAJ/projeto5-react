package aor.proj2.backendprojeto2.dao;

import aor.proj2.backendprojeto2.entity.CategoryEntity;
import jakarta.ejb.Stateless;

@Stateless
public class CategoryDao extends AbstractDao<CategoryEntity> {

  private static final long serialVersionUID = 1L;
  public CategoryDao() {
    super(CategoryEntity.class);
  }
}
