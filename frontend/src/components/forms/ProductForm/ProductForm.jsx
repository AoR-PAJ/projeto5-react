import InputField from "../InputField/InputField";
import SubmitButton from "../../buttons/SubmitButton/SubmitButton";
import SelectField from "../SelectField/SelectField";
import { FormattedMessage, useIntl } from "react-intl";

const ProductForm = ({ formData, handleChange, handleSubmit, categories }) => {
  const intl = useIntl();
  return (
    <form onSubmit={handleSubmit}>
      <h2>
        <FormattedMessage id="createProduct" />
      </h2>
      <hr className="separator" />

      <InputField
        label={intl.formatMessage({ id: "image" })}
        type="text"
        name="picture"
        placeholder="Insira a URL"
        value={formData.picture}
        onChange={handleChange}
        required
      />

      <SelectField
        label={intl.formatMessage({ id: "category" })}
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
        label={intl.formatMessage({ id: "title" })}
        type="text"
        name="title"
        placeholder="Add title"
        value={formData.title}
        onChange={handleChange}
        maxLength={50}
        required
      />
      <InputField
        label={intl.formatMessage({ id: "description" })}
        type="textarea"
        name="description"
        placeholder="Add description"
        value={formData.description}
        onChange={handleChange}
        maxLength={200}
        required
      />
      <InputField
        label={intl.formatMessage({ id: "price" })}
        type="text"
        name="price"
        placeholder="Add price"
        value={formData.price}
        onChange={handleChange}
        maxLength={15}
        required
      />
      <InputField
        label={intl.formatMessage({ id: "location" })}
        type="text"
        name="location"
        placeholder="Add location"
        value={formData.location}
        onChange={handleChange}
        maxLength={30}
        required
      />

      <SubmitButton text={intl.formatMessage({ id: "sellbutton.text" })} />
    </form>
  );
};

export default ProductForm;
