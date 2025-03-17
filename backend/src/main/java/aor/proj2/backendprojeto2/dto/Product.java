package aor.proj2.backendprojeto2.dto;

import aor.proj2.backendprojeto2.utils.State;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Product {

    String category;
    String date;
    String alterationDate;
    String description;
    int id;
    String location;
    String picture; // imagem em formato Base64 pode ser armazenada como String
    double price;
    String seller;
    State status;
    String title;

    // O construtor vazio é necessário por três razões principais:
    // 1. Os 'frameworks' Java exigem um construtor padrão (Jakarta REST (JAX-RS) e JPA/Hibernate precisam de um construtor sem argumentos para poderem criar objetos dinamicamente)
    // 2. Serialização JSON/XML (bibliotecas como Jackson e JAXB usam o construtor vazio para instanciar o objeto antes de preencher os valores)
    // 3. Permite a criação do objeto sem precisar definir imediatamente todos os atributos
    public Product() {
    }

    public Product(String category, String date, String description, int id, String picture, String location, double price, String seller, State status, String title, String alterationDate) {
        this.category = category;
        this.date = date;
        this.description = description;
        this.id = id;
        this.picture = picture;
        this.location = location;
        this.price = price;
        this.seller = seller;
        this.status = status;
        this.title = title;
        this.alterationDate = alterationDate;
    }

    // Getters
    @XmlElement
    public String getCategory() {
        return category;
    }

    @XmlElement
    public String getDate() {
        return date;
    }

    @XmlElement
    public String getDescription() {
        return description;
    }

    @XmlElement
    public int getId() {
        return id;
    }

    @XmlElement
    public String getPicture() {
        return picture;
    }

    @XmlElement
    public String getLocation() {
        return location;
    }

    @XmlElement
    public double getPrice() {
        return price;
    }

    @XmlElement
    public String getSeller() {
        return seller;
    }

    @XmlElement
    public State getStatus() {
        return status;
    }

    @XmlElement
    public String getTitle() {
        return title;
    }

    @XmlElement
    public String getAlterationDate() {
        return alterationDate;
    }

    // Setters
    public void setCategory(String category) {
        this.category = category;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setSeller(String seller) {
        this.seller = seller;
    }

    public void setStatus(State status) {
        this.status = status;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setAlterationDate(String alterationDate) {
        this.alterationDate = alterationDate;
    }
}