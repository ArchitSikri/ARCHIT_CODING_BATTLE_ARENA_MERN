const GlassPanel = ({ children, className = "" }) => (
  <div
    className={`border border-white/10 bg-black/55 shadow-2xl backdrop-blur-2xl ${className}`}
  >
    {children}
  </div>
);

export default GlassPanel;
