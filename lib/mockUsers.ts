// lib/mockUsers.ts

import { User } from "./types"

export const defaultUsers: User[] = [
  {
    id: "1",
    name: "Super Admin",
    email: "admin@clinic.com",
    password: "admin123",
    role: "SUPER",
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Dr. John",
    email: "doctor@clinic.com",
    password: "doctor123",
    role: "DOCTOR",
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "Dr. doctor1",
    email: "doctor1@clinic.com",
    password: "doctor123",
    role: "DOCTOR",
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    name: "Dr. doctor2",
    email: "doctor2@clinic.com",
    password: "doctor123",
    role: "DOCTOR",
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "5",
    name: "Nurse1 Mary",
    email: "nurse@clinic.com",
    password: "nurse123",
    role: "NURSE",
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "6",
    name: "Nurse2 Queen",
    email: "nurse2@clinic.com",
    password: "nurse123",
    role: "NURSE",
    active: true,
    createdAt: new Date().toISOString()
  }
]

// Initialize users if not already stored
export const initializeMockUsers = () => {
  if (typeof window === "undefined") return

  const existing = localStorage.getItem("users")
  if (!existing) {
    localStorage.setItem("users", JSON.stringify(defaultUsers))
  }
}
