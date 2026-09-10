import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const backgroundImage =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCabyU5eIvOOMrfztFZONxFVe_hkK5SaVvlrQdRAtR2K3_4ApUaA0BhwU&s=10";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login Data:", {
      email,
      password,
    });
    navigate("/home");
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-fixed flex items-center justify-center px-4"
      style={{
        backgroundImage: `url("${backgroundImage}")`,
      }}
    >
      <div className="fixed inset-0 bg-black/65"></div>
      <div className="relative z-10 w-full max-w-md">

        <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">

            <h1 className="text-4xl font-bold text-white">
              Welcome Back
            </h1>

            <p className="text-gray-400 mt-2">
              Enter the arena and battle your friends
            </p>

          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
            <div>

              <label className="block text-sm text-gray-300 mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-purple-500 focus:bg-white/15 transition"
              />

            </div>

            <div>

              <label className="block text-sm text-gray-300 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-purple-500 focus:bg-white/15 transition"
              />

            </div>
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold transition duration-200"
            >
              Login
            </button>

          </form>

          <p className="text-center text-gray-400 mt-7">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Sign Up
            </Link>

          </p>

        </div>

      </div>
    </div>
  );
};

export default Login;