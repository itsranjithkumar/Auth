"use client"

import { useEffect, useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { VideoCard } from "@/components/video-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, TrendingUp, Play, BookOpen, Brain, Tag, Filter } from "lucide-react"
import Link from "next/link"
import { videoData } from "@/lib/data"
import type { VideoQuestion, VideoFlashcard } from "@/lib/video-types"

export default function DashboardPage() {
  // Normalize videoData to ensure question_stats always has the required fields
  const normalizedVideoData = useMemo(
    () =>
      videoData.map((video) => ({
        ...video,
        tags: video.tags ?? [],
        details: video.details ?? {
          title: "",
          description: "",
          thumbnail_url: "",
          channel_title: "",
          duration: "",
        },
        api_call_count: video.api_call_count ?? {
          summary: 0,
          questions: 0,
          flashcards: 0,
          total_calls: 0,
          last_updated: "",
        },
        question_stats: {
          MCQ: video.question_stats?.MCQ ?? 0,
          Flashcards: video.question_stats?.Flashcards ?? 0,
          Match: video.question_stats?.Match ?? 0,
          FillBlanks: video.question_stats?.FillBlanks ?? 0,
        },
        questions: (video.questions ?? []).map((q: VideoQuestion) => ({
          ...q,
          question: q.question ?? "",
          correct_answer: q.correct_answer ?? "",
          explanation: q.explanation ?? "",
          difficulty: q.difficulty ?? "",
        })),
        flashcards: (video.flashcards ?? []).map((f: VideoFlashcard) => ({
          ...f,
          front: f.front ?? "",
          back: f.back ?? "",
        })),
      })),
    [videoData],
  )

  // Get all unique tags from videos
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    normalizedVideoData.forEach(video => {
      video.tags.forEach((tag: string) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [normalizedVideoData])

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [continueLearningVideos, setContinueLearningVideos] = useState<typeof normalizedVideoData>([])

  // Filter videos based on selected tags
  const filteredVideos = useMemo(() => {
    if (selectedTags.length === 0) return normalizedVideoData
    return normalizedVideoData.filter(video => 
      selectedTags.some(tag => (video.tags as string[]).includes(tag))
    )
  }, [normalizedVideoData, selectedTags])

  const featuredVideos = filteredVideos.slice(0, 6)

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      interface UserProgress {
        videoId: string;
        lastQuestionIndex: number;
        updatedAt: string;
      }
      const progress: UserProgress[] = JSON.parse(localStorage.getItem("userProgress") || "[]")
      const videos = progress
        .map((p: UserProgress) => normalizedVideoData.find((v) => v._id === p.videoId))
        .filter((v): v is typeof normalizedVideoData[number] => Boolean(v))
        .slice(0, 3)
      if (videos.length > 0) {
        setContinueLearningVideos(videos)
      } else {
        // fallback to completed videos if no progress
        setContinueLearningVideos(normalizedVideoData.filter((video) => video.status === "completed").slice(0, 3))
      }
    }
  }, [normalizedVideoData])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-blue-50 text-blue-600 border-blue-200 px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4 mr-2" />
            Interactive Learning Experience
          </Badge>
          <h1 className="font-bold text-5xl md:text-7xl text-gray-900 mb-6 tracking-tight leading-tight">
            Master Deep Learning
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block mt-2">
              with Intelligence
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Experience the future of education with interactive quizzes, smart flashcards, and personalized learning
            paths designed for deep learning mastery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/videos/${featuredVideos[0]?._id || ""}`} passHref legacyBehavior>
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <a>
                  Start Learning
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </Link>
            <Link href="/videos" passHref legacyBehavior>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 bg-transparent"
              >
                <a>
                  Browse Library
                </a>
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-2xl p-3">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{normalizedVideoData.length}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Video Lessons</h3>
            <p className="text-gray-600 text-sm">Interactive content library</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-2xl p-3">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {normalizedVideoData.reduce((sum, video) => sum + (video.question_stats?.MCQ || 0), 0)}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Quiz Questions</h3>
            <p className="text-gray-600 text-sm">Interactive assessments</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-2xl p-3">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {normalizedVideoData.reduce((sum, video) => sum + (video.question_stats?.Flashcards || 0), 0)}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Flashcards</h3>
            <p className="text-gray-600 text-sm">Memory reinforcement</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 rounded-2xl p-3">
                <Tag className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{allTags.length}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Topics</h3>
            <p className="text-gray-600 text-sm">Learning categories</p>
          </div>
        </div>

        {/* Tags Filter Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Filter className="w-6 h-6 text-gray-600" />
              <h2 className="font-bold text-2xl text-gray-900">Filter by Topics</h2>
            </div>
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                onClick={() => setSelectedTags([])}
                className="text-gray-600 hover:text-gray-800"
              >
                Clear All
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "secondary"}
                className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  selectedTags.includes(tag)
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => toggleTag(tag)}
              >
                <Tag className="w-3 h-3 mr-2" />
                {tag}
              </Badge>
            ))}
          </div>
          
          {selectedTags.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-blue-800 text-sm">
                <strong>Filtering by:</strong> {selectedTags.join(", ")} 
                <span className="ml-2 text-blue-600">({filteredVideos.length} videos found)</span>
              </p>
            </div>
          )}
        </section>

        {/* Featured Content */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-bold text-4xl text-gray-900 mb-3 tracking-tight">Featured Lessons</h2>
              <p className="text-gray-600 text-lg">Curated content to accelerate your learning journey</p>
            </div>
            <Button
              variant="ghost"
              className="hidden sm:flex text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full px-6"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVideos.map((video, idx) => {
              // Remove only the 4th box if it is empty/dummy
              if (
                idx === 3 &&
                (!video.details || !video.details.title || !video.details.thumbnail_url ||
                  ((Array.isArray(video.questions) && video.questions.filter(q => q && q.question).length === 0) &&
                   (Array.isArray(video.flashcards) && video.flashcards.filter(f => f && f.front && f.back && !f.error).length === 0))
                )
              ) {
                return null
              }
              return <VideoCard key={video._id} video={video} />
            })}
          </div>
        </section>

        {/* Continue Learning */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-bold text-4xl text-gray-900 mb-3 tracking-tight flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                Continue Learning
              </h2>
              <p className="text-gray-600 text-lg">Pick up where you left off</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {continueLearningVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
