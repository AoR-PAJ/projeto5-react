const SubmitButton = ({ text }) => {
  return (
    <div className="btn-container">
      <button type="submit" className="btn btn-sell btn-success">
        {text}
      </button>
    </div>
  );
};

export default SubmitButton;
