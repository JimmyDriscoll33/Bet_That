import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"

interface GroupCardProps {
  name: string
  members: number
  activeBets: number
  lastMessage: string
  image?: string
}

export function GroupCard({ name, members, activeBets, lastMessage, image }: GroupCardProps) {
  return (
    <Link href={`/groups/${name.toLowerCase().replace(/\s+/g, "-")}`} className="block">
      <div className="flex items-center p-3 rounded-xl border hover:border-primary transition-colors">
        <Avatar className="h-12 w-12 mr-3">
          <AvatarFallback className="bg-primary text-primary-foreground">{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-bold truncate">{name}</h3>
            <span className="text-xs text-muted-foreground ml-2">2m ago</span>
          </div>
          <p className="text-sm text-muted-foreground truncate">{lastMessage}</p>
          <div className="flex items-center mt-1">
            <span className="text-xs bg-secondary px-1.5 py-0.5 rounded-full">{members} members</span>
            {activeBets > 0 && (
              <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full ml-2">
                {activeBets} active bets
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
