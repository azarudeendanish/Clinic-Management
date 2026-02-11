// lib/storage.ts

import { User, Patient, Prescription } from "./types"

const isBrowser = typeof window !== "undefined"

/* ---------- GENERIC HELPERS ---------- */

function getItem<T>(key: string): T[] {
  if (!isBrowser) return []
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

function setItem<T>(key: string, value: T[]) {
  if (!isBrowser) return
  localStorage.setItem(key, JSON.stringify(value))
}

/* ---------- USERS ---------- */

export const getUsers = (): User[] => getItem<User>("users")

export const saveUsers = (users: User[]) =>
  setItem<User>("users", users)

export const addUser = (user: User) => {
  const users = getUsers()
  saveUsers([...users, user])
}

export const updateUserStatus = (userId: string, active: boolean) => {
  const users = getUsers().map((u) =>
    u.id === userId ? { ...u, active } : u
  )
  saveUsers(users)
}

/* ---------- PATIENTS ---------- */

export const getPatients = (): Patient[] =>
  getItem<Patient>("patients")

export const savePatients = (patients: Patient[]) =>
  setItem<Patient>("patients", patients)

export const addPatient = (patient: Patient) => {
  const patients = getPatients()
  savePatients([...patients, patient])
}

/* ---------- PRESCRIPTIONS ---------- */

export const getPrescriptions = (): Prescription[] =>
  getItem<Prescription>("prescriptions")

export const savePrescriptions = (
  prescriptions: Prescription[]
) => setItem<Prescription>("prescriptions", prescriptions)

export const addPrescription = (prescription: Prescription) => {
  const prescriptions = getPrescriptions()
  savePrescriptions([...prescriptions, prescription])
}

export const markAsDispensed = (
  prescriptionId: string,
  nurseId: string
) => {
  const updated = getPrescriptions().map((p) =>
    p.id === prescriptionId
      ? {
          ...p,
          dispensed: true,
          dispensedBy: nurseId,
          dispensedAt: new Date().toISOString()
        }
      : p
  )

  savePrescriptions(updated)
}
