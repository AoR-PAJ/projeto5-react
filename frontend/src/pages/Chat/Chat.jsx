import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Service } from "../../Services/Services";
import { useAuthStore } from "../../stores/useAuthStore";
import Breadcrumbs from "../BreadCrumbs/BreadCrumbs";
import { FormattedMessage, useIntl } from "react-intl";
import "./Chat.css";

const ChatPage = () => {
  const [users, setUsers] = useState([]); // Lista de usuários
  const [selectedUser, setSelectedUser] = useState(null); // Usuário selecionado
  const [messages, setMessages] = useState([]); // Mensagens do chat
  const [newMessage, setNewMessage] = useState(""); // Nova mensagem
  const [shouldReloadMessages, setShouldReloadMessages] = useState(false); // Controle de recarregamento de mensagens
  const token = useAuthStore((state) => state.token); // Token do usuário logado
  const loggedInUsername = useAuthStore((state) => state.username); // Username do usuário logado
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const intl = useIntl();

  //funcao para rolar até o final da lista de mensagens
  const scrollToBottom = () => {
    const chatMessagesContainer = document.querySelector(".chat-messages");
    if (chatMessagesContainer) {
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
  };

  // Rolar para o final da lista de mensagens quando as mensagens mudam
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Função para formatar o timestamp recebido do backend
  const formatTimestamp = (timestamp) => {
    if (!Array.isArray(timestamp) || timestamp.length < 6) {
      return "Data inválida"; // Verifica se o timestamp é um array válido
    }

    const [year, month, day, hours, minutes, seconds] = timestamp;
    const date = new Date(year, month - 1, day, hours, minutes, seconds); // O mês começa em 0 no JavaScript

    if (isNaN(date.getTime())) return "Data inválida"; // Verifica se o timestamp é válido

    const dayFormatted = String(date.getDate()).padStart(2, "0");
    const monthFormatted = String(date.getMonth() + 1).padStart(2, "0"); // Os meses começam em 0
    const yearFormatted = date.getFullYear();
    const hoursFormatted = String(date.getHours()).padStart(2, "0");
    const minutesFormatted = String(date.getMinutes()).padStart(2, "0");

    return `${dayFormatted}/${monthFormatted}/${yearFormatted} ${hoursFormatted}:${minutesFormatted}`;
  };

  // Redirecionar para login se o token não estiver presente
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Buscar usuários ao carregar a página
  useEffect(() => {
    const fetchUsersAndUnreadCounts = async () => {
      try {
        // Busca os usuários
        const usersData = await Service.fetchUsers(token);

        // Busca a contagem de mensagens não lidas
        const unreadCounts = await Service.fetchUnreadMessageCounts(
          loggedInUsername
        );

        // Atualiza o estado dos usuários com o contador de mensagens não lidas
        const activeUsers = usersData.map((user) => ({
          ...user,
          unreadCount: unreadCounts[user.username] || 0, // Adiciona o contador de mensagens não lidas
        }));

        setUsers(activeUsers);
      } catch (error) {
        console.error(
          "Erro ao buscar usuários ou contagem de mensagens não lidas:",
          error.message
        );
      }
    };

    fetchUsersAndUnreadCounts();
  }, [token, loggedInUsername]);

  // Recarregar mensagens ao enviar uma nova mensagem
  useEffect(() => {
    if (shouldReloadMessages && selectedUser) {
      const fetchMessages = async () => {
        try {
          const data = await Service.fetchMessages(
            loggedInUsername,
            selectedUser.username
          );
          setMessages(data); // Atualiza as mensagens com os dados do backend
        } catch (error) {
          console.error("Erro ao buscar mensagens:", error.message);
        } finally {
          setShouldReloadMessages(false); // Reseta o estado
        }
      };

      fetchMessages();
    }
  }, [shouldReloadMessages, selectedUser, loggedInUsername]);

  

  // Buscar mensagens ao selecionar um usuário
  const handleUserClick = async (user) => {
    setSelectedUser(user);
    try {
      const data = await Service.fetchMessages(loggedInUsername, user.username);
      setMessages(data); // Atualiza as mensagens com os dados do backend

      // Marca as mensagens como lidas no backend
      await Service.markMessagesAsRead(user.username, loggedInUsername);

      // Atualiza o contador de mensagens não lidas para o usuário selecionado
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.username === user.username ? { ...u, unreadCount: 0 } : u
        )
      );
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error.message);
    }
  };

  // Enviar uma nova mensagem
  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return; // Não envia mensagens vazias

    try {
      await Service.createMessage(
        loggedInUsername,
        selectedUser.username,
        newMessage
      );
      setNewMessage(""); // Limpa o campo de entrada
      setShouldReloadMessages(true); // Sinaliza para recarregar as mensagens
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error.message);
    }
  };

  // Marcar mensagens como lidas ao fazer scroll
  const handleScroll = async () => {
    try {
      await Service.markMessagesAsRead(selectedUser.username, loggedInUsername);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.sender === selectedUser.username ? { ...msg, read: true } : msg
        )
      );

      // Atualiza o contador de mensagens não lidas no sidebar
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.username === selectedUser.username
            ? { ...user, unreadCount: 0 }
            : user
        )
      );
    } catch (error) {
      console.error("Erro ao marcar mensagens como lidas:", error.message);
    }
  };

  return (
    <div className="container-fluid chat-page">
      <Breadcrumbs />
      <div className="chat-container">
        <div className="row">
          <div className="col-12 col-md-4 chat-sidebar rounded">
            <h5 className="p-3">
              <FormattedMessage id="users" />
            </h5>
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
                    src={user.photoUrl || "/assets/general-profile.jpg"}
                    alt={user.username}
                    className="rounded-circle me-3"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                    }}
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

          <div className="col-12 col-md-8 chat-window">
            {selectedUser ? (
              <>
                <div className="chat-header p-3 border-bottom rounded-top">
                  <h5>
                    <FormattedMessage id="chatWith" />{" "}
                    <span className="text-success">
                      {selectedUser.username}
                    </span>{" "}
                    <button
                      className="btn btn-outline-danger btn-sm text-dark ml-5"
                      onClick={() => setSelectedUser(null)}
                    >
                      x
                    </button>
                  </h5>
                </div>
                <div
                  className="chat-body d-flex flex-column"
                  style={{ height: "100%" }}
                >
                  <div
                    className="chat-messages p-3 flex-grow-1"
                    style={{ maxHeight: "600px", overflowY: "auto" }}
                  >
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`d-flex rounded-bottom ${
                          msg.sender === loggedInUsername
                            ? "justify-content-end"
                            : "justify-content-start"
                        } mb-3`}
                      >
                        <div
                          className={`p-2 rounded ${
                            msg.sender === loggedInUsername
                              ? "bg-primary text-white"
                              : "bg-light text-dark"
                          }`}
                          style={{ maxWidth: "70%" }}
                        >
                          <p className="mb-1">{msg.content}</p>
                          <small className="timestamp">
                            {formatTimestamp(msg.timestamp)}
                          </small>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef}></div>
                  </div>
                  <div className="chat-input p-3 border-top">
                    <div className="input-group">
                      <textarea
                        className="form-control"
                        placeholder={intl.formatMessage({
                          id: "chat.placeholder",
                        })}
                        value={newMessage}
                        onChange={(e) =>
                          setNewMessage(e.target.value.slice(0, 220))
                        }
                        style={{ resize: "none", overflow: "hidden" }}
                        rows={Math.min(5, Math.ceil(newMessage.length / 44))}
                      />
                      <button
                        className="btn btn-primary"
                        onClick={handleSendMessage}
                      >
                        <FormattedMessage id="sendButton.text" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="chat-placeholder d-flex align-items-center justify-content-center">
                <h5>
                  <FormattedMessage id="chat.h5" />
                </h5>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;


