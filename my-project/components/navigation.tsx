"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, User, Menu, X } from "lucide-react"
import { useUser } from "@/lib/useUser"
import { usePathname } from "next/navigation"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const user = useUser();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-2.5 shadow-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="font-semibold text-xl text-gray-900 tracking-tight">LearnHub</span>
          </Link>

          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search courses, topics, or concepts..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-full text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center space-x-2">
                {user.avatar && (
                  <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                )}
                <span className="font-medium text-gray-800">{String(user.email ?? user.sub ?? "")}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 text-gray-700 border-gray-300 hover:bg-gray-100 rounded-full px-3 py-1"
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/sign-in";
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full px-4 py-2 transition-all duration-200"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden rounded-full p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search courses, topics..."
                  className="pl-10 bg-gray-50 border-0 rounded-full focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {user ? (
                <div className="flex items-center space-x-2 px-2">
                  {user.avatar && (
                    <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                  )}
                  <span className="font-medium text-gray-800">{String(user.email ?? user.sub ?? "")}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2 text-gray-700 border-gray-300 hover:bg-gray-100 rounded-full px-3 py-1"
                    onClick={() => {
                      localStorage.removeItem("token");
                      window.location.href = "/sign-in";
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/sign-in">
                  <Button variant="ghost" className="justify-start w-full rounded-full">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
