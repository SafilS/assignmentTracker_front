function LoadingSpinner({ message = "Loading...", size = "medium" }) {
  const sizeClasses = {
    small: "loading-spinner-small",
    medium: "loading-spinner-medium",
    large: "loading-spinner-large"
  };

  return (
    <div className="loading-container">
      <div className={`loading-spinner ${sizeClasses[size]}`}>
        <div className="spinner-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
