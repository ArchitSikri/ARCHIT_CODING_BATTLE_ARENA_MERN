import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Plus, Swords, UsersRound } from "lucide-react";
import { RiFlashlightLine } from "@remixicon/react";
import PageFrame from "../components/layout/PageFrame";
import { UserDataContext } from "../context/UserContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserDataContext);
  
  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const displayName = user?.name || savedUser.name || "Challenger";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <PageFrame wide>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <section className="py-8 lg:py-16">
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-emerald-300">
            <RiFlashlightLine size={18} /> Your arena is ready
          </p>
          <h1 className="max-w-2xl text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl">
            Make your next line of code <span className="text-fuchsia-300">count.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-white/55">
            Jump into a focused head-to-head session, solve faster, and find out who owns the runtime.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl bg-fuchsia-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-fuchsia-950/40 transition hover:bg-fuchsia-400"
              onClick={() => navigate("/create-room")}
            >
              <Plus size={17} /> Create a room
            </button>
            <button
              type="button"
              onClick={() => navigate("/join-room")}
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.07] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.14]"
            >
              <UsersRound size={17} /> Join a match
            </button>
          </div>
        </section>

        <div className="border border-white/10 bg-black/55 p-6 shadow-2xl backdrop-blur-2xl sm:p-8 rounded-3xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">Player profile</p>
              <h2 className="mt-2 text-2xl font-bold">{displayName}</h2>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-400/15 text-xl font-black text-fuchsia-200">
              {initial}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <p className="text-xs text-white/40">Preferred Language</p>
              <p className="mt-2 text-xl font-black uppercase text-cyan-300">
                {user?.preferredLanguage || "C++"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <p className="text-xs text-white/40">Arena Status</p>
              <p className="mt-2 text-xl font-black text-emerald-300">Ready</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="mt-5 flex w-full items-center justify-between border-t border-white/10 pt-5 text-sm text-white/55 transition hover:text-white"
          >
            View profile <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      <div className="mt-12 grid gap-4 border-t border-white/10 pt-6 text-sm text-white/45 sm:grid-cols-3">
        <span className="flex items-center gap-2">
          <Swords size={16} className="text-fuchsia-300" /> 1v1 coding battles
        </span>
        <span>
          Realtime Socket <strong className="text-white">Active</strong>
        </span>
        <span className="sm:text-right">Code Battle Arena</span>
      </div>
    </PageFrame>
  );
};

export default Home;