import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreaterRoom from "./pages/CreaterRoom";
import JoinMatch from "./pages/JoinMatch";
import StartBattle from "./pages/StartBattle";
import BattleArena from "./pages/BattleArena";
import BattleWinner from "./pages/BattleWinner";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-room" element={<CreaterRoom />} />
        <Route path="/join-room" element={<JoinMatch />} />
        <Route path="/start-battle" element={<StartBattle />} />
        <Route path="/battle-arena" element={<BattleArena />} />
        <Route path="/battle-winner" element={<BattleWinner />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;