"use client"

import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import Navbar from "@/components/Navbar"
import { getPatients, getPrescriptions, addPrescription } from "@/lib/storage"
import { getCurrentUser } from "@/lib/auth"
import { Patient, Prescription } from "@/lib/types"
import toast from "react-hot-toast"
import { formatSmartDate } from "@/lib/utils/dateUtils"

export default function DoctorDashboard() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const [diagnosis, setDiagnosis] = useState("")
  const [medicines, setMedicines] = useState("")
  const [notes, setNotes] = useState("")

  // Load patients assigned to current doctor
  const loadData = () => {
    const allPatients = getPatients()
    const currentDoctor = getCurrentUser()
    if (!currentDoctor) return

    const filtered = allPatients.filter(
      (p) => p.assignedDoctorId === currentDoctor.id
    )
    setPatients(filtered)
    setPrescriptions(getPrescriptions())
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 5000) // refresh every 5s
    return () => clearInterval(interval)
  }, [])

  // Select a patient to add/update prescription
  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    const pres = prescriptions.find((p) => p.patientId === patient.id)
    if (pres) {
      setDiagnosis(pres.diagnosis)
      setMedicines(pres.medicines)
      setNotes(pres.notes || "")
    } else {
      setDiagnosis("")
      setMedicines("")
      setNotes("")
    }
  }

  const handleSubmitPrescription = () => {
    if (!selectedPatient) return
    const user = getCurrentUser()
    if (!user) return

    if (!diagnosis || !medicines) {
      toast.error("Fill required fields")
      return
    }

    // Prevent duplicate prescriptions
    const existing = prescriptions.find((p) => p.patientId === selectedPatient.id)
    if (existing) {
      toast.error("Prescription already exists. Dispense or delete first.")
      return
    }

    addPrescription({
      id: crypto.randomUUID(),
      patientId: selectedPatient.id,
      doctorId: user.id,
      diagnosis,
      medicines,
      notes,
      dispensed: false,
      createdAt: new Date().toISOString()
    })

    toast.success("Prescription saved")
    setSelectedPatient(null)
    setDiagnosis("")
    setMedicines("")
    setNotes("")
    loadData()
  }

  const getPrescriptionStatus = (patientId: string) => {
    const pres = prescriptions.find((p) => p.patientId === patientId)
    if (!pres) return "Pending"
    return pres.dispensed ? "Dispensed" : "Pending"
  }

  return (
    <ProtectedRoute allowedRoles={["DOCTOR"]}>
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Header */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Doctor Dashboard</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your patients & prescriptions</p>
          </div>

          {/* Patients Table */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3">S.No</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Age</th>
                  <th className="px-4 py-3">Blood Group</th>
                  <th className="px-4 py-3">Patient Created At</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-center">
                {patients.map((patient, idx) => (
                  <tr key={patient.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-800">{idx + 1}</td>
                    <td className="px-4 py-3 text-gray-800">{patient.name}</td>
                    <td className="px-4 py-3 text-gray-600">{patient.age}</td>
                    <td className="px-4 py-3 text-gray-600">{patient.bloodGroup}</td>
                    {/* <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {formatSmartDate(
                        prescriptions.find(p => p.patientId === patient.id)?.createdAt
                      )}
                    </td> */}
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {formatSmartDate(patient.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        getPrescriptionStatus(patient.id) === "Dispensed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {getPrescriptionStatus(patient.id)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleSelectPatient(patient)}
                        className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-1 rounded-md text-xs transition"
                      >
                        {prescriptions.find(p => p.patientId === patient.id) ? "Update" : "Add"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {patients.length === 0 && (
              <p className="text-gray-500 mt-4 text-center">No patients assigned</p>
            )}
          </div>

          {/* Prescription Form Modal */}
          {selectedPatient && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
              <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 text-gray-800">
                <h3 className="text-lg font-semibold mb-4">
                  Prescription for {selectedPatient.name}
                </h3>

                <div className="space-y-4">

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Diagnosis *</label>
                    <textarea
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      rows={3}
                      placeholder="Enter diagnosis"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Medicines *</label>
                    <textarea
                      value={medicines}
                      onChange={(e) => setMedicines(e.target.value)}
                      rows={4}
                      placeholder="Enter medicines (one per line)"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Notes (Optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      placeholder="Additional instructions"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>

                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={handleSubmitPrescription}
                      className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setSelectedPatient(null)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </ProtectedRoute>
  )
}