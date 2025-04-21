import React from "react";
import { FormattedMessage } from "react-intl";

const UserProductStats = () => {
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
              {/* Aqui será inserida a lógica para exibir os usuários e seus produtos */}
              <tr>
                <td>Exemplo Usuário</td>
                <td>50</td>
                <td>10</td>
                <td>20</td>
                <td>5</td>
                <td>10</td>
                <td>3</td>
                <td>2</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <button className="btn btn-secondary" disabled>
            <FormattedMessage id="previous" defaultMessage="Previous" />
          </button>
          <span>
            <FormattedMessage
              id="pagination.info"
              defaultMessage="Page {currentPage} of {totalPages}"
              values={{ currentPage: 1, totalPages: 1 }}
            />
          </span>
          <button className="btn btn-secondary" disabled>
            <FormattedMessage id="next" defaultMessage="Next" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProductStats;
