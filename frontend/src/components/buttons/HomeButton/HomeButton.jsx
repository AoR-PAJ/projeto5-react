import "./HomeButton.css";
import { useNavigate } from "react-router-dom";

function HomeButton() {
  const navigate = useNavigate();
  return (
    <button className="home-button">
      <img src="./assets/lettering.png" alt="home button image" onClick={()=>navigate("/homePage")}/>
    </button>
  )
}

export default HomeButton;