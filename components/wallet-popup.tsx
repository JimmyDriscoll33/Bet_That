"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wallet } from "lucide-react"
import Link from "next/link"

export function WalletPopup() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          <span>Wallet</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Wallet</DialogTitle>
          <DialogDescription>This feature is not available yet. Check back soon!</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-6">
          <div className="rounded-full bg-muted p-6">
            <Wallet className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button asChild>
            <Link href="/wallet">View Wallet</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
