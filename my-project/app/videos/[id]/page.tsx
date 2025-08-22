"use client"

import { useState } from "react"
import { videoData } from "@/lib/data"
import { notFound } from "next/navigation"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"

export default function VideoDetailPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0)
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false)
  const params = useParams()
  const video = videoData.find((v) => v._id === params.id)
  if (!video) return notFound()

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
        videoId: string;
        lastQuestionIndex: number;
        updatedAt: string;
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
                    {currentQuestion.options?.map((option, index) => {
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
      </main>
    </div>
  )
}
