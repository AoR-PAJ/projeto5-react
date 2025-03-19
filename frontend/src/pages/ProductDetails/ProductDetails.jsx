import "./ProductDetails.css";

function ProductDetails() {
  return (
    <main id="main-div" className="clearfix">
      <div id="product-details">
        <div className="product-container">
          <div className="image-container">
            <img id="product-image" className="product-image" alt="Product Image" />
          </div>

          <div className="text-container" id="product-info">
            <p className="nomeProduct">Title: <span id="product-title" className="editable"></span></p>
            <p className="categoryProduct">Category: <span id="product-category" className="editable"></span></p>
            <p className="precoProduct">Price: <span id="product-price" className="editable"></span>€</p>
            <p className="categoryProduct">Description: <span id="product-description" className="editable"></span></p>
            <p className="sellerProduct">Seller: <span id="product-seller"></span></p>
            <p className="categoryProduct">Location: <span id="product-location" className="editable"></span></p>
            <p className="categoryProduct">Publication: <span id="product-date"></span></p>
            <p className="categoryProduct">Alteration: <span id="product-alteration"></span></p>
            <p className="categoryProduct">State: <span id="product-state"></span></p>
            <p className="categoryProduct">Image: <span id="product-imagem"></span></p>

            <div id="edit-buttons"></div>
            <div id="action-buttons">
              <button id="delete-product-button" className="button">Delete Product</button>
            </div>
          </div>

          <div id="edit-form" style={{ display: "none" }}>
            <h3>Edit Your Information</h3>
            <form id="update-form">
              <label htmlFor="title">Title: </label>
              <input type="text" id="title" name="title" maxLength="10" />
              
              <label htmlFor="category">Category: </label>
              <input type="text" id="category" name="category" maxLength="15" />
              
              <label htmlFor="price">Price: </label>
              <input type="text" id="price" name="price" maxLength="6" />
              
              <label htmlFor="description">Description: </label>
              <input type="text" id="description" name="description" maxLength="30" />
              
              <label htmlFor="location">Location: </label>
              <input type="text" id="location" name="location" maxLength="30" />
              
              <button type="submit">Save changes</button>
              <button type="button" id="cancel-edit">Cancel</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;
