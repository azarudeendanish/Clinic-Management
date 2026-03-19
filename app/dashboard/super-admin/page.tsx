// app\dashboard\super-admin\page.tsx

"use client"

import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import Navbar from "@/components/Navbar"
import {
  getUsers,
  addUser,
  updateUserStatus,
  getPatients,
  getPrescriptions,
  updatePatient
} from "@/lib/storage"

import { User } from "@/lib/types"
import toast from "react-hot-toast"
import { formatSmartDate } from "@/lib/utils/dateUtils"

export default function SuperAdminDashboard() {

  const [users, setUsers] = useState<User[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"users" | "patients" | "prescriptions">("users")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("DOCTOR")

  const [editingPatient, setEditingPatient] = useState<any | null>(null)

  const [editName, setEditName] = useState("")
  const [editAge, setEditAge] = useState("")
  const [editBloodGroup, setEditBloodGroup] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editDoctorId, setEditDoctorId] = useState("")

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

  const handleEditPatient = (p: any) => {

    setEditingPatient(p)

    setEditName(p.name)
    setEditAge(p.age)
    setEditBloodGroup(p.bloodGroup || "")
    setEditPhone(p.phone || "")
    setEditDoctorId(p.assignedDoctorId)
  }

  const handleUpdatePatient = () => {

    if (!editingPatient) return

    const updatedPatient = {
      ...editingPatient,
      name: editName,
      age: editAge,
      bloodGroup: editBloodGroup,
      phone: editPhone,
      assignedDoctorId: editDoctorId
    }

    updatePatient(updatedPatient)

    toast.success("Patient updated")

    setEditingPatient(null)

    loadData()
  }

  return (
    <ProtectedRoute allowedRoles={["SUPER"]}>

      <div className="min-h-screen bg-gray-100">

        <Navbar />

        <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Sidebar */}
          <div className="hidden md:flex md:flex-col w-64 bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4 flex-shrink-0">

            <h2 className="text-xl font-semibold text-gray-800 mb-4">Dashboard</h2>

            <button
              className={`w-full text-left px-4 py-2 rounded-lg ${
                activeTab === "users" ? "bg-gray-800 text-white" : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>

            <button
              className={`w-full text-left px-4 py-2 rounded-lg ${
                activeTab === "patients" ? "bg-gray-800 text-white" : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("patients")}
            >
              Patients
            </button>

            <button
              className={`w-full text-left px-4 py-2 rounded-lg ${
                activeTab === "prescriptions" ? "bg-gray-800 text-white" : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("prescriptions")}
            >
              Prescriptions
            </button>

          </div>

          {/* Main */}
          <div className="flex-1 space-y-6">

            {/* Stats */}
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

            {/* USERS TAB */}
            {activeTab === "users" && (

              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

                <h3 className="text-lg font-semibold mb-4">
                  Add Doctor / Nurse
                </h3>

                <div className="grid grid-cols-5 gap-4 mb-6">

                  <input
                    placeholder="Name"
                    className="border rounded-lg px-3 py-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <input
                    placeholder="Email"
                    className="border rounded-lg px-3 py-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    className="border rounded-lg px-3 py-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <select
                    className="border rounded-lg px-3 py-2"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="DOCTOR">Doctor</option>
                    <option value="NURSE">Nurse</option>
                  </select>

                  <button
                    onClick={handleAddUser}
                    className="bg-gray-800 text-white rounded-lg px-4 py-2"
                  >
                    Add User
                  </button>

                </div>

                {users.map((u) => (

                  <div
                    key={u.id}
                    className="flex justify-between border p-4 rounded-lg mb-3"
                  >

                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-sm text-gray-500">
                        {u.role} • {u.active ? "Active" : "Inactive"}
                      </p>
                    </div>

                    {u.role !== "SUPER" && (

                      <button
                        onClick={() => toggleStatus(u.id, u.active)}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg"
                      >
                        Toggle Status
                      </button>

                    )}

                  </div>

                ))}

              </div>

            )}

            {/* PATIENT TAB */}
            {activeTab === "patients" && (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Patient List
                </h2>

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
                        <th className="px-4 py-3">Patient Created At</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {patients.map((p, index) => {

                        const prescription = prescriptions.find(
                          (pr) => pr.patientId === p.id
                        )

                        const doctor = users.find(
                          (u) => u.id === p.assignedDoctorId
                        )

                        const nurse = users.find(
                          (u) => u.id === p.createdBy
                        )

                        return (
                          <tr
                            key={p.id}
                            className="hover:bg-gray-50 transition"
                          >

                            <td className="px-4 py-3 text-gray-800">
                              {index + 1}
                            </td>

                            <td className="px-4 py-3 text-gray-800">
                              {p.name}
                            </td>

                            <td className="px-4 py-3 text-gray-600">
                              {p.age}
                            </td>

                            <td className="px-4 py-3 text-gray-600">
                              {p.bloodGroup || "-"}
                            </td>

                            <td className="px-4 py-3 text-gray-600">
                              {p.phone || "-"}
                            </td>

                            <td className="px-4 py-3 text-gray-600">
                              {doctor?.name || "-"}
                            </td>

                            <td className="px-4 py-3 text-gray-600">
                              {nurse?.name || "-"}
                            </td>

                            <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                              {formatSmartDate(p.createdAt)}
                            </td>

                            <td className="px-4 py-3">
                              {prescription?.dispensed ? (
                                <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
                                  Dispensed
                                </span>
                              ) : (
                                <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-500">
                                  Pending
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-3 text-center">

                              <button
                                onClick={() => handleEditPatient(p)}
                                className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded-md text-xs transition"
                              >
                                Edit
                              </button>

                            </td>

                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PRESCRIPTION TAB */}
            {activeTab === "prescriptions" && (

              <div className="bg-white border rounded-xl shadow-sm p-6">

                <h3 className="text-lg font-semibold mb-4">
                  Prescriptions
                </h3>

                {prescriptions.map((p) => (

                  <div
                    key={p.id}
                    className="border rounded-lg p-4 mb-3"
                  >

                    <p>Patient ID: {p.patientId}</p>

                    <p>
                      Diagnosis: {p.diagnosis}
                    </p>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

        {/* EDIT MODAL */}

        {editingPatient && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">

              <h3 className="text-lg font-semibold mb-4">
                Edit Patient
              </h3>

              <div className="space-y-3">

                <input
                  className="w-full border px-3 py-2 rounded"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />

                <input
                  className="w-full border px-3 py-2 rounded"
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value)}
                />

                <input
                  className="w-full border px-3 py-2 rounded"
                  value={editBloodGroup}
                  onChange={(e) => setEditBloodGroup(e.target.value)}
                />

                <input
                  className="w-full border px-3 py-2 rounded"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />

                <select
                  className="w-full border px-3 py-2 rounded"
                  value={editDoctorId}
                  onChange={(e) => setEditDoctorId(e.target.value)}
                >

                  {users
                    .filter(u => u.role === "DOCTOR")
                    .map(doc => (

                      <option key={doc.id} value={doc.id}>
                        {doc.name}
                      </option>

                    ))}

                </select>

              </div>

              <div className="flex justify-end gap-3 mt-6">

                <button
                  onClick={() => setEditingPatient(null)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdatePatient}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg"
                >
                  Update
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </ProtectedRoute>
  )
}