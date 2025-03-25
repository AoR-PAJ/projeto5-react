const RegisterButton = ({ text }) => {
  return (
    <div className="form-group">
      <button type="submit" className="btn btn-register">
        {text}
      </button>
    </div>
  );
};

export default RegisterButton;
