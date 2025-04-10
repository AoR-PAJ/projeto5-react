package aor.proj2.backendprojeto2.bean;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

@Stateless
public class SettingsBean {
  @PersistenceContext
  private EntityManager em;

  public int getTokenDuration() {
    TypedQuery<Integer> query = em.createNamedQuery("Settings.findTokenExpiration", Integer.class);
    Integer tokenExpirationMinutes = query.getSingleResult();

    return tokenExpirationMinutes;
  }

  public void changeSessionExpiration(int minutes) {
    em.createNamedQuery("Settings.changeSessionExpiration")
            .setParameter("minutes", minutes)
            .executeUpdate();
  }
}
