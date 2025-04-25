package aor.proj2.backendprojeto2.entity;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name="notificacoes")
public class NotificationEntity implements Serializable {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String userId; // ID do usuário associado à notificação
  private String message; // Mensagem da notificação
  private boolean read; // Status de leitura da notificação

  // Construtor padrão
  public NotificationEntity() {}

  // Construtor com parâmetros
  public NotificationEntity(String userId, String message, boolean read) {
    this.userId = userId;
    this.message = message;
    this.read = read;
  }

  // Getters e Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public boolean isRead() {
    return read;
  }

  public void setRead(boolean read) {
    this.read = read;
  }
}
