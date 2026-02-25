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
import { formatSmartDate } from "@/lib/utils/dateUtils"

export default function SuperAdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"users" | "patients" | "prescriptions">("users")
  const [sidebarOpen, setSidebarOpen] = useState(false) // mobile toggle

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

        <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Sidebar for large screens */}
          <div className="hidden md:flex md:flex-col w-64 bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4 flex-shrink-0">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Dashboard</h2>
            <button
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                activeTab === "users" ? "bg-gray-800 text-white" : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
            <button
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                activeTab === "patients" ? "bg-gray-800 text-white" : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("patients")}
            >
              Patients
            </button>
            <button
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                activeTab === "prescriptions" ? "bg-gray-800 text-white" : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("prescriptions")}
            >
              Prescriptions
            </button>
          </div>

          {/* Mobile sidebar toggle */}
          <div className="md:hidden mb-4 w-full flex justify-between items-center">
            <span className="font-semibold text-gray-800 text-lg">Dashboard</span>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              {sidebarOpen ? "Close" : "Menu"}
            </button>
          </div>

          {/* Mobile Sidebar */}
          {sidebarOpen && (
            <div className="md:hidden w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-4 space-y-4">
              <button
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  activeTab === "users" ? "bg-gray-800 text-white" : "hover:bg-gray-100"
                }`}
                onClick={() => { setActiveTab("users"); setSidebarOpen(false) }}
              >
                Users
              </button>
              <button
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  activeTab === "patients" ? "bg-gray-800 text-white" : "hover:bg-gray-100"
                }`}
                onClick={() => { setActiveTab("patients"); setSidebarOpen(false) }}
              >
                Patients
              </button>
              <button
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  activeTab === "prescriptions" ? "bg-gray-800 text-white" : "hover:bg-gray-100"
                }`}
                onClick={() => { setActiveTab("prescriptions"); setSidebarOpen(false) }}
              >
                Prescriptions
              </button>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 space-y-6">

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold text-gray-800">{users.length}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <p className="text-sm text-gray-500">Total Patients</p>
                <p className="text-2xl font-semibold text-gray-800">{patients.length}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <p className="text-sm text-gray-500">Total Prescriptions</p>
                <p className="text-2xl font-semibold text-gray-800">{prescriptions.length}</p>
              </div>
            </div>

            {/* Tab content */}
            {activeTab === "users" && (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Doctor / Nurse</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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

                <div className="space-y-3">
                  {users.map((u) => (
                    <div
                      key={u.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-100 rounded-lg p-4"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{u.name}</p>
                        <p className="text-sm text-gray-500">
                          {u.role} • {u.active ? "Active" : "Inactive"}
                        </p>
                      </div>
                      {u.role !== "SUPER" && (
                        <button
                          onClick={() => toggleStatus(u.id, u.active)}
                          className="mt-3 sm:mt-0 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm transition"
                        >
                          Toggle Status
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

{activeTab === "patients" && (
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-6">Patient List</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr className="text-left text-gray-600">
            <th className="px-4 py-3">S.No</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Age</th>
            <th className="px-4 py-3">Blood Group</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Doctor</th>
            <th className="px-4 py-3">Nurse</th>
            <th className="px-4 py-3">Created At</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {patients.map((p, index) => {
            const prescription = prescriptions.find(pr => pr.patientId === p.id)
            const doctor = prescription ? users.find(u => u.id === p.assignedDoctorId) : null
            const nurse = users.find(u => u.id === p.createdBy)

            return (
              <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-gray-800">{index + 1}</td>
                <td className="px-4 py-3 text-gray-800">{p.name}</td>
                <td className="px-4 py-3 text-gray-600">{p.age}</td>
                <td className="px-4 py-3 text-gray-600">{p.bloodGroup || "-"}</td>
                <td className="px-4 py-3 text-gray-600">{p.contact || "-"}</td>
                <td className="px-4 py-3 text-gray-600">{doctor?.name || "-"}</td>
                <td className="px-4 py-3 text-gray-600">{nurse?.name || "-"}</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatSmartDate(p.createdAt)}</td>
                <td className="px-4 py-3">
                  {prescription?.dispensed ? (
                    <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-700">Dispensed</span>
                  ) : (
                    <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-500">Pending</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  </div>
)}

            {activeTab === "prescriptions" && (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Prescriptions</h3>
                {prescriptions.length === 0 ? (
                  <p className="text-gray-500">No prescriptions found</p>
                ) : (
                  <div className="space-y-3">
                    {prescriptions.map((p) => (
                      <div
                        key={p.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-100 rounded-lg p-4"
                      >
                        <div>
                          <p className="font-medium text-gray-800">Patient ID: {p.patientId}</p>
                          <p className="text-sm text-gray-500">
                            Diagnosis: {p.diagnosis} • Medicines: {p.medicines.split("\n").join(", ")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}