import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Hash, ScanLine } from "lucide-react";
import PageFrame from "../components/layout/PageFrame";
import ActionButton from "../components/ui/ActionButton";
import GlassPanel from "../components/ui/GlassPanel";
import PageHeading from "../components/ui/PageHeading";
import TextInput from "../components/ui/TextInput";

const JoinMatch = () => {
	const navigate = useNavigate();
	const [code, setCode] = useState("");
	const [isJoining, setIsJoining] = useState(false);

	const handleCodeChange = (event) => {
		setCode(event.target.value.toUpperCase());
	};

	const handleJoinRoom = async (event) => {
		event.preventDefault();
		const token = localStorage.getItem("token");

		if (!token) {
			navigate("/");
			return;
		}

		setIsJoining(true);
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_BASE_URL}/api/battle/join/${code.trim()}`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			const battle = response.data?.battle;

			if (!battle?.roomCode) {
				throw new Error("The server did not return a room code.");
			}

			toast.success(response.data.message || "Joined battle room");
			navigate(`/room/${battle.roomCode}`, { state: { battle } });
		} catch (error) {
			const battle = error.response?.data?.battle;
			if (battle?.roomCode && error.response?.status === 409) {
				navigate(`/room/${battle.roomCode}`, { state: { battle } });
				return;
			}
			toast.error(error.response?.data?.message || error.message || "Unable to join room");
		} finally {
			setIsJoining(false);
		}
	};

	return (
		<PageFrame className="flex min-h-[calc(100vh-3rem)] flex-col justify-center">
			<button
				type="button"
				onClick={() => navigate("/home")}
				className="mb-8 flex items-center gap-2 text-sm text-white/45 hover:text-white"
			>
				<ArrowLeft size={16} />
				Back to lobby
			</button>

			<PageHeading
				eyebrow="Find a rival"
				title="Join a match."
				description="Enter the room code your opponent shared with you."
			/>

			<GlassPanel className="max-w-xl rounded-3xl p-6 sm:p-8">
				<form onSubmit={handleJoinRoom}>
				<TextInput
					label="Room code"
					icon={Hash}
					placeholder="Enter six digit code"
					value={code}
					onChange={handleCodeChange}
					maxLength={6}
				/>

				<div className="mt-6 flex items-center gap-3 rounded-xl border border-cyan-300/15 bg-cyan-300/10 p-4 text-sm text-cyan-100/75">
					<ScanLine size={18} />
					Codes are case-insensitive and expire after the battle.
				</div>

				<ActionButton
					icon={ArrowRight}
					className="mt-6 w-full"
					disabled={isJoining || code.trim().length === 0}
				>
					{isJoining ? "Joining room..." : "Join room"}
				</ActionButton>
				</form>
			</GlassPanel>
		</PageFrame>
	);
};

export default JoinMatch;
