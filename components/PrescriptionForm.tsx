"use client"

import { useState } from "react"
import { addPrescription } from "@/lib/storage"
import { getCurrentUser } from "@/lib/auth"
import { Patient } from "@/lib/types"
import toast from "react-hot-toast"

interface Props {
  patient: Patient
}

export default function PrescriptionForm({ patient }: Props) {
  const [diagnosis, setDiagnosis] = useState("")
  const [medicines, setMedicines] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = () => {
    const user = getCurrentUser()

    if (!diagnosis || !medicines) {
      toast.error("Fill required fields")
      return
    }

    addPrescription({
      id: crypto.randomUUID(),
      patientId: patient.id,
      doctorId: user!.id,
      diagnosis,
      medicines,
      notes,
      dispensed: false,
      createdAt: new Date().toISOString()
    })

    toast.success("Prescription added")

    setDiagnosis("")
    setMedicines("")
    setNotes("")
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Prescription for {patient.name}
      </h3>
  
      <div className="space-y-4">
  
        {/* Diagnosis */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Diagnosis *
          </label>
          <textarea
            placeholder="Enter diagnosis details"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
  
        {/* Medicines */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Medicines *
          </label>
          <textarea
            placeholder="Enter medicines (one per line)"
            value={medicines}
            onChange={(e) => setMedicines(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
  
        {/* Notes */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Notes (Optional)
          </label>
          <textarea
            placeholder="Additional instructions"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
  
        {/* Submit Button */}
        <div>
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto bg-gray-800 hover:bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm transition"
          >
            Save Prescription
          </button>
        </div>
  
      </div>
    </div>
  )
}
