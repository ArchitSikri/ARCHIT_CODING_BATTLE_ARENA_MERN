import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Clipboard, Copy, UsersRound } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import PageFrame from "../components/layout/PageFrame";
import ActionButton from "../components/ui/ActionButton";
import GlassPanel from "../components/ui/GlassPanel";

const Room = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { state } = useLocation();
  const [copied, setCopied] = useState(false);
  const [battle, setBattle] = useState(state?.battle || null);
  const [isLoading, setIsLoading] = useState(!state?.battle);

  useEffect(() => {
    if (battle) {
      return;
    }

    const token = localStorage.getItem("token");
    axios.get(`${import.meta.env.VITE_BASE_URL}/api/battle/room/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      setBattle(response.data?.battle || null);
    }).catch((error) => {
      toast.error(error.response?.data?.message || "Unable to load battle room");
      navigate("/home");
    }).finally(() => {
      setIsLoading(false);
    });
  }, [battle, navigate, roomId]);

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      toast.success("Room code copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Unable to copy room code");
    }
  };

  if (isLoading) {
    return <PageFrame className="flex min-h-[calc(100vh-3rem)] items-center justify-center"><p className="text-sm text-white/50">Loading room...</p></PageFrame>;
  }

  return (
    <PageFrame className="flex min-h-[calc(100vh-3rem)] flex-col justify-center">
      <button type="button" onClick={() => navigate("/home")} className="mb-8 flex items-center gap-2 text-sm text-white/45 hover:text-white"><ArrowLeft size={16} /> Back to lobby</button>
      <GlassPanel className="mx-auto w-full max-w-2xl rounded-3xl p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Battle room</p><h1 className="mt-2 text-3xl font-black">{battle?.battleName || "Your battle room"}</h1><p className="mt-2 text-sm text-white/45">{battle?.description || "Share the room code with your opponent to begin."}</p></div>
          <UsersRound className="mt-1 shrink-0 text-cyan-300" size={25} />
        </div>
        <div className="mt-7 rounded-2xl border border-fuchsia-300/25 bg-fuchsia-300/10 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">Room code</p>
          <div className="mt-3 flex items-center gap-3"><p className="min-w-0 flex-1 truncate text-3xl font-black tracking-[0.18em] text-fuchsia-100">{roomId}</p><button type="button" onClick={copyRoomCode} className="flex items-center gap-2 rounded-xl bg-fuchsia-500 px-4 py-3 text-sm font-bold text-white hover:bg-fuchsia-400">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Copied" : "Copy"}</button></div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"><div className="rounded-xl border border-white/10 bg-white/4 p-3"><p className="text-xs text-white/40">Questions</p><p className="mt-1 font-bold">{battle?.questionsNumber || "-"}</p></div><div className="rounded-xl border border-white/10 bg-white/4 p-3"><p className="text-xs text-white/40">Difficulty</p><p className="mt-1 font-bold capitalize">{battle?.difficulty || "-"}</p></div><div className="rounded-xl border border-white/10 bg-white/4 p-3"><p className="text-xs text-white/40">Mode</p><p className="mt-1 font-bold capitalize">{battle?.mode || "-"}</p></div><div className="rounded-xl border border-white/10 bg-white/4 p-3"><p className="text-xs text-white/40">Access</p><p className="mt-1 font-bold">Private</p></div></div>
        <div className="mt-7 flex flex-col items-center rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-7 text-center"><div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-cyan-300 text-cyan-200"><Clipboard size={24} /></div><h2 className="mt-4 text-xl font-bold">Waiting for opponent...</h2><p className="mt-2 text-sm text-white/45">Share the room code and start the battle when they join.</p></div>
        <ActionButton icon={ArrowLeft} className="mt-6 w-full" onClick={() => navigate("/home")}>Back to lobby</ActionButton>
      </GlassPanel>
    </PageFrame>
  );
};

export default Room;