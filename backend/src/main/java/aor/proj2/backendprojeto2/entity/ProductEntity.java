package aor.proj2.backendprojeto2.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;

@Entity
@Table(name = "produto")
@NamedQuery(name = "Product.findProductById", query = "SELECT a FROM ProductEntity a WHERE a.id = :id")
@NamedQuery(name = "Product.findProductByUser", query = "SELECT a FROM ProductEntity a WHERE a.owner = :owner")
@NamedQuery(name = "Product.findProductByCategory", query = "SELECT a FROM ProductEntity a WHERE a.categoria.nome = :category")
@NamedQuery(name = "Product.findProductByUsername", query = "SELECT a FROM ProductEntity a WHERE a.owner.username = :owner")
public class ProductEntity implements Serializable {
  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "idProduto", nullable = false, unique = true, updatable = false)
  private long idProduto;

  @Column(name = "titulo", nullable = false)
  private String titulo;

  @Column(name = "descricao", nullable = false, length = 512)
  private String descricao;

  @Column(name = "preco", nullable = false)
  private double preco;

  @Column(name = "localizacao", nullable = false)
  private String localizacao;

  @Column(name = "estado", nullable = false)
  private String estado;

  @Column(name = "data_publicacao", nullable = false, columnDefinition = "TIMESTAMP")
  private Timestamp dataPublicacao;

  @Column(name = "data_modificacao", columnDefinition = "TIMESTAMP")
  private Timestamp dataModificacao;

  @Column(name = "photo", nullable = false)
  private String photo;

  @ManyToOne
  @JoinColumn(name = "utilizador_username", referencedColumnName = "username", nullable = true) // Permite null
  private UserEntity owner;

  @ManyToOne
  private CategoryEntity categoria;

  public ProductEntity() {}

  // Getters e setters
  public long getIdProduto() {
    return idProduto;
  }

  public void setIdProduto(long idProduto) {
    this.idProduto = idProduto;
  }

  public String getTitulo() {
    return titulo;
  }

  public void setTitulo(String titulo) {
    this.titulo = titulo;
  }

  public String getDescricao() {
    return descricao;
  }

  public void setDescricao(String descricao) {
    this.descricao = descricao;
  }

  public double getPreco() {
    return preco;
  }

  public void setPreco(double preco) {
    this.preco = preco;
  }

  public String getLocalizacao() {
    return localizacao;
  }

  public void setLocalizacao(String localizacao) {
    this.localizacao = localizacao;
  }

  public String getEstado() {
    return estado;
  }

  public void setEstado(String estado) {
    this.estado = estado;
  }

  public Timestamp getDataPublicacao() {
    return dataPublicacao;
  }

  public void setDataPublicacao(Timestamp dataPublicacao) {
    this.dataPublicacao = dataPublicacao;
  }

  public Timestamp getDataModificacao() {
    return dataModificacao;
  }

  public void setDataModificacao(Timestamp dataModificacao) {
    this.dataModificacao = dataModificacao;
  }

  public String getPhoto() {
    return photo;
  }

  public void setPhoto(String photo) {
    this.photo = photo;
  }

  public UserEntity getOwner() {
    return owner;
  }

  public void setOwner(UserEntity owner) {
    this.owner = owner;
  }

  public CategoryEntity getCategoria() {
    return categoria;
  }

  public void setCategoria(CategoryEntity categoria) {
    this.categoria = categoria;
  }
}
