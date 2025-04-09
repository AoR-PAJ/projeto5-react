package aor.proj2.backendprojeto2.entity;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name="settings")
@NamedQuery(name="Settings.findTokenExpiration", query = "SELECT s.tokenExpirationMinutes FROM SettingsEntity s")
public class SettingsEntity implements Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "token_expiration_minutes", nullable = false)
  private int tokenExpirationMinutes;

  @Column(name = "session_expiration_minutes", nullable = false)
  private int sessionExpirationMinutes;

  public SettingsEntity() {
  }

  public SettingsEntity(Integer tokenExpirationMinutes) {
    this.tokenExpirationMinutes = tokenExpirationMinutes;
  }

  //Getters e Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public int getTokenExpirationMinutes() {
    return tokenExpirationMinutes;
  }

  public void setTokenExpirationMinutes(int tokenExpirationMinutes) {
    this.tokenExpirationMinutes = tokenExpirationMinutes;
  }
}
