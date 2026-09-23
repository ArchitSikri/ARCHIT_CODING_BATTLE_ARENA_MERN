import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Clipboard, Copy, UsersRound } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import PageFrame from "../components/layout/PageFrame";
import ActionButton from "../components/ui/ActionButton";
import GlassPanel from "../components/ui/GlassPanel";
import { UserDataContext } from "../context/UserContext";
import { SocketContext } from "../context/SocketContext";

const Room = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { state } = useLocation();
  const userContext = useContext(UserDataContext);
  const socketContext = useContext(SocketContext);
  const user = userContext?.user || {};
  const socket = socketContext?.socket;

  const [copied, setCopied] = useState(false);
  const [battle, setBattle] = useState(state?.battle || null);
  const [isLoading, setIsLoading] = useState(!state?.battle);
  const [isCreator, setIsCreator] = useState(false);
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [showBattleModal, setShowBattleModal] = useState(false);
  const [opponentData, setOpponentData] = useState(null);

  const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

  useEffect(() => {
    if (!roomId) return;

    if (state?.battle) {
      setBattle(state.battle);
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    axios
      .get(`${baseUrl}/api/battle/room/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setBattle(response.data?.battle || null);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Unable to load battle room");
        navigate("/home");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [roomId, navigate, state?.battle]);

  useEffect(() => {
    if (!socket || !user?._id || !roomId) return;

    const registerSocket = () => {
      socket.emit("join", user._id, (response) => {
        if (response?.ok) {
          socket.emit("battleRoom", roomId);
        }
      });
    };

    if (socket.connected) {
      registerSocket();
      return;
    }

    socket.once("connect", registerSocket);
    return () => {
      socket.off("connect", registerSocket);
    };
  }, [socket, user?._id, roomId]);

  useEffect(() => {
    if (!socket) return;

    const handleOpponentJoined = ({ opponent }) => {
      if (opponent) {
        setOpponentJoined(true);
        setOpponentData(opponent);
      }
    };

    socket.on("opponentJoined", handleOpponentJoined);

    return () => {
      socket.off("opponentJoined", handleOpponentJoined);
    };
  }, [socket]);

  useEffect(() => {
    if (battle && user) {
      const creatorId =
        typeof battle.createdBy === "object" && battle.createdBy?._id
          ? battle.createdBy._id
          : battle.createdBy;
      setIsCreator(String(creatorId) === String(user._id));
      setOpponentJoined(Boolean(battle.user2SocketId || battle.challenger));
    }
  }, [battle, user]);

  useEffect(() => {
    let pollInterval;

    const pollBattle = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${baseUrl}/api/battle/all`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          const updatedBattle = response.data.battles.find(
            (item) => item.roomCode === roomId
          );

          if (!updatedBattle) {
            if (!isCreator) {
              navigate("/home");
            }
            return;
          }

          setBattle(updatedBattle);
          setOpponentJoined(Boolean(updatedBattle.user2SocketId || updatedBattle.challenger));
        }
      } catch (error) {
        console.error("Error polling battle:", error);
      }
    };

    if (roomId) {
      pollInterval = setInterval(pollBattle, 3000);
    }

    return () => clearInterval(pollInterval);
  }, [isCreator, roomId, navigate, baseUrl]);

  const startBattle = async () => {
    if (!isCreator || !opponentJoined) return;

    const opponentSocketId = battle?.user2SocketId;

    if (!opponentSocketId) {
      setShowBattleModal(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${baseUrl}/api/user/opponent/${opponentSocketId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        let opponent = response.data?.opponent;

        if (Array.isArray(opponent)) {
          opponent = opponent[0];
        }

        if (opponent && (opponent.name || opponent.email)) {
          setOpponentData(opponent);
          setShowBattleModal(true);
        }
      }
    } catch (error) {
      console.error("Error fetching opponent data:", error);
    }
  };

  const confirmStartBattle = async () => {
    if (!battle?._id) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${baseUrl}/api/battle/start/${battle._id}`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        socket?.emit("startBattle", {
          roomCode: roomId,
          opponentSocketId: battle.user2SocketId,
        }); 

        setShowBattleModal(false);
        navigate(`/start-battle/room/${roomId}`);
      }
    } catch (error) {
      console.error("Error starting battle:", error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleRedirect = ({ roomCode }) => {
      if (roomCode === roomId) {
        navigate(`/start-battle/room/${roomCode}`);
      }
    };

    socket.on("redirectToBattle", handleRedirect);

    return () => {
      socket.off("redirectToBattle", handleRedirect);
    };
  }, [socket, roomId, navigate]);

  const handleLeaveRoom = async () => {
    const token = localStorage.getItem("token");

    try {
      if (isCreator) {
        const confirmed = window.confirm(
          "Are you sure you want to leave and delete this battle?"
        );

        if (!confirmed) return;

        await axios.delete(
          `${baseUrl}/api/battle/delete/${battle._id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        navigate("/home");
      } else {
        await axios.post(
          `${baseUrl}/api/battle/leave/${battle._id}`,
          { userId: user?._id },
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        navigate("/home");
      }
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  };

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

  const opponentName =
    opponentData?.name ||
    opponentData?.email ||
    (battle?.challenger?.name) ||
    "Opponent";

  if (isLoading) {
    return (
      <PageFrame className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
        <p className="text-sm text-white/50">Loading room...</p>
      </PageFrame>
    );
  }

  if (!battle) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex justify-center items-center">
        <p>Battle not found</p>
      </div>
    );
  }

  return (
    <PageFrame className="flex min-h-[calc(100vh-3rem)] flex-col justify-center">
      <button
        type="button"
        onClick={handleLeaveRoom}
        className="mb-8 flex items-center gap-2 text-sm text-white/45 hover:text-white"
      >
        <ArrowLeft size={16} />
        Leave room
      </button>

      <GlassPanel className="mx-auto w-full max-w-2xl rounded-3xl p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">
              Battle room
            </p>
            <h1 className="mt-2 text-3xl font-black">
              {battle?.battleName || "Your battle room"}
            </h1>
            <p className="mt-2 text-sm text-white/45">
              {battle?.description || "Share the room code with your opponent to begin."}
            </p>
          </div>
          <UsersRound className="mt-1 shrink-0 text-cyan-300" size={25} />
        </div>

        <div className="mt-7 rounded-2xl border border-fuchsia-300/25 bg-fuchsia-300/10 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">Room code</p>
          <div className="mt-3 flex items-center gap-3">
            <p className="min-w-0 flex-1 truncate text-3xl font-black tracking-[0.18em] text-fuchsia-100">
              {roomId}
            </p>
            <button
              type="button"
              onClick={copyRoomCode}
              className="flex items-center gap-2 rounded-xl bg-fuchsia-500 px-4 py-3 text-sm font-bold text-white hover:bg-fuchsia-400"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/4 p-3">
            <p className="text-xs text-white/40">Questions</p>
            <p className="mt-1 font-bold">{battle?.questionsNumber || "-"}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/4 p-3">
            <p className="text-xs text-white/40">Difficulty</p>
            <p className="mt-1 font-bold capitalize">{battle?.difficulty || "-"}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/4 p-3">
            <p className="text-xs text-white/40">Mode</p>
            <p className="mt-1 font-bold capitalize">{battle?.mode || "-"}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/4 p-3">
            <p className="text-xs text-white/40">Access</p>
            <p className="mt-1 font-bold">{battle?.isPrivate ? "Private" : "Public"}</p>
          </div>
        </div>

        <div className="mt-7 flex flex-col items-center rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-7 text-center">
          {isCreator ? (
            opponentJoined ? (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-300 text-emerald-200">
                  <Check size={24} />
                </div>
                <h2 className="mt-4 text-xl font-bold">Opponent has joined!</h2>
                <p className="mt-2 text-sm text-white/45">
                  You can start the battle when you are ready.
                </p>
                <ActionButton
                  className="mt-5 w-full sm:w-auto"
                  onClick={startBattle}
                >
                  Start battle
                </ActionButton>
              </>
            ) : (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-cyan-300 text-cyan-200">
                  <Clipboard size={24} />
                </div>
                <h2 className="mt-4 text-xl font-bold">Waiting for opponent...</h2>
                <p className="mt-2 text-sm text-white/45">
                  Share the room code and start the battle when they join.
                </p>
              </>
            )
          ) : (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-cyan-300 text-cyan-200">
                <Clipboard size={24} />
              </div>
              <h2 className="mt-4 text-xl font-bold">Waiting for creator to start...</h2>
              <p className="mt-2 text-sm text-white/45">
                The battle will begin shortly.
              </p>
            </>
          )}
        </div>

        <ActionButton
          icon={ArrowLeft}
          className="mt-6 w-full"
          onClick={handleLeaveRoom}
        >
          Leave room
        </ActionButton>
      </GlassPanel>

      {isCreator && showBattleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border border-white/15 bg-white/8 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-200/80">
                  Battle details
                </p>
                <h2 className="mt-2 text-3xl font-black text-white">Confirm match</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-fuchsia-200">
                <UsersRound size={22} />
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-white/10 bg-black/15 p-4 text-sm text-white/90">
              <div className="flex items-center justify-between gap-3">
                <span className="text-white/60">Creator</span>
                <span className="font-semibold text-white">
                  {user?.fullname?.firstname || user?.name || "You"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-white/60">Opponent</span>
                <span className="font-semibold text-white">{opponentName}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-white/60">Battle</span>
                <span className="font-semibold text-white">{battle.battleName}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-white/60">Mode</span>
                <span className="font-semibold capitalize text-white">{battle.mode}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-white/60">Difficulty</span>
                <span className="font-semibold capitalize text-white">{battle.difficulty}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-white/60">Questions</span>
                <span className="font-semibold text-white">{battle.questionsNumber}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowBattleModal(false)}
                className="flex-1 rounded-xl border border-white/15 bg-transparent px-4 py-3 font-semibold text-white/80 transition hover:bg-white/6 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmStartBattle}
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-400 to-green-400 px-4 py-3 font-semibold text-slate-900 shadow-[0_12px_30px_rgba(52,211,153,0.45)] transition hover:brightness-110"
              >
                Start battle
              </button>
            </div>
          </div>
        </div>
      )}
    </PageFrame>
  );
};

export default Room;