import InputField from "../InputField/InputField";
import SubmitButton from "../../buttons/SubmitButton/SubmitButton";
import SelectField from "../SelectField/SelectField";

const ProductForm = ({ formData, handleChange, handleSubmit, categories }) => {
  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a new sale</h2>
      <hr className="separator" />

      <InputField
        label="Image"
        type="text"
        name="picture"
        placeholder="Insira a URL"
        value={formData.picture}
        onChange={handleChange}
        required
      />

      <SelectField
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        options={categories.map((category) => ({
          value: category.id,
          label: category.nome,
        }))}
        required
      />

      <InputField
        label="Title"
        type="text"
        name="title"
        placeholder="Add title"
        value={formData.title}
        onChange={handleChange}
        maxLength={50}
        required
      />
      <InputField
        label="Description"
        type="textarea"
        name="description"
        placeholder="Add description"
        value={formData.description}
        onChange={handleChange}
        maxLength={200}
        required
      />
      <InputField
        label="Price"
        type="text"
        name="price"
        placeholder="Add price"
        value={formData.price}
        onChange={handleChange}
        maxLength={15}
        required
      />
      <InputField
        label="Location"
        type="text"
        name="location"
        placeholder="Add location"
        value={formData.location}
        onChange={handleChange}
        maxLength={30}
        required
      />

      <SubmitButton text="Sell" />
    </form>
  );
};

export default ProductForm;
