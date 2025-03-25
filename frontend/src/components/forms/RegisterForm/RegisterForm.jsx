import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateUser = async (userData) => {
    try {
      const response = await fetch(
        "http://localhost:8080/vanessa-vinicyus-proj3/rest/users/register",
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userData.username,
            password: userData.password,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            photoUrl: userData.photo,
            estado: "ativo",
            admin: userData.userType === "true",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao criar usuário");
      }

      alert("Usuário criado com sucesso");
      navigate("/login");
    } catch (error) {
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
        maxLength="9"
        value={inputs.phone}
        onChange={handleChange}
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
      />

      <RegisterButton text="Register" />
    </form>
  );
};

export default RegisterForm;
