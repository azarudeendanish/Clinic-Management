import { Patient } from "@/lib/types"

/**
 * Sort patients by createdAt descending (latest first)
 */
export function sortPatientsByLatest(patients: Patient[]): Patient[] {
  return [...patients].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return dateB - dateA
  })
}