const BASE_URL = "http://localhost:8080/vanessa-vinicyus-proj3/rest";


export const Service = {
  //AUTH
  //funcao para realizar logout
  async logout(token) {
    try {
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.status === 200) {
        return true;
      } else if (response.status === 401) {
        console.warn("Token inválido ou expirado.");
        return false;
      } else {
        throw new Error("Erro desconhecido ao realizar logout.");
      }
    } catch (err) {
      throw new Error(err.message);
    }
  },

  // Função para verificar se o usuário está verificado antes de fazer login
  async isUserVerified(username) {
    const response = await fetch(
      `${BASE_URL}/auth/verifyUser?username=${username}`
    );

    if (response.status === 200) {
      return true;
    } else if (response.status === 403) {
      return false;
    } else {
      throw new Error("Erro ao verificar o status da conta.");
    }
  },

  //Funcao para realizar o login do user
  async loginUser(username, password) {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        const data = await response.json(); // Supondo que o backend retorna { token, sessionExpirationMinutes }
        return {
          success: true,
          token: data.token,
          sessionExpirationMinutes: data.sessionExpirationMinutes,
        };
      } else if (response.status === 403) {
        throw new Error("Conta inativa. Credenciais rejeitadas.");
      } else if (response.status === 401) {
        throw new Error("Credenciais inválidas!");
      } else {
        throw new Error("Erro desconhecido ao fazer login.");
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  //Função para registrar um novo usuário
  async registerUser(userData) {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          photoUrl: userData.photo,
          estado: "ativo",
          admin: userData.userType === "true",
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar usuário");
      }

      const responseData = await response.text();

      return responseData;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  //ativa a conta de um user
  async verifyUserAccount(token) {
    try {
      const response = await fetch(`${BASE_URL}/auth/verify?token=${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (response.ok) {
        alert("Conta verificada com sucesso!");
      } else {
        alert(data.message || "Erro ao verificar a conta.");
      }
    } catch (error) {
      console.error("Erro ao verificar conta:", error);
      alert("Erro ao verificar a conta.");
    }
  },

  //Funcao para redefinir a senha
  async resetPassword(username) {
    try {
      const response = await fetch(
        `${BASE_URL}/auth/resetPassword?username=${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao redefinir a senha");
      }

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Função para alterar a senha
  async updatePassword(token, password) {
    try {
      const response = await fetch(`${BASE_URL}/auth/updatePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          status: response.status,
          message: errorData.message || "Erro ao redefinir a senha.",
        };
      }

      return {
        success: true,
        status: response.status,
        message: "Senha redefinida com sucesso!",
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        message: "Erro ao conectar ao servidor.",
      };
    }
  },

  //USER
  //Funcao para buscar todos os usuários
  async fetchUsers(token) {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Erro ao buscar usuários");
      }

      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  },

  // Função para buscar dados do usuário
  async getUserData(username, token) {
    try {
      const response = await fetch(`${BASE_URL}/users/${username}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar dados do usuário");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  //Funcao para exibir dados de um user qualquer
  async getUserProfile(username, token) {
    try {
      const response = await fetch(`${BASE_URL}/users/${username}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar dados do usuário");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  //Funcao para inativar a conta de um user
  async inactivateAccount(usernameParam, token) {
    const url = `${BASE_URL}/users/${usernameParam}/deactivate`;

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao inativar conta.");
      }

      return await response.text();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  //Funcao para reativar conta
  async reativarConta(username, token) {
    try {
      const response = await fetch(`${BASE_URL}/users/${username}/activate`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao reativar conta.");
      }

      return true; // Sucesso
    } catch (error) {
      throw new Error(error.message); // Propaga o erro
    }
  },

  //Funcao para editar perfil
  async updateUserProfile(usernameParam, token, editUserData) {
    const url = `${BASE_URL}/users/${usernameParam}`;
    console.log("url", url);

    const requestBody = {
      firstName: editUserData.firstName,
      lastName: editUserData.lastName,
      email: editUserData.email,
      phone: editUserData.phone,
      photoUrl: editUserData.photoUrl,
      estado: editUserData.estado,
    };

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Erro ao tentar atualizar o perfil");
      }

      return await response.json();
      //return await response.text();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  //Funcao para apagar definitivamente um user
  async deleteUser(usernameParam, token) {
    const url = `${BASE_URL}/auth/${usernameParam}`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao apagar conta.");
      }

      return response.ok; // Retorna true se a conta for apagada com sucesso
    } catch (error) {
      throw new Error(error.message); // Lança o erro se falhar
    }
  },

  //FILTRAGEM DE USERS
  //Funcao para filtrar usuarios por username ou email
  async fetchFilteredUsers(searchText, token) {
    try {
      // Verifica se o parâmetro searchText está vazio
      const url =
        searchText && searchText.trim() !== ""
          ? `${BASE_URL}/users?search=${searchText}`
          : `${BASE_URL}/users`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar usuários filtrados");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar usuários filtrados:", error);
      throw new Error(error.message);
    }
  },

  //PRODUTOS
  // Função para criar um novo produto
  async createProduct(username, token, productData) {
    const url = `${BASE_URL}/users/${username}/products`;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    };

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error("Erro ao criar o produto");
      }

      alert("Produto criado com sucesso!");
      window.location.reload();
      return response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  },

  // Função para buscar todos os produtos
  async fetchProductsByState(estado) {
    try {
      const query = estado ? `?estado=${estado}` : "";
      const response = await fetch(`${BASE_URL}/products${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar produtos");
      }

      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  },
  // Função para buscar um produto atraves do id
  async fetchProductById(productId, token) {
    try {
      const response = await fetch(`${BASE_URL}/products/${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Produto não encontrado.");
        } else if (response.status === 401) {
          throw new Error("Token inválido ou expirado.");
        } else if (response.status === 500) {
          throw new Error("Erro interno no servidor.");
        } else {
          throw new Error("Erro ao buscar o produto.");
        }
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar o produto:", error);
      throw error;
    }
  },

  // Função para buscar produtos por categoria
  async fetchProductsByCategory(category) {
    try {
      const response = await fetch(`${BASE_URL}/products/category/${category}`);
      if (!response.ok)
        throw new Error("Erro ao buscar produtos por categoria");
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  },

  // Função para buscar produtos de um usuário específico
  async fetchProductsByUser(username, token) {
    try {
      const response = await fetch(`${BASE_URL}/users/${username}/products`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Erro ao buscar produtos por usuário");
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  },

  // Serviço para buscar todos os produtos de um usuário
  fetchUserProducts: async (usernameParam, token) => {
    try {
      const response = await fetch(
        `${BASE_URL}/products/user/${usernameParam}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao obter produtos");
      }

      return await response.json(); // Retorna os dados brutos
    } catch (error) {
      console.error("Erro ao buscar produtos do usuário:", error);
      throw error; // Propaga o erro para ser tratado no componente
    }
  },

  // Função para comprar produto
  async buyProduct(username, productId, token) {
    try {
      const response = await fetch(
        `${BASE_URL}/users/${username}/products/${productId}/buy`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao comprar o produto");
      }
      return await response.text(); // Produto comprado
    } catch (err) {
      throw new Error(err.message);
    }
  },

  //Funcao para inativar produtos
  async inactivateProduct(sellerId, productId, token) {
    try {
      const response = await fetch(
        `${BASE_URL}/users/${sellerId}/products/${productId}/inactivate`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao inativar o produto");
      }

      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  //Funcao para apagar permanentemente um produto
  async deleteProduct(productId, usernameParam, token) {
    try {
      const response = await fetch(
        `${BASE_URL}/users/${usernameParam}/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        return true; // Produto deletado com sucesso
      } else if (response.status === 400) {
        const errorMessage = await response.text();
        throw new Error(`Erro: ${errorMessage}`); // Erro de validação (ex.: produto não está "INATIVO")
      } else if (response.status === 401) {
        throw new Error("Erro: Usuário não autenticado ou token inválido.");
      } else if (response.status === 403) {
        throw new Error("Erro: Acesso negado.");
      } else if (response.status === 500) {
        throw new Error(
          "Erro interno no servidor. Tente novamente mais tarde."
        );
      } else {
        throw new Error("Erro desconhecido ao deletar o produto.");
      }
    } catch (err) {
      console.error("Erro ao deletar o produto:", err);
      throw new Error(err.message); // Propaga o erro para ser tratado no frontend
    }
  },

  // Função para atualizar dados do produto para um usuário normal
  async updateProductByUser(username, productId, updatedData, token) {
    try {
      const response = await fetch(
        `${BASE_URL}/users/${username}/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar o produto");
      }

      const updatedProductResponse = await fetch(
        `${BASE_URL}/products/${productId}`
      );

      if (!updatedProductResponse.ok) {
        throw new Error("Erro ao buscar produto atualizado");
      }

      return await updatedProductResponse.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Função para atualizar produtos por um admin
  async updateProductByAdmin(username, productId, updatedData, token) {
    try {
      const response = await fetch(
        `${BASE_URL}/users/${username}/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar o produto");
      }

      const updatedProductResponse = await fetch(
        `${BASE_URL}/products/${productId}`
      );

      if (!updatedProductResponse.ok) {
        throw new Error("Erro ao buscar produto atualizado");
      }

      return await updatedProductResponse.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  //Funcao para exibir produtos modificados
  async getModifiedProducts(token) {
    try {
      const response = await fetch(`${BASE_URL}/products/modified`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao obter produtos modificados");
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  //Funcao para apagar (permanentemente) todos os produtos de um user
  async deleteAllProducts(usernameParam, token) {
    const url = `${BASE_URL}/users/${usernameParam}/products`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar os produtos.");
      }

      return response.ok; // Retorna true se a deleção for bem-sucedida
    } catch (error) {
      throw new Error(error.message); // Lança o erro se falhar
    }
  },

  //CATEGORIAS
  // Função para buscar categorias
  async fetchCategories() {
    try {
      const response = await fetch(`${BASE_URL}/categories`);
      if (!response.ok) throw new Error("Erro ao buscar categorias");
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  },

  // Função para criar uma nova categoria
  async createCategory(categoryName, token) {
    try {
      const response = await fetch(`${BASE_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome: categoryName }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar categoria");
      }

      return await response.text();
    } catch (err) {
      throw new Error(err.message);
    }
  },

  //Funcao para retornar a quantidade de produtos por categoria
  async fetchCategoriesSortedByProductCount(token) {
    try {
      const response = await fetch(
        `${BASE_URL}/categories/sorted-by-product-count`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            "Acesso negado: Você não tem permissão para acessar este recurso."
          );
        } else if (response.status === 401) {
          throw new Error("Token inválido ou expirado.");
        } else {
          throw new Error("Erro ao buscar categorias ordenadas.");
        }
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar categorias ordenadas:", error);
      throw error;
    }
  },

  //DASHBOARD
  //Funcao para altera o sesison timeout
  async updateSessionTimeout(minutes, token) {
    try {
      const response = await fetch(
        `${BASE_URL}/settings/session-expiration?minutes=${minutes}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        // Verificar o código de status e lançar mensagens apropriadas
        if (response.status === 400) {
          throw new Error("O tempo de expiração deve ser maior que zero.");
        } else if (response.status === 401) {
          throw new Error("Token de autorização ausente ou inválido.");
        } else if (response.status === 403) {
          throw new Error("Acesso negado. Usuário não autorizado.");
        } else if (response.status === 500) {
          throw new Error(
            "Erro interno no servidor. Tente novamente mais tarde."
          );
        } else {
          throw new Error(
            "Erro desconhecido ao atualizar o tempo de expiração."
          );
        }
      }

      return await response.text(); // Retorna a resposta como texto
    } catch (error) {
      throw new Error(error.message); // Lança o erro para ser tratado onde for chamado
    }
  },

  //SESSION
  //Funcao para buscar o sessiontimeout
  async getSessionTimeout(token) {
    try {
      const response = await fetch(`${BASE_URL}/settings/session-expiration`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar o tempo de expiração da sessão");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  //ESTATISTICAS
  async getUserProductsStats(username, token) {
    try {
      const response = await fetch(
        `${BASE_URL}/users/${username}/products/stats`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Token inválido ou expirado.");
        } else if (response.status === 403) {
          throw new Error("Acesso negado.");
        } else if (response.status === 500) {
          throw new Error("Erro interno no servidor.");
        } else {
          throw new Error("Erro ao buscar estatísticas dos produtos.");
        }
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar estatísticas dos produtos:", error);
      throw error;
    }
  },

  // Serviço para buscar dados de crescimento de usuários
  async fetchUserGrowthData() {
    try {
      const response = await fetch(`${BASE_URL}/users/registrations`);
      if (!response.ok) {
        throw new Error(
          `Erro ao buscar dados de crescimento de usuários: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar dados de crescimento de usuários:", error);
      throw error;
    }
  },

  // Serviço para buscar dados de compras de produtos
  async fetchProductPurchaseData() {
    try {
      const response = await fetch(`${BASE_URL}/users/purchases`);
      if (!response.ok) {
        throw new Error(
          `Erro ao buscar dados de compras de produtos: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar dados de compras de produtos:", error);
      throw error;
    }
  },

  //funcao para buscar todos os users e seus produtos
  async fetchUserProductStats(page = 1, size = 10) {
    try {
      const response = await fetch(
        `${BASE_URL}/users/stats?page=${page}&size=${size}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar estatísticas de usuários");
      }

      return await response.json(); // Retorna os dados do backend
    } catch (error) {
      console.error("Erro ao buscar estatísticas de usuários:", error);
      throw error;
    }
  },
  async fetchAverageTimeToPurchase(token) {
    try {
      const response = await fetch(
        `${BASE_URL}/products/average-time-to-purchase`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar o tempo médio de compra.");
      }

      return await response.json(); // Retorna o tempo médio
    } catch (error) {
      console.error("Erro ao buscar o tempo médio de compra:", error);
      throw error;
    }
  },

  //MENSAGENS
  //Funcao para buscar mensagens
  fetchMessages: async (user1, user2) => {
    const response = await fetch(
      `${BASE_URL}/messages?user1=${user1}&user2=${user2}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao buscar mensagens");
    }
    return await response.json();
  },

  // Criar uma nova mensagem
  createMessage: async (sender, receiver, content) => {
    const response = await fetch(`${BASE_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sender, receiver, content }),
    });
    if (!response.ok) {
      throw new Error("Erro ao enviar mensagem");
    }
    return await response.json();
  },

  // Marcar mensagens como lidas
  markMessagesAsRead: async (sender, receiver) => {
    const response = await fetch(
      `${BASE_URL}/messages/mark-as-read?sender=${sender}&receiver=${receiver}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao marcar mensagens como lidas");
    }
    return await response.json();
  },

  fetchUnreadMessageCounts: async (receiver) => {
    const response = await fetch(
      `${BASE_URL}/messages/unread-count?receiver=${receiver}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar contagem de mensagens não lidas");
    }

    return await response.json();
  },

  //NOTIFICACOES
  //Criar notificação
  createNotification: async (token, userId, message) => {
    try {
      const response = await fetch(`${BASE_URL}/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, message }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar notificação");
      }

      console.log("Notificação criada com sucesso");
      return await response.json();
    } catch (error) {
      console.error("Erro ao criar notificação:", error);
      throw error;
    }
  },

  // Serviço para obter notificações
  fetchNotifications: async (token, userId, read) => {
    try {
      const response = await fetch(
        `${BASE_URL}/notifications?userId=${userId}&read=${read}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar notificações");
      }

      return await response.json(); // Retorna os dados brutos
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      throw error; // Propaga o erro para ser tratado no componente
    }
  },

  // Serviço para marcar notificações como lidas
  markNotificationsAsRead: async (token, username) => {
    try {
      const response = await fetch(
        `${BASE_URL}/notifications/${username}/mark-as-read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao marcar notificações como lidas");
      }

      return response.ok; // Retorna true se a operação foi bem-sucedida
    } catch (error) {
      console.error("Erro ao marcar notificações como lidas:", error);
      throw error; // Propaga o erro para ser tratado no componente
    }
  },
};




