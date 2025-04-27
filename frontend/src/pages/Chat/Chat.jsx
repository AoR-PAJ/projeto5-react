import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Service } from "../../Services/Services";
import { useAuthStore } from "../../stores/useAuthStore";
import Breadcrumbs from "../BreadCrumbs/BreadCrumbs";
import { FormattedMessage } from "react-intl";
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
    } catch (error) {
      console.error("Erro ao marcar mensagens como lidas:", error.message);
    }
  };

  return (
    <div className="container-fluid chat-page">
      <Breadcrumbs />
      <div className="row">
        {/* Lista de usuários */}
        <div className="col-12 col-md-4 chat-sidebar border-end">
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
                <h5>
                  <FormattedMessage id="chatWith" />{" "}
                  <span className="text-success">{selectedUser.username}</span>{" "}
                </h5>
              </div>
              <div
                className="chat-messages p-3"
                style={{ maxHeight: "900px", overflowY: "auto" }}
                onScroll={handleScroll}
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`d-flex ${
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
              </div>
              <div className="chat-input p-3 border-top">
                <div className="input-group">
                  <textarea
                    className="form-control"
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={
                      (e) => setNewMessage(e.target.value.slice(0, 220)) // Limita a 220 caracteres
                    }
                    style={{ resize: "none", overflow: "hidden" }}
                    rows={Math.min(5, Math.ceil(newMessage.length / 44))} // Cresce dinamicamente
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleSendMessage}
                  >
                    <FormattedMessage id="sendButton.text" />
                  </button>
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
  );
};

export default ChatPage;
