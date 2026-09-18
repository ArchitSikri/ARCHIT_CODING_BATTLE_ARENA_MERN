import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, LockKeyhole, Plus, Settings2, Timer } from "lucide-react";
import PageFrame from "../components/layout/PageFrame";
import ActionButton from "../components/ui/ActionButton";
import GlassPanel from "../components/ui/GlassPanel";
import PageHeading from "../components/ui/PageHeading";

const CreaterRoom = () => {
  const navigate = useNavigate();
  const handleCreateRoom = () => navigate("/start-battle");

  return (
    <PageFrame>
      <button
        type="button"
        onClick={() => navigate("/home")}
        className="mb-8 flex items-center gap-2 text-sm text-white/45 hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to lobby
      </button>

      <PageHeading
        eyebrow="Private match"
        title="Create a room."
        description="Tune the rules, invite your rival, and start when the room feels right."
      />

      <div className="grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
        <GlassPanel className="rounded-3xl p-6 sm:p-8">
          <div className="mb-7 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Room settings</h2>
              <p className="mt-1 text-sm text-white/45">
                A balanced setup for two challengers.
              </p>
            </div>
            <Settings2 className="text-fuchsia-300" size={20} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <Timer size={18} className="text-cyan-300" />
              <p className="mt-5 text-xs text-white/45">Time limit</p>
              <p className="mt-1 font-bold">15 minutes</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <LockKeyhole size={18} className="text-emerald-300" />
              <p className="mt-5 text-xs text-white/45">Visibility</p>
              <p className="mt-1 font-bold">Invite only</p>
            </div>
          </div>

          <ActionButton
            icon={Plus}
            className="mt-6 w-full"
            onClick={handleCreateRoom}
          >
            Create battle room
          </ActionButton>
        </GlassPanel>

        <GlassPanel className="rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            Invite code
          </p>
          <div className="mt-6 rounded-2xl border border-fuchsia-300/25 bg-fuchsia-300/10 p-5 text-center">
            <p className="text-4xl font-black tracking-[0.25em] text-fuchsia-100">
              A7K9Q
            </p>
            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center gap-2 text-sm text-white/55 hover:text-white"
            >
              <Copy size={15} />
              Copy code
            </button>
          </div>
          <p className="mt-5 text-sm leading-6 text-white/45">
            Share this code with one friend. The room will stay private until
            they join.
          </p>
        </GlassPanel>
      </div>
    </PageFrame>
  );
};

export default CreaterRoom;
