import "./CreateProduct.css";

function CreateProduct() {
  return(
    <div className="create-product-wrapper">
      <main id="main-div" className="clearfix main-div-create-product">
      <div className="create-product-wrapper">
        <a href="/homePage"> 
      <img className="lettering" src="./assets/lettering.png" alt="lettering" height="180" />
    </a>
    
    <form>
        <h2>Create a new sale</h2>
        <hr className="separator" />

        <div className="form-group">
        <label htmlFor="image">Image</label>
        <input type="text" placeholder="Insira a url" id="image-produto" /> 
      </div>
      
      <div className="form-group">
        <label htmlFor="category">Category:</label>
        <select id="category" name="category" maxLength="15" required></select>
      </div>
      
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" placeholder="Add title" maxLength="15" /> 
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea id="description" placeholder="Add description" maxLength="30"></textarea> 
      </div>
      
      <div className="form-group">
        <label htmlFor="price">Price:</label>
        <input type="text" id="price" placeholder="Add price" maxLength="6" /> 
      </div>
      
      <div className="form-group">
        <label htmlFor="location">Location:</label>
        <input type="text" id="location" placeholder="Add location" maxLength="15" /> 
      </div>

      <div className="btn-container">
        <button  type="submit" id="btn-sell" name="action" value="DISPONIVEL" className="btn btn-sell">Sell</button>
        <button type="submit" id="btn-draft" name="action" value="RASCUNHO" className="btn btn-draft">Draft</button>
      </div>
    </form>

      </div>
      </main>
    </div>


  );
}

export default CreateProduct;