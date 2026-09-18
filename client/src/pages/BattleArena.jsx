import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Clock3,
  Flag,
  Play,
  Send,
  Terminal,
} from "lucide-react";
import PageFrame from "../components/layout/PageFrame";
import GlassPanel from "../components/ui/GlassPanel";

const BattleArena = () => {
  const navigate = useNavigate();

  const handleSubmit = () => navigate("/battle-winner");

  return (
    <PageFrame>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-300">
            Round 01 / Arrays
          </p>
          <h1 className="mt-2 text-2xl font-black">
            Two Sum, under pressure.
          </h1>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-amber-100">
          <Clock3 size={17} />
          <span className="font-mono font-bold">14:32</span>
        </div>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <ScoreCard label="You" name="Archit" score="240 pts" active />
        <ScoreCard label="Opponent" name="Rival_09" score="180 pts" />
        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
          <p className="text-xs text-white/45">Status</p>
          <p className="mt-1 font-bold text-emerald-200">Live battle</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <GlassPanel className="rounded-3xl p-6">
          <div className="mb-5 flex items-center gap-2">
            <Terminal size={18} className="text-cyan-300" />
            <h2 className="font-bold">Problem statement</h2>
          </div>
          <p className="text-sm leading-7 text-white/65">
            Given an array of integers and a target, return the indices of the
            two numbers that add up to the target.
          </p>
          <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-4 font-mono text-xs leading-6 text-cyan-100/70">
            Input: nums = [2, 7, 11, 15]
            <br />
            Target: 9
            <br />
            Output: [0, 1]
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-white/40">
            <Flag size={14} />
            Easy difficulty
          </div>
        </GlassPanel>

        <GlassPanel className="overflow-hidden rounded-3xl">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              solution.cpp
            </div>
            <button
              type="button"
              className="flex items-center gap-2 text-xs text-white/45"
            >
              <ChevronDown size={14} />
              C++
            </button>
          </div>
          <pre className="min-h-[300px] overflow-auto bg-[#08070c]/70 p-5 font-mono text-sm leading-7 text-white/65">
            <code>{`#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
  // write your solution here
  return {};
}`}</code>
          </pre>
          <div className="flex justify-end border-t border-white/10 p-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-emerald-300"
            >
              <Play size={16} />
              Submit solution
              <Send size={14} />
            </button>
          </div>
        </GlassPanel>
      </div>
    </PageFrame>
  );
};

const ScoreCard = ({ active, label, name, score }) => (
  <div
    className={`rounded-2xl border p-4 ${
      active
        ? "border-fuchsia-300/20 bg-fuchsia-300/10"
        : "border-white/10 bg-white/[0.05]"
    }`}
  >
    <p className="text-xs text-white/45">{label}</p>
    <p className="mt-1 font-bold">
      {name}
      <span className={`float-right ${active ? "text-fuchsia-200" : "text-white/60"}`}>
        {score}
      </span>
    </p>
  </div>
);

export default BattleArena;