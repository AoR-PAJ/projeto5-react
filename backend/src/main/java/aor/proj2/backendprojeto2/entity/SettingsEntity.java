package aor.proj2.backendprojeto2.entity;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "settings")
@NamedQuery(name = "Settings.findTokenExpiration", query = "SELECT s.tokenExpirationMinutes FROM SettingsEntity s")
@NamedQuery(name = "Settings.changeSessionExpiration", query = "UPDATE SettingsEntity s SET s.sessionExpirationMinutes = :minutes where s.id = 1" )
@NamedQuery(name ="Settings.getSessionExpiration", query = "SELECT s.sessionExpirationMinutes FROM SettingsEntity s where id = 1")
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

  // Getters e Setters
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

  public int getSessionExpirationMinutes() {
    return sessionExpirationMinutes;
  }

  public void setSessionExpirationMinutes(int sessionExpirationMinutes) {
    this.sessionExpirationMinutes = sessionExpirationMinutes;
  }
}