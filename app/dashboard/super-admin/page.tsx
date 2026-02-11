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
      <Navbar />

      <div className="p-6 space-y-6">

        {/* Add User */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Add Doctor/Nurse</h2>

          <input
            placeholder="Name"
            className="border p-2 mr-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Email"
            className="border p-2 mr-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            className="border p-2 mr-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            className="border p-2 mr-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="DOCTOR">Doctor</option>
            <option value="NURSE">Nurse</option>
          </select>

          <button
            onClick={handleAddUser}
            className="bg-blue-600 text-white px-3 py-2 rounded"
          >
            Add
          </button>
        </div>

        {/* Users List */}
        <div>
          <h2 className="font-semibold mb-2">Users</h2>

          {users.map((u) => (
            <div key={u.id} className="border p-2 mb-2 rounded">
              {u.name} - {u.role} -{" "}
              {u.active ? "Active" : "Inactive"}

              {u.role !== "SUPER" && (
                <button
                  onClick={() =>
                    toggleStatus(u.id, u.active)
                  }
                  className="ml-3 bg-gray-600 text-white px-2 py-1 rounded text-sm"
                >
                  Toggle
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Data Overview */}
        <div>
          <h2 className="font-semibold mb-2">All Patients</h2>
          <p>Total: {patients.length}</p>

          <h2 className="font-semibold mt-4 mb-2">
            All Prescriptions
          </h2>
          <p>Total: {prescriptions.length}</p>
        </div>

      </div>
    </ProtectedRoute>
  )
}
