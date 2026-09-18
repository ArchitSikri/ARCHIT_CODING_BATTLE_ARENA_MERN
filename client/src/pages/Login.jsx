import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowRight, KeyRound, Mail, ShieldCheck } from "lucide-react";
import PageFrame from "../components/layout/PageFrame";
import ActionButton from "../components/ui/ActionButton";
import GlassPanel from "../components/ui/GlassPanel";
import TextInput from "../components/ui/TextInput";

const Login = () => {
  const navigate = useNavigate();
  const Base_Url = import.meta.env.VITE_BASE_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${Base_Url}/api/user/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify({
          id: res.data.id,
          name: res.data.name,
          email: res.data.email,
        }));
      }

      toast.success(res.data.message || "Login successful");
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <PageFrame className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <GlassPanel className="w-full max-w-md rounded-3xl p-6 sm:p-8">
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-2 text-emerald-300"><ShieldCheck size={17} /><span className="text-xs font-semibold uppercase tracking-[0.2em]">Secure sign in</span></div>
          <h1 className="text-4xl font-black tracking-tight">Welcome back.</h1>
          <p className="mt-3 text-sm leading-6 text-white/50">Enter the arena and battle your friends in real time.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <TextInput label="Email address" icon={Mail} type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextInput label="Password" icon={KeyRound} type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <ActionButton type="submit" icon={ArrowRight} className="w-full">Enter the arena</ActionButton>
        </form>
        <p className="mt-7 text-center text-sm text-white/45">New challenger? <Link to="/register" className="font-semibold text-fuchsia-300 transition hover:text-white">Create an account</Link></p>
      </GlassPanel>
    </PageFrame>
  );
};

export default Login;