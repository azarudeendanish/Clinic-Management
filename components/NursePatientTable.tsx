"use client"

import { useEffect, useState } from "react"
import {
  getPatients,
  getPrescriptions,
  getUsers,
  markAsDispensed
} from "@/lib/storage"
import { getCurrentUser } from "@/lib/auth"
import { Patient, Prescription, User } from "@/lib/types"
import toast from "react-hot-toast"
import QRCode from "qrcode"


interface CombinedData {
  patient: Patient
  prescription?: Prescription
  doctor?: User
  nurse?: User
}

interface NursePatientTableProps {
    refreshKey: number
  }
  
  export default function NursePatientTable({
    refreshKey
  }: NursePatientTableProps) {
  const [data, setData] = useState<CombinedData[]>([])
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null)

  const loadData = () => {
    const patients = getPatients()
    const prescriptions = getPrescriptions()
    const users = getUsers()

    const combined: CombinedData[] = patients.map((patient) => {
      const prescription = prescriptions.find(
        (p) => p.patientId === patient.id
      )

      const doctor = users.find(
        (u) => u.id === patient.assignedDoctorId
      )

      const nurse = users.find(
        (u) => u.id === patient.createdBy
      )

      return {
        patient,
        prescription,
        doctor,
        nurse
      }
    })

    setData(combined)
  }

  useEffect(() => {
    loadData()
  }, [refreshKey])

  const handleDispense = (prescriptionId: string) => {
    const user = getCurrentUser()
    if (!user) return

    markAsDispensed(prescriptionId, user.id)
    toast.success("Medicine dispensed")
    loadData()
  }

  const handlePrintPrescription = async (item: CombinedData) => {
    const prescription = item.prescription
    if (!prescription || !prescription.dispensed) return
  
    const users = getUsers()
  
    const nurse = users.find(
      (u) => u.id === prescription.dispensedBy
    )
  
    const prescriptionNumber = `RX-${prescription.id.slice(0, 6).toUpperCase()}`
  
    // Generate QR Code
    const qrData = `
      Prescription No: ${prescriptionNumber}
      Patient: ${item.patient.name}
      Doctor: ${item.doctor?.name}
      Diagnosis: ${prescription.diagnosis}
      Date: ${new Date(prescription.createdAt).toLocaleDateString()}
    `
  
    const qrImage = await QRCode.toDataURL(qrData)
  
    // Convert medicine string into table rows
    const medicineRows = prescription.medicines
      .split("\n")
      .map(
        (med) => `
        <tr>
          <td style="border:1px solid #ccc;padding:8px;">${med}</td>
          <td style="border:1px solid #ccc;padding:8px;">As Prescribed</td>
        </tr>
      `
      )
      .join("")
  
    const printWindow = window.open("", "", "width=900,height=700")
    if (!printWindow) return
  
    printWindow.document.write(`
      <html>
        <head>
          <title>Prescription</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
            }
            .header {
              display:flex;
              justify-content:space-between;
              align-items:center;
              margin-bottom:20px;
            }
            .logo {
              height:80px;
            }
            h2 {
              margin:0;
            }
            table {
              width:100%;
              border-collapse:collapse;
              margin-top:15px;
            }
            th {
              background:#f4f4f4;
              border:1px solid #ccc;
              padding:8px;
            }
            .section {
              margin-top:15px;
            }
            .footer {
              margin-top:40px;
            }
            hr {
              margin:20px 0;
            }
          </style>
        </head>
        <body>
  
          <div class="header">
            <div>
              <img src="/logo.png" class="logo"/>
            </div>
            <div style="text-align:right;">
              <h2>City Care Hospital</h2>
              <p>Prescription No: <strong>${prescriptionNumber}</strong></p>
            </div>
          </div>
  
          <hr/>
  
          <div class="section">
            <strong>Date:</strong> ${new Date().toLocaleDateString()}<br/>
            <strong>Time:</strong> ${new Date().toLocaleTimeString()}
          </div>
  
          <div class="section">
            <strong>Patient Name:</strong> ${item.patient.name}<br/>
            <strong>Age:</strong> ${item.patient.age}<br/>
            <strong>Place:</strong> ${item.patient.place}
          </div>
  
          <div class="section">
            <strong>Doctor:</strong> ${item.doctor?.name || "-"}<br/>
            <strong>Nurse:</strong> ${nurse?.name || "-"}
          </div>
  
          <hr/>
  
          <div class="section">
            <strong>Diagnosis:</strong><br/>
            ${prescription.diagnosis}
          </div>
  
          <div class="section">
            <strong>Medicines:</strong>
            <table>
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Instruction</th>
                </tr>
              </thead>
              <tbody>
                ${medicineRows}
              </tbody>
            </table>
          </div>
  
          <div class="section">
            <strong>Notes:</strong><br/>
            ${prescription.notes || "Take medicines as advised by doctor."}
          </div>
  
          <div class="footer">
            <p>Status: <strong>Dispensed</strong></p>
            <br/><br/>
            <div style="display:flex;justify-content:space-between;">
              <div>
                Doctor Signature<br/><br/>
                ____________________
              </div>
              <div>
                Nurse Signature<br/><br/>
                ____________________
              </div>
            </div>
  
            <div style="margin-top:30px;text-align:center;">
              <img src="${qrImage}" width="120"/>
              <p style="font-size:12px;">Scan to verify prescription</p>
            </div>
          </div>
  
        </body>
      </html>
    `)
  
    printWindow.document.close()
    printWindow.print()
  }
  
  

  return (
    <div className="bg-white p-6 rounded shadow mt-6">
      <h2 className="text-lg font-semibold mb-4">
        Patient List
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Age</th>
              <th className="border p-2">Place</th>
              <th className="border p-2">Doctor</th>
              <th className="border p-2">Nurse</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.patient.id} className="text-center">
                <td className="border p-2">
                  {item.patient.name}
                </td>
                <td className="border p-2">
                  {item.patient.age}
                </td>
                <td className="border p-2">
                  {item.patient.place}
                </td>
                <td className="border p-2">
                  {item.doctor?.name || "-"}
                </td>
                <td className="border p-2">
                  {item.nurse?.name || "-"}
                </td>
                <td className="border p-2">
                  {item.prescription?.dispensed ? (
                    <span className="text-green-600 font-medium">
                      Dispensed
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      Pending
                    </span>
                  )}
                </td>

                <td className="border p-2 space-x-2">
                  {item.prescription && (
                    <>
                      <button
                        onClick={() =>
                          setSelectedPrescription(
                            item.prescription!
                          )
                        }
                        className="bg-blue-600 text-white px-2 py-1 rounded"
                      >
                        View
                      </button>

                      {!item.prescription.dispensed && (
                        <button
                          onClick={() =>
                            handleDispense(
                              item.prescription!.id
                            )
                          }
                          className="bg-green-600 text-white px-2 py-1 rounded"
                        >
                          Dispense
                        </button>
                      )}

                        {item.prescription?.dispensed && (
                        <button
                            onClick={() => handlePrintPrescription(item)}
                            className="bg-gray-700 text-white px-2 py-1 rounded"
                        >
                            Print
                        </button>
                        )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ View Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-lg font-semibold mb-2">
              Prescription Details
            </h3>

            <p>
              <strong>Diagnosis:</strong>{" "}
              {selectedPrescription.diagnosis}
            </p>

            <p>
              <strong>Medicines:</strong>{" "}
              {selectedPrescription.medicines}
            </p>

            <p>
              <strong>Notes:</strong>{" "}
              {selectedPrescription.notes || "-"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {selectedPrescription.dispensed
                ? "Dispensed"
                : "Pending"}
            </p>

            <button
              onClick={() => setSelectedPrescription(null)}
              className="mt-4 bg-red-600 text-white px-3 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
