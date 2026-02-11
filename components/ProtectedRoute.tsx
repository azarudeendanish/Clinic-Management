"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Role } from "@/lib/types"

interface Props {
  children: React.ReactNode
  allowedRoles?: Role[]
}

export default function ProtectedRoute({
  children,
  allowedRoles
}: Props) {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()

    if (!user) {
      router.push("/")
      return
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push("/dashboard")
    }
  }, [router, allowedRoles])

  return <>{children}</>
}
