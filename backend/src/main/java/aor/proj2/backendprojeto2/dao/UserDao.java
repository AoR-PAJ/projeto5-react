package aor.proj2.backendprojeto2.dao;

import aor.proj2.backendprojeto2.entity.ProductEntity;
import aor.proj2.backendprojeto2.entity.UserEntity;
import jakarta.ejb.Stateless;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
    @Transactional
    public void deleteUser(UserEntity userEntity) {
        // Obter ou criar o utilizador padrão
        UserEntity defaultOwner = findOrCreateDefaultOwner();

        // Encontrar e desassociar produtos pertencentes ao utilizador
        List<ProductEntity> products = em.createQuery(
                        "SELECT p FROM ProductEntity p WHERE p.owner = :owner", ProductEntity.class)
                .setParameter("owner", userEntity)
                .getResultList();

        for (ProductEntity product : products) {
            product.setOwner(defaultOwner); // Definir o utilizador padrão como proprietário
            em.merge(product); // Atualizar na base de dados
        }

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

