import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";
import "./SearchBar.css";

const SearchBar = () => {
  const intl = useIntl();

  return (
    <div id="search-bar-div" className="container my-3">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 d-flex">
          <input
            type="text"
            id="search-input"
            className="form-control me-2"
            placeholder={intl.formatMessage({ id: "searchbar.placeholder" })}
          />
          <button id="search-button" className="btn btn-success">
            <FormattedMessage id="searchbutton.text" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
