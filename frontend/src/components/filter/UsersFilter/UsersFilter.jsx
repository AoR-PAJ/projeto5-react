const UserFilter = ({ users, selectedUser, setSelectedUser }) => (
  <div className="radio-group" id="users-placeholder">
    Filter by Users: <br /> <br />
    <label htmlFor="utilizadores-todos">
      <input
        id="utilizadores-todos"
        type="radio"
        value="Todos"
        name="user"
        checked={selectedUser === "Todos"}
        onChange={() => setSelectedUser("Todos")}
      />
      Todos
    </label>
    {users.length > 0 ? (
      users.map((user) => (
        <label key={user.username} htmlFor={user.username}>
          <input
            id={user.username}
            type="radio"
            value={user.username}
            name="user"
            checked={selectedUser === user.username}
            onChange={() => setSelectedUser(user.username)}
          />
          {user.username}
        </label>
      ))
    ) : (
      <span>Nenhum utilizador no momento</span>
    )}
  </div>
);

export default UserFilter;
