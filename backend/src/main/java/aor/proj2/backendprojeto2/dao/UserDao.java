package aor.proj2.backendprojeto2.dao;

import aor.proj2.backendprojeto2.entity.ProductEntity;
import aor.proj2.backendprojeto2.entity.UserEntity;
import jakarta.ejb.Stateless;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Stateless
public class UserDao extends AbstractDao<UserEntity> {

  private static final long serialVersionUID = 1L;

  public UserDao() {
    super(UserEntity.class);
  }

  // Consultar o utilizador pelo token
  public UserEntity findUserByToken(String token) {
    try {
      return em.createNamedQuery("User.findUserByToken", UserEntity.class)
              .setParameter("token", token)
              .getSingleResult();
    } catch (NoResultException e) {
      return null; // Caso nenhum registro seja encontrado
    }
  }

  //encontra o user através do token de verificacao
  public UserEntity findUserByVerificationToken(String token) {
    try {
      return em.createNamedQuery("User.findUserByVerificationToken", UserEntity.class)
              .setParameter("token", token)
              .getSingleResult();
    } catch (NoResultException e) {
      return null;
    }

  }

  public UserEntity findUserByAlterationPasswordToken(String token) {
    try {
        return em.createNamedQuery("User.findUserByAlterationPasswordToken", UserEntity.class)
                .setParameter("token", token)
                .getSingleResult();
    } catch (NoResultException e) {
      return null;
    }
  }

  // Consultar o utilizador pelo username
  public UserEntity findUserByUsername(String username) {
    try {
      return (UserEntity) em.createNamedQuery("User.findUserByUsername")
              .setParameter("username", username)
              .getSingleResult();
    } catch (NoResultException e) {
      return null; // Caso nenhum registro seja encontrado
    }
  }

  // Consultar todos os utilizadores
  public List<UserEntity> findAllUsers() {
    return em.createQuery("SELECT u FROM UserEntity u", UserEntity.class).getResultList();
  }

  //Garante que todas as operações no banco de dados dentro do método sejam executadas como uma única transação.
//  @Transactional
//  public void deleteUser(UserEntity userEntity) {
//    // Obter ou criar o utilizador padrão
//    UserEntity defaultOwner = findOrCreateDefaultOwner();
//
//    // Encontrar e desassociar produtos pertencentes ao utilizador
//    List<ProductEntity> products = em.createQuery(
//                    "SELECT p FROM ProductEntity p WHERE p.owner = :owner", ProductEntity.class)
//            .setParameter("owner", userEntity)
//            .getResultList();
//
//    for (ProductEntity product : products) {
//      product.setOwner(defaultOwner); // Definir o utilizador padrão como proprietário
//      em.merge(product); // Atualizar na base de dados
//    }
//
//    // Remover utilizador
//    em.remove(em.contains(userEntity) ? userEntity : em.merge(userEntity));
//  }

  @Transactional
  public void deleteUser(UserEntity userEntity) {
    // Encontrar e desassociar produtos pertencentes ao utilizador
    List<ProductEntity> products = em.createQuery(
                    "SELECT p FROM ProductEntity p WHERE p.owner = :owner", ProductEntity.class)
            .setParameter("owner", userEntity)
            .getResultList();

    for (ProductEntity product : products) {
      product.setOwner(null); // Remove a relação com o usuário
      product.setCreatorInfo("Usuário excluído"); // Atualizar o campo creatorInfo
      em.merge(product); // Atualizar na base de dados
    }

    // Invalidar o token do utilizador antes de removê-lo
    userEntity.setToken(null);
    em.merge(userEntity);

    // Remover utilizador
    em.remove(em.contains(userEntity) ? userEntity : em.merge(userEntity));
  }

  //verifica se um user tem a conta verificada
  public boolean isUserVerified(String username) {
    try {
      // Executa a named query para verificar se o usuário está verificado
      UserEntity user = (UserEntity) em.createNamedQuery("User.findUserByUsernameAndVerified")
              .setParameter("username", username)
              .getSingleResult();
      return user != null;  // Se o usuário for encontrado e estiver verificado, retorna true
    } catch (NoResultException e) {
      return false; // Se não encontrar o usuário ou se ele não estiver verificado, retorna false
    }
  }

  //Verifica com base no token sem o user tem conta ativa, verificada e permissao de admin
  public Object[] checkUserStatusByToken(String token) {
    try {
      return (Object[]) em.createNamedQuery("User.checkUserStatusByToken")
              .setParameter("token", token)
              .getSingleResult();
    } catch (NoResultException e) {
      return null;
    }
  }

  // Busca usuários ativos e verificados, ordenados por username
  public List<UserEntity> findActiveAndVerifiedUsers(String search) {
    return em.createNamedQuery("User.findActiveAndVerified", UserEntity.class)
            .setParameter("ativo", "ativo")
            .setParameter("search", (search == null || search.trim().isEmpty()) ? null : search)
            .getResultList();
  }

  // Contar o número total de utilizadores
  public int countAllUsers() {
    try {
      Long count = em.createQuery("SELECT COUNT(u) FROM UserEntity u", Long.class)
              .getSingleResult();
      System.out.println("total users: " + count);
      return count.intValue();
    } catch (Exception e) {
      e.printStackTrace();
      return 0; // Retorna 0 em caso de erro
    }
  }

  // Contar o número de utilizadores com contas verificadas
  public int countVerifiedUsers() {
    try {
      Long count = em.createQuery("SELECT COUNT(u) FROM UserEntity u WHERE u.isVerified = true", Long.class)
              .getSingleResult();
      return count.intValue();
    } catch (Exception e) {
      e.printStackTrace();
      return 0; // Retorna 0 em caso de erro
    }
  }

  // Contar registros de utilizadores agrupados por data
  public List<Object[]> countUsersByDate() {
    try {
      return em.createQuery(
              "SELECT FUNCTION('DATE', u.dataCriacao), COUNT(u) " +
                      "FROM UserEntity u " +
                      "GROUP BY FUNCTION('DATE', u.dataCriacao) " +
                      "ORDER BY FUNCTION('DATE', u.dataCriacao)", Object[].class
      ).getResultList();
    } catch (Exception e) {
      e.printStackTrace();
      return Collections.emptyList();
    }
  }

  //Verifica se um token é válido
  public boolean isTokenValid(String token) {
    try {
      // Consulta para verificar se o token é válido
      UserEntity user = em.createQuery(
                      "SELECT u FROM UserEntity u WHERE u.token = :token AND u.tokenExpiration > CURRENT_TIMESTAMP AND u.estado = 'ativo'",
                      UserEntity.class)
              .setParameter("token", token)
              .getSingleResult();

      // Se o usuário for encontrado, o token é válido
      return user != null;
    } catch (NoResultException e) {
      // Nenhum usuário encontrado com o token fornecido
      return false;
    } catch (Exception e) {
      // Log de erro para depuração
      e.printStackTrace();
      return false;
    }
  }


  private UserEntity findOrCreateDefaultOwner() {
    // Verificar se o utilizador padrão já existe
    UserEntity defaultOwner = em.createQuery("SELECT u FROM UserEntity u WHERE u.username = :username", UserEntity.class)
            .setParameter("username", "default")
            .getResultStream()
            .findFirst()
            .orElse(null);

    if (defaultOwner == null) {
      // Criar o utilizador padrão se não existir
      defaultOwner = new UserEntity();
      defaultOwner.setUsername("Utilizador_Excluido");
      defaultOwner.setPassword("defaultpassword");
      defaultOwner.setName("Default");
      defaultOwner.setLastName("User");
      defaultOwner.setEmail("default@domain.com");
      defaultOwner.setPhone("000000000");
      defaultOwner.setPhotoUrl("https://default.photo.url");
      defaultOwner.setEstado("ativo");
      defaultOwner.setAdmin(false); // Definindo se é admin ou não

      // Definir a data de criação como o momento atual
      defaultOwner.setDataCriacao(LocalDate.now());

      em.persist(defaultOwner); // Persistir o utilizador no banco de dados
    }

    return defaultOwner;
  }

}

