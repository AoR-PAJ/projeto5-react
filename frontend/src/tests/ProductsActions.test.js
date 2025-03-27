import { render, screen, fireEvent } from "@testing-library/react";
import ProductActions from "../components/buttons/ProductActionsButton/ProductsActions";

it("deve exibir os botões de Editar e Deletar quando o usuário for dono do produto e não for admin", () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnBuy = jest.fn();

  // Renderizando o componente com isOwner=true e isAdmin=false
  render(
    <ProductActions
      isOwner={true}
      isAdmin={false}
      onEdit={mockOnEdit}
      onDelete={mockOnDelete}
      onBuy={mockOnBuy}
    />
  );

  // Verificando se os botões corretos estão sendo renderizados
  expect(screen.getByText("Edit Product")).toBeInTheDocument();
  expect(screen.getByText("Delete Product")).toBeInTheDocument();

  // Verificando se o botão de "Buy" não está presente
  expect(screen.queryByText("Buy")).not.toBeInTheDocument();
});

it("deve chamar a função onEdit quando o botão Edit Product for clicado", () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnBuy = jest.fn();

  render(
    <ProductActions
      isOwner={true}
      isAdmin={false}
      onEdit={mockOnEdit}
      onDelete={mockOnDelete}
      onBuy={mockOnBuy}
    />
  );

  // Encontrando o botão de "Edit Product"
  const editButton = screen.getByText("Edit Product");

  // Clicando no botão
  fireEvent.click(editButton);

  // Verificando se a função mockada foi chamada
  expect(mockOnEdit).toHaveBeenCalledTimes(1);
});
