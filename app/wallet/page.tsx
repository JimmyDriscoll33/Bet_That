import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft, Plus, ArrowDownToLine, ArrowUpFromLine, Clock, Home } from "lucide-react"
import Link from "next/link"

export default function WalletPage() {
  return (
    <div className="max-w-lg mx-auto p-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <Link href="/profile">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-bold">Wallet</h1>
        <Link href="/dashboard">
          <Home className="h-6 w-6" />
        </Link>
      </div>

      <Tabs defaultValue="money" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="money">Money</TabsTrigger>
          <TabsTrigger value="betcoin">Bet-Coins</TabsTrigger>
        </TabsList>

        <TabsContent value="money">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white mb-6">
            <p className="text-sm opacity-80 mb-1">Available Balance</p>
            <h2 className="text-4xl font-bold mb-4">$151.00</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" className="rounded-full flex-1 flex items-center gap-1">
                <ArrowDownToLine className="h-4 w-4" />
                <span>Deposit</span>
              </Button>
              <Button size="sm" variant="secondary" className="rounded-full flex-1 flex items-center gap-1">
                <ArrowUpFromLine className="h-4 w-4" />
                <span>Withdraw</span>
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">Payment Methods</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs opacity-70">AMEX</p>
                        <p className="text-lg font-mono">•••• 4167</p>
                      </div>
                      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-3 flex justify-between items-center">
                    <p className="text-sm font-medium">American Express</p>
                    <p className="text-xs text-muted-foreground">Default</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <Plus className="h-5 w-5 mr-1" />
                    <span>Add Card</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3">Transaction History</h3>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="deposits">Deposits</TabsTrigger>
                <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <ArrowDownToLine className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Deposit</p>
                      <p className="text-xs text-muted-foreground">From AMEX •••• 4167</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">+$100.00</p>
                    <p className="text-xs text-muted-foreground">Apr 5, 2025</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Bet Settlement</p>
                      <p className="text-xs text-muted-foreground">Poker Night with Alex</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">+$75.00</p>
                    <p className="text-xs text-muted-foreground">Apr 2, 2025</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Bet Settlement</p>
                      <p className="text-xs text-muted-foreground">Golf Match with Jordan</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">-$50.00</p>
                    <p className="text-xs text-muted-foreground">Mar 28, 2025</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      <ArrowUpFromLine className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Withdrawal</p>
                      <p className="text-xs text-muted-foreground">To AMEX •••• 4167</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">-$200.00</p>
                    <p className="text-xs text-muted-foreground">Mar 20, 2025</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="deposits" className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <ArrowDownToLine className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Deposit</p>
                      <p className="text-xs text-muted-foreground">From AMEX •••• 4167</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">+$100.00</p>
                    <p className="text-xs text-muted-foreground">Apr 5, 2025</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <ArrowDownToLine className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Deposit</p>
                      <p className="text-xs text-muted-foreground">From AMEX •••• 4167</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">+$250.00</p>
                    <p className="text-xs text-muted-foreground">Mar 15, 2025</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="withdrawals" className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      <ArrowUpFromLine className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Withdrawal</p>
                      <p className="text-xs text-muted-foreground">To AMEX •••• 4167</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">-$200.00</p>
                    <p className="text-xs text-muted-foreground">Mar 20, 2025</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>

        <TabsContent value="betcoin">
          <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl p-6 text-white mb-6">
            <p className="text-sm opacity-80 mb-1">Available Bet-Coins</p>
            <div className="flex items-center">
              <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9.5L12 8L9 9.5V14.5L12 16L15 14.5V9.5Z" fill="white" />
              </svg>
              <h2 className="text-4xl font-bold">325</h2>
            </div>
            <p className="text-sm opacity-80 mt-2 mb-4">Use Bet-Coins for special bets and features</p>
            <Button size="sm" variant="secondary" className="rounded-full w-full">
              View Achievement Progress
            </Button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">Bet-Coin Usage</h3>
            <Card>
              <CardContent className="p-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="h-6 w-6 bg-yellow-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                      <svg className="h-4 w-4 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M15 9.5L12 8L9 9.5V14.5L12 16L15 14.5V9.5Z" fill="white" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Place Special Bets</p>
                      <p className="text-sm text-muted-foreground">
                        Use Bet-Coins to place bets with special rules and higher rewards
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 bg-yellow-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                      <svg className="h-4 w-4 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M15 9.5L12 8L9 9.5V14.5L12 16L15 14.5V9.5Z" fill="white" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Unlock Premium Features</p>
                      <p className="text-sm text-muted-foreground">
                        Access exclusive app features and customization options
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 bg-yellow-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                      <svg className="h-4 w-4 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M15 9.5L12 8L9 9.5V14.5L12 16L15 14.5V9.5Z" fill="white" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Enter Special Tournaments</p>
                      <p className="text-sm text-muted-foreground">
                        Join exclusive betting tournaments with Bet-Coin entry fees
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3">Transaction History</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M15 9.5L12 8L9 9.5V14.5L12 16L15 14.5V9.5Z" fill="white" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Achievement Reward</p>
                    <p className="text-xs text-muted-foreground">Big Spender</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+50</p>
                  <p className="text-xs text-muted-foreground">Apr 5, 2025</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M15 9.5L12 8L9 9.5V14.5L12 16L15 14.5V9.5Z" fill="white" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Achievement Reward</p>
                    <p className="text-xs text-muted-foreground">Winning Streak</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+100</p>
                  <p className="text-xs text-muted-foreground">Mar 28, 2025</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M15 9.5L12 8L9 9.5V14.5L12 16L15 14.5V9.5Z" fill="white" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Special Bet</p>
                    <p className="text-xs text-muted-foreground">March Madness Tournament</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">-75</p>
                  <p className="text-xs text-muted-foreground">Mar 15, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
