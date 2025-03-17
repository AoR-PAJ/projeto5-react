package aor.proj2.backendprojeto2.bean;

import aor.proj2.backendprojeto2.dao.UserDao;
import aor.proj2.backendprojeto2.dto.UserDto;
import aor.proj2.backendprojeto2.entity.UserEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MyAccountBeanTest {

    private MyAccountBean myAccountBean;
    private UserDao userDao;

    @BeforeEach
    void setup() {
        // Criar mock da classe UserDao
        userDao = mock(UserDao.class);

        // Instanciar a classe  e configurar o mock através do setter
        myAccountBean = new MyAccountBean();
        myAccountBean.setUserDao(userDao);
    }

    @Test
    void testGetUser_Success() {
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername("pedro");
        userEntity.setEmail("pedro@example.com");

        when(userDao.findUserByUsername("pedro")).thenReturn(userEntity);

        UserDto userDto = myAccountBean.getUser("pedro");

        assertNotNull(userDto);
        assertEquals("pedro", userDto.getUsername());
        assertEquals("pedro@example.com", userDto.getEmail());
    }

    @Test
    void testGetUser_NotFound() {
        when(userDao.findUserByUsername("nonexistent_user")).thenReturn(null);

        UserDto userDto = myAccountBean.getUser("nonexistent_user");

        assertNull(userDto);
    }

    @Test
    void testGetUserByToken_Success() {
        UserEntity userEntity = new UserEntity();
        userEntity.setToken("valid_token");
        userEntity.setUsername("pedro");

        when(userDao.findUserByToken("valid_token")).thenReturn(userEntity);

        UserDto userDto = myAccountBean.getUserByToken("valid_token");

        assertNotNull(userDto);
        assertEquals("valid_token", userDto.getToken());
        assertEquals("pedro", userDto.getUsername());
    }

    @Test
    void testGetUserByToken_NotFound() {
        when(userDao.findUserByToken("invalid_token")).thenReturn(null);

        UserDto userDto = myAccountBean.getUserByToken("invalid_token");

        assertNull(userDto);
    }

    @Test
    void testUpdateUserByTokenAndUsername_AdminSuccess() {
        UserEntity adminUser = new UserEntity();
        adminUser.setToken("admin_token");
        adminUser.setAdmin(true); // Token pertence a um administrador

        UserDto updatedDto = new UserDto();
        updatedDto.setFirstName("New Name");
        updatedDto.setEmail("updated.email@example.com");

        UserEntity userToUpdate = new UserEntity();
        userToUpdate.setUsername("pedro");

        when(userDao.findUserByToken("admin_token")).thenReturn(adminUser);
        when(userDao.findUserByUsername("pedro")).thenReturn(userToUpdate);

        boolean result = myAccountBean.updateUserByTokenAndUsername("admin_token", "pedro", updatedDto);

        assertTrue(result);
        verify(userDao, times(1)).merge(userToUpdate);
        assertEquals("New Name", userToUpdate.getName());
        assertEquals("updated.email@example.com", userToUpdate.getEmail());
    }

    @Test
    void testUpdateUserByTokenAndUsername_NotAdminButOwnAccount() {
        UserEntity regularUser = new UserEntity();
        regularUser.setToken("valid_token");
        regularUser.setAdmin(false);
        regularUser.setUsername("rita"); // utilizador normal tenta atualizar seu próprio perfil

        UserDto updatedDto = new UserDto();
        updatedDto.setFirstName("Updated Name");

        UserEntity userToUpdate = new UserEntity();
        userToUpdate.setUsername("rita");

        when(userDao.findUserByToken("valid_token")).thenReturn(regularUser);
        when(userDao.findUserByUsername("rita")).thenReturn(userToUpdate);

        boolean result = myAccountBean.updateUserByTokenAndUsername("valid_token", "rita", updatedDto);

        assertTrue(result);
        verify(userDao, times(1)).merge(userToUpdate);
        assertEquals("Updated Name", userToUpdate.getName());
    }

    @Test
    void testUpdateUserByTokenAndUsername_Unauthorized() {
        UserEntity regularUser = new UserEntity();
        regularUser.setToken("valid_token");
        regularUser.setAdmin(false);
        regularUser.setUsername("rita"); // utilizador normal tenta atualizar outro perfil

        when(userDao.findUserByToken("valid_token")).thenReturn(regularUser);

        boolean result = myAccountBean.updateUserByTokenAndUsername("valid_token", "other_user", new UserDto());

        assertFalse(result);
        verify(userDao, times(0)).merge(any());
    }

    @Test
    void testListUsers() {
        List<UserEntity> users = new ArrayList<>();
        UserEntity user1 = new UserEntity();
        user1.setUsername("pedro");
        users.add(user1);

        UserEntity user2 = new UserEntity();
        user2.setUsername("rita");
        users.add(user2);

        when(userDao.findAllUsers()).thenReturn(users);

        List<UserDto> userDtos = myAccountBean.listUsers();

        assertNotNull(userDtos);
        assertEquals(2, userDtos.size());
        assertEquals("pedro", userDtos.get(0).getUsername());
        assertEquals("rita", userDtos.get(1).getUsername());
    }

    @Test
    void testInactivateAccount_Success() {
        // Preparação do UserEntity com estado "ativo"
        UserEntity user = new UserEntity();
        user.setUsername("pedro");
        user.setEstado("ativo"); // Utilizador começa ativo

        when(userDao.findUserByUsername("pedro")).thenReturn(user);

        boolean result = myAccountBean.inativarConta("pedro");

        // Verificações do comportamento
        assertTrue(result); // Este deve dar true porque é o comportamento atual da função
        verify(userDao, times(1)).merge(user);
        assertEquals("inativo", user.getEstado().toLowerCase()); // Verifica se o estado foi alterado para "inativo"
    }

    @Test
    void testInactivateAccount_AlreadyInactive() {
        UserEntity user = new UserEntity();
        user.setUsername("pedro");
        user.setEstado("inativo"); // Utilizador já está inativo

        when(userDao.findUserByUsername("pedro")).thenReturn(user);

        boolean result = myAccountBean.inativarConta("pedro");

        assertTrue(result); // Deve retornar true porque já estava inativo
        verify(userDao, times(0)).merge(any());
    }
}
