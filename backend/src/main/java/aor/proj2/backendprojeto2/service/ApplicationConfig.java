package aor.proj2.backendprojeto2.service;
import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

//Define o caminho base para todos os endpoints da aplicação (neste caso, "/rest").
@ApplicationPath("/rest")

//Esta classe configura a aplicação Jakarta RESTful Web Services (JAX-RS).
//A extensão da classe Application é necessária para integrar o comportamento REST na aplicação.
public class ApplicationConfig extends Application {

}