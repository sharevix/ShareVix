import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Courses from './pages/Courses'
import Blog from './pages/Blog'
import Reports from './pages/Reports'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Privacy from './pages/Privacy'
import TermsOfService from './pages/TermsOfService'
import CourseUpload from './pages/CourseUpload'
import BlogUpload from './pages/BlogUpload'
import BlogEdit from './pages/BlogEdit'
import BlogManagement from './pages/BlogManagement'
import ReportManagement from './pages/ReportManagement'
import CourseManagement from './pages/CourseManagement'
import CourseEdit from './pages/CourseEdit'
import ProtectedRoute from './components/Auth/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/admin/course-upload" element={<CourseUpload />} />
            <Route path="/admin/blog-upload" element={<BlogUpload />} />
            <Route path="/admin/blog-edit/:id" element={<ProtectedRoute adminOnly><BlogEdit /></ProtectedRoute>} />
            <Route path="/admin/blog-management" element={<ProtectedRoute adminOnly><BlogManagement /></ProtectedRoute>} />
            <Route path="/admin/report-management" element={<ProtectedRoute adminOnly><ReportManagement /></ProtectedRoute>} />
            <Route path="/admin/course-edit/:id" element={<ProtectedRoute adminOnly><CourseEdit /></ProtectedRoute>} />
            <Route path="/admin/course-management" element={<ProtectedRoute adminOnly><CourseManagement /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
