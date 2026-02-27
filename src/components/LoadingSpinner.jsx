const LoadingSpinner = ({ size = 'medium', fullPage = false }) => {
  const sizeClass = `spinner--${size}`;

  if (fullPage) {
    return (
      <div className="spinner-fullpage">
        <div className={`spinner ${sizeClass}`} />
      </div>
    );
  }

  return <div className={`spinner ${sizeClass}`} />;
};

export default LoadingSpinner;
