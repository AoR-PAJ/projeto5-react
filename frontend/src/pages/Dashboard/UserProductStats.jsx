import React from "react";
import { FormattedMessage } from "react-intl";

const UserProductStats = () => {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>
                <FormattedMessage id="inputUsername.text" />
              </th>
              <th>
                <FormattedMessage
                  id="totalproducts"
                  defaultMessage="Total Products"
                />
              </th>
              <th>
                <FormattedMessage id="draft.text" />
              </th>
              <th>
                <FormattedMessage id="available.text" />
              </th>
              <th>
                <FormattedMessage id="reserved.text" />
              </th>
              <th>
                <FormattedMessage id="bought.text" />
              </th>
              <th>
                <FormattedMessage id="published.text" />
              </th>
              <th>
                <FormattedMessage id="inactive.text" />
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

        {/* Paginação */}
        <div className="d-flex justify-content-between align-items-center">
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
