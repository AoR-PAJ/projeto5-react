package aor.proj2.backendprojeto2.dto;

public class NotificationDto {
  private Long id;
  private String userId; // ID do usuário associado à notificação
  private String message;
  private boolean read;

  // Construtor
  public NotificationDto() {}

  public NotificationDto(Long id, String userId, String message, boolean read) {
    this.id = id;
    this.userId = userId;
    this.message = message;
    this.read = read;
  }

  // Construtor sem userId (caso necessário)
  public NotificationDto(Long id, String message, boolean read) {
    this.id = id;
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
