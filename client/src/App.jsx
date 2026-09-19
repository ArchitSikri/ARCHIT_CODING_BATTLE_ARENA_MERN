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
import Room from "./pages/Room";
import UserProtectedWrapper from "./utils/UserProtectedWrapper";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-room" element={<UserProtectedWrapper><CreaterRoom /></UserProtectedWrapper>} />
        <Route path="/room/:roomId" element={<UserProtectedWrapper><Room /></UserProtectedWrapper>} />
        <Route path="/join-room" element={<UserProtectedWrapper><JoinMatch /></UserProtectedWrapper>} />
        <Route path="/start-battle/room/:roomId" element={<UserProtectedWrapper><StartBattle /></UserProtectedWrapper>} />
        <Route path="/battle-arena/room/:roomId" element={<UserProtectedWrapper><BattleArena /></UserProtectedWrapper>} />
        <Route path="/battle-winner/room/:roomId" element={<UserProtectedWrapper><BattleWinner /></UserProtectedWrapper>} />
        <Route path="/profile" element={<UserProtectedWrapper><ProfilePage /></UserProtectedWrapper>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;