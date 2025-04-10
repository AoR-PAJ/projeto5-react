package aor.proj2.backendprojeto2.dto;

import aor.proj2.backendprojeto2.entity.SettingsEntity;

public class SettingsDto {
  private int tokenExpirationMinutes;
  private int sessionExpirationMinutes; // Novo campo

  // Construtores
  public SettingsDto() {
  }

  public SettingsDto(int tokenExpirationMinutes, int sessionExpirationMinutes) {
    this.tokenExpirationMinutes = tokenExpirationMinutes;
    this.sessionExpirationMinutes = sessionExpirationMinutes;
  }

  // Getters e Setters
  public int getTokenExpirationMinutes() {
    return tokenExpirationMinutes;
  }

  public void setTokenExpirationMinutes(int tokenExpirationMinutes) {
    this.tokenExpirationMinutes = tokenExpirationMinutes;
  }

  public int getSessionExpirationMinutes() {
    return sessionExpirationMinutes;
  }

  public void setSessionExpirationMinutes(int sessionExpirationMinutes) {
    this.sessionExpirationMinutes = sessionExpirationMinutes;
  }

  // Converte Entity -> DTO
  public static SettingsDto convertSettingsEntityToSettingsDto(SettingsEntity settingsEntity) {
    SettingsDto sdto = new SettingsDto();
    sdto.setTokenExpirationMinutes(settingsEntity.getTokenExpirationMinutes());
    sdto.setSessionExpirationMinutes(settingsEntity.getSessionExpirationMinutes()); // Adicionado
    return sdto;
  }

  // Converte DTO -> Entity
  public static SettingsEntity convertSettingsDtoToSettingsEntity(SettingsDto settingsDto) {
    SettingsEntity st = new SettingsEntity();
    st.setTokenExpirationMinutes(settingsDto.getTokenExpirationMinutes());
    st.setSessionExpirationMinutes(settingsDto.getSessionExpirationMinutes()); // Adicionado
    return st;
  }
}