"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, HandshakeIcon, UserCircle, PlusCircle } from "lucide-react"

export function NavigationBar() {
  const pathname = usePathname()

  // Skip rendering navigation on login, signup, and root pages
  if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
    return null
  }

  const navItems = [
    {
      icon: Home,
      label: "Home",
      href: "/dashboard",
    },
    {
      icon: HandshakeIcon,
      label: "My Bets",
      href: "/dashboard/my-bets",
    },
    {
      icon: PlusCircle,
      label: "Create",
      href: "/dashboard/create-bet",
    },
    {
      icon: Users,
      label: "Groups",
      href: "/groups",
    },
    {
      icon: UserCircle,
      label: "Profile",
      href: "/profile",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-background border-t">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive =
            (item.href === "/dashboard" && pathname === "/dashboard") ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href))

          return (
            <Link key={item.href} href={item.href} className={`nav-icon ${isActive ? "active" : ""}`}>
              <item.icon className="h-5 w-5 mb-1" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
