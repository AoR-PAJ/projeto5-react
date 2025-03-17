package aor.proj2.backendprojeto2.dto;

public class CategoryDto {
  private String nome;

  public CategoryDto(String nome) {
    this.nome = nome;
  }

  public CategoryDto() {

  }

  // Getters e Setters

  public String getNome() {
    return nome;
  }

  public void setNome(String nome) {
    this.nome = nome;
  }
}

