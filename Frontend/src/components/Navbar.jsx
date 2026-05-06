import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, LogOut, KeyRound, User, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logoImg from '../assets/logo_copy.png'

const Navbar = () => {
    const { user, isAdmin, logout } = useAuth()
    const [profileOpen, setProfileOpen] = useState(false)
    const [showChangePassword, setShowChangePassword] = useState(false)
    const [pwData, setPwData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
    const [pwError, setPwError] = useState('')
    const [pwSuccess, setPwSuccess] = useState('')
    const [pwLoading, setPwLoading] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const profileRef = useRef(null)

    // Close profile dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleChangePassword = async (e) => {
        e.preventDefault()
        setPwError('')
        setPwSuccess('')
        if (pwData.newPassword !== pwData.confirmPassword) {
            setPwError('New passwords do not match')
            return
        }
        if (pwData.newPassword.length < 8) {
            setPwError('New password must be at least 8 characters')
            return
        }
        setPwLoading(true)
        try {
            const token = localStorage.getItem('authToken')
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8787'}/api/auth/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ oldPassword: pwData.oldPassword, newPassword: pwData.newPassword })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to change password')
            setPwSuccess('Password changed successfully!')
            setPwData({ oldPassword: '', newPassword: '', confirmPassword: '' })
            setTimeout(() => { setShowChangePassword(false); setPwSuccess('') }, 2000)
        } catch (err) {
            setPwError(err.message)
        } finally {
            setPwLoading(false)
        }
    }

    return (
        <>
            <nav className="navbar">
                <div className="container nav-content">
                    <div className="logo-area">
                        <Link to="/">
                            <img src={logoImg} alt="Share Vix Logo" className="nav-logo" />
                        </Link>
                        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0' }}>
                            <span className="logo-text">Share</span>
                            <span className="logo-text-vix">Vix</span>
                        </Link>
                    </div>

                    <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
                        <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
                        <li><Link to="/blogs" onClick={() => setMobileMenuOpen(false)}>Blogs</Link></li>
                        <li><Link to="/deepreports" onClick={() => setMobileMenuOpen(false)}>Deep Reports</Link></li>
                        <li><Link to="/videos" onClick={() => setMobileMenuOpen(false)}>Videos</Link></li>
                        {/* <li><Link to="/membership">Join The Membership</Link></li> */}
                        <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link></li>

                        {isAdmin() && (
                            <li className="dropdown">
                                <button className="dropdown-toggle">
                                    Admin <ChevronDown size={18} />
                                </button>
                                <div className="dropdown-menu">
                                    <Link to="/admin/blog-upload" className="dropdown-item" onClick={() => setMobileMenuOpen(false)}>
                                        Blog Upload
                                    </Link>
                                    <Link to="/admin/blog-management" className="dropdown-item" onClick={() => setMobileMenuOpen(false)}>
                                        Blog Management
                                    </Link>
                                    <Link to="/admin/report-management" className="dropdown-item" onClick={() => setMobileMenuOpen(false)}>
                                        Report Management
                                    </Link>
                                    <Link to="/admin/course-upload" className="dropdown-item" onClick={() => setMobileMenuOpen(false)}>
                                        Course Upload
                                    </Link>
                                    <Link to="/admin/course-management" className="dropdown-item" onClick={() => setMobileMenuOpen(false)}>
                                        Course Management
                                    </Link>
                                </div>
                            </li>
                        )}
                    </ul>

                    <div className="nav-actions">
                        {user ? (
                            <div className="profile-dropdown-wrapper" ref={profileRef}>
                                <button
                                    className="profile-menu-btn"
                                    onClick={() => setProfileOpen(prev => !prev)}
                                    aria-label="Profile menu"
                                >
                                    <User size={24} />
                                </button>

                                {profileOpen && (
                                    <div className="profile-dropdown-menu">
                                        <div className="profile-dropdown-header">
                                            <div className="profile-dropdown-avatar">
                                                <img src={logoImg} alt="Profile" />
                                            </div>
                                            <div className="profile-dropdown-info">
                                                <span className="profile-dropdown-name">{user.name}</span>
                                                {isAdmin() && <span className="profile-dropdown-role">Administrator</span>}
                                            </div>
                                        </div>
                                        <div className="profile-dropdown-divider" />
                                        <button
                                            className="profile-dropdown-item"
                                            onClick={() => { setShowChangePassword(true); setProfileOpen(false) }}
                                        >
                                            <KeyRound size={16} />
                                            Change Password
                                        </button>
                                        <button
                                            className="profile-dropdown-item profile-dropdown-logout"
                                            onClick={() => { logout(); setProfileOpen(false) }}
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="login-btn" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                        )}
                        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Change Password Modal */}
            {showChangePassword && (
                <div className="cp-modal-overlay" onClick={() => setShowChangePassword(false)}>
                    <div className="cp-modal" onClick={e => e.stopPropagation()}>
                        <div className="cp-modal-header">
                            <h2>Change Password</h2>
                            <button className="cp-modal-close" onClick={() => setShowChangePassword(false)}>✕</button>
                        </div>
                        <form onSubmit={handleChangePassword} className="cp-modal-body">
                            {pwError && <div className="cp-alert cp-alert-error">{pwError}</div>}
                            {pwSuccess && <div className="cp-alert cp-alert-success">{pwSuccess}</div>}
                            <div className="cp-form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    value={pwData.oldPassword}
                                    onChange={e => setPwData(p => ({ ...p, oldPassword: e.target.value }))}
                                    placeholder="Enter current password"
                                    required
                                />
                            </div>
                            <div className="cp-form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={pwData.newPassword}
                                    onChange={e => setPwData(p => ({ ...p, newPassword: e.target.value }))}
                                    placeholder="Enter new password (min 8 chars)"
                                    required
                                />
                            </div>
                            <div className="cp-form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    value={pwData.confirmPassword}
                                    onChange={e => setPwData(p => ({ ...p, confirmPassword: e.target.value }))}
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>
                            <div className="cp-form-actions">
                                <button type="button" className="cp-btn-cancel" onClick={() => setShowChangePassword(false)}>Cancel</button>
                                <button type="submit" className="cp-btn-submit" disabled={pwLoading}>
                                    {pwLoading ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar
