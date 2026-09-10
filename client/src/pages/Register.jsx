import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const backgroundImage =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCabyU5eIvOOMrfztFZONxFVe_hkK5SaVvlrQdRAtR2K3_4ApUaA0BhwU&s=10";

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
              Create Account
            </h1>

            <p className="text-gray-400 mt-2">
              Create your account and start battling
            </p>

          </div>
          <form
            onSubmit={handleRegister}
            className="space-y-5"
          >
            <div>

              <label className="block text-sm text-gray-300 mb-2">
                Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-purple-500 focus:bg-white/15 transition"
              />

            </div>

            <div>

              <label className="block text-sm text-gray-300 mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
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
                placeholder="Create a password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-purple-500 focus:bg-white/15 transition"
              />

            </div>

             <div>

              <label className="block text-sm text-gray-300 mb-2">
                Preferred Language
              </label>

              <select
                value={user.preferredLanguage}
                onChange={(e) => setUser({ ...user, preferredLanguage: e.target.value })}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white outline-none focus:border-purple-500 focus:bg-white/15 transition"
              >
                <option value="" disabled className="text-gray-900">
                  Select your preferred language
                </option>
                <option value="cpp" className="text-gray-900">C++</option>
                <option value="java" className="text-gray-900">Java</option>
                <option value="python" className="text-gray-900">Python</option>
              </select>

            </div>


            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold transition duration-200"
            >
              Create Account
            </button>

          </form>
          <p className="text-center text-gray-400 mt-7">

            Already have an account?{" "}

            <Link
              to="/"
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Login
            </Link>

          </p>

        </div>

      </div>
    </div>
  );
};

export default Register;