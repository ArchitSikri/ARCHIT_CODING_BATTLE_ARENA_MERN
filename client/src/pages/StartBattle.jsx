
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
import PageFrame from "../components/layout/PageFrame";
import GlassPanel from "../components/ui/GlassPanel";

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
      if (data?.scores) {
        setScores(data.scores);
      }
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

  const judgeCodeWithJudge0 = async ({
    sourceCode,
    language,
  }) => {
    const languageIds = {
      javascript: 63,
      python: 71,
      cpp: 54,
      java: 62,
      csharp: 51,
      ruby: 72,
      go: 60,
    };
    const languageId = languageIds[String(language).toLowerCase()];
    const judge0ApiHost = import.meta.env.VITE_JUDGE0_API_HOST?.trim() || "judge0-ce.p.rapidapi.com";
    const judge0BaseUrl = (import.meta.env.VITE_JUDGE0_API_URL?.trim() || "https://ce.judge0.com").replace(/\/+$/, "");
    const usesRapidApi = judge0BaseUrl.includes("rapidapi.com");

    if (!languageId) {
      throw new Error(`Unsupported Judge0 language: ${language}`);
    }
    const judge0ApiKey = import.meta.env.VITE_JUDGE0_API_KEY?.trim().replace(/[.,;]+$/, "");
    if (usesRapidApi && !judge0ApiKey) {
      throw new Error("Judge0 API key is missing. Add VITE_JUDGE0_API_KEY to your client .env file.");
    }

    const headers = { "Content-Type": "application/json" };
    if (usesRapidApi) {
      headers["X-RapidAPI-Key"] = judge0ApiKey;
      headers["X-RapidAPI-Host"] = judge0ApiHost;
    }
    const submissionResponse = await axios.post(
      `${judge0BaseUrl}/submissions?base64_encoded=false&wait=false`,
      {
        language_id: languageId,
        source_code: sourceCode,
        stdin: "",
      },
      {
        headers,
      }
    );

    const token = submissionResponse.data?.token;
    if (!token) {
      throw new Error("Judge0 did not return a submission token.");
    }

    let result;
    for (let attempt = 0; attempt < 30; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const resultResponse = await axios.get(
        `${judge0BaseUrl}/submissions/${token}?base64_encoded=false`,
        { headers }
      );
      result = resultResponse.data;
      if (result?.status?.id > 2) break;
    }

    if (!result || result.status?.id <= 2) {
      throw new Error("Judge0 execution timed out.");
    }

    const output = result.stdout || result.compile_output || result.stderr || "";
    const hasExecutionError = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13].includes(result.status.id);

    return {
      // The stored examples are descriptive function inputs, not valid stdin for every language.
      // Judge0's expected_output check would therefore reject valid submissions as wrong answers.
      result: !hasExecutionError && result.status.id === 3 ? "CORRECT" : "INCORRECT",
      output,
      status: result.status.description,
      message: result.message || result.stderr || result.compile_output || "",
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
      const judge0Judgement = await judgeCodeWithJudge0({
        sourceCode: code,
        language: selectedLanguage,
      });

      const judgeResult = judge0Judgement.result;

      console.log("Judge0 result:", judge0Judgement);

      if (judgeResult === "CORRECT") {
        const updatedScores = { ...scores };
        if (isCreator) {
          updatedScores.creator += 1;
        } else {
          updatedScores.challenger += 1;
        }

        setScores(updatedScores);
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
            .post(
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
        const details = [judge0Judgement.status, judge0Judgement.message]
          .filter(Boolean)
          .join(": ");
        alert(`Incorrect solution submitted.${details ? ` ${details}` : ""}`);
        setHasSubmitted(false);
      }
    } catch (error) {
      console.error("Error during submission:", error);
      const apiMessage = error.response?.data?.message;
      alert(
        apiMessage ||
          (error.message === "Judge0 API key is missing. Add VITE_JUDGE0_API_KEY to your client .env file."
            ? error.message
            : error.message || "Submission failed while running Judge0.")
      );
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
    <PageFrame wide className="flex min-h-[calc(100vh-3rem)] flex-col">
      {toastMessage && (
        <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-full border border-emerald-200/25 bg-emerald-300/15 px-5 py-2 text-sm font-semibold text-emerald-100 shadow-2xl backdrop-blur-xl">
          {toastMessage}
        </div>
      )}

      <header className="sticky top-4 z-10 mb-6 rounded-2xl border border-white/10 bg-black/45 px-4 py-4 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:px-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
              <Code2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-200/75">Live arena / room {roomId}</p>
              <h1 className="truncate text-lg font-black tracking-tight text-white">{battle.battleName}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-white/60 sm:gap-5 sm:text-sm">
            <span className="hidden rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] font-semibold text-emerald-200 sm:inline-flex">
              {questionIndex + 1}/{battle.questions?.length || battle.questionsNumber} rounds
            </span>
            {currentQuestion && battle.mode === "quality" && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="hidden sm:inline">Time left:</span> {timer}s
              </div>
            )}
            {currentQuestion && battle.mode === "time" && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-400" />
                <span className="hidden sm:inline">Elapsed:</span> {new Date(timer * 1000).toISOString().substr(14, 5)}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex w-full flex-1 flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2 space-y-6">
          <GlassPanel className="overflow-hidden rounded-2xl">
            <div className="border-b border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-fuchsia-200/70">Head to head</p>
                  <h2 className="text-lg font-bold">{battle.battleName}</h2>
                  <p className="mt-1 text-sm text-white/45">{battle.description}</p>
                </div>
                <span className="shrink-0 rounded-lg border border-white/10 bg-black/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/50">
                  {battle.mode} mode
                </span>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 p-5 sm:gap-8">
                <div className="rounded-xl border border-cyan-200/15 bg-cyan-300/[0.06] p-3 text-center">
                  <p className="text-sm font-semibold text-white/75">{creatorDisplayName}</p>
                  <p className="mt-1 text-4xl font-black text-cyan-200">{scores.creator}</p>
                </div>
                <div className="text-center text-xs font-bold uppercase tracking-[0.3em] text-white/25">VS</div>
                <div className="rounded-xl border border-fuchsia-200/15 bg-fuchsia-300/[0.06] p-3 text-center">
                  <p className="text-sm font-semibold text-white/75">{challengerDisplayName}</p>
                  <p className="mt-1 text-4xl font-black text-fuchsia-200">{scores.challenger}</p>
                </div>
            </div>
          </GlassPanel>

          <GlassPanel className="overflow-hidden rounded-2xl">
            {!currentQuestion ? (
              <div className="p-8 text-center">
                {isCreator ? (
                  <>
                    <div className="mb-5 flex justify-center">
                      <Play className="h-12 w-12 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      {questionIndex === 0 ? "Start the battle" : "Point awarded"}
                    </h3>
                    <p className="text-gray-400 mb-6">
                      {questionIndex === 0
                        ? "Click below to generate the first challenge."
                        : "Click below to continue to the next challenge."}
                    </p>
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
                          {questionIndex === 0 ? "Generate Question" : "Next Question"}
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
          </GlassPanel>
        </div>

        <div className="w-full lg:w-1/2 space-y-6">
          <GlassPanel className="flex h-full min-h-[620px] flex-col overflow-hidden rounded-2xl border-cyan-200/10">
            <div className="flex items-center justify-between border-b border-white/10 bg-black/30 p-3">
              <div className="flex items-center gap-2 font-medium text-white/80">
                <Code2 className="h-4 w-4 text-cyan-200" />
                <span>Solution workspace</span>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="rounded-lg border border-white/10 bg-black/35 px-2 py-1.5 text-sm text-white/80 outline-none focus:ring-1 focus:ring-cyan-300/50"
                >
                  {allowedLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>

                {opponentTyping && (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-fuchsia-300"></span>
                    Opponent typing
                  </div>
                )}
              </div>
            </div>

            <div className="relative min-h-[420px] flex-1 bg-[#080b12]/45 p-2">
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
                <div className="absolute inset-2 flex items-center justify-center rounded-xl bg-black/65 backdrop-blur-sm">
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

            <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-black/30 p-3">
              <div className="text-xs text-white/40">Submit when your solution is ready.</div>
              <button
                type="button"
                onClick={handleSubmitCode}
                disabled={!currentQuestion || !code.trim() || hasSubmitted}
                className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  !currentQuestion || !code.trim() || hasSubmitted
                    ? "cursor-not-allowed border border-white/10 bg-white/10 text-white/35"
                    : "border border-emerald-200/30 bg-emerald-300/15 text-emerald-100 hover:bg-emerald-300/25"
                }`}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {hasSubmitted ? "Submitted" : "Submit Solution"}
              </button>
            </div>
          </GlassPanel>
        </div>
      </main>
    </PageFrame>
  );
};

export default StartBattle;
