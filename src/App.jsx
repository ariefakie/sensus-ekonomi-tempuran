import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense, useState } from 'react'
import Sidebar from './components/Sidebar'
import Navbar  from './components/Navbar'
import { LoadingSpinner } from './components/UI'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const Dashboard   = lazy(() => import('./pages/Dashboard'))
const PetugasPage = lazy(() => import('./pages/PetugasPage'))
const SLSPage     = lazy(() => import('./pages/SLSPage'))
const AnomaliPage = lazy(() => import('./pages/AnomaliPage'))
const KualitasPage = lazy(() => import('./pages/KualitasPage'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    }
  }
})

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const handleRefresh = () => queryClient.invalidateQueries()
  const handleMenuToggle = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="app-layout">
      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onRefresh={handleRefresh} onMenuToggle={handleMenuToggle} />
        {children}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Landing page — no sidebar */}
          <Route path="/" element={
            <Suspense fallback={<LoadingSpinner />}>
              <LandingPage />
            </Suspense>
          } />

          {/* App pages — with sidebar + navbar */}
          <Route path="/dashboard" element={
            <AppLayout>
              <Suspense fallback={<LoadingSpinner />}>
                <Dashboard />
              </Suspense>
            </AppLayout>
          } />
          <Route path="/petugas" element={
            <AppLayout>
              <Suspense fallback={<LoadingSpinner />}>
                <PetugasPage />
              </Suspense>
            </AppLayout>
          } />
          <Route path="/sls" element={
            <AppLayout>
              <Suspense fallback={<LoadingSpinner />}>
                <SLSPage />
              </Suspense>
            </AppLayout>
          } />
          <Route path="/anomali" element={
            <AppLayout>
              <Suspense fallback={<LoadingSpinner />}>
                <AnomaliPage />
              </Suspense>
            </AppLayout>
          } />
          <Route path="/kualitas" element={
            <AppLayout>
              <Suspense fallback={<LoadingSpinner />}>
                <KualitasPage />
              </Suspense>
            </AppLayout>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
