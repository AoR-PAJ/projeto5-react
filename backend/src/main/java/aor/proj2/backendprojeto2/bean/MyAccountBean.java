package aor.proj2.backendprojeto2.bean;

import aor.proj2.backendprojeto2.dao.UserDao;
import aor.proj2.backendprojeto2.dto.UserDto;
import aor.proj2.backendprojeto2.entity.UserEntity;
import jakarta.ejb.EJB;
import jakarta.enterprise.context.ApplicationScoped;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class MyAccountBean {
    private static final Logger infoLogger = LogManager.getLogger(MyAccountBean.class);
    private static final Logger errorLogger = LogManager.getLogger(MyAccountBean.class);

    @EJB
    private UserDao userDao;

    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }

    // Obter um utilizador pelo nome de utilizador
    public UserDto getUser(String username) {
        infoLogger.info("Fetching user data for username: " + username);
        UserEntity userEntity = userDao.findUserByUsername(username);
        if (userEntity != null) {
            infoLogger.info("User data fetched successfully for username: " + username);
            return convertUserEntityToUserDto(userEntity);
        }
        errorLogger.warn("User not found: " + username);
        return null; // Retorna null se o utilizador não for encontrado
    }

    // Obter um utilizador pelo token
    public UserDto getUserByToken(String token) {
        infoLogger.info("Fetching user data for token: " + token);
        UserEntity userEntity = userDao.findUserByToken(token);
        if (userEntity != null) {
            infoLogger.info("User data fetched successfully for token: " + token);
            return convertUserEntityToUserDto(userEntity);
        }
        errorLogger.warn("User not found for token: " + token);
        return null; // Retorna null se o utilizador não for encontrado
    }

    public boolean updateUserByTokenAndUsername(String token, String username, UserDto updatedUser) {
        infoLogger.info("Attempting to update user with username: " + username + " and provided token.");

        UserEntity currentUser = userDao.findUserByToken(token);

        if (currentUser == null) {
            errorLogger.error("Invalid token. User not authenticated.");
            return false; // Token inválido ou utilizador não encontrado
        }

        if (Boolean.TRUE.equals(currentUser.getAdmin())) {
            infoLogger.info("Action authorized: User with token is an administrator.");
        } else if (!username.equals(currentUser.getUsername())) {
            errorLogger.error("Action denied: Only administrators can change other profiles.");
            return false;
        }

        UserEntity userToUpdate = userDao.findUserByUsername(username);
        if (userToUpdate == null) {
            errorLogger.error("User not found in database: " + username);
            return false; // Utilizador não encontrado
        }

        try {
            infoLogger.info("Updating user information...");
            userToUpdate.setName(updatedUser.getFirstName());
            userToUpdate.setLastName(updatedUser.getLastName());
            userToUpdate.setEmail(updatedUser.getEmail());
            userToUpdate.setPhone(updatedUser.getPhone());
            userToUpdate.setPhotoUrl(updatedUser.getPhotoUrl());
            userToUpdate.setEstado(updatedUser.getEstado()); // Atualiza o estado do utilizador
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                userToUpdate.setPassword(updatedUser.getPassword());
            }

            userDao.merge(userToUpdate);
            infoLogger.info("User information updated successfully for username: " + username);
            return true;
        } catch (Exception e) {
            errorLogger.error("Error updating user information: " + e.getMessage(), e);
            return false;
        }
    }

    // Listar todos os utilizadores
    public List<UserDto> listUsers() {
        infoLogger.info("Listing all users");
        List<UserEntity> userEntities = userDao.findAllUsers();
        List<UserDto> userDtos = userEntities.stream()
                .map(this::convertUserEntityToUserDto)
                .collect(Collectors.toList());
        infoLogger.info("Users listed successfully");
        return userDtos;
    }

    // Conversão de UserEntity para UserDto
    private UserDto convertUserEntityToUserDto(UserEntity userEntity) {
        UserDto userDto = new UserDto();
        userDto.setUsername(userEntity.getUsername());
        userDto.setEmail(userEntity.getEmail());
        userDto.setFirstName(userEntity.getName());
        userDto.setLastName(userEntity.getLastName());
        userDto.setPhone(userEntity.getPhone());
        userDto.setPhotoUrl(userEntity.getPhotoUrl());
        userDto.setEstado(userEntity.getEstado());
        userDto.setAdmin(userEntity.getAdmin());
        userDto.setDataCriacao(userEntity.getDataCriacao());
        userDto.setToken(userEntity.getToken());
        return userDto;
    }

    public boolean inativarConta(String username) {
        infoLogger.info("Deactivating account for username: " + username);
        UserEntity user = userDao.findUserByUsername(username);
        String contaAtiva = user.getEstado();

        if (contaAtiva.equalsIgnoreCase("inativo")) {
            errorLogger.error("Account for " + username + " is already inactive");
            return true;
        }

        user.setEstado("inativo");
        userDao.merge(user);
        infoLogger.info("Account deactivated successfully for username: " + username);
        return true;
    }

    public boolean ativarConta(String username) {
        infoLogger.info("Reactivating account for username: " + username);
        UserEntity user = userDao.findUserByUsername(username);
        String contaAtiva = user.getEstado();

        if (contaAtiva.equalsIgnoreCase("ativo")) {
            errorLogger.error("Account for " + username + " is already active");
            return true;
        }

        user.setEstado("ativo");
        userDao.merge(user);
        infoLogger.info("Account reactivated successfully for username: " + username);
        return true;
    }
}