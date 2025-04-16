const SearchBar = () => (
  <div id="search-bar-div">
    <input
      type="text"
      id="search-input"
      className="search-bar"
      placeholder="Pesquisar..."
    />
    <button id="search-button" className="btn btn-success">Search</button>
  </div>
);

export default SearchBar;
