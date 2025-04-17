import { FormattedMessage } from "react-intl";

function CategoryStatus(){
  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="card-title mb-0">
          <FormattedMessage id="categorystatistics" />
        </h5>
      </div>
      <div className="card-body">
        <p className="card-text">
          <FormattedMessage id="categorystatistics.description" />
        </p>
        <ul className="list-group">
          <li className="list-group-item">
            <strong>nome da actegoria:</strong> contagem de produtos
          </li>

          <li className="list-group-item">
            <strong>nome da actegoria:</strong> contagem de produtos
          </li>

          <li className="list-group-item">
            <strong>nome da actegoria:</strong> contagem de produtos
          </li>
        </ul>
      </div>
    </div>
  );
}

export default CategoryStatus;