import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
