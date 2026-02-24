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
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Register Patient
      </h2>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  
        {/* Name */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Full Name *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter patient name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
  
        {/* Age */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Age *
          </label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="Enter age"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
  
        {/* Place */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Place
          </label>
          <input
            name="place"
            value={form.place}
            onChange={handleChange}
            placeholder="Enter place"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
  
        {/* Blood Group */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Blood Group
          </label>
          <input
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
            placeholder="e.g. O+"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
  
        {/* Phone */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Phone *
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
  
        {/* Email */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
  
        {/* Doctor Dropdown */}
        <div className="sm:col-span-2">
          <label className="block text-xs text-gray-600 mb-1">
            Assign Doctor *
          </label>
          <select
            name="assignedDoctorId"
            value={form.assignedDoctorId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>
  
      </div>
  
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2.5 rounded-lg text-sm transition"
        >
          Save Patient
        </button>
      </div>
    </div>
  )
}
