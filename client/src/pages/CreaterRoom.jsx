import { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Code2, Hash, LockKeyhole, Plus, Settings2, Timer, UsersRound, Zap } from "lucide-react";
import PageFrame from "../components/layout/PageFrame";
import ActionButton from "../components/ui/ActionButton";
import GlassPanel from "../components/ui/GlassPanel";
import PageHeading from "../components/ui/PageHeading";
import TextInput from "../components/ui/TextInput";
import { UserDataContext } from "../context/UserContext";

const CreaterRoom = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserDataContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    battleName: "",
    description: "",
    questionsNumber: 5,
    isSameLanguage: true,
    allowedLanguages: [],
    difficulty: "medium",
    mode: "time",
    isPrivate: true,
  });

  useEffect(() => {
    if (user?.preferredLanguage) {
      updateForm("allowedLanguages", [user.preferredLanguage]);
    }
  }, [user?.preferredLanguage]);

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleLanguageChange = (event) => {
    const selectedLanguages = Array.from(event.target.selectedOptions, (option) => option.value);
    updateForm("allowedLanguages", selectedLanguages);
  };

  const languageNames = {
    cpp: "C++",
    java: "Java",
    python: "Python",
  };

  const handleCreateRoom = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/battle/create`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const battle = response.data?.battle;

      if (!battle?.roomCode) {
        throw new Error("The server did not return a room code.");
      }

      navigate(`/room/${battle.roomCode}`, { state: { battle } });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Unable to create room");
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <PageHeading eyebrow="Private match" title="Create a battle room." description="Configure your coding duel and challenge an opponent to test their skills." />

      <GlassPanel className="mx-auto max-w-2xl rounded-3xl p-6 sm:p-8">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Room settings</h2>
            <p className="mt-1 text-sm text-white/45">Choose the rules for your next coding duel.</p>
          </div>
          <Settings2 className="text-fuchsia-300" size={20} />
        </div>

        <form onSubmit={handleCreateRoom} className="space-y-5">
          <TextInput label="Battle room title" icon={Hash} placeholder="Enter a catchy title for your battle" value={form.battleName} onChange={(event) => updateForm("battleName", event.target.value)} required />
          <label className="block text-sm font-medium text-white/75">
            <span className="mb-2 flex items-center gap-2"><Code2 size={15} className="text-cyan-300" /> Battle description</span>
            <textarea className="min-h-24 w-full resize-y rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-fuchsia-300/60" placeholder="Describe the battle challenge" value={form.description} onChange={(event) => updateForm("description", event.target.value)} required />
          </label>

          <label className="block text-sm font-medium text-white/75">
            <span className="mb-2 flex items-center justify-between"><span className="flex items-center gap-2"><Hash size={15} className="text-cyan-300" /> Number of questions</span><strong className="text-cyan-200">{form.questionsNumber}</strong></span>
            <input className="w-full accent-fuchsia-400" type="range" min="3" max="10" value={form.questionsNumber} onChange={(event) => updateForm("questionsNumber", Number(event.target.value))} />
            <span className="mt-1 flex justify-between text-[11px] text-white/35"><span>3</span><span>10</span></span>
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-white/75">
              <span className="mb-2 flex items-center gap-2"><Code2 size={15} className="text-cyan-300" /> Allowed languages</span>
              <select className="h-12 w-full rounded-xl border border-white/10 bg-[#172033] px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-300/60" value={form.allowedLanguages[0] || ""} onChange={handleLanguageChange} disabled={!form.isSameLanguage || !user?.preferredLanguage}>
                {user?.preferredLanguage ? <option value={user.preferredLanguage}>{languageNames[user.preferredLanguage] || user.preferredLanguage}</option> : <option value="">Loading preferred language...</option>}
              </select>
            </label>
            <label className="block text-sm font-medium text-white/75">
              <span className="mb-2 flex items-center gap-2"><Zap size={15} className="text-cyan-300" /> Difficulty level</span>
              <select className="w-full rounded-xl border border-white/10 bg-[#172033] px-3 py-3 text-sm text-white outline-none focus:border-fuchsia-300/60" value={form.difficulty} onChange={(event) => updateForm("difficulty", event.target.value)}>
                <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
              </select>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/4 p-4 text-sm">
              <span className="flex items-center gap-2"><Code2 size={15} className="text-cyan-300" /> Same language</span>
              <input type="checkbox" className="h-4 w-4 accent-fuchsia-400" checked={form.isSameLanguage} onChange={(event) => updateForm("isSameLanguage", event.target.checked)} />
            </label>
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/4 p-4 text-sm">
              <span className="flex items-center gap-2"><LockKeyhole size={15} className="text-fuchsia-300" /> Private room</span>
              <input type="checkbox" className="h-4 w-4 accent-fuchsia-400" checked={form.isPrivate} onChange={(event) => updateForm("isPrivate", event.target.checked)} />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm ${form.mode === "time" ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10 bg-white/4"}`}><input type="radio" name="mode" value="time" checked={form.mode === "time"} onChange={(event) => updateForm("mode", event.target.value)} /><Timer size={15} /> Time-based</label>
            <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm ${form.mode === "quality" ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10 bg-white/4"}`}><input type="radio" name="mode" value="quality" checked={form.mode === "quality"} onChange={(event) => updateForm("mode", event.target.value)} /><UsersRound size={15} /> Quality-based</label>
          </div>

          <ActionButton type="submit" icon={Plus} className="w-full" disabled={isSubmitting}>{isSubmitting ? "Creating room..." : "Create battle room"}</ActionButton>
        </form>
      </GlassPanel>
    </PageFrame>
  );
};

export default CreaterRoom;
