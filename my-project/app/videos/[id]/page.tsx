"use client"

import { useState, useEffect } from "react"
import { fetchVideoData } from "@/lib/data"
import { notFound } from "next/navigation"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RotateCcw, ChevronLeft, ChevronRight, Zap, Target, Trophy } from "lucide-react"
import { LoaderOne } from "@/components/ui/loader"

import { useMemo } from "react"

function shuffle<T>(array: T[]): T[] {
  // Fisher-Yates shuffle
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function MatchPairs({ matchQuestions }: { matchQuestions: { left: string; right: string }[] }) {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  const [selectedRight, setSelectedRight] = useState<number | null>(null)
  const [matches, setMatches] = useState<{ left: number; right: number }[]>([])
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" | "" }>({
    message: "",
    type: "",
  })
  const [showConnections, setShowConnections] = useState(false)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)

  // Shuffle only once
  const leftItems = useMemo(() => matchQuestions.map((q) => q.left), [matchQuestions])
  const rightItems = useMemo(() => shuffle(matchQuestions.map((q) => q.right)), [matchQuestions])

  const isMatched = (leftIdx: number, rightIdx: number) =>
    matches.some((m) => m.left === leftIdx && m.right === rightIdx)

  const isLeftMatched = (leftIdx: number) => matches.some((m) => m.left === leftIdx)
  const isRightMatched = (rightIdx: number) => matches.some((m) => m.right === rightIdx)

  const handleSelect = (side: "left" | "right", idx: number) => {
    if (side === "left" && !isLeftMatched(idx)) {
      setSelectedLeft(selectedLeft === idx ? null : idx)
    } else if (side === "right" && !isRightMatched(idx)) {
      setSelectedRight(selectedRight === idx ? null : idx)
    }
  }

  const resetGame = () => {
    setMatches([])
    setSelectedLeft(null)
    setSelectedRight(null)
    setFeedback({ message: "", type: "" })
    setScore(0)
    setAttempts(0)
    setShowConnections(false)
  }

  useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null) {
      setAttempts((prev) => prev + 1)

      if (matchQuestions[selectedLeft].right === rightItems[selectedRight]) {
        setMatches((prev) => [...prev, { left: selectedLeft, right: selectedRight }])
        setScore((prev) => prev + 10)
        setFeedback({
          message: `Perfect! "${leftItems[selectedLeft]}" matches "${rightItems[selectedRight]}"`,
          type: "success",
        })
        setShowConnections(true)
        setTimeout(() => {
          setSelectedLeft(null)
          setSelectedRight(null)
          setFeedback({ message: "", type: "" })
        }, 1200)
      } else {
        setFeedback({
          message: `Not quite right. "${leftItems[selectedLeft]}" doesn't match "${rightItems[selectedRight]}"`,
          type: "error",
        })
        setTimeout(() => {
          setSelectedLeft(null)
          setSelectedRight(null)
          setFeedback({ message: "", type: "" })
        }, 1200)
      }
    }
  }, [selectedLeft, selectedRight, matchQuestions, rightItems, leftItems])

  const progress = (matches.length / matchQuestions.length) * 100
  const isComplete = matches.length === matchQuestions.length

  return (
    <div className="space-y-6">
      {/* Progress and Stats */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-700">
              Progress: {matches.length}/{matchQuestions.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <span className="font-semibold text-gray-700">Score: {score}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Attempts: {attempts}</span>
          </div>
        </div>
        <Button onClick={resetGame} variant="outline" className="rounded-full px-4 py-2 border-2 bg-transparent">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Feedback */}
      {feedback.message && (
        <div
          className={`text-center p-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
            feedback.type === "success"
              ? "bg-green-100 text-green-800 border-2 border-green-200"
              : "bg-red-100 text-red-800 border-2 border-red-200"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Matching Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <h4 className="font-bold text-lg text-gray-800">Terms</h4>
          </div>
          {leftItems.map((item, idx) => (
            <Card
              key={idx}
              className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedLeft === idx
                  ? "ring-4 ring-blue-400 shadow-lg bg-blue-50 border-blue-300"
                  : isLeftMatched(idx)
                    ? "bg-green-50 border-green-300 shadow-md"
                    : "hover:shadow-md hover:border-gray-300 bg-white"
              } ${isLeftMatched(idx) ? "opacity-75" : ""}`}
              onClick={() => handleSelect("left", idx)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">{item}</span>
                  {isLeftMatched(idx) && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {selectedLeft === idx && !isLeftMatched(idx) && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Connection Lines */}
        {showConnections && (
          <div className="absolute inset-0 pointer-events-none hidden lg:block">
            <svg className="w-full h-full">
              {matches.map((match, idx) => (
                <line
                  key={idx}
                  x1="45%"
                  y1={`${(match.left + 1) * (100 / (leftItems.length + 1))}%`}
                  x2="55%"
                  y2={`${(rightItems.findIndex((item) => item === matchQuestions[match.left].right) + 1) * (100 / (rightItems.length + 1))}%`}
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
              ))}
            </svg>
          </div>
        )}

        {/* Right Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            <h4 className="font-bold text-lg text-gray-800">Definitions</h4>
          </div>
          {rightItems.map((item, idx) => (
            <Card
              key={idx}
              className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedRight === idx
                  ? "ring-4 ring-purple-400 shadow-lg bg-purple-50 border-purple-300"
                  : isRightMatched(idx)
                    ? "bg-green-50 border-green-300 shadow-md"
                    : "hover:shadow-md hover:border-gray-300 bg-white"
              } ${isRightMatched(idx) ? "opacity-75" : ""}`}
              onClick={() => handleSelect("right", idx)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">{item}</span>
                  {isRightMatched(idx) && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {selectedRight === idx && !isRightMatched(idx) && (
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Completion State */}
      {isComplete && (
        <div className="text-center p-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl border-2 border-green-200">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-800 mb-2">Congratulations! 🎉</h3>
          <p className="text-green-700 text-lg mb-4">You've successfully matched all pairs!</p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <span>
              Final Score: <strong className="text-green-600">{score} points</strong>
            </span>
            <span>
              Total Attempts: <strong>{attempts}</strong>
            </span>
            <span>
              Accuracy: <strong className="text-green-600">{Math.round((matches.length / attempts) * 100)}%</strong>
            </span>
          </div>
        </div>
      )}

      {/* Instructions */}
      {matches.length === 0 && (
        <div className="text-center p-6 bg-gray-50 rounded-2xl">
          <p className="text-gray-600">
            Click on a term from the left column, then click on its matching definition from the right column.
            <br />
            <span className="text-sm text-gray-500 mt-2 block">
              Get visual feedback and track your progress as you match pairs!
            </span>
          </p>
        </div>
      )}
    </div>
  )
}

export default function VideoDetailPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0)
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false)
  const [video, setVideo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()

  useEffect(() => {
    if (!params || !("id" in params) || !params.id) return;
    let mounted = true
    setLoading(true)
    fetchVideoData()
      .then((data) => {
        const videos = Array.isArray(data) ? data : data?.videos || []
        const found = videos.find((v: any) => v._id === params.id)
        if (mounted) {
          setVideo(found)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || "Failed to load video")
          setLoading(false)
        }
      })
    return () => {
      mounted = false
    }
  }, [params?.id])

  if (!params || !("id" in params) || !params.id) return notFound()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <LoaderOne />
      </div>
    )
  }
  if (error || !video) {
    return notFound()
  }

  let youtubeId = video.video_id
  if (youtubeId.includes("youtube.com")) {
    const match = youtubeId.match(/v=([\w-]+)/)
    youtubeId = match ? match[1] : youtubeId
  }

  const currentQuestion = video.questions[currentQuestionIndex]
  const currentFlashcard = video.flashcards[currentFlashcardIndex]

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
    setShowResult(true)

    // Save progress
    if (typeof window !== "undefined") {
      interface UserProgress {
        videoId: string
        lastQuestionIndex: number
        updatedAt: string
      }
      const progress: UserProgress[] = JSON.parse(localStorage.getItem("userProgress") || "[]")
      const idx = progress.findIndex((p: UserProgress) => p.videoId === video._id)
      if (idx >= 0) {
        progress[idx].lastQuestionIndex = currentQuestionIndex
        progress[idx].updatedAt = new Date().toISOString()
      } else {
        progress.push({
          videoId: video._id,
          lastQuestionIndex: currentQuestionIndex,
          updatedAt: new Date().toISOString(),
        })
      }
      localStorage.setItem("userProgress", JSON.stringify(progress))
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < video.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const resetQuestion = () => {
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const nextFlashcard = () => {
    if (currentFlashcardIndex < video.flashcards.length - 1) {
      setCurrentFlashcardIndex(currentFlashcardIndex + 1)
      setShowFlashcardAnswer(false)
    }
  }

  const prevFlashcard = () => {
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex(currentFlashcardIndex - 1)
      setShowFlashcardAnswer(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200 overflow-hidden mb-12">
          <div className="p-8">
            <h1 className="font-bold text-4xl text-gray-900 mb-6 tracking-tight leading-tight">
              {video.details?.title ?? "Untitled Video"}
            </h1>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <iframe
                width="100%"
                height="500"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={video.details?.title ?? "Untitled Video"}
                frameBorder="0"
                allowFullScreen
                className="w-full"
              ></iframe>
            </div>
          </div>
        </div>

        {video.questions.length > 0 && (
          <section className="mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-bold text-3xl text-gray-900 tracking-tight">Interactive Quiz</h2>
                <Badge className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
                  {currentQuestionIndex + 1} of {video.questions.length}
                </Badge>
              </div>

              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-sm rounded-2xl">
                <CardContent className="p-8">
                  <h3 className="font-semibold text-xl text-gray-900 mb-8 leading-relaxed">
                    {currentQuestion.question}
                  </h3>

                  <div className="grid gap-4 mb-8">
                    {currentQuestion.options?.map((option: string, index: number) => {
                      let buttonClass =
                        "w-full p-6 text-left rounded-2xl border-2 transition-all duration-200 font-medium text-lg"

                      if (!showResult) {
                        buttonClass +=
                          " border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
                      } else if (option === currentQuestion.correct_answer) {
                        buttonClass += " border-green-400 bg-green-50 text-green-800 shadow-lg"
                      } else if (option === selectedAnswer && option !== currentQuestion.correct_answer) {
                        buttonClass += " border-red-400 bg-red-50 text-red-800 shadow-lg"
                      } else {
                        buttonClass += " border-gray-200 bg-gray-50 text-gray-600"
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => !showResult && handleAnswerSelect(option)}
                          disabled={showResult}
                          className={buttonClass}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {showResult && option === currentQuestion.correct_answer && (
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            )}
                            {showResult && option === selectedAnswer && option !== currentQuestion.correct_answer && (
                              <XCircle className="w-6 h-6 text-red-600" />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {showResult && currentQuestion.explanation && (
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Explanation:</h4>
                      <p className="text-gray-700 leading-relaxed">{currentQuestion.explanation}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <Button
                        onClick={prevQuestion}
                        disabled={currentQuestionIndex === 0}
                        variant="outline"
                        className="rounded-full px-6 border-2 bg-transparent"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>
                      <Button
                        onClick={resetQuestion}
                        variant="outline"
                        className="rounded-full px-6 border-2 bg-transparent"
                        disabled={!showResult}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Reset
                      </Button>
                    </div>

                    <Button
                      onClick={nextQuestion}
                      disabled={currentQuestionIndex === video.questions.length - 1}
                      className="bg-blue-600 hover:bg-blue-700 rounded-full px-6"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {video.flashcards.length > 0 && (
          <section>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-bold text-3xl text-gray-900 tracking-tight">Smart Flashcards</h2>
                <Badge className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full">
                  {currentFlashcardIndex + 1} of {video.flashcards.length}
                </Badge>
              </div>

              <div className="max-w-2xl mx-auto">
                <div
                  className="relative h-80 cursor-pointer perspective-1000"
                  onClick={() => setShowFlashcardAnswer(!showFlashcardAnswer)}
                >
                  <div
                    className={`absolute inset-0 w-full h-full transition-transform duration-700 transform-style-preserve-3d ${showFlashcardAnswer ? "rotate-y-180" : ""}`}
                  >
                    {/* Front of card */}
                    <div className="absolute inset-0 w-full h-full backface-hidden">
                      <Card className="h-full bg-gradient-to-br from-purple-50 to-blue-50 border-0 shadow-xl rounded-3xl">
                        <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
                          <h3 className="font-semibold text-2xl text-gray-900 mb-4 leading-relaxed">
                            {currentFlashcard.front}
                          </h3>
                          <p className="text-gray-600 text-sm">Click to reveal answer</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Back of card */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                      <Card className="h-full bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-xl rounded-3xl">
                        <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
                          <h3 className="font-semibold text-xl text-gray-900 mb-4 leading-relaxed">
                            {currentFlashcard.back}
                          </h3>
                          <p className="text-gray-600 text-sm">Click to flip back</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-8">
                  <Button
                    onClick={prevFlashcard}
                    disabled={currentFlashcardIndex === 0}
                    variant="outline"
                    className="rounded-full px-6 border-2 bg-transparent"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <Button
                    onClick={() => setShowFlashcardAnswer(!showFlashcardAnswer)}
                    variant="outline"
                    className="rounded-full px-6 border-2"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Flip Card
                  </Button>

                  <Button
                    onClick={nextFlashcard}
                    disabled={currentFlashcardIndex === video.flashcards.length - 1}
                    className="bg-purple-600 hover:bg-purple-700 rounded-full px-6"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Match the Pairs Section */}
        {video.match_questions && video.match_questions.length > 0 && (
          <section className="mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-green-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-bold text-3xl text-green-900 tracking-tight">Match the Pairs</h2>
                <Badge className="bg-green-100 text-green-700 px-4 py-2 rounded-full">
                  {video.match_questions.length} Questions
                </Badge>
              </div>
              {/* Normalize API match_questions to {left, right}[] */}
              {video.match_questions.map((q: any, idx: number) => {
                const pairs = Object.entries(q.correct_matches || {}).map(([left, right]) => ({ left, right: String(right) }))
                return (
                  <div key={idx} className="mb-8">
                    <MatchPairs matchQuestions={pairs} />
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
