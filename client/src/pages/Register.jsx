import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowRight, Code2, Mail, UserRound } from "lucide-react";
import PageFrame from "../components/layout/PageFrame";
import ActionButton from "../components/ui/ActionButton";
import GlassPanel from "../components/ui/GlassPanel";
import TextInput from "../components/ui/TextInput";

const Register = () => {

  const Base_Url = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    preferredLanguage: "",
  });


  const handleRegister = async (e) => {
    
    e.preventDefault();

    try {
      const res = await axios.post(`${Base_Url}/api/user/register`, user, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        setUser({ name: "", email: "", password: "", preferredLanguage: "" });
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to create your account");
    }
  };

  return (
    <PageFrame className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
      <GlassPanel className="w-full max-w-md p-7 sm:p-9">
        <div className="mb-8"><div className="mb-5 flex items-center gap-2 text-cyan-300"><Code2 size={17} /><span className="text-xs font-semibold uppercase tracking-[0.2em]">Join the grid</span></div><h1 className="text-4xl font-black tracking-tight">Create your account.</h1><p className="mt-3 text-sm leading-6 text-white/50">Build your profile, pick your language, and find your next rival.</p></div>
        <form onSubmit={handleRegister} className="space-y-5">
          <TextInput label="Display name" icon={UserRound} type="text" placeholder="Your battle name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} required />
          <TextInput label="Email address" icon={Mail} type="email" placeholder="you@example.com" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} required />
          <TextInput label="Password" type="password" placeholder="Create a password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} required />
          <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/55">Preferred language</span><select value={user.preferredLanguage} onChange={(e) => setUser({ ...user, preferredLanguage: e.target.value })} required className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-300/70"><option value="" disabled className="text-black">Select a language</option><option value="cpp" className="text-black">C++</option><option value="java" className="text-black">Java</option><option value="python" className="text-black">Python</option></select></label>
          <ActionButton type="submit" icon={ArrowRight} className="w-full">Create account</ActionButton>
        </form>
        <p className="mt-7 text-center text-sm text-white/45">Already a challenger? <Link to="/" className="font-semibold text-fuchsia-300 transition hover:text-white">Sign in</Link></p>
      </GlassPanel>
    </PageFrame>
  );
};

export default Register;