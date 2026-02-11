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

export default function NurseDashboard() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])

  const loadPrescriptions = () => {
    setPrescriptions(getPrescriptions())
  }

  useEffect(() => {
    loadPrescriptions()
  }, [])

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
        <PatientForm />

        <div>
          <h2 className="text-lg font-semibold mb-2">
            Prescriptions
          </h2>

          {prescriptions.map((p) => (
            <div
              key={p.id}
              className="border p-3 mb-2 rounded bg-white"
            >
              <p><strong>Diagnosis:</strong> {p.diagnosis}</p>
              <p><strong>Medicines:</strong> {p.medicines}</p>
              <p>Status: {p.dispensed ? "Dispensed" : "Pending"}</p>

              {!p.dispensed && (
                <button
                  onClick={() => handleDispense(p.id)}
                  className="bg-green-600 text-white px-3 py-1 mt-2 rounded"
                >
                  Dispense
                </button>
              )}

              <button
                onClick={() => window.print()}
                className="ml-2 bg-gray-600 text-white px-3 py-1 rounded"
              >
                Print
              </button>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  )
}
