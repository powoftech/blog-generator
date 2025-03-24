import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

// export function getRelativeTimeString(date: Date): string {
//   const now = new Date()
//   const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

//   // Less than 60 seconds
//   if (diffInSeconds < 60) {
//     return '1m'
//   }

//   // Less than 60 minutes
//   const diffInMinutes = Math.floor(diffInSeconds / 60)
//   if (diffInMinutes < 60) {
//     return `${diffInMinutes}m`
//   }

//   // Less than 24 hours
//   const diffInHours = Math.floor(diffInMinutes / 60)
//   if (diffInHours < 24) {
//     return `${diffInHours}h`
//   }

//   // Less than 10 days
//   const diffInDays = Math.floor(diffInHours / 24)
//   if (diffInDays < 10) {
//     return `${diffInDays}d`
//   }

//   // Default to regular date format
//   return date.toLocaleDateString('en-US', {})
// }

// export function removeAllToasts(toasts: ToastT[]) {
//   toasts.forEach((t) => toast.dismiss(t.id))
// }
