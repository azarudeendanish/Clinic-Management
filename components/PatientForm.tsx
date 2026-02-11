"use client"

import { useState } from "react"
import { addPatient } from "@/lib/storage"
import { getCurrentUser } from "@/lib/auth"
import toast from "react-hot-toast"

export default function PatientForm() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    place: "",
    bloodGroup: "",
    phone: "",
    email: ""
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    const user = getCurrentUser()

    if (!form.name || !form.age || !form.phone) {
      toast.error("Please fill required fields")
      return
    }

    addPatient({
      id: crypto.randomUUID(),
      name: form.name,
      age: Number(form.age),
      place: form.place,
      bloodGroup: form.bloodGroup,
      phone: form.phone,
      email: form.email,
      createdBy: user!.id,
      createdAt: new Date().toISOString()
    })

    toast.success("Patient added successfully")

    setForm({
      name: "",
      age: "",
      place: "",
      bloodGroup: "",
      phone: "",
      email: ""
    })
  }

  return (
    <div className="bg-white p-6 shadow rounded w-full max-w-lg text-gray-700">
      <h2 className="text-lg font-semibold mb-4">
        Register Patient
      </h2>

      {[
        { name: "name", placeholder: "Name" },
        { name: "age", placeholder: "Age" },
        { name: "place", placeholder: "Place" },
        { name: "bloodGroup", placeholder: "Blood Group" },
        { name: "phone", placeholder: "Phone Number" },
        { name: "email", placeholder: "Email" }
      ].map((field) => (
        <input
          key={field.name}
          name={field.name}
          value={(form as any)[field.name]}
          onChange={handleChange}
          placeholder={field.placeholder}
          className="w-full border p-2 mb-3 rounded"
        />
      ))}

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Save Patient
      </button>
    </div>
  )
}
