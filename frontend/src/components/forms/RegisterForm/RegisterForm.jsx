import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Service } from "../../../Services/Services";

import InputField from "../InputField/InputField";
import SelectField from "../SelectField/SelectField";
import RegisterButton from "../../buttons/RegisterButton/RegisterButton";


const RegisterForm = () => {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    photo: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    userType: "false",
  });

 const handleChange = (event) => {
   const { name, value } = event.target;

   if (name === "phone") {
     // Permite apenas números e limita a 9 caracteres
     const formattedValue = value.replace(/\D/g, ""); // Remove qualquer caractere não numérico
     if (formattedValue.length <= 9) {
       setInputs((prev) => ({
         ...prev,
         [name]: formattedValue,
       }));
     }
   } else {
     setInputs((prev) => ({
       ...prev,
       [name]: value,
     }));
   }
 };

  const handleCreateUser = async (userData) => {
    // Verifica se todos os campos obrigatórios estão preenchidos
    if (
      userData.photo.trim() === "" ||
      userData.firstName.trim() === "" ||
      userData.lastName.trim() === "" ||
      userData.username.trim() === "" ||
      userData.password.trim() === "" ||
      userData.confirmPassword.trim() === "" ||
      userData.email.trim() === "" ||
      userData.phone.trim() === "" ||
      userData.userType.trim() === ""
    ) {
      alert("Todos os campos são obrigaórios!")
      return; 
    }

    // Verifica se as senhas coincidem
    if (userData.password !== userData.confirmPassword) {
      alert("As senhas não coincidem!");
      return; 
    }

    //verificao do campo do telefone
    const phoneRegex = /^\d{9}$/;

    if (!phoneRegex.test(userData.phone)) {
      alert("O número de telefone deve conter exatamente 9 dígitos.");
      return;
    }

    try {
      const response = await Service.registerUser(userData);
      alert("Usuário criado com sucesso");
      navigate("/login");
    } catch (error) {
      alert("erro ao criar conta")
      console.error(error);
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    handleCreateUser(inputs);
  };

  return (
    <form id="register-form" className="form-wrapper" onSubmit={handleSubmit}>
      <h2>Registration</h2>
      <hr className="separator" />

      <InputField
        label="Photo (URL)"
        type="url"
        id="photo-url"
        name="photo"
        maxLength="200"
        value={inputs.photo}
        onChange={handleChange}
      />
      <InputField
        label="First Name"
        type="text"
        id="first-name"
        name="firstName"
        maxLength="15"
        value={inputs.firstName}
        onChange={handleChange}
        maxLength={20}
        required
      />
      <InputField
        label="Last Name"
        type="text"
        id="last-name"
        name="lastName"
        maxLength="15"
        value={inputs.lastName}
        onChange={handleChange}
        maxLength={20}
        required
      />
      <InputField
        label="Username"
        type="text"
        id="username"
        name="username"
        maxLength="15"
        value={inputs.username}
        onChange={handleChange}
        maxLength={30}
        required
      />
      <InputField
        label="Password"
        type="password"
        id="password"
        name="password"
        maxLength="15"
        value={inputs.password}
        onChange={handleChange}
        required
      />
      <InputField
        label="Confirm Password"
        type="password"
        id="confirm-password"
        name="confirmPassword"
        maxLength="15"
        value={inputs.confirmPassword}
        onChange={handleChange}
        required
      />
      <InputField
        label="Email"
        type="email"
        id="email"
        name="email"
        maxLength="30"
        value={inputs.email}
        onChange={handleChange}
        required
      />
      <InputField
        label="Phone Number"
        type="tel"
        id="phone"
        name="phone"
        value={inputs.phone}
        onChange={handleChange}
        maxLength="9"
        minLength="9"
        pattern="^\d{9}$"
        required
      />

      <SelectField
        label="User Type"
        id="user-type"
        name="userType"
        value={inputs.userType}
        onChange={handleChange}
        options={[
          { value: "false", label: "Normal User" },
          { value: "true", label: "Administrator" },
        ]}
        required
      />

      <RegisterButton text="Register" />
    </form>
  );
};

export default RegisterForm;
