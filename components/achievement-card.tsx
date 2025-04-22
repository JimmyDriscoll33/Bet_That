import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, Coins } from "lucide-react"
import * as Icons from "lucide-react"

interface AchievementCardProps {
  achievement: {
    id: string
    name: string
    description: string | null
    icon: string | null
    color: string | null
    category: string
    max_tier: number
    tier_thresholds: number[]
    tier_rewards: number[]
    user_progress: number
    current_tier: number
    completed: boolean
    progress_percentage: number
    next_threshold: number | null
    next_reward: number | null
  }
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  // Safely get the icon component
  const getIconComponent = (iconName: string | null) => {
    if (!iconName) return Award

    // Convert kebab-case to PascalCase if needed
    const formattedName = iconName
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")

    // @ts-ignore - Icons has dynamic keys
    return Icons[formattedName] || Award
  }

  const IconComponent = getIconComponent(achievement.icon)

  // Get color class based on achievement color
  const getColorClass = (color: string | null) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 text-blue-800 border-blue-300",
      green: "bg-green-100 text-green-800 border-green-300",
      red: "bg-red-100 text-red-800 border-red-300",
      yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
      purple: "bg-purple-100 text-purple-800 border-purple-300",
      pink: "bg-pink-100 text-pink-800 border-pink-300",
      indigo: "bg-indigo-100 text-indigo-800 border-indigo-300",
      cyan: "bg-cyan-100 text-cyan-800 border-cyan-300",
      amber: "bg-amber-100 text-amber-800 border-amber-300",
      emerald: "bg-emerald-100 text-emerald-800 border-emerald-300",
      violet: "bg-violet-100 text-violet-800 border-violet-300",
      slate: "bg-slate-100 text-slate-800 border-slate-300",
      orange: "bg-orange-100 text-orange-800 border-orange-300",
      gold: "bg-yellow-100 text-yellow-800 border-yellow-300",
    }

    return color && colorMap[color] ? colorMap[color] : "bg-gray-100 text-gray-800 border-gray-300"
  }

  // Get icon color class
  const getIconColorClass = (color: string | null) => {
    const colorMap: Record<string, string> = {
      blue: "text-blue-600",
      green: "text-green-600",
      red: "text-red-600",
      yellow: "text-yellow-600",
      purple: "text-purple-600",
      pink: "text-pink-600",
      indigo: "text-indigo-600",
      cyan: "text-cyan-600",
      amber: "text-amber-600",
      emerald: "text-emerald-600",
      violet: "text-violet-600",
      slate: "text-slate-600",
      orange: "text-orange-600",
      gold: "text-yellow-500",
    }

    return color && colorMap[color] ? colorMap[color] : "text-gray-600"
  }

  // Get progress bar color class
  const getProgressColorClass = (color: string | null) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-600",
      green: "bg-green-600",
      red: "bg-red-600",
      yellow: "bg-yellow-600",
      purple: "bg-purple-600",
      pink: "bg-pink-600",
      indigo: "bg-indigo-600",
      cyan: "bg-cyan-600",
      amber: "bg-amber-600",
      emerald: "bg-emerald-600",
      violet: "bg-violet-600",
      slate: "bg-slate-600",
      orange: "bg-orange-600",
      gold: "bg-yellow-500",
    }

    return color && colorMap[color] ? colorMap[color] : "bg-gray-600"
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${getColorClass(achievement.color)}`}>
              <IconComponent className={`h-5 w-5 ${getIconColorClass(achievement.color)}`} />
            </div>
            <div>
              <CardTitle className="text-base">{achievement.name}</CardTitle>
              <CardDescription className="text-xs">{achievement.description}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            Tier {achievement.current_tier}/{achievement.max_tier}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {achievement.user_progress} / {achievement.next_threshold || "Max"}
            </span>
            <span>{achievement.progress_percentage}%</span>
          </div>
          <Progress
            value={achievement.progress_percentage}
            className={`h-2 ${getProgressColorClass(achievement.color)}`}
          />
        </div>
      </CardContent>
      <CardFooter className="pt-1">
        {achievement.next_reward ? (
          <div className="w-full flex justify-between items-center text-xs text-muted-foreground">
            <span>Next reward:</span>
            <div className="flex items-center">
              <Coins className="h-3 w-3 mr-1 text-yellow-500" />
              <span>{achievement.next_reward} Bet Coins</span>
            </div>
          </div>
        ) : (
          <div className="w-full text-center text-xs text-muted-foreground">
            {achievement.completed ? "Achievement Completed!" : "Max tier reached!"}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
