import { useNavigate } from "react-router-dom";
import { ArrowLeft, Award, Flame, Target, TrendingUp } from "lucide-react";
import PageFrame from "../components/layout/PageFrame";
import GlassPanel from "../components/ui/GlassPanel";
import PageHeading from "../components/ui/PageHeading";

const ProfilePage = () => {
	const navigate = useNavigate();

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
				eyebrow="Player profile"
				title="Archit."
				description="Your recent form, battle stats, and place on the circuit."
			/>

			<div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
				<GlassPanel className="rounded-3xl p-6">
					<div className="flex items-center gap-4">
						<div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-fuchsia-400/15 text-3xl font-black text-fuchsia-200">
							A
						</div>
						<div>
							<h2 className="text-2xl font-bold">Archit</h2>
							<p className="mt-1 text-sm text-white/45">Member since Sep 2026</p>
						</div>
					</div>
					<div className="mt-8 flex items-center gap-3 rounded-2xl border border-orange-300/15 bg-orange-300/10 p-4">
						<Flame className="text-orange-300" size={20} />
						<div>
							<p className="font-bold">4 battle streak</p>
							<p className="text-xs text-white/45">Keep the momentum going</p>
						</div>
					</div>
				</GlassPanel>

				<div className="grid grid-cols-2 gap-3">
					<GlassPanel className="rounded-3xl p-5">
						<Award className="text-amber-300" size={20} />
						<p className="mt-8 text-3xl font-black">12</p>
						<p className="mt-1 text-xs text-white/45">Wins</p>
					</GlassPanel>
					<GlassPanel className="rounded-3xl p-5">
						<Target className="text-cyan-300" size={20} />
						<p className="mt-8 text-3xl font-black">68%</p>
						<p className="mt-1 text-xs text-white/45">Win rate</p>
					</GlassPanel>
					<GlassPanel className="col-span-2 rounded-3xl p-5">
						<TrendingUp className="text-emerald-300" size={20} />
						<p className="mt-8 text-3xl font-black">1,842</p>
						<p className="mt-1 text-xs text-white/45">Rating points</p>
					</GlassPanel>
				</div>
			</div>
		</PageFrame>
	);
};

export default ProfilePage;
