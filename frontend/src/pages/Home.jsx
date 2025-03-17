import React from "react";
import Sidebar from "../components/navbar/Sidebar";
import "../index.css";

function Home() {
  return(
    <div className="Home" id="home-outer-container">
      <Sidebar pageWrapId={"home-page-wrap"} outerContainerId={"home-outer-container"}/>
      <div className="page-wrap" id="home-page-wrap">
        <h1>Home</h1>
      </div>
    </div>
  )
}

export default Home;