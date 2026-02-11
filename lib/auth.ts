// lib/auth.ts

import { User } from "./types"
import { getUsers } from "./storage"

const CURRENT_USER_KEY = "currentUser"

export const login = (
  email: string,
  password: string
): { success: boolean; message: string; user?: User } => {
  const users = getUsers()

  const user = users.find(
    (u) =>
      u.email === email &&
      u.password === password
  )

  if (!user) {
    return { success: false, message: "Invalid credentials" }
  }

  if (!user.active) {
    return { success: false, message: "Account is inactive" }
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))

  return { success: true, message: "Login successful", user }
}

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY)
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null

  const user = localStorage.getItem(CURRENT_USER_KEY)
  return user ? JSON.parse(user) : null
}

export const isAuthenticated = (): boolean => {
  return !!getCurrentUser()
}

export const hasRole = (role: string): boolean => {
  const user = getCurrentUser()
  return user?.role === role
}
