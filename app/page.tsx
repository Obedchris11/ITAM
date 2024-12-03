import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/login')
}

export const dynamic = 'force-dynamic'