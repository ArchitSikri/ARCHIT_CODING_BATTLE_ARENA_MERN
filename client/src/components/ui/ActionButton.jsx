const ActionButton = ({ children, icon: Icon, className = "", ...props }) => (
  <button
    className={`flex items-center justify-center gap-2 rounded-xl bg-fuchsia-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-fuchsia-950/40 transition hover:bg-fuchsia-400 ${className}`}
    {...props}
  >
    {Icon && <Icon size={17} />}
    {children}
  </button>
);

export default ActionButton;
