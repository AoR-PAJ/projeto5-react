package aor.proj2.backendprojeto2.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Set;

@Entity
@Table(name="categoria")

public class CategoryEntity implements Serializable {
  private static final long serialVersionUID = 1L;

  @Id
  @Column(name="nome", nullable = false, unique = true, updatable = false)
  private String nome;

  @OneToMany(mappedBy = "categoria")
  private Set<ProductEntity> produtos;

  public CategoryEntity() {}

  public String getNome() {
    return nome;
  }

  public void setNome(String nome) {
    this.nome = nome;
  }

  public Set<ProductEntity> getProdutos() {
    return produtos;
  }

  public void setProdutos(Set<ProductEntity> produtos) {
    this.produtos = produtos;
  }
}

