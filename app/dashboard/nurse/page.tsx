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
    setRefreshKey((prev) => prev + 1)
  }

  const handleDispense = (id: string) => {
    const user = getCurrentUser()
    markAsDispensed(id, user!.id)
    toast.success("Medicine dispensed")
    loadPrescriptions()
  }

  return (
    <ProtectedRoute allowedRoles={["NURSE"]}>
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

          {/* Header Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Nurse Dashboard
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage patients and prescriptions
              </p>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full sm:w-auto bg-gray-800 hover:bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm transition"
            >
              {showForm ? "Close Form" : "Add New Patient"}
            </button>
          </div>

          {/* Patient Form */}
          {showForm && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <PatientForm onSuccess={handlePatientAdded} />
            </div>
          )}

          {/* Table Section */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 overflow-x-auto">
            <NursePatientTable refreshKey={refreshKey} />
          </div>

        </div>
      </div>
    </ProtectedRoute>
  )
}