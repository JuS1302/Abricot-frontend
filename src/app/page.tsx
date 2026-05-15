import { redirect } from 'next/navigation'

export default function Home() {
  // redirect() est une fonction Next.js qui redirige instantanément
  // Quand quelqu'un arrive sur "/", il est envoyé vers "/dashboard"
  // Et quand la protection des routes sera en place,
  // "/dashboard" redirigera vers "/login" si pas connecté
  redirect('/dashboard')
}
