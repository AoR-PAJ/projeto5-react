package aor.proj2.backendprojeto2.dao;

import java.io.Serializable;
import java.util.List;
import jakarta.ejb.TransactionAttribute;
import jakarta.ejb.TransactionAttributeType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaDelete;
import jakarta.persistence.criteria.CriteriaQuery;

@TransactionAttribute(TransactionAttributeType.REQUIRED)
public abstract class AbstractDao<T extends Serializable> implements Serializable {

    private static final long serialVersionUID = 1L;

    private final Class<T> clazz;

    @PersistenceContext(unitName = "playAula")
    protected EntityManager em;

    public AbstractDao(Class<T> clazz)
    {
        this.clazz = clazz;
    }


    public T find(Object id)
    {
        return em.find(clazz, id);
    }


    public void persist(final T entity)
    {
        em.persist(entity);
    }


    public void merge(final T entity)
    {
        em.merge(entity);
    }

    public void remove(final T entity)
    {
        em.remove(em.contains(entity) ? entity : em.merge(entity));
    }


    public List<T> findAll()
    {
        final CriteriaQuery<T> criteriaQuery = em.getCriteriaBuilder().createQuery(clazz);
        criteriaQuery.select(criteriaQuery.from(clazz));
        return em.createQuery(criteriaQuery).getResultList();
    }

//  força essa sincronização imediatamente, sem esperar o commit da transação.
    public void flush() {
        em.flush();
    }

    public boolean existsByName(String nome) {
        TypedQuery<Long> query = em.createQuery("Select count (c) from CategoryEntity c where c.nome = :nome", Long.class);
        query.setParameter("nome", nome);
        long count = query.getSingleResult();
        return count > 0;
    }
}