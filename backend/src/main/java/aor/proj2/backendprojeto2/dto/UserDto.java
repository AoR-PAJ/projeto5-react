package aor.proj2.backendprojeto2.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Classe para representar os dados do utilizador que são enviados/recebidos pelas APIs (camada externa).
 */
public class UserDto {

    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String photoUrl;
    private String estado; // Representa o estado do utilizador (ativo/inativo)
    private Boolean admin; // Indica se o utilizador é administrador ou não
    private LocalDate dataCriacao; // Representa a data de criação do utilizador
    private String token;
    private Boolean isVerified = false; //indica se a conta está verificada ou nao (ou seja, após registada a conta foi confirmada pelo user)
    private String verificationToken;
    private LocalDateTime tokenExpiration;


    // Construtor vazio
    public UserDto() {
    }

    // Construtor com todos os atributos
    public UserDto(String username, String password, String firstName, String lastName, String email,
                   String phone, String photoUrl, String estado, Boolean admin,
                   LocalDate dataCriacao, String token) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.photoUrl = photoUrl;
        this.estado = estado;
        this.admin = admin;
        this.dataCriacao = dataCriacao;
        this.token = token;
        this.isVerified = isVerified;
    }

    // Getters e Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Boolean getAdmin() {
        return admin;
    }

    public void setAdmin(Boolean admin) {
        this.admin = admin;
    }

    public LocalDate getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDate dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public String getVerificationToken() {
        return verificationToken;
    }

    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }

    public LocalDateTime getTokenExpiration() {
        return tokenExpiration;
    }

    public void setTokenExpiration(LocalDateTime tokenExpiration) {
        this.tokenExpiration = tokenExpiration;
    }
}