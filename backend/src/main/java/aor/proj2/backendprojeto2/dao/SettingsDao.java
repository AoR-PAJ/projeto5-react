package aor.proj2.backendprojeto2.dao;

import aor.proj2.backendprojeto2.entity.SettingsEntity;
import jakarta.ejb.Stateless;

@Stateless
public class SettingsDao extends AbstractDao<SettingsEntity> {
  private static final long serialVersionUID = 1L;

  public SettingsDao() {
    super(SettingsEntity.class);
  }

  // Método para obter o valor de sessionExpirationMinutes
  public int getSessionExpirationMinutes() {
    try {
      SettingsEntity settings = (SettingsEntity) em.createQuery("SELECT s FROM SettingsEntity s")
              .setMaxResults(1)
              .getSingleResult();
      return settings.getSessionExpirationMinutes();
    } catch (Exception e) {
      e.printStackTrace();
      // Retorna um valor padrão em caso de erro
      return 30; // Por exemplo, 30 minutos
    }
  }
}