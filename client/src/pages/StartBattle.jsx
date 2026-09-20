
import React from "react";
import { useState , useEffect , useContext } from "react";
import { useParams , useNavigate } from "react-router-dom";
import axios from "axios";

import {Code2,
  Play,
  RefreshCw,
  Clock,
  AlertCircle,
  Terminal,
  CheckCircle,
} from "lucide-react";

import { UserDataContext } from "../context/UserContext";
import Editor from "@monaco-editor/react";
import { SocketContext } from "../context/SocketContext";


const languageMapping = {
  javascript: 63,
  python: 71,
  cpp: 54,
  java: 62,
  csharp: 51,
  ruby: 72,
  go: 60,
};

const getLanguageId = (lang) => languageMapping[lang] || 63;

const allLanguages = [
  "javascript",
  "python",
  "cpp",
  "java",
  "csharp",
  "ruby",
  "go",
];


const StartBattle = () => {


  const nevigate = useNavigate();
  const { roomcode } = useParams();
  const { user } = useContext(UserDataContext);
  const { socket } = useContext(SocketContext);
  const userPreferredLanguage = user?.preferredLanguage || "";
  const [scores, setScores] = useState({ creator: 0, challenger: 0 });
  const [battle, setBattle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [opponentTyping, setOpponentTyping] = useState(false);
  const [allowedLanguages, setAllowedLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [opponentName, setOpponentName] = useState("Waiting...");
  const [opponentLanguage, setOpponentLanguage] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(600);
  const [editorInstance, setEditorInstance] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (userPreferredLanguage) {
      setSelectedLanguage(userPreferredLanguage);
    }
  }, [userPreferredLanguage]);

  const fetchOpponent = async (socketId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/opponent/${socketId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    

      const opponent = response.data?.opponent;
      setOpponentName(opponent?.name || opponent?.email || "Opponent");
      setOpponentLanguage(opponent?.preferredLanguage || "");
    } catch (err) {
      console.error("Error fetching opponent:", err);
    }
  };

  useEffect(() => {
    const fetchBattle = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/battle/all`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status !== 200) return;

        const foundBattle = response.data.battles.find(
          (battleItem) => battleItem.roomCode === roomcode
        );

        if (!foundBattle) return;

        setBattle(foundBattle);
        setAllowedLanguages(
          foundBattle.isSameLanguage
            ? foundBattle.allowedLanguages || []
            : allLanguages
        );

        if (userPreferredLanguage) {
          setSelectedLanguage(userPreferredLanguage);
        }

        const creatorId =
          typeof foundBattle.createdBy === "object"
            ? foundBattle.createdBy._id
            : foundBattle.createdBy;
        const creatorBool = String(creatorId) === String(user?._id);
        setIsCreator(creatorBool);

        if (isCreator) {
          fetchOpponent(foundBattle.user2SocketId);
        } else if (foundBattle.user1SocketId) {
          fetchOpponent(foundBattle.user1SocketId);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchBattle();
  }, [roomcode, user, userPreferredLanguage]);


   useEffect(() => {
    if (battle && currentQuestion) {
      let interval;
      if (battle.mode === "quality") {
        interval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setCurrentQuestion(null);
              return 600; // reset timer for next question
            }
            return prev - 1;
          });
        }, 1000);
      } else if (battle.mode === "time") {
        setTimer(0);
        interval = setInterval(() => {
          setTimer((prev) => prev + 1);
        }, 1000);
      }
      return () => clearInterval(interval);
    }
  }, [battle, currentQuestion]);


   useEffect(() => {
    if (!socket) return;
    socket.on("newQuestion", (data) => {
      setCurrentQuestion(data.question);
      setHasSubmitted(false);
      setCode(""); // clear the code editor upon receiving a new question
      if (battle) {
        if (battle.mode === "quality") {
          setTimer(600);
        } else if (battle.mode === "time") {
          setTimer(0);
        }
      }
    });
    socket.on("scoreUpdate", (data) => {
      setScores(data.scores);
    });
    socket.on("pointAwarded", (data) => {
      const wonPoint =
        (isCreator && data.winner === "creator") ||
        (!isCreator && data.winner === "challenger");
      const msg = wonPoint ? "You won a point" : "Opponent won a point";
      setToastMessage(msg);
      // Clear the current question and increment the question index
      setCurrentQuestion(null);
      setQuestionIndex((prev) => prev + 1);
      if (battle) {
        if (battle.mode === "quality") {
          setTimer(600);
        } else if (battle.mode === "time") {
          setTimer(0);
        }
      }
      setTimeout(() => setToastMessage(""), 2000);
    });
    socket.on("battleCompleted", (data) => {
      // data contains isWinner, battleDetails, finalScore
      navigate(`/battle-winner/${battle.roomCode}`, {
        state: {
          isWinner: data.isWinner,
          battleDetails: data.battleDetails,
          finalScore: data.finalScore,
        },
      });
    });
    return () => {
      socket.off("newQuestion");
      socket.off("scoreUpdate");
      socket.off("pointAwarded");
      socket.off("battleCompleted");
    };
  }, [socket, battle, isCreator, navigate]);


  

  


  return (
    <div>
      
    </div>
  )
}

export default StartBattle
