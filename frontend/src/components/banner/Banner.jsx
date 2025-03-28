//componente que exibe a imagem principal na homepage
const Banner = () => (
  <div id="banner-div">
    <img src="./assets/newlogo.png" alt="Logotipo" height="320" />
    <div className="button-container">
      <a href="#search-bar-div" className="buybutton animate-buybutton">
        Press <br /> Start Buying
      </a>
      <a href="/create-product" className="sellbutton animate-sellbutton">
        Press <br />
        Start Selling
      </a>
    </div>
  </div>
);

export default Banner;
