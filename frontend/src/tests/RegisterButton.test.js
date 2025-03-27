import { render, screen } from "@testing-library/react";
import RegisterButton from "../components/buttons/RegisterButton/RegisterButton";

it("deve renderizar o botão com o texto passado como prop", () => {
  const text = "Register";

  // Renderizando o componente com a prop 'text'
  render(<RegisterButton text={text} />);

  // Verificando se o texto passado aparece no botão
  expect(screen.getByText(text)).toBeInTheDocument();
});


it("deve aplicar a classe 'btn-register' no botão", () => {
  const text = "Register";

  // Renderizando o componente
  render(<RegisterButton text={text} />);

  // Verificando se o botão tem a classe 'btn-register'
  expect(screen.getByRole("button")).toHaveClass("btn-register");
});


it("deve renderizar o botão com diferentes textos", () => {
  // Testando com o texto "Register"
  render(<RegisterButton text="Register" />);
  expect(screen.getByText("Register")).toBeInTheDocument();

  // Testando com o texto "Sign Up"
  render(<RegisterButton text="Sign Up" />);
  expect(screen.getByText("Sign Up")).toBeInTheDocument();
});
