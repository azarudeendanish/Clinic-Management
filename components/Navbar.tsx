"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, logout } from "@/lib/auth"
import { User } from "@/lib/types"
import toast from "react-hot-toast"

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
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
    <div className="flex justify-between items-center bg-blue-600 text-white px-6 py-3">
      <h1 className="font-bold text-lg">Clinic Management</h1>

      <div className="flex items-center gap-4">
        <div className="text-sm">
          <p>{user.name}</p>
          <p className="text-xs opacity-80">{user.role}</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
