import React from "react";
import Footer from "../../components/footer/Footer";
import "./Registo.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Registo() {
  const navigate = useNavigate();

  //capturar os inputs do formulario
  const [inputs, setInputs] = useState({
    photo: "",
    firstName: "",
    lastName:"",
    username:"",
    password:"",
    confirmPassword: "",
    email: "",
    phone: "",
    userType: "false"
  });

  //armazenando os valores nas variaveis correspondentes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value
    }));
  }

  //fetch para criar um novo utilizador
  const handleCreateUser = async (userData) => {
    
    try {
      const response = await fetch("http://localhost:8080/vanessa-vinicyus-proj3/rest/users/register", {
        method: "POST",
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "username": userData.username,
          "password": userData.password,
          "firstName": userData.firstName,
          "lastName": userData.lastName,
          "email": userData.email,
          "phone": userData.phone,
          "photoUrl": userData.photo,
          "estado": "ativo",
          "admin": userData.userType === "true",
        }), 
      });

      if(!response.ok) {
        console.log("response" + response);
        throw new Error("Erro ao criar usuário");
      }

      const data = await response.text();
      alert("user criado com sucesso");
      
      
      navigate("/login");
      

    } catch(error) {
      console.error(error);
    }
  } 


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);

    handleCreateUser(inputs);
  }

  return(
    <div className="registo-wrapper">
      <main>
        <a href="homePage">
            <img className="lettering" src="assets/lettering.png" alt="lettering" height="180"/>
        </a>
    
        <form id="register-form" className="form-wrapper" onSubmit={handleSubmit}>
            <h2>Registration</h2>
            <hr className="separator"/>
        
            <div className="form-group">
                <label htmlFor="photo-url">Photo (URL):</label>
                <input type="url" id="photo-url" name="photo" maxLength="200" onChange = {handleChange} defaultValue={inputs.photo}/>
            </div>
        
            <div className="form-group">
                <label htmlFor="first-name">First Name:</label>
                <input type="text" id="first-name" name="firstName" maxLength="15" onChange = {handleChange} defaultValue={inputs.firstName} required/>
            </div>
        
            <div className="form-group">
                <label htmlFor="last-name">Last Name:</label>
                <input type="text" id="last-name" name="lastName" maxLength="15" onChange = {handleChange} defaultValue={inputs.lastName} required/>
            </div>
        
            <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" maxLength="15" onChange = {handleChange} defaultValue={inputs.username} required/>
            </div>
        
            <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" maxLength="15" onChange = {handleChange} defaultValue={inputs.password} required/>
            </div>
        
            <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password:</label>
                <input type="password" id="confirm-password" name="confirmPassword" maxLength="15" onChange = {handleChange} defaultValue={inputs.confirmPassword} required/>
            </div>
        
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" maxLength="30" onChange = {handleChange} defaultValue={inputs.email} required/>
            </div>
        
            <div className="form-group">
                <label htmlFor="phone">Phone Number:</label>
                <input type="tel" id="phone" name="phone" maxLength="9" onChange = {handleChange} defaultValue={inputs.phone} required/>
            </div>
        
            <div className="form-group">
                <label htmlFor="user-type">User Type:</label>
                <select id="user-type" name="userType" onChange = {handleChange} value={inputs.userType}>
                    <option value="false">Normal User</option>
                    <option value="true">Administrator</option>
                </select>
            </div>
        
            <div className="form-group">
                <button type="submit" className="btn btn-register">Register</button>
            </div>
        </form>
       </main>  
    </div>
  )
}

export default Registo;