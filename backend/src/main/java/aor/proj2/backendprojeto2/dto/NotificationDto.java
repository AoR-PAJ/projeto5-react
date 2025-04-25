package aor.proj2.backendprojeto2.dto;

public class NotificationDto {
  private Long id;
  private String message;
  private boolean read;

  // Construtor
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
