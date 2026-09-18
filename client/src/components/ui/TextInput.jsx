const TextInput = ({ label, icon: Icon, ...props }) => (
  <label className="block">
    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
      {label}
    </span>
    <span className="relative block">
      {Icon && (
        <Icon
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
          size={17}
        />
      )}
      <input
        {...props}
        className={`w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-fuchsia-300/70 focus:bg-white/[0.11] ${Icon ? "pl-11" : ""}`}
      />
    </span>
  </label>
);

export default TextInput;
