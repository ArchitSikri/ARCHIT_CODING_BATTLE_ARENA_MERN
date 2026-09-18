import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Copy, Swords, UserRound } from "lucide-react";
import PageFrame from "../components/layout/PageFrame";
import ActionButton from "../components/ui/ActionButton";
import GlassPanel from "../components/ui/GlassPanel";
import PageHeading from "../components/ui/PageHeading";

const StartBattle = () => {
	const navigate = useNavigate();

	const handleStartBattle = () => navigate("/battle-arena");

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
				eyebrow="Room A7K9Q"
				title="Your rival is in."
				description="Everything is set. Take a breath, then start the round."
			/>

			<GlassPanel className="rounded-3xl p-6 sm:p-8">
				<div className="grid gap-4 sm:grid-cols-3">
					<div className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/10 p-5 text-center">
						<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-400/20 text-xl font-black">
							A
						</div>
						<p className="mt-4 font-bold">Archit</p>
						<p className="mt-1 text-xs text-fuchsia-200/70">Ready</p>
					</div>

					<div className="flex items-center justify-center text-white/35">
						<Swords size={28} />
					</div>

					<div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5 text-center">
						<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/20">
							<UserRound size={21} />
						</div>
						<p className="mt-4 font-bold">Waiting rival</p>
						<p className="mt-1 text-xs text-cyan-200/70">Connected</p>
					</div>
				</div>

				<div className="mt-7 flex flex-col gap-3 sm:flex-row">
					<ActionButton
						className="flex-1"
						icon={Swords}
						onClick={handleStartBattle}
					>
						Start battle
					</ActionButton>
					<button
						type="button"
						className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/60 hover:text-white"
					>
						<Copy size={16} />
						Share room
					</button>
				</div>

				<p className="mt-5 flex items-center justify-center gap-2 text-xs text-white/35">
					<Check size={14} className="text-emerald-300" />
					Both players are ready
				</p>
			</GlassPanel>
		</PageFrame>
	);
};

export default StartBattle;
