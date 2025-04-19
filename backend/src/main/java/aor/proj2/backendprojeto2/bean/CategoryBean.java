package aor.proj2.backendprojeto2.bean;

import aor.proj2.backendprojeto2.dao.CategoryDao;
import aor.proj2.backendprojeto2.dto.CategoryDto;
import aor.proj2.backendprojeto2.entity.CategoryEntity;
import jakarta.ejb.EJB;
import java.util.ArrayList;
import java.util.List;

import jakarta.ejb.Stateless;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Stateless
public class CategoryBean {
    private static final Logger infoLogger = LogManager.getLogger(RegisterUserBean.class);
    private static final Logger errorLogger = LogManager.getLogger(RegisterUserBean.class);

    @EJB
    CategoryDao categoryDao;

    public CategoryBean() {
    }

    public boolean newCategory(CategoryDto category) {
        //verifica se a categoria já foi criada na base de dados:
        if(categoryDao.existsByName(category.getNome())) {
            return false;
        }
        //se categoria nao existir ela é criada:
        CategoryEntity categoryEntity = new CategoryEntity();
        categoryEntity.setNome(category.getNome());
        categoryDao.persist(categoryEntity);

        return true;
    }

    public ArrayList<CategoryDto> getAllCategories() {
        String timestamp = java.time.LocalDateTime.now().toString();
        infoLogger.info("[{}] Starting retrieval of all categories.", timestamp);

        // Call findAll method and store in a List<CategoryEntity>
        List<CategoryEntity> allCategories = categoryDao.findAll();
        infoLogger.info("[{}] Retrieved {} categories from the database.", timestamp, allCategories.size());

        // Convert CategoryEntity to CategoryDto
        ArrayList<CategoryDto> categoryDtos = new ArrayList<>();

        for (CategoryEntity categoryEntity : allCategories) {
            CategoryDto categoryDto = new CategoryDto(categoryEntity.getNome());
            categoryDtos.add(categoryDto);
        }

        // Return List of CategoryDto
        return categoryDtos;
    }



}