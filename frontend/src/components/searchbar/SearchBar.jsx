import { FormattedMessage } from "react-intl";
import {useIntl} from "react-intl";

const SearchBar = () => {
  const intl = useIntl();

  return (
  <div id="search-bar-div">
    <input
      type="text"
      id="search-input"
      className="search-bar"
      placeholder={intl.formatMessage({ id: "searchbar.placeholder" })}
    />
    <button id="search-button" className="btn btn-success">
      <FormattedMessage id="searchbutton.text" />
    </button>
  </div>
  )
}
;

export default SearchBar;
