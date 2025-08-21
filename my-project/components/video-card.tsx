import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, BookOpen, Brain } from "lucide-react"
import Link from "next/link"

interface MCQQuestion {
  question: string
  options?: string[]
  correct_answer?: string
  explanation?: string
  difficulty?: string | null
}

interface Flashcard {
  front: string
  back: string
  error?: string | null
}

interface VideoCardProps {
  video: {
    _id: string
    details: {
      title: string
      description: string
      thumbnail_url: string
      channel_title: string
      duration: string
    }
    question_stats: {
      MCQ: number
      Flashcards: number
      Match: number
      FillBlanks: number
    }
    api_call_count: {
      total_calls: number
    }
    questions?: MCQQuestion[]
    flashcards?: Flashcard[]
  }
}

export function VideoCard({ video }: VideoCardProps) {
  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+)M(\d+)S/)
    if (match) {
      return `${match[1]}:${match[2].padStart(2, "0")}`
    }
    return duration
  }

  return (
    <div className="block mb-4">
      <Link href={`/videos/${video._id}`} passHref legacyBehavior>
        <a style={{ display: "block" }}>
          <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] bg-white/80 backdrop-blur-sm border-0 shadow-lg cursor-pointer rounded-3xl">
            <div className="relative overflow-hidden rounded-t-3xl">
              <img
                src={video.details.thumbnail_url || "/placeholder.svg"}
                alt={video.details.title}
                className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 backdrop-blur-sm text-gray-900 rounded-full p-4 pointer-events-none shadow-lg">
                  <Play className="w-6 h-6 fill-current pointer-events-none" />
                </div>
              </div>
              <Badge className="absolute top-4 right-4 bg-black/70 text-white border-0 pointer-events-none rounded-full px-3 py-1">
                <Clock className="w-3 h-3 mr-1 pointer-events-none" />
                {formatDuration(video.details.duration)}
              </Badge>
            </div>

            <CardContent className="p-6">
              <h3 className="font-bold text-xl mb-3 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                {video.details.title}
              </h3>

              <p className="text-gray-600 text-sm mb-6 line-clamp-1 font-medium">{video.details.channel_title}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="bg-blue-100 rounded-full p-1.5">
                      <BookOpen className="w-3 h-3 text-blue-600" />
                    </div>
                    {/* Show MCQ count only if there are real MCQs */}
                    {Array.isArray(video.questions) && video.questions.filter(q => q && q.question).length > 0 && (
                      <>
                        <span className="text-sm font-medium">{video.questions.filter(q => q && q.question).length}</span>
                      </>
                    )}
                  </div>
                  {/* Show Flashcard count only if there are real flashcards */}
                  {Array.isArray(video.flashcards) && video.flashcards.filter(f => f && f.front && f.back && !f.error).length > 0 && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="bg-purple-100 rounded-full p-1.5">
                        <Brain className="w-3 h-3 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium">{video.flashcards.filter(f => f && f.front && f.back && !f.error).length}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </a>
      </Link>
    </div>
  )
}
