import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Service } from "../../Services/Services"; 
import { useAuthStore } from "../../stores/useAuthStore"; 
import "./Chat.css";

const ChatPage = () => {
  const [users, setUsers] = useState([]); 
  const [selectedUser, setSelectedUser] = useState(null); 
  const [messages, setMessages] = useState([]); 
  const token = useAuthStore((state) => state.token); 
  const loggedInUsername = useAuthStore((state) => state.username); 
  const navigate = useNavigate(); 

  // Redirecionar para login se o token não estiver presente
  useEffect(() => {
    if (!token) {
      navigate("/login"); 
    }
  }, [token, navigate]);

  // Buscar usuários ao carregar a página
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await Service.fetchUsers(token);
        const activeUsers = data.filter(
          (user) =>
            user.estado === "ativo" && user.username !== loggedInUsername 
        );
        setUsers(activeUsers);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error.message);
      }
    };

    fetchUsers();
  }, [token, loggedInUsername]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setMessages([]); // Limpa as mensagens ao selecionar um novo usuário
  };

  const handleScroll = () => {
    // Simula a marcação de mensagens como lidas ao fazer scroll
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.sender === selectedUser.username ? { ...msg, read: true } : msg
      )
    );
  };

  return (
    <div className="container-fluid chat-page">
      <div className="row">
        {/* Lista de usuários */}
        <div className="col-12 col-md-4 chat-sidebar border-end">
          <h5 className="p-3">Usuários</h5>
          <ul className="list-group">
            {users.map((user) => (
              <li
                key={user.username}
                className={`list-group-item d-flex align-items-center ${
                  selectedUser?.username === user.username ? "active" : ""
                }`}
                onClick={() => handleUserClick(user)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={user.photoUrl || "/assets/general-profile.jpg"} // Foto do usuário ou imagem padrão
                  alt={user.username}
                  className="rounded-circle me-3"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
                <span>{user.username}</span>
                {user.unreadCount > 0 && (
                  <span className="badge bg-danger ms-auto">
                    {user.unreadCount}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Janela de chat */}
        <div className="col-12 col-md-8 chat-window">
          {selectedUser ? (
            <>
              <div className="chat-header p-3 border-bottom">
                <h5>Chat com {selectedUser.username}</h5>
              </div>
              <div
                className="chat-messages p-3"
                style={{ height: "400px", overflowY: "auto" }}
                onScroll={handleScroll}
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`d-flex ${
                      msg.sender === "me"
                        ? "justify-content-end"
                        : "justify-content-start"
                    } mb-3`}
                  >
                    <div
                      className={`p-2 rounded ${
                        msg.sender === "me"
                          ? "bg-primary text-white"
                          : "bg-light text-dark"
                      }`}
                      style={{ maxWidth: "70%" }}
                    >
                      <p className="mb-1">{msg.content}</p>
                      <small className="text-muted">{msg.timestamp}</small>
                    </div>
                  </div>
                ))}
              </div>
              <div className="chat-input p-3 border-top">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Digite sua mensagem..."
                  />
                  <button className="btn btn-primary">Enviar</button>
                </div>
              </div>
            </>
          ) : (
            <div className="chat-placeholder d-flex align-items-center justify-content-center">
              <h5>Selecione um usuário para iniciar o chat</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
