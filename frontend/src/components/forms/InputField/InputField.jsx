const InputField = ({
  label,
  type,
  id,
  name,
  maxLength,
  value,
  onChange,
  required,
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}:</label>
      <input
        type={type}
        id={id}
        name={name}
        maxLength={maxLength}
        onChange={onChange}
        value={value}
        required={required}
      />
    </div>
  );
};

export default InputField;
