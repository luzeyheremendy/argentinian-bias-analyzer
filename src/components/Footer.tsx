
export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500">
        <p>AI Bias Analyzer &copy; {new Date().getFullYear()}</p>
        <p className="mt-2">
          This tool analyzes AI responses for bias markers and sentiment patterns.
          It does not store any of the analyzed content.
        </p>
      </div>
    </footer>
  );
};
