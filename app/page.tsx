"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/lib/auth"
import { initializeMockUsers } from "@/lib/mockUsers"
import { getUsers } from "@/lib/storage"
import { User } from "@/lib/types"
import toast from "react-hot-toast"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    initializeMockUsers()
    const storedUsers = getUsers()
    setUsers(storedUsers)
  }, [])

  const handleLogin = () => {
    const result = login(email, password)

    if (!result.success) {
      toast.error(result.message)
      return
    }

    toast.success(result.message)

    if (result.user?.role === "SUPER")
      router.push("/dashboard/super-admin")

    if (result.user?.role === "DOCTOR")
      router.push("/dashboard/doctor")

    if (result.user?.role === "NURSE")
      router.push("/dashboard/nurse")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
        
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Clinic Login
        </h1>

        {/* Email */}
        <input
          className="w-full border border-gray-300 placeholder:text-gray-400 text-gray-600 focus:border-gray-800 focus:ring-1 focus:ring-gray-800 outline-none p-3 mb-4 rounded-lg transition"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          className="w-full border border-gray-300 placeholder:text-gray-400 text-gray-600 focus:border-gray-800 focus:ring-1 focus:ring-gray-800 outline-none p-3 mb-6 rounded-lg transition"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2.5 rounded-lg transition text-sm font-medium"
        >
          Login
        </button>

        {/* Mock Users Section */}
        <div className="mt-8 border-t border-gray-200 pt-4">
          <h3 className="font-medium text-gray-700 mb-3 text-sm">
            Mock Login Users
          </h3>

          <div className="space-y-3 max-h-52 overflow-y-auto pr-1 text-sm">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <p className="text-gray-700">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="text-gray-700">
                  <strong>Password:</strong> {user.password}
                </p>
                <p>
                  <strong className="text-gray-400">Status:</strong>{" "}
                  {user.active ? (
                    <span className="text-green-600 font-medium">
                      Active
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      Inactive
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}