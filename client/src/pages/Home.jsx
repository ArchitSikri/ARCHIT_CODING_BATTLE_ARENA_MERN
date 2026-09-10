import { useNavigate } from "react-router-dom";

const backgroundImage =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCabyU5eIvOOMrfztFZONxFVe_hkK5SaVvlrQdRAtR2K3_4ApUaA0BhwU&s=10";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-fixed flex items-center justify-center px-6"
      style={{
        backgroundImage: `url("${backgroundImage}")`,
      }}
    >
      <div className="fixed inset-0 bg-black/65"></div>
      <div className="relative z-10 w-full max-w-xl">
        <div className="flex flex-col items-center mb-10">

          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-1 shadow-2xl">

            <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">

              <span className="text-5xl font-bold text-white">
                A
              </span>

            </div>

          </div>
          <h1 className="text-3xl font-bold text-white mt-5">
            Archit
          </h1>

          <p className="text-gray-400 mt-1">
            Ready for battle?
          </p>

        </div>
        <div className="space-y-5">

          <button
            onClick={() => navigate("/create-room")}
            className="w-full text-left p-6 rounded-2xl bg-white/10 hover:bg-purple-600/80 backdrop-blur-xl border border-white/10 transition duration-300"
          >

            <h2 className="text-2xl font-bold text-white">
              Create Room
            </h2>

            <p className="text-gray-400 mt-2">
              Create a room and invite your friend
            </p>

          </button>

          <button
            onClick={() => navigate("/join-room")}
            className="w-full text-left p-6 rounded-2xl bg-white/10 hover:bg-blue-600/80 backdrop-blur-xl border border-white/10 transition duration-300"
          >

            <h2 className="text-2xl font-bold text-white">
              Join Room
            </h2>

            <p className="text-gray-400 mt-2">
              Enter a room code and battle your friend
            </p>

          </button>

        </div>

      </div>
    </div>
  );
};

export default Home;