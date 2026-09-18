import { useState } from "react";
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

	const handleCodeChange = (event) => {
		setCode(event.target.value.toUpperCase());
	};

	const handleJoinRoom = () => navigate("/start-battle");

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
				<TextInput
					label="Room code"
					icon={Hash}
					placeholder="Enter five character code"
					value={code}
					onChange={handleCodeChange}
					maxLength={5}
				/>

				<div className="mt-6 flex items-center gap-3 rounded-xl border border-cyan-300/15 bg-cyan-300/10 p-4 text-sm text-cyan-100/75">
					<ScanLine size={18} />
					Codes are case-insensitive and expire after the battle.
				</div>

				<ActionButton
					icon={ArrowRight}
					className="mt-6 w-full"
					onClick={handleJoinRoom}
				>
					Join room
				</ActionButton>
			</GlassPanel>
		</PageFrame>
	);
};

export default JoinMatch;
