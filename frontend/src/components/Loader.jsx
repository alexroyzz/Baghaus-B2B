const Loader = ({ label = "Loading" }) => (
  <div className="flex items-center justify-center py-24">
    <div className="flex items-center gap-3 text-espresso/50">
      <span className="h-4 w-4 rounded-full border-2 border-camel border-t-transparent animate-spin" />
      <span className="text-sm tracking-wide">{label}...</span>
    </div>
  </div>
);

export default Loader;
