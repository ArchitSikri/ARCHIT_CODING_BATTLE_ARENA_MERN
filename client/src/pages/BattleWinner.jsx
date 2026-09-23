import { useLocation, useNavigate } from "react-router-dom";
import { Home, Plus, Swords, Trophy, UsersRound } from "lucide-react";
import PageFrame from "../components/layout/PageFrame";
import ActionButton from "../components/ui/ActionButton";
import GlassPanel from "../components/ui/GlassPanel";

const BattleWinner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const {
    isWinner: isWinnerState,
    isDraw: isDrawState,
    battleDetails,
    opponentName = "Opponent",
    userScore = 0,
    opponentScore = 0,
  } = state;

  const isDraw = isDrawState !== undefined ? isDrawState : userScore === opponentScore;
  const isWinner = isDraw ? false : (isWinnerState !== undefined ? isWinnerState : userScore > opponentScore);

  const getTitle = () => {
    if (isDraw) return "Equally Matched!";
    if (isWinner) return "Victory is Yours!";
    return "Hard Fought Battle!";
  };

  const getSubtitle = () => {
    if (isDraw) return "Both challengers fought bravely and finished with equal scores.";
    if (isWinner) return "You solved faster, stayed focused, and dominated the runtime.";
    return "Great effort! Review your code and come back stronger for the next match.";
  };

  const getBadgeColor = () => {
    if (isDraw) return "border-amber-200/30 bg-amber-300/15 text-amber-200 shadow-amber-950/30";
    if (isWinner) return "border-emerald-200/30 bg-emerald-300/15 text-emerald-200 shadow-emerald-950/30";
    return "border-fuchsia-200/30 bg-fuchsia-300/15 text-fuchsia-200 shadow-fuchsia-950/30";
  };

  return (
    <PageFrame className="flex min-h-[calc(100vh-3rem)] flex-col items-center justify-center text-center">
      <div className={`mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border ${getBadgeColor()} shadow-2xl`}>
        {isWinner ? (
          <Trophy size={46} className="animate-bounce text-amber-300" />
        ) : isDraw ? (
          <Swords size={46} className="text-amber-200" />
        ) : (
          <Swords size={46} className="text-fuchsia-300" />
        )}
      </div>

      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">
        Battle Complete
      </p>
      <h1 className="mt-3 text-5xl font-black tracking-tight">{getTitle()}</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-white/55">
        {getSubtitle()}
      </p>

      <GlassPanel className="mt-8 w-full max-w-lg rounded-3xl p-6 sm:p-8">
        <div className="mb-6 rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Final Score</p>
          <div className="mt-3 flex items-center justify-center gap-6">
            <div>
              <p className="text-xs font-medium text-cyan-200">You</p>
              <p className="mt-1 text-4xl font-black text-cyan-300">{userScore}</p>
            </div>
            <span className="text-xl font-bold text-white/30">:</span>
            <div>
              <p className="text-xs font-medium text-fuchsia-200">{opponentName}</p>
              <p className="mt-1 text-4xl font-black text-fuchsia-300">{opponentScore}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-left">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-[11px] text-white/40">Room Code</p>
            <p className="mt-1 text-sm font-bold text-white uppercase tracking-wider">{battleDetails?.roomCode || "-"}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-[11px] text-white/40">Difficulty</p>
            <p className="mt-1 text-sm font-bold text-emerald-300 capitalize">{battleDetails?.difficulty || "Medium"}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-[11px] text-white/40">Mode</p>
            <p className="mt-1 text-sm font-bold text-cyan-300 capitalize">{battleDetails?.mode || "Time"}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ActionButton className="flex-1" icon={Plus} onClick={() => navigate("/create-room")}>
            New match
          </ActionButton>
          <button
            type="button"
            onClick={() => navigate("/join-room")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <UsersRound size={16} />
            Join room
          </button>
        </div>
      </GlassPanel>

      <button
        type="button"
        onClick={() => navigate("/home")}
        className="mt-7 flex items-center gap-2 text-sm text-white/45 transition hover:text-white"
      >
        <Home size={15} />
        Return to lobby
      </button>
    </PageFrame>
  );
};

export default BattleWinner;
