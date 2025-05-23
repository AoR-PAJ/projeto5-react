package aor.proj2.backendprojeto2.bean;

import aor.proj2.backendprojeto2.dao.CategoryDao;
import aor.proj2.backendprojeto2.dto.CategoryDto;
import aor.proj2.backendprojeto2.entity.CategoryEntity;
import aor.proj2.backendprojeto2.websockets.StatsWebSocket;
import jakarta.ejb.EJB;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Stateless
public class CategoryBean {
    private static final Logger infoLogger = LogManager.getLogger(RegisterUserBean.class);
    private static final Logger errorLogger = LogManager.getLogger(RegisterUserBean.class);

    @EJB
    CategoryDao categoryDao;

    @Inject
    private StatsWebSocket statsWebSocket;

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

    //Busca e ordena as categorias pela quantidade de produtos
    public List<Map<String, Object>> getCategoriesSortedByProductCount() {
        List<Object[]> results = categoryDao.getCategoriesWithProductCount();

        return results.stream()
                .map(row -> Map.of(
                        "category", row[0],
                        "productCount", ((Long) row[1]).intValue() // Converte Long para int
                ))
                .sorted((a, b) -> Integer.compare((int) b.get("productCount"), (int) a.get("productCount"))) // Ordena em ordem decrescente
                .collect(Collectors.toList());  
    }

    // Atualiza as estatísticas de categorias e envia via WebSocket
    public void updateCategoryStats() {
        try {
            List<Map<String, Object>> categoryStats = getCategoriesSortedByProductCount();

            StringBuilder statsMessage = new StringBuilder("{\"type\": \"categoryStats\", \"payload\": [");
            for (int i = 0; i < categoryStats.size(); i++) {
                Map<String, Object> category = categoryStats.get(i);
                statsMessage.append("{")
                        .append("\"category\": \"").append(category.get("category")).append("\", ")
                        .append("\"productCount\": ").append(category.get("productCount"))
                        .append("}");
                if (i < categoryStats.size() - 1) {
                    statsMessage.append(", ");
                }
            }
            statsMessage.append("]}");

            // Enviar as estatísticas para o WebSocket
            statsWebSocket.broadcast(statsMessage.toString());
            infoLogger.info("Estatísticas de categorias enviadas via WebSocket.");
        } catch (Exception e) {
            errorLogger.error("Erro ao atualizar estatísticas de categorias: " + e.getMessage(), e);
        }
    }
}