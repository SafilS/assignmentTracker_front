function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="loading-dots mb-4"></div>
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
}

export default LoadingSpinner;