import { SeedData } from "@/components/seed-data"
import { SeedAchievements } from "@/components/seed-achievements"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SeedPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Database Seeding</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Seed Sample Data with Images</CardTitle>
            <CardDescription>Add sample users, bets, and evidence with images to the database.</CardDescription>
          </CardHeader>
          <CardContent>
            <SeedData />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Seed Achievements</CardTitle>
            <CardDescription>Add achievement definitions to the database.</CardDescription>
          </CardHeader>
          <CardContent>
            <SeedAchievements />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
