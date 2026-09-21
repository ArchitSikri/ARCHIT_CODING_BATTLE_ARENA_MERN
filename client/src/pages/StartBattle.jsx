
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Code2,
  Play,
  RefreshCw,
  Clock,
  AlertCircle,
  Terminal,
  CheckCircle,
} from "lucide-react";
import Editor from "@monaco-editor/react";

import { UserDataContext } from "../context/UserContext";
import { SocketContext } from "../context/SocketContext";

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
  const navigate = useNavigate();
  const { roomId } = useParams();
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
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(600);
  const [editorInstance, setEditorInstance] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (userPreferredLanguage && !allowedLanguages.includes(userPreferredLanguage)) {
      setSelectedLanguage(userPreferredLanguage);
    }
  }, [allowedLanguages, userPreferredLanguage]);

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
      const resolvedOpponent = Array.isArray(opponent) ? opponent[0] : opponent;

      setOpponentName(
        resolvedOpponent?.name ||
          `${resolvedOpponent?.fullname?.firstname || ""} ${resolvedOpponent?.fullname?.lastname || ""}`.trim() ||
          resolvedOpponent?.email ||
          "Opponent"
      );
    } catch (error) {
      console.error("Error fetching opponent:", error);
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
          (battleItem) => battleItem.roomCode === roomId
        );

        if (!foundBattle) return;

        setBattle(foundBattle);

        const nextAllowedLanguages = foundBattle.isSameLanguage
          ? foundBattle.allowedLanguages || []
          : allLanguages;

        setAllowedLanguages(nextAllowedLanguages);

        const defaultLanguage =
          userPreferredLanguage && nextAllowedLanguages.includes(userPreferredLanguage)
            ? userPreferredLanguage
            : nextAllowedLanguages[0] || allLanguages[0];

        setSelectedLanguage(defaultLanguage);

        const creatorId =
          typeof foundBattle.createdBy === "object"
            ? foundBattle.createdBy._id
            : foundBattle.createdBy;
        const creatorBool = String(creatorId) === String(user?._id);
        setIsCreator(creatorBool);

        if (creatorBool && foundBattle.user2SocketId) {
          fetchOpponent(foundBattle.user2SocketId);
        } else if (!creatorBool && foundBattle.user1SocketId) {
          fetchOpponent(foundBattle.user1SocketId);
        }
      } catch (error) {
        console.error("Error fetching battle:", error);
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchBattle();
    }
  }, [roomId, user, userPreferredLanguage]);

  useEffect(() => {
    if (battle && currentQuestion) {
      let interval;
      if (battle.mode === "quality") {
        interval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setCurrentQuestion(null);
              return 600;
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
      setCode("");
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
      navigate(`/battle-winner/room/${battle.roomCode}`, {
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

  useEffect(() => {
    if (editorInstance) {
      const { editor, monaco } = editorInstance;
      monaco.editor.setModelLanguage(editor.getModel(), selectedLanguage);
    }
  }, [selectedLanguage, editorInstance]);

  useEffect(() => {
    if (currentQuestion) {
      const typingInterval = setInterval(() => {
        setOpponentTyping((prev) => !prev);
      }, 3000);
      return () => clearInterval(typingInterval);
    }
  }, [currentQuestion]);

  const normalizeOutput = (output) => {
    if (!output) return "";
    const trimmed = output.trim();
    try {
      return JSON.stringify(JSON.parse(trimmed));
    } catch (error) {
      return trimmed.replace(/\s+/g, "");
    }
  };

  const judgeCodeWithGemini = async ({
    sourceCode,
    language,
    sampleInput,
    sampleOutput,
    problemText,
  }) => {
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!geminiApiKey) {
      throw new Error("Gemini API key is missing. Add VITE_GEMINI_API_KEY to your .env file.");
    }

    const prompt = `
You are a strict coding judge.
Evaluate whether the following code solves the problem.

Problem description:
${problemText || "No description available."}

Sample Input:
${sampleInput || ""}

Sample Output:
${sampleOutput || ""}

Language: ${language}

Code:
\`\`\`
${sourceCode}
\`\`\`

Return EXACTLY this format:
RESULT: CORRECT or INCORRECT or ERROR
OUTPUT: <the exact output produced by the code for the sample input>
REASON: <very short reason>

If the code is incomplete or has syntax issues, return RESULT: ERROR.
`;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 500,
      },
    };

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const answerText =
      response?.data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text)
        ?.join("\n") || "";

    const resultMatch = answerText.match(/RESULT\s*:\s*(CORRECT|INCORRECT|ERROR)/i);
    const outputMatch = answerText.match(/OUTPUT\s*:\s*([\s\S]*?)(?:\nREASON\s*:|$)/i);

    return {
      result: resultMatch ? resultMatch[1].toUpperCase() : "ERROR",
      output: outputMatch ? outputMatch[1].trim() : "",
      raw: answerText,
    };
  };

  const handleGenerateQuestion = () => {
    if (!isCreator || currentQuestion) return;
    if (battle && battle.questions && battle.questions.length > questionIndex) {
      setIsGeneratingQuestion(true);
      const newQuestion = {
        ...battle.questions[questionIndex],
        constraints: `
• 2 <= nums.length <= 10^4
• -10^9 <= nums[i] <= 10^9
• -10^9 <= target <= 10^9
• Only one valid answer exists.
        `,
      };

      setCurrentQuestion(newQuestion);
      if (battle.mode === "quality") {
        setTimer(600);
      } else if (battle.mode === "time") {
        setTimer(0);
      }
      setIsGeneratingQuestion(false);
      socket.emit("newQuestion", {
        roomCode: battle.roomCode,
        question: newQuestion,
      });
    }
  };

  const handleSubmitCode = async () => {
    if (!currentQuestion || hasSubmitted) return;
    setHasSubmitted(true);

    try {
      const sampleInput = currentQuestion["sample input"] || currentQuestion.sampleInput || "";
      const sampleOutput = currentQuestion["sample output"] || currentQuestion.sampleOutput || "";
      const problemText = currentQuestion.description || currentQuestion.statement || currentQuestion.title || "";

      const geminiJudgement = await judgeCodeWithGemini({
        sourceCode: code,
        language: selectedLanguage,
        sampleInput,
        sampleOutput,
        problemText,
      });

      const judgeResult = geminiJudgement.result;
      const judgeOutput = normalizeOutput(geminiJudgement.output);
      const expectedOutput = normalizeOutput(sampleOutput);

      console.log("Gemini judge result:", geminiJudgement);
      console.log("Normalized Judge Output:", judgeOutput);
      console.log("Normalized Expected Output:", expectedOutput);

      if (judgeResult === "CORRECT" || judgeOutput === expectedOutput) {
        const updatedScores = { ...scores };
        if (isCreator) {
          updatedScores.creator += 1;
        } else {
          updatedScores.challenger += 1;
        }

        socket.emit("scoreUpdate", {
          roomCode: battle.roomCode,
          scores: updatedScores,
        });

        socket.emit("pointAwarded", {
          roomCode: battle.roomCode,
          winner: isCreator ? "creator" : "challenger",
        });

        if (updatedScores.creator + updatedScores.challenger === battle.questions.length) {
          const token = localStorage.getItem("token");
          axios
            .patch(
              `${import.meta.env.VITE_BASE_URL}/battle/complete/${battle._id}`,
              { scores: updatedScores },
              {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
              }
            )
            .then((response) => {
              const isWinner =
                response.data.battle.winner?.toString() === user._id.toString();
              socket.emit("battleCompleted", {
                roomCode: battle.roomCode,
                isWinner,
                battleDetails: battle,
                finalScore: updatedScores,
              });
            })
            .catch((error) => console.error("Error completing battle:", error));
        }
      } else {
        alert("Incorrect solution submitted.");
        setHasSubmitted(false);
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("Submission failed. Please ensure VITE_GEMINI_API_KEY is set and try again.");
      setHasSubmitted(false);
    }
  };

  const creatorDisplayName = isCreator
    ? "You"
    : battle?.createdBy?.fullname
    ? `${battle.createdBy.fullname.firstname} ${battle.createdBy.fullname.lastname}`
    : "Creator";
  const challengerDisplayName = isCreator ? opponentName : "You";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center text-gray-100">
        Loading battle details...
      </div>
    );
  }

  if (!battle) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center text-gray-100">
        Battle not found!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toastMessage}
        </div>
      )}

      <header className="bg-gray-800/50 border-b border-gray-700/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Code2 className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Code Battle
            </h1>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-300">
            {currentQuestion && battle.mode === "quality" && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <span>Time Left: {timer}s</span>
              </div>
            )}
            {currentQuestion && battle.mode === "time" && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-400" />
                <span>Elapsed: {new Date(timer * 1000).toISOString().substr(14, 5)}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl flex-1 w-full px-4 py-6 flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 border-b border-gray-700">
              <h2 className="text-lg font-bold">{battle.battleName}</h2>
              <p className="text-sm text-gray-400 mt-1">{battle.description}</p>
            </div>

            <div className="p-4 flex items-center justify-center">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{creatorDisplayName}</p>
                  <p className="text-4xl font-black text-blue-400">{scores.creator}</p>
                </div>
                <div className="text-3xl font-bold text-gray-500">VS</div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{challengerDisplayName}</p>
                  <p className="text-4xl font-black text-purple-400">{scores.challenger}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
            {!currentQuestion ? (
              <div className="p-8 text-center">
                {isCreator ? (
                  <>
                    <div className="mb-5 flex justify-center">
                      <Play className="h-12 w-12 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Start the battle</h3>
                    <p className="text-gray-400 mb-6">Click below to generate the next challenge.</p>
                    <button
                      type="button"
                      onClick={handleGenerateQuestion}
                      disabled={isGeneratingQuestion}
                      className={`mx-auto flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                        isGeneratingQuestion
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                      }`}
                    >
                      {isGeneratingQuestion ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Generate Question
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mb-5 flex justify-center">
                      <Clock className="h-12 w-12 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Waiting for question</h3>
                    <p className="text-gray-400">The creator is preparing the challenge.</p>
                    <div className="mt-6 flex justify-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-purple-500 animate-pulse"></div>
                      <div className="h-2.5 w-2.5 rounded-full bg-purple-500 animate-pulse delay-150"></div>
                      <div className="h-2.5 w-2.5 rounded-full bg-purple-500 animate-pulse delay-300"></div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="flex items-center text-lg font-bold">
                    <Terminal className="h-5 w-5 text-blue-400 mr-2" />
                    {currentQuestion.questionname || currentQuestion.title}
                  </h3>
                  <span className="rounded-full border border-green-500/30 bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-300">
                    {currentQuestion.difficulty || "Medium"}
                  </span>
                </div>

                <div className="mb-4 whitespace-pre-line text-gray-300">
                  {currentQuestion.description}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="rounded-xl border border-gray-700 bg-gray-900/70 p-3">
                    <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">Sample Input</p>
                    <pre className="text-sm text-green-400 whitespace-pre-wrap font-mono">
                      {currentQuestion["sample input"] || currentQuestion.sampleInput || "-"}
                    </pre>
                  </div>
                  <div className="rounded-xl border border-gray-700 bg-gray-900/70 p-3">
                    <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">Sample Output</p>
                    <pre className="text-sm text-blue-400 whitespace-pre-wrap font-mono">
                      {currentQuestion["sample output"] || currentQuestion.sampleOutput || "-"}
                    </pre>
                  </div>
                </div>

                {currentQuestion.constraints && (
                  <div className="mb-4 rounded-xl border border-gray-700 bg-gray-900/70 p-3">
                    <p className="mb-2 text-xs uppercase tracking-wide text-gray-400">Constraints</p>
                    <pre className="text-xs whitespace-pre-wrap text-gray-300 font-mono">
                      {currentQuestion.constraints}
                    </pre>
                  </div>
                )}

                {isCreator && (
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleGenerateQuestion}
                      disabled={currentQuestion !== null}
                      className="flex items-center rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 text-sm font-medium hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isGeneratingQuestion ? "animate-spin" : ""}`} />
                      {isGeneratingQuestion ? "Generating..." : "Next Question"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/2 space-y-6">
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl overflow-hidden shadow-xl shadow-black/20 h-full flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-700 bg-gray-900/40 p-3">
              <div className="flex items-center gap-2 font-medium text-gray-200">
                <Code2 className="h-4 w-4 text-blue-400" />
                Solution
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="rounded-xl border border-gray-700 bg-gray-900 px-2 py-1.5 text-sm text-gray-200 outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {allowedLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>

                {opponentTyping && (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
                    Opponent typing...
                  </div>
                )}
              </div>
            </div>

            <div className="relative flex-1 min-h-[420px]">
              <Editor
                height="100%"
                language={selectedLanguage || "javascript"}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                onMount={(editor, monaco) => {
                  setEditorInstance({ editor, monaco });
                }}
                options={{
                  minimap: { enabled: false },
                  automaticLayout: true,
                  fontSize: 14,
                  readOnly: !currentQuestion,
                }}
              />

              {!currentQuestion && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/75 backdrop-blur-sm">
                  <div className="text-center px-6">
                    <AlertCircle className="mx-auto mb-4 h-12 w-12 text-gray-500" />
                    <h3 className="text-lg font-medium text-gray-300">Waiting for challenge</h3>
                    <p className="mt-2 text-sm text-gray-400">
                      The editor unlocks when the battle question is live.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-gray-700 bg-gray-900/40 p-3">
              <div className="text-xs text-gray-400">Write efficient code and submit when ready.</div>
              <button
                type="button"
                onClick={handleSubmitCode}
                disabled={!currentQuestion || !code.trim() || hasSubmitted}
                className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  !currentQuestion || !code.trim() || hasSubmitted
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {hasSubmitted ? "Submitted" : "Submit Solution"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StartBattle;
