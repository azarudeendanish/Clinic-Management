// lib/types.ts

export type Role = "SUPER" | "DOCTOR" | "NURSE"

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: Role
  active: boolean
  createdAt: string
}

export interface Patient {
  id: string
  name: string
  age: number
  place: string
  bloodGroup: string
  phone: string
  email?: string
  createdBy: string // nurse id
  assignedDoctorId: string
  createdAt: string
}

export interface Prescription {
  id: string
  patientId: string
  doctorId: string
  diagnosis: string
  medicines: string
  notes?: string
  dispensed: boolean
  dispensedBy?: string // nurse id
  dispensedAt?: string
  createdAt: string
}
