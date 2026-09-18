import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, RotateCcw, Trophy } from "lucide-react";
import PageFrame from "../components/layout/PageFrame";
import ActionButton from "../components/ui/ActionButton";
import GlassPanel from "../components/ui/GlassPanel";

const BattleWinner = () => {
	const navigate = useNavigate();
	const returnHome = () => navigate("/home");

	return (
		<PageFrame className="flex min-h-[calc(100vh-3rem)] flex-col items-center justify-center text-center">
			<div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-amber-200/30 bg-amber-300/15 text-amber-200 shadow-2xl shadow-amber-950/30">
				<Trophy size={42} />
			</div>
			<p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">
				Battle complete
			</p>
			<h1 className="mt-4 text-5xl font-black tracking-tight">Victory is yours.</h1>
			<p className="mt-4 max-w-md text-sm leading-6 text-white/50">
				You solved faster, stayed focused, and took the round in style.
			</p>

			<GlassPanel className="mt-8 w-full max-w-lg rounded-3xl p-6">
				<div className="grid grid-cols-3 gap-3">
					<div>
						<p className="text-2xl font-black text-emerald-300">03:18</p>
						<p className="mt-1 text-xs text-white/40">Solve time</p>
					</div>
					<div>
						<p className="text-2xl font-black">+240</p>
						<p className="mt-1 text-xs text-white/40">Points</p>
					</div>
					<div>
						<p className="text-2xl font-black text-fuchsia-300">#18</p>
						<p className="mt-1 text-xs text-white/40">Rank move</p>
					</div>
				</div>

				<div className="mt-6 flex flex-col gap-3 sm:flex-row">
					<ActionButton className="flex-1" icon={RotateCcw} onClick={returnHome}>
						Play again
					</ActionButton>
					<button
						type="button"
						onClick={returnHome}
						className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-white/60 hover:text-white"
					>
						<Home size={16} />
						Return home
					</button>
				</div>
			</GlassPanel>

			<button
				type="button"
				onClick={returnHome}
				className="mt-7 flex items-center gap-2 text-sm text-white/35 hover:text-white"
			>
				<ArrowLeft size={15} />
				Back to lobby
			</button>
		</PageFrame>
	);
};

export default BattleWinner;
