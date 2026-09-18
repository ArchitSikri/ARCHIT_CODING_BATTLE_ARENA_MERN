import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Swords } from "lucide-react";
import { backgroundImage } from "../../constants/ui";

const PageFrame = ({ children, className = "", wide = false }) => {
  const contentRef = useRef(null);
  const contentWidth = wide ? "max-w-6xl" : "max-w-4xl";

  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }
    );
  }, []);

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden bg-cover bg-center bg-fixed px-4 py-6 text-white sm:px-8"
      style={{ backgroundImage: `url("${backgroundImage}")` }}
    >
      <div className="absolute inset-0 bg-[#09070d]/80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(236,72,153,0.2),transparent_28%),radial-gradient(circle_at_85%_80%,rgba(14,165,233,0.16),transparent_30%)]" />
      <div
        ref={contentRef}
        className={`relative z-10 mx-auto ${contentWidth}`}
      >
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-fuchsia-300/30 bg-fuchsia-400/15 text-fuchsia-200">
              <Swords size={19} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-fuchsia-200/75">
                Code Battle
              </p>
              <p className="text-xs text-white/45">Think fast. Ship faster.</p>
            </div>
          </div>
          <span className="hidden rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] font-medium text-emerald-200 sm:block">
            Arena online
          </span>
        </header>
        <div className={className}>{children}</div>
      </div>
    </main>
  );
};

export default PageFrame;
