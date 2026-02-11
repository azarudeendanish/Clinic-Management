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

    // Load users from localStorage
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
  
  console.log('users', users);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 shadow rounded w-96">
        <h1 className="text-xl font-bold text-gray-900 mb-4 text-center">
          Clinic Login
        </h1>

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 mb-3 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Login
        </button>

        {/* 🔽 Dynamic Mock User List */}
        <div className="mt-6 text-xs text-gray-600 border-t pt-3">
          <h3 className="font-semibold mb-2">Mock Login Users:</h3>

          {users.map((user) => (
            <div
              key={user.id}
              className="mb-2 p-2 bg-gray-50 rounded border"
            >
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Password:</strong> {user.password}</p>
              <p>
                <strong>Status:</strong>{" "}
                {user.active ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-red-600">Inactive</span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
