import { FormattedMessage } from "react-intl";
//componente que permite filtrar os produtos com base no nome do user
const UserFilter = ({ users, selectedUser, setSelectedUser }) => (
  <div className="radio-group" id="users-placeholder">
    <FormattedMessage id="userfilter.text" />: <br /> <br />
    <label htmlFor="utilizadores-todos">
      <input
        id="utilizadores-todos"
        type="radio"
        value="Todos"
        name="user"
        checked={selectedUser === "Todos"}
        onChange={() => setSelectedUser("Todos")}
      />
      <FormattedMessage id="categoryFilter.all" />
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
      <FormattedMessage id="categoryFilter.noCategory" />
    )}
  </div>
);

export default UserFilter;
