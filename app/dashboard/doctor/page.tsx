"use client"

import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import Navbar from "@/components/Navbar"
import { getPatients } from "@/lib/storage"
import { Patient } from "@/lib/types"
import PrescriptionForm from "@/components/PrescriptionForm"

export default function DoctorDashboard() {
  const [patients, setPatients] = useState<Patient[]>([])

  const loadPatients = () => {
    setPatients(getPatients())
  }

  useEffect(() => {
    loadPatients()

    const interval = setInterval(() => {
      loadPatients()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <ProtectedRoute allowedRoles={["DOCTOR"]}>
      <Navbar />

      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">
          Patients
        </h2>

        {patients.length === 0 && (
          <p>No patients registered</p>
        )}

        {patients.map((patient) => (
          <div
            key={patient.id}
            className="border p-4 mb-4 rounded bg-white text-gray-700"
          >
            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>Age:</strong> {patient.age}</p>
            <p><strong>Blood Group:</strong> {patient.bloodGroup}</p>

            <PrescriptionForm patient={patient} />
          </div>
        ))}
      </div>
    </ProtectedRoute>
  )
}
