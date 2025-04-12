import React from "react";

const UserProductStats = ({ products }) => {

  return (
    <div className="card mt-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Estatísticas dos Produtos</h5>
      </div>
      <div className="card-body">
        <div className="row">
          {/* Total de Produtos */}
          <div className="col-12 mb-3">
            <h6 className="text-center">
              <strong>Total de Produtos:</strong> 
            </h6>
          </div>

          {/* Distribuição por Estado */}
          <div className="col-12 col-md-6">
            <p>
              <strong>Rascunho:</strong> 
            </p>
            <p>
              <strong>Publicado:</strong> 
            </p>
          </div>
          <div className="col-12 col-md-6">
            <p>
              <strong>Reservado:</strong> 
            </p>
            <p>
              <strong>Comprado:</strong> 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProductStats;
