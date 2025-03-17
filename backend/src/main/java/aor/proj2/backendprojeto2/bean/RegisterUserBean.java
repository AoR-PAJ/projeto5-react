package aor.proj2.backendprojeto2.bean;

import aor.proj2.backendprojeto2.dao.UserDao;
import aor.proj2.backendprojeto2.dto.UserDto;
import aor.proj2.backendprojeto2.entity.ProductEntity;
import aor.proj2.backendprojeto2.entity.UserEntity;
import jakarta.ejb.EJB;
import jakarta.enterprise.context.ApplicationScoped;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;

@ApplicationScoped
public class RegisterUserBean {

    private static final Logger infoLogger = LogManager.getLogger(RegisterUserBean.class);
    private static final Logger errorLogger = LogManager.getLogger(RegisterUserBean.class);

    @EJB
    private UserDao userDao;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Registar um novo utilizador
    public UserEntity registerUser(UserDto userDto) {
        infoLogger.info("Registering user: " + userDto.getUsername());
        if (userDao.findUserByUsername(userDto.getUsername()) != null) {
            errorLogger.error("Username already exists: " + userDto.getUsername());
            throw new IllegalArgumentException("Username já existe!");
        }

        // Encripta a senha
        String hashedPassword = passwordEncoder.encode(userDto.getPassword());

        // Converte guarda o utilizador
        UserEntity userEntity = convertUserDtoToUserEntity(userDto);
        userEntity.setPassword(hashedPassword); // Armazena a senha encriptada
        userEntity.setDataCriacao(LocalDate.now());
        userDao.persist(userEntity);

        infoLogger.info("User registered successfully: " + userDto.getUsername());
        return userEntity;
    }

    // Obter um utilizador pelo username
    public UserDto getUser(String username) {
        infoLogger.info("Fetching user data for username: " + username);
        UserEntity userEntity = userDao.findUserByUsername(username);
        if (userEntity != null) {
            infoLogger.info("User data fetched successfully for username: " + username);
            return convertUserEntityToUserDto(userEntity);
        }
        errorLogger.warn("User not found: " + username);
        return null;
    }



// No arquivo RegisterUserBean.java

    // Fazer login verificando a senha e gerando um token
    public String login(String username, String password) {
        infoLogger.info("Attempting login for username: " + username);
        UserEntity user = userDao.findUserByUsername(username);

        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            if ("inativo".equalsIgnoreCase(user.getEstado())) {
                errorLogger.warn("Login failed for username: " + username + " - Account is inactive");
                return null; // Conta inativa
            }

            // Senha válida - gera um token
            String token = generateNewToken();
            user.setToken(token);
            userDao.merge(user);
            infoLogger.info("Login successful for username: " + username);
            return token;
        }

        errorLogger.warn("Login failed for username: " + username);
        return null;
    }
    // Logout: desativar o token
    public boolean logout(String token) {
        infoLogger.info("Attempting logout for token: " + token);
        UserEntity user = userDao.findUserByToken(token);
        if (user != null) {
            user.setToken(null);
            userDao.merge(user);
            infoLogger.info("Logout successful for token: " + token);
            return true;
        }
        errorLogger.warn("Logout failed for token: " + token);
        return false;
    }

    // Excluir um utilizador pelo username
    public boolean deleteUser(String username) {
        infoLogger.info("Deleting user with username: {}", username);
        UserEntity userEntity = userDao.findUserByUsername(username);
        if (userEntity != null) {
            userDao.deleteUser(userEntity); // Deleção com desassociação dos produtos
            infoLogger.info("User '{}' successfully deleted.", username);
            return true;
        }
        errorLogger.warn("User '{}' not found for deletion.", username);
        return false;
    }


    // Obter a entidade do utilizador pelo username
    public UserEntity getUserEntity(String username) {
        infoLogger.info("Fetching user entity for username: " + username);
        return userDao.findUserByUsername(username);
    }

    // Conversão de UserDto para UserEntity
    private UserEntity convertUserDtoToUserEntity(UserDto userDto) {
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(userDto.getUsername());
        userEntity.setPassword(userDto.getPassword());
        userEntity.setEmail(userDto.getEmail());
        userEntity.setName(userDto.getFirstName());
        userEntity.setLastName(userDto.getLastName());
        userEntity.setPhone(userDto.getPhone());
        userEntity.setPhotoUrl(userDto.getPhotoUrl());
        userEntity.setEstado(userDto.getEstado());
        userEntity.setAdmin(userDto.getAdmin());
        userEntity.setDataCriacao(userDto.getDataCriacao());
        userEntity.setToken(userDto.getToken());
        return userEntity;
    }

    // Conversão de UserEntity para UserDto
    private UserDto convertUserEntityToUserDto(UserEntity userEntity) {
        UserDto userDto = new UserDto();
        userDto.setUsername(userEntity.getUsername());
        userDto.setPassword("***"); // Exibe senha mascarada como ***
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

    // Gerar um token único
    private String generateNewToken() {
        SecureRandom secureRandom = new SecureRandom();
        Base64.Encoder base64Encoder = Base64.getUrlEncoder();
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }
}