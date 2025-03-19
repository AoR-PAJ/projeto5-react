import "./CreateProduct.css";
import { useState, useEffect } from "react";
import { AuthStore } from "../../stores/AuthStore";

function CreateProduct() {
  const username = AuthStore((state) => state.username);
  const token = sessionStorage.getItem("token");
  
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    description: "",
    location: "",
    picture: "",
    price: "",
    status: "DISPONIVEL",
    title: "",
    category: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = `http://localhost:8080/vanessa-vinicyus-proj3/rest/users/${username}/addProducts`;

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Passando o token no cabeçalho
      },
      body: JSON.stringify(formData), // Enviando os dados do formulário
    };

    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error('Erro ao criar o produto');
      }

      alert("Produto criado com sucesso!");

    } catch (err) {
      setError(err.message);
    }
  }


  //exibe as categorias que estao disponiveis 
   useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/vanessa-vinicyus-proj3/rest/category/all");
        if (!response.ok) {
          throw new Error("Erro ao buscar categorias");
        }
        const data = await response.json();
        setCategories(data); // Armazena as categorias no estado
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCategories();
  }, []);

  

  return(
    <div className="create-product-wrapper">
      <main id="main-div" className="clearfix main-div-create-product">
      <div className="create-product-wrapper">
        <a href="/homePage"> 
      <img className="lettering" src="./assets/lettering.png" alt="lettering" height="180" />
    </a>
    
    <form onSubmit={handleSubmit}>
        <h2>Create a new sale</h2>
        <hr className="separator" />

        <div className="form-group">
        <label htmlFor="image">Image</label>
        <input 
          type="text" 
          placeholder="Insira a url" 
          value={formData.image} 
          onChange={handleChange} 
          name="picture"
          id="image-produto" /> 
      </div>
      
      <div className="form-group">
        <label htmlFor="category">Category:</label>
        <select 
          id="category" 
          name="category" 
          value={formData.category} 
          onChange={handleChange} 
          maxLength="15" 
          required
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((category) => (
                  <option key={category.nome} value={category.id}>
                    {category.nome}
                  </option>
                ))}
          
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input 
          type="text" 
          id="title" 
          placeholder="Add title" 
          value={formData.title} 
          onChange={handleChange} 
          maxLength="15" 
          name="title"
        /> 
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea 
          id="description" 
          placeholder="Add description" 
          value={formData.description} 
          onChange={handleChange} 
          name="description"
          maxLength="60"
        >
        </textarea> 
      </div>
      
      <div className="form-group">
        <label htmlFor="price">Price:</label>
        <input 
          type="text" 
          id="price" 
          placeholder="Add price" 
          value={formData.price} 
          onChange={handleChange} 
          maxLength="6" 
          name="price"
        /> 
      </div>
      
      <div className="form-group">
        <label htmlFor="location">Location:</label>
        <input 
          type="text" 
          id="location" 
          placeholder="Add location" 
          value={formData.location} 
          onChange={handleChange} 
          maxLength="15" 
          name="location"
        /> 
      </div>

      <div className="btn-container">
        <button  type="submit" id="btn-sell" name="action" value="DISPONIVEL" className="btn btn-sell">Sell</button>
      </div>
    </form>

      </div>
      </main>
    </div>


  );
}

export default CreateProduct;