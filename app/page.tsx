"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/lib/auth"
import { initializeMockUsers } from "@/lib/mockUsers"
import toast from "react-hot-toast"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    initializeMockUsers()
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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 shadow rounded w-96">
        <h1 className="text-xl font-bold text-gray-900 mb-4 text-center">
          Clinic Login
        </h1>

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 mb-3 rounded"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Login
        </button>

        <div className="mt-4 text-xs text-gray-500">
          <p>Super: admin@clinic.com / admin123</p>
          <p>Doctor: doctor@clinic.com / doctor123</p>
          <p>Nurse: nurse@clinic.com / nurse123</p>
        </div>
      </div>
    </div>
  )
}
