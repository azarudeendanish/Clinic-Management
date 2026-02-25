// /lib/dateUtils.ts

export const formatSmartDate = (dateString?: string): string => {
    if (!dateString) return "-"
  
    const date = new Date(dateString)
    const now = new Date()
  
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    )
  
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
  
    const inputDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    )
  
    const timePart = date.toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    })
  
    if (inputDate.getTime() === today.getTime()) {
      return `Today, ${timePart}`
    }
  
    if (inputDate.getTime() === yesterday.getTime()) {
      return `Yesterday, ${timePart}`
    }
  
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    })
  }