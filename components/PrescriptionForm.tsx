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
    <div className="bg-gray-100 p-4 rounded mt-4 text-gray-600">
      <h3 className="font-semibold mb-2">
        Prescription for {patient.name}
      </h3>

      <textarea
        placeholder="Diagnosis"
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
        className="w-full border p-2 mb-2 rounded"
      />

      <textarea
        placeholder="Medicines"
        value={medicines}
        onChange={(e) => setMedicines(e.target.value)}
        className="w-full border p-2 mb-2 rounded"
      />

      <textarea
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full border p-2 mb-2 rounded"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Prescription
      </button>
    </div>
  )
}
