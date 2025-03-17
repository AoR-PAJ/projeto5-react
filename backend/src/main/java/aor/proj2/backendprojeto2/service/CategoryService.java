package aor.proj2.backendprojeto2.service;

import aor.proj2.backendprojeto2.bean.CategoryBean;
import aor.proj2.backendprojeto2.dao.UserDao;
import aor.proj2.backendprojeto2.dto.CategoryDto;
import aor.proj2.backendprojeto2.entity.UserEntity;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.List;

@Path("/category")
public class CategoryService {

  private static final Logger infoLogger = LogManager.getLogger("infoLogger");
  private static final Logger errorLogger = LogManager.getLogger("errorLogger");

  @Inject
  private CategoryBean categoryBean;

  @Inject
  private UserDao user;

  @GET
  @Path("/all")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getCategorias() {
    List<CategoryDto> categorias = categoryBean.getAllCategories();
    infoLogger.info("Visualizou todas as categorias");
    return Response.status(200).entity(categorias).build();
  }

  @POST
  @Path("/create")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response createCategory(CategoryDto categoryDto, @HeaderParam("Authorization") String authorizationHeader) {

    if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer")) {
      errorLogger.error("Token ausente ou inválido");
      return Response.status(401).entity("Token ausente ou inválido").build();
    }

    String token = authorizationHeader.substring("Bearer ".length());

    UserEntity userIsAdmin = user.findUserByToken(token);
    if(!userIsAdmin.getAdmin()) {
      errorLogger.error("Tentativa de criar uma categoria por parte de um utilizador que não é administrador");
      return Response.status(400).entity("Não tem permissoes de administrador e nao pode criar uma categoria").build();
    }

    boolean categoryIsCreated = categoryBean.newCategory(categoryDto);
    if (categoryIsCreated) {
      infoLogger.info("\nNova categoria criada: " + categoryDto.getNome());
      return Response.status(201).entity("Nova categoria criada com sucesso").build();
    } else {
      errorLogger.error("\n[ERRO]tentativa de criar uma categoria já existente: " + categoryDto.getNome());
      return Response.status(400).entity("Esta categoria já existe!").build();
    }
  }
}


