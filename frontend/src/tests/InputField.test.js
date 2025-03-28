import { render, screen } from "@testing-library/react";
import InputField from "../components/forms/InputField/InputField";

test("renderiza o InputField corretamente", () => {
  render(
    <InputField
      label="Nome"
      type="text"
      id="name"
      name="name"
      maxLength={50}
      value=""
      onChange={() => {}}
      required={false}
    />
  );
  const inputElement = screen.getByLabelText(/nome/i);
  expect(inputElement).toBeInTheDocument();
  expect(inputElement).toHaveAttribute("type", "text");
  expect(inputElement).toHaveAttribute("maxLength", "50");
});


test("o valor do campo é controlado corretamente", () => {
  render(
    <InputField
      label="Nome"
      type="text"
      id="name"
      name="name"
      maxLength={50}
      value="John"
      onChange={() => {}}
      required={false}
    />
  );
  const inputElement = screen.getByLabelText(/nome/i);
  expect(inputElement).toHaveValue("John");
});


test("verifica se o campo é obrigatório", () => {
  render(
    <InputField
      label="Email"
      type="email"
      id="email"
      name="email"
      maxLength={100}
      value=""
      onChange={() => {}}
      required={true}
    />
  );
  const inputElement = screen.getByLabelText(/email/i);
  expect(inputElement).toBeRequired();
});


test("verifica o maxLength do campo de input", () => {
  render(
    <InputField
      label="Nome"
      type="text"
      id="name"
      name="name"
      maxLength={5}
      value=""
      onChange={() => {}}
      required={false}
    />
  );
  const inputElement = screen.getByLabelText(/nome/i);
  expect(inputElement).toHaveAttribute("maxLength", "5");
});


