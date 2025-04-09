package aor.proj2.backendprojeto2.dao;

import aor.proj2.backendprojeto2.entity.SettingsEntity;
import jakarta.ejb.Stateless;

@Stateless
public class SettingsDao extends AbstractDao<SettingsEntity>{
  private static final long serialVersionUID = 1L;

  public SettingsDao() {
    super(SettingsEntity.class);
  }


}
