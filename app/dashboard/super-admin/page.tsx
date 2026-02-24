"use client"

import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import Navbar from "@/components/Navbar"
import {
  getUsers,
  addUser,
  updateUserStatus,
  getPatients,
  getPrescriptions
} from "@/lib/storage"
import { User } from "@/lib/types"
import toast from "react-hot-toast"

export default function SuperAdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [prescriptions, setPrescriptions] = useState<any[]>([])

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("DOCTOR")

  const loadData = () => {
    setUsers(getUsers())
    setPatients(getPatients())
    setPrescriptions(getPrescriptions())
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAddUser = () => {
    if (!name || !email || !password) {
      toast.error("Fill all fields")
      return
    }

    addUser({
      id: crypto.randomUUID(),
      name,
      email,
      password,
      role: role as any,
      active: true,
      createdAt: new Date().toISOString()
    })

    toast.success("User added")
    setName("")
    setEmail("")
    setPassword("")
    loadData()
  }

  const toggleStatus = (id: string, current: boolean) => {
    updateUserStatus(id, !current)
    toast.success("User status updated")
    loadData()
  }

  return (
    <ProtectedRoute allowedRoles={["SUPER"]}>
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

          {/* Header */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Super Admin Dashboard
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage users, patients and prescriptions
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-800">
                {users.length}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total Patients</p>
              <p className="text-2xl font-semibold text-gray-800">
                {patients.length}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total Prescriptions</p>
              <p className="text-2xl font-semibold text-gray-800">
                {prescriptions.length}
              </p>
            </div>
          </div>

          {/* Add User Form */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Add Doctor / Nurse
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <input
                placeholder="Name"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                placeholder="Email"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="DOCTOR">Doctor</option>
                <option value="NURSE">Nurse</option>
              </select>

              <button
                onClick={handleAddUser}
                className="bg-gray-800 hover:bg-gray-900 text-white rounded-lg px-4 py-2 text-sm transition"
              >
                Add User
              </button>
            </div>
          </div>

          {/* Users List */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Users
            </h3>

            <div className="space-y-3">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-100 rounded-lg p-4"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {u.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {u.role} • {u.active ? "Active" : "Inactive"}
                    </p>
                  </div>

                  {u.role !== "SUPER" && (
                    <button
                      onClick={() =>
                        toggleStatus(u.id, u.active)
                      }
                      className="mt-3 sm:mt-0 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm transition"
                    >
                      Toggle Status
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  )
}