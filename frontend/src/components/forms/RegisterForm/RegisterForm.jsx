import { FormattedMessage, useIntl } from "react-intl";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Service } from "../../../Services/Services";

import InputField from "../InputField/InputField";
import SelectField from "../SelectField/SelectField";
import RegisterButton from "../../buttons/RegisterButton/RegisterButton";

const RegisterForm = () => {
  const navigate = useNavigate();
  const intl = useIntl();

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
    const BASE_URL = "http://localhost:8080/vanessa-vinicyus-proj3/rest";
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
      alert("Todos os campos são obrigatórios!");
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    const phoneRegex = /^\d{9}$/;
    if (!phoneRegex.test(userData.phone)) {
      alert("O número de telefone deve conter exatamente 9 dígitos.");
      return;
    }

    try {
      const verificationToken = await Service.registerUser(userData);
      alert(
        "Usuário criado com sucesso. Por favor acesse o console para ativar a conta."
      );

      const verificationUrl = `${BASE_URL}/auth/verifyAccount?token=${verificationToken}`;
      console.log("Clique no link para ativar sua conta: ", verificationUrl);
    } catch (error) {
      alert("Erro ao criar conta");
      console.error(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleCreateUser(inputs);
  };

  return (
    <form id="register-form" className="form-wrapper" onSubmit={handleSubmit}>
      <h2>
        <FormattedMessage id="registration.text" />
      </h2>
      <hr className="separator" />
      <InputField
        label={intl.formatMessage({ id: "registrationForm.photo" })}
        type="url"
        id="photo-url"
        name="photo"
        maxLength="200"
        value={inputs.photo}
        onChange={handleChange}
      />
      <InputField
        label={intl.formatMessage({ id: "registrationForm.firstName" })}
        type="text"
        id="first-name"
        name="firstName"
        maxLength="20"
        value={inputs.firstName}
        onChange={handleChange}
        required
      />
      <InputField
        label={intl.formatMessage({ id: "registrationForm.lastname" })}
        type="text"
        id="last-name"
        name="lastName"
        maxLength="20"
        value={inputs.lastName}
        onChange={handleChange}
        required
      />
      <InputField
        label={intl.formatMessage({ id: "inputUsername.text" })}
        type="text"
        id="username"
        name="username"
        maxLength="30"
        value={inputs.username}
        onChange={handleChange}
        required
      />
      <InputField
        label={intl.formatMessage({ id: "inputPassword.text" })}
        type="password"
        id="password"
        name="password"
        maxLength="15"
        value={inputs.password}
        onChange={handleChange}
        required
      />
      <InputField
        label={intl.formatMessage({ id: "registrationForm.confirmPassword" })}
        type="password"
        id="confirm-password"
        name="confirmPassword"
        maxLength="15"
        value={inputs.confirmPassword}
        onChange={handleChange}
        required
      />
      <InputField
        label={intl.formatMessage({ id: "registrationForm.email" })}
        type="email"
        id="email"
        name="email"
        maxLength="30"
        value={inputs.email}
        onChange={handleChange}
        required
      />
      <InputField
        label={intl.formatMessage({ id: "registrationForm.phone" })}
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
        label={intl.formatMessage({ id: "registrationForm.userType" })}
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
      <RegisterButton text={intl.formatMessage({ id: "registration.text" })} />
    </form>
  );
};

export default RegisterForm;
