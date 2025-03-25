const SubmitButton = ({ text }) => {
  return (
    <div className="btn-container">
      <button type="submit" className="btn btn-sell">
        {text}
      </button>
    </div>
  );
};

export default SubmitButton;
