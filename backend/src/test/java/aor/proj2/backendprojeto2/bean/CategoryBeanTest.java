package aor.proj2.backendprojeto2.bean;

import aor.proj2.backendprojeto2.dao.CategoryDao;
import aor.proj2.backendprojeto2.dto.CategoryDto;
import aor.proj2.backendprojeto2.entity.CategoryEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CategoryBeanTest {

    @Mock
    private CategoryDao categoryDao; // Mock do DAO de categorias.

    @InjectMocks
    private CategoryBean categoryBean; // Classe CategoryBean que será testada.

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this); // Inicializa os mocks do Mockito.
    }

    @Test
    void testNewCategory_Success() {
        // Configura uma nova categoria fictícia
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setNome("Roupa");

        // Simular que a categoria não existe
        when(categoryDao.existsByName("Roupa")).thenReturn(false);


        boolean result = categoryBean.newCategory(categoryDto);

        // Verificar que a categoria foi criada com sucesso
        assertTrue(result);
        verify(categoryDao, times(1)).persist(any(CategoryEntity.class)); // Garante que o DAO persistiu a categoria.
    }

    @Test
    void testNewCategory_AlreadyExists() {
        // Configura uma categoria fictícia que já existe
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setNome("Móveis");

        // Simular que a categoria já existe
        when(categoryDao.existsByName("Móveis")).thenReturn(true);


        boolean result = categoryBean.newCategory(categoryDto);

        // Verificar que a categoria não foi criada
        assertFalse(result);
        verify(categoryDao, never()).persist(any(CategoryEntity.class)); // Garante que o persist não foi chamado.
    }

    @Test
    void testGetAllCategories_Success() {
        // Configurar categorias fictícias no banco de dados
        List<CategoryEntity> mockCategories = Arrays.asList(
                createCategoryEntity("Moda"),
                createCategoryEntity("Automóveis"),
                createCategoryEntity("Livros")
        );

        // Simular o comportamento do DAO
        when(categoryDao.findAll()).thenReturn(mockCategories);


        ArrayList<CategoryDto> result = categoryBean.getAllCategories();

        // Verificar o resultado
        assertNotNull(result);
        assertEquals(3, result.size()); // Certifica que 3 categorias foram retornadas.
        assertEquals("Moda", result.get(0).getNome());
        assertEquals("Automóveis", result.get(1).getNome());
        assertEquals("Livros", result.get(2).getNome());
        verify(categoryDao, times(1)).findAll(); // Garante que o findAll foi chamado.
    }

    @Test
    void testGetAllCategories_EmptyList() {
        // Simular base dados vazia
        when(categoryDao.findAll()).thenReturn(new ArrayList<>());

        // Chamar o método a ser testado
        ArrayList<CategoryDto> result = categoryBean.getAllCategories();

        // Verificar que a lista retornada está vazia
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(categoryDao, times(1)).findAll(); // Garante que o findAll foi chamado mesmo com a lista vazia.
    }

    // auxiliar para criar uma CategoryEntity fictícia
    private CategoryEntity createCategoryEntity(String nome) {
        CategoryEntity categoryEntity = new CategoryEntity();
        categoryEntity.setNome(nome);
        return categoryEntity;
    }
}