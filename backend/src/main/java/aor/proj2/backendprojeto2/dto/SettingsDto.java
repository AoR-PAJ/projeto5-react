package aor.proj2.backendprojeto2.dto;

import aor.proj2.backendprojeto2.entity.SettingsEntity;

public class SettingsDto {
  private int tokenExpirationMinutes;

  //construtores
  public SettingsDto(){

  }

  public SettingsDto(int tokenExpirationMinutes) {
    this.tokenExpirationMinutes = tokenExpirationMinutes;
  }

  //gettters e setters
  public int getTokenExpirationMinutes() {
    return tokenExpirationMinutes;
  }

  public void setTokenExpirationMinutes(int tokenExpirationMinutes) {
    this.tokenExpirationMinutes = tokenExpirationMinutes;
  }

  //converts Entity -> DTO
  private SettingsDto convertSettingsEntityToSettingsDto(SettingsEntity settingsEntity) {
    SettingsDto sdto = new SettingsDto();

    sdto.setTokenExpirationMinutes(settingsEntity.getTokenExpirationMinutes());
    return sdto;
  }

  //converts DTO -> Entity
  private SettingsEntity convertSettingsDtotoSettignsEntity(SettingsDto settingsDto) {
    SettingsEntity st = new SettingsEntity();

    st.setTokenExpirationMinutes(settingsDto.getTokenExpirationMinutes());
    return st;
  }
}
