"use client"

import { useState, useEffect } from "react"
import { addPatient, getUsers } from "@/lib/storage"
import { getCurrentUser } from "@/lib/auth"
import { User } from "@/lib/types"
import toast from "react-hot-toast"

interface PatientFormProps {
  onSuccess?: () => void
}

export default function PatientForm({ onSuccess }: PatientFormProps) {

  const [form, setForm] = useState({
    name: "",
    age: "",
    place: "",
    bloodGroup: "",
    phone: "",
    email: "",
    assignedDoctorId: ""
  })

  const [doctors, setDoctors] = useState<User[]>([])

  // ✅ Load active doctors & select first automatically
  useEffect(() => {
    const allUsers = getUsers()
    const doctorList = allUsers.filter(
      (u) => u.role === "DOCTOR" && u.active
    )

    setDoctors(doctorList)

    if (doctorList.length > 0) {
      setForm((prev) => ({
        ...prev,
        assignedDoctorId: doctorList[0].id
      }))
    }
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    const user = getCurrentUser()

    if (!form.name || !form.age || !form.phone || !form.assignedDoctorId) {
      toast.error("Please fill required fields")
      return
    }

    if (!user) {
      toast.error("User not found")
      return
    }

    addPatient({
      id: crypto.randomUUID(),
      name: form.name,
      age: Number(form.age),
      place: form.place,
      bloodGroup: form.bloodGroup,
      phone: form.phone,
      email: form.email || undefined,
      createdBy: user.id, // ✅ nurse id saved
      assignedDoctorId: form.assignedDoctorId, // ✅ correct doctor id
      createdAt: new Date().toISOString()
    })

    toast.success("Patient added successfully")

    // Reset form but keep first doctor selected
    setForm({
      name: "",
      age: "",
      place: "",
      bloodGroup: "",
      phone: "",
      email: "",
      assignedDoctorId: doctors.length > 0 ? doctors[0].id : ""
    })
    onSuccess?.()
  }

  return (
    <div className="bg-white p-6 shadow rounded w-full max-w-lg text-gray-700">
      <h2 className="text-lg font-semibold mb-4">
        Register Patient
      </h2>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        className="w-full border p-2 mb-3 rounded"
      />

      <input
        type="number"
        name="age"
        value={form.age}
        onChange={handleChange}
        placeholder="Age"
        className="w-full border p-2 mb-3 rounded"
      />

      <input
        name="place"
        value={form.place}
        onChange={handleChange}
        placeholder="Place"
        className="w-full border p-2 mb-3 rounded"
      />

      <input
        name="bloodGroup"
        value={form.bloodGroup}
        onChange={handleChange}
        placeholder="Blood Group"
        className="w-full border p-2 mb-3 rounded"
      />

      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="w-full border p-2 mb-3 rounded"
      />

      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full border p-2 mb-3 rounded"
      />

      {/* ✅ Doctor Dropdown */}
      <select
        name="assignedDoctorId"
        value={form.assignedDoctorId}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
      >
        {doctors.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>
            {doctor.name}
          </option>
        ))}
      </select>

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Save Patient
      </button>
    </div>
  )
}
