const PageHeading = ({ eyebrow, title, description }) => (
  <div className="mb-8">
    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-300">
      {eyebrow}
    </p>
    <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
      {title}
    </h1>
    <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
      {description}
    </p>
  </div>
);

export default PageHeading;
