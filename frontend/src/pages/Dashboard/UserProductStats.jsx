import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { Service } from "../../Services/Services";

const UserProductStats = () => {
  const [users, setUsers] = useState([]); // Lista de usuários
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState(null); // Estado de erro

  // Função para buscar os dados do backend
  const fetchUserStats = async (page) => {
    try {
      setLoading(true);
      const response = await Service.fetchUserProductStats(page, 10);
      setUsers(response.users);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Buscar os dados ao carregar o componente ou mudar de página
  useEffect(() => {
    fetchUserStats(currentPage);
  }, [currentPage]);

  // Função para mudar de página
  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "previous" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p className="text-danger">Erro: {error}</p>;
  }

  return (
    <div className="mb-4">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>
                  <FormattedMessage id="username" defaultMessage="Username" />
                </th>
                <th>
                  <FormattedMessage
                    id="totalproducts"
                    defaultMessage="Total Products"
                  />
                </th>
                <th>
                  <FormattedMessage id="RASCUNHO.text" defaultMessage="Draft" />
                </th>
                <th>
                  <FormattedMessage
                    id="DISPONIVEL.text"
                    defaultMessage="Available"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="reserved.text"
                    defaultMessage="Reserved"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="purchasedv"
                    defaultMessage="Purchased"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="published.text"
                    defaultMessage="Published"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="INATIVO.text"
                    defaultMessage="Inactive"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.username}>
                  <td>
                    <a href={`/users/${user.username}`}>{user.username}</a>
                  </td>
                  <td>{user.totalProducts}</td>
                  <td>{user.draft}</td>
                  <td>{user.available}</td>
                  <td>{user.reserved}</td>
                  <td>{user.purchased}</td>
                  <td>{user.published}</td>
                  <td>{user.inactive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <button
            className="btn btn-secondary"
            onClick={() => handlePageChange("previous")}
            disabled={currentPage === 1}
          >
            <FormattedMessage id="previous" defaultMessage="Previous" />
          </button>
          <span>
            <FormattedMessage
              id="pagination.info"
              defaultMessage="Page {currentPage} of {totalPages}"
              values={{ currentPage, totalPages }}
            />
          </span>
          <button
            className="btn btn-secondary"
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
          >
            <FormattedMessage id="next" defaultMessage="Next" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProductStats;
