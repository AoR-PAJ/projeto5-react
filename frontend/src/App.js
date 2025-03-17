import React from 'react';
import './App.css';
import Header from "../src/components/header/Header";
import Footer from './components/footer/Footer';

function App() {
  return (
    <div className='App' id ="outer-container">
      <div className='page-wrap' id="app-page-wrap">
        <Header/>
        <h1>Welcome to the website</h1> 
        <Footer/>
      </div>
    </div>
  );
}

export default App;
