package aor.proj2.backendprojeto2.service;

import aor.proj2.backendprojeto2.bean.CategoryBean;
import aor.proj2.backendprojeto2.dao.UserDao;
import aor.proj2.backendprojeto2.dto.CategoryDto;
import aor.proj2.backendprojeto2.dto.UserDto;
import aor.proj2.backendprojeto2.entity.UserEntity;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

//classe responsável por reunir os servicos relacionados as categorias dos produtos
@Path("/categories")
public class CategoryService {

  private static final Logger infoLogger = LogManager.getLogger("infoLogger");
  private static final Logger errorLogger = LogManager.getLogger("errorLogger");

  @Inject
  private CategoryBean categoryBean;

  @Inject
  private UserDao user;

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response getCategorias() {
    String timestamp = LocalDateTime.now().toString();
    infoLogger.info("[{}] Retrieving all categories.", timestamp);

    try {
      List<CategoryDto> categorias = categoryBean.getAllCategories();
      infoLogger.info("[{}] Successfully retrieved {} categories.", timestamp, categorias.size());
      return Response.status(200).entity(categorias).build();
    } catch (Exception e) {
      errorLogger.error("[{}] Error while retrieving categories: {}", timestamp, e.getMessage(), e);
      return Response.status(500).entity("Error retrieving categories").build();
    }
  }

  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response createCategory(CategoryDto categoryDto, @HeaderParam("Authorization") String authorizationHeader) {
    String timestamp = LocalDateTime.now().toString();

    if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer")) {
      errorLogger.error("[{}] Missing or invalid token.", timestamp);
      return Response.status(401).entity("Missing or invalid token").build();
    }

    String token = authorizationHeader.substring("Bearer ".length());
    UserEntity userIsAdmin = user.findUserByToken(token);

    if (userIsAdmin == null) {
      errorLogger.error("[{}] Invalid token: user not found.", timestamp);
      return Response.status(401).entity("Invalid token").build();
    }

    if (!userIsAdmin.getAdmin()) {
      errorLogger.error("[{}] User '{}' attempted to create a category without admin privileges.", timestamp, userIsAdmin.getUsername());
      return Response.status(403).entity("You do not have admin privileges to create a category").build();
    }

    try {
      boolean categoryIsCreated = categoryBean.newCategory(categoryDto);
      if (categoryIsCreated) {
        infoLogger.info("[{}] User '{}' created a new category: '{}'.", timestamp, userIsAdmin.getUsername(), categoryDto.getNome());

        //atualiza as estatísticas apos criar a categoria
        categoryBean.updateCategoryStats();

        return Response.status(201).entity("Category created successfully").build();
      } else {
        errorLogger.error("[{}] User '{}' attempted to create an existing category: '{}'.", timestamp, userIsAdmin.getUsername(), categoryDto.getNome());
        return Response.status(400).entity("This category already exists!").build();
      }
    } catch (Exception e) {
      errorLogger.error("[{}] Error while creating category '{}': {}", timestamp, categoryDto.getNome(), e.getMessage(), e);
      return Response.status(500).entity("Error creating category").build();
    }
  }

  //Exibe as categorias e a quantidade de produtos ordenados
  @GET
  @Path("/sorted-by-product-count")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getCategoriesSortedByProductCount(@HeaderParam("Authorization") String authorizationHeader) {

    String timestamp = LocalDateTime.now().toString();

    if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer")) {
      errorLogger.error("[{}] Missing or invalid token.", timestamp);
      return Response.status(401).entity("Missing or invalid token").build();
    }

    String token = authorizationHeader.substring("Bearer ".length());
    UserEntity userIsAdmin = user.findUserByToken(token);

    if (userIsAdmin == null) {
      errorLogger.error("[{}] Invalid token: user not found.", timestamp);
      return Response.status(401).entity("Invalid token").build();
    }

    System.out.println("admin: " + userIsAdmin.getAdmin());

    if (!userIsAdmin.getAdmin()) {
      errorLogger.error("[{}] User '{}' attempted to view a category without admin privileges.", timestamp, userIsAdmin.getUsername());
      return Response.status(403).entity("You do not have admin privileges to view the listed categories").build();
    }


    try {
      List<Map<String, Object>> sortedCategories = categoryBean.getCategoriesSortedByProductCount();
      infoLogger.info("[{}] User '{}' successfully retrieved {} categories sorted by product count.", timestamp, userIsAdmin.getUsername(), sortedCategories.size());
      return Response.ok(sortedCategories).build();
    } catch (Exception e) {
      errorLogger.error("[{}] Error while retrieving categories sorted by product count: {}", timestamp, e.getMessage(), e);
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao buscar categorias").build();
    }
  }
}


