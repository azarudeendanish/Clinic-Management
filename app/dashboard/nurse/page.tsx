"use client"

import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import Navbar from "@/components/Navbar"
import PatientForm from "@/components/PatientForm"
import {
  getPrescriptions,
  markAsDispensed
} from "@/lib/storage"
import { getCurrentUser } from "@/lib/auth"
import { Prescription } from "@/lib/types"
import toast from "react-hot-toast"
import NursePatientTable from "@/components/NursePatientTable"

export default function NurseDashboard() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [showForm, setShowForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const loadPrescriptions = () => {
    setPrescriptions(getPrescriptions())
  }

  useEffect(() => {
    loadPrescriptions()
  }, [])
  const handlePatientAdded = () => {
    setShowForm(false)
    setRefreshKey((prev) => prev + 1) // ✅ trigger refresh
  }
  const handleDispense = (id: string) => {
    const user = getCurrentUser()
    markAsDispensed(id, user!.id)
    toast.success("Medicine dispensed")
    loadPrescriptions()
  }

  return (
    <ProtectedRoute allowedRoles={["NURSE"]}>
      <Navbar />

      <div className="p-6 space-y-6">

        {/* ✅ Add New Patient Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Nurse Dashboard
          </h2>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {showForm ? "Close Form" : "Add New Patient"}
          </button>
        </div>

        {/* ✅ Show Patient Form Conditionally */}
        {showForm && (
          <PatientForm
            onSuccess={handlePatientAdded} // auto close after save
          />
        )}

        {/* ✅ Patient Table */}
        <NursePatientTable refreshKey={refreshKey} />

      </div>
    </ProtectedRoute>
  )
}
