"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, logout } from "@/lib/auth"
import { User } from "@/lib/types"
import toast from "react-hot-toast"

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
    router.push("/")
  }

  if (!user) return null

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <h1 className="font-semibold text-lg text-gray-800">
            Clinic Management
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <div className="text-sm text-gray-600 text-right">
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3">
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}