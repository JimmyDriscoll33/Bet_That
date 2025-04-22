import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, QrCode } from "lucide-react"
import Link from "next/link"

export default function SocialPage() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div className="flex-1 mx-2">
          <Input placeholder="Username or Group Name" className="rounded-full bg-secondary border-0 text-center" />
        </div>
        <QrCode className="h-6 w-6" />
      </div>

      <h2 className="text-xl font-bold mb-4">Friends</h2>

      <div className="space-y-4 mb-8">
        <div className="flex items-center">
          <Avatar className="h-12 w-12 bg-secondary mr-3">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">User Name</p>
            <p className="text-sm text-gray-500">@username123</p>
          </div>
        </div>

        <div className="flex items-center">
          <Avatar className="h-12 w-12 bg-secondary mr-3">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">User Name</p>
            <p className="text-sm text-gray-500">@username123</p>
          </div>
        </div>

        <div className="flex items-center">
          <Avatar className="h-12 w-12 bg-secondary mr-3">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">User Name</p>
            <p className="text-sm text-gray-500">@username123</p>
          </div>
        </div>

        <div className="flex items-center">
          <Avatar className="h-12 w-12 bg-secondary mr-3">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">User Name</p>
            <p className="text-sm text-gray-500">@username123</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Groups</h2>

      <div className="space-y-4">
        <div className="flex items-center">
          <Avatar className="h-12 w-12 bg-secondary mr-3">
            <AvatarFallback>G</AvatarFallback>
          </Avatar>
          <p className="font-medium">Group Name</p>
        </div>

        <div className="flex items-center">
          <Avatar className="h-12 w-12 bg-secondary mr-3">
            <AvatarFallback>G</AvatarFallback>
          </Avatar>
          <p className="font-medium">Group Name</p>
        </div>
      </div>
    </div>
  )
}
