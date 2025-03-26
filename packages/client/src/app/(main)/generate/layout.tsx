import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function GenerateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const connectSid = cookieStore.get('connect.sid')

  const user = await fetch(`${process.env.API_URL}/auth`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `connect.sid=${connectSid?.value}`,
    },
  })

  if (!user.ok) {
    redirect('/signin')
  }

  return <>{children}</>
}
