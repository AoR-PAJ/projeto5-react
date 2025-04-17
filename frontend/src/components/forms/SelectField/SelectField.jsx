import { FormattedMessage } from "react-intl";

const SelectField = ({ label, id, name, value, onChange, options }) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}:</label>
      <select id={id} name={name} onChange={onChange} value={value}>
        <option value="" checked disabled>
          <FormattedMessage id="select" />
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
