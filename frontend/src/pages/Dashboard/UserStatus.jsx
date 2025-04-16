import React from "react";
import useUserStats from "../../hooks/useUserStats";

const UserStatus = () => {
  const { total, verified, unverified } = useUserStats();

  return(
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="card-title mb-0">Estatísticas de Utilizadores</h5>
      </div>
      <div className="card-body">
        <p className="card-text">
          Veja em tempo real as estatísticas de utilizadores registados.
        </p>
        <ul className="list-group">
          <li className="list-group-item">
            <strong>Total de Utilizadores:</strong> {total}
          </li>
          <li className="list-group-item">
            <strong>Utilizadores Verificados:</strong> {verified}
          </li>
          <li className="list-group-item">
            <strong>Utilizadores Não Verificados:</strong> {unverified}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserStatus;
