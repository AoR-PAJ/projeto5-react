/*
package aor.proj2.backendprojeto2.bean;

import aor.proj2.backendprojeto2.dao.UserDao;
import aor.proj2.backendprojeto2.dto.UserDto;
import aor.proj2.backendprojeto2.entity.UserEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RegisterUserBeanTest {

    @Mock
    private UserDao userDao; // Mock do UserDao para simular o comportamento do DAO

    @InjectMocks
    private RegisterUserBean registerUserBean; // Bean a ser testado

    private BCryptPasswordEncoder passwordEncoder;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this); // Inicializa Mockito
        passwordEncoder = new BCryptPasswordEncoder();
    }

    @Test
    void testRegisterUser_Success() {
        // Configurar dados de exemplo com nome realista
        UserDto userDto = new UserDto();
        userDto.setUsername("joao.silva");
        userDto.setPassword("senhaForte123");

        // Simular comportamento do DAO
        when(userDao.findUserByUsername("joao.silva")).thenReturn(null);


        UserEntity result = registerUserBean.registerUser(userDto);

        // Verificar resultados
        assertNotNull(result);
        assertEquals("joao.silva", result.getUsername());
        assertTrue(passwordEncoder.matches("senhaForte123", result.getPassword())); // Verifica se a senha está encriptada
        verify(userDao, times(1)).persist(any(UserEntity.class)); // Garante que o DAO foi chamado
    }

    @Test
    void testGetUser_Found() {
        // Configurar dados de exemplo
        String username = "ana_maria";
        UserEntity mockUserEntity = new UserEntity();
        mockUserEntity.setUsername("ana_maria");
        mockUserEntity.setPassword("hashedPassword");

        // Simular comportamento do DAO
        when(userDao.findUserByUsername(username)).thenReturn(mockUserEntity);


        UserDto result = registerUserBean.getUser(username);
        assertNotNull(result);
        assertEquals("ana_maria", result.getUsername());
        verify(userDao, times(1)).findUserByUsername(username);
    }

    @Test
    void testDeleteUser_Success() {
        // Configurar dados de exemplo
        String username = "fernando123";
        UserEntity mockUserEntity = new UserEntity();
        mockUserEntity.setUsername(username);

        // Simular comportamento do DAO
        when(userDao.findUserByUsername(username)).thenReturn(mockUserEntity);

        boolean result = registerUserBean.deleteUser(username);
        assertTrue(result);
        verify(userDao, times(1)).deleteUser(mockUserEntity); // Garante que o DAO foi chamado para excluir o usuário
    }

}*/
