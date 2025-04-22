import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchIcon, FilterIcon } from "lucide-react"

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Wager History</h1>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Wagers</SelectItem>
              <SelectItem value="won">Won</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <FilterIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search wagers..." className="pl-9" />
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-500 hover:bg-green-600">Won</Badge>
                  <span className="text-sm text-muted-foreground">Completed 1 week ago</span>
                </div>
                <h3 className="font-semibold text-lg">Super Bowl prediction</h3>
                <p className="text-muted-foreground mt-1">Chiefs will win the Super Bowl</p>
                <div className="flex items-center gap-2 mt-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>MJ</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">You vs. Mike Johnson</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-green-500">+$50.00</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-red-500 hover:bg-red-600">Lost</Badge>
                  <span className="text-sm text-muted-foreground">Completed 2 weeks ago</span>
                </div>
                <h3 className="font-semibold text-lg">Golf match</h3>
                <p className="text-muted-foreground mt-1">I'll score under 90 on the round</p>
                <div className="flex items-center gap-2 mt-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>AT</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">You vs. Alex Thompson</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-red-500">-$25.00</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-500 hover:bg-green-600">Won</Badge>
                  <span className="text-sm text-muted-foreground">Completed 1 month ago</span>
                </div>
                <h3 className="font-semibold text-lg">Weight loss challenge</h3>
                <p className="text-muted-foreground mt-1">Lose 10 pounds in 30 days</p>
                <div className="flex items-center gap-2 mt-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>SW</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">You vs. Sarah Williams</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-green-500">+$100.00</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-red-500 hover:bg-red-600">Lost</Badge>
                  <span className="text-sm text-muted-foreground">Completed 2 months ago</span>
                </div>
                <h3 className="font-semibold text-lg">NBA Finals Game 7</h3>
                <p className="text-muted-foreground mt-1">Celtics will win by at least 10 points</p>
                <div className="flex items-center gap-2 mt-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>MJ</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">You vs. Mike Johnson</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-red-500">-$30.00</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-4">
        <Button variant="outline">Load more</Button>
      </div>
    </div>
  )
}
