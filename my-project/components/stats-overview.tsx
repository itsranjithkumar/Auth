import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, BookOpen, Brain, Trophy } from "lucide-react"

interface StatsOverviewProps {
  data: any[]
}

export function StatsOverview({ data }: StatsOverviewProps) {
  const totalVideos = data.length
  const totalQuestions = data.reduce((sum, video) => sum + (video.question_stats?.MCQ || 0), 0)
  const totalFlashcards = data.reduce((sum, video) => sum + (video.question_stats?.Flashcards || 0), 0)
  const completedVideos = data.filter((video) => video.status === "completed").length

  const stats = [
    {
      title: "Total Videos",
      value: totalVideos,
      icon: Play,
      color: "text-blue-600",
    },
    {
      title: "Questions",
      value: totalQuestions,
      icon: BookOpen,
      color: "text-green-600",
    },
    {
      title: "Flashcards",
      value: totalFlashcards,
      icon: Brain,
      color: "text-purple-600",
    },
    {
      title: "Completed",
      value: completedVideos,
      icon: Trophy,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
