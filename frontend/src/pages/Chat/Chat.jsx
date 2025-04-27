import React, { useState, useEffect } from "react";
import "./Chat.css";

const ChatPage = () => {
  const [users, setUsers] = useState([
    {
      username: "john_doe",
      photoUrl: "https://via.placeholder.com/50",
      unreadCount: 3,
    },
    {
      username: "jane_doe",
      photoUrl: "https://via.placeholder.com/50",
      unreadCount: 0,
    },
    {
      username: "user123",
      photoUrl: "https://via.placeholder.com/50",
      unreadCount: 5,
    },
  ]); // Lista de usuários fictícios com contadores de mensagens não lidas
  const [selectedUser, setSelectedUser] = useState(null); // Usuário selecionado
  const [messages, setMessages] = useState([]); // Mensagens do chat

  // Mensagens fictícias para teste
  const mockMessages = [
    { sender: "john_doe", content: "Olá!", timestamp: "10:00", read: false },
    { sender: "me", content: "Oi, tudo bem?", timestamp: "10:01", read: true },
    {
      sender: "john_doe",
      content: "Tudo ótimo, e você?",
      timestamp: "10:02",
      read: false,
    },
  ];

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setMessages(mockMessages); // Carrega mensagens fictícias

    // Marca todas as mensagens como lidas ao abrir o chat
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.username === user.username ? { ...u, unreadCount: 0 } : u
      )
    );
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
                  src={user.photoUrl}
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
