import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Award, Code2, Flame, Target } from "lucide-react";
import PageFrame from "../components/layout/PageFrame";
import GlassPanel from "../components/ui/GlassPanel";
import PageHeading from "../components/ui/PageHeading";
import { UserDataContext } from "../context/UserContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserDataContext);
  
  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const displayName = user?.name || savedUser.name || "Challenger";
  const displayEmail = user?.email || savedUser.email || "user@example.com";
  const initial = displayName.charAt(0).toUpperCase();
  const lang = user?.preferredLanguage || "C++";

  return (
    <PageFrame>
      <button
        type="button"
        onClick={() => navigate("/home")}
        className="mb-8 flex items-center gap-2 text-sm text-white/45 hover:text-white transition"
      >
        <ArrowLeft size={16} />
        Back to lobby
      </button>

      <PageHeading
        eyebrow="Player Profile"
        title={`${displayName}.`}
        description="Your recent form, battle stats, and place on the circuit."
      />

      <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
        <GlassPanel className="rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-fuchsia-400/15 text-3xl font-black text-fuchsia-200 border border-fuchsia-300/30">
              {initial}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{displayName}</h2>
              <p className="mt-1 text-xs text-white/45 truncate">{displayEmail}</p>
            </div>
          </div>
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-orange-300/15 bg-orange-300/10 p-4">
            <Flame className="text-orange-300 shrink-0" size={20} />
            <div>
              <p className="font-bold text-sm">Battle Ready</p>
              <p className="text-xs text-white/45">Compete in 1v1 coding duels</p>
            </div>
          </div>
        </GlassPanel>

        <div className="grid grid-cols-2 gap-3">
          <GlassPanel className="rounded-3xl p-5">
            <Code2 className="text-amber-300" size={20} />
            <p className="mt-6 text-2xl font-black uppercase text-amber-200">{lang}</p>
            <p className="mt-1 text-xs text-white/45">Preferred Language</p>
          </GlassPanel>
          <GlassPanel className="rounded-3xl p-5">
            <Target className="text-cyan-300" size={20} />
            <p className="mt-6 text-2xl font-black text-cyan-300">Active</p>
            <p className="mt-1 text-xs text-white/45">Account Status</p>
          </GlassPanel>
          <GlassPanel className="col-span-2 rounded-3xl p-5">
            <Award className="text-emerald-300" size={20} />
            <p className="mt-6 text-2xl font-black text-emerald-300">Code Battle Arena</p>
            <p className="mt-1 text-xs text-white/45">Compete, solve, and win</p>
          </GlassPanel>
        </div>
      </div>
    </PageFrame>
  );
};

export default ProfilePage;
