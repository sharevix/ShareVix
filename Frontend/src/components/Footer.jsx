import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h2>ShareVix</h2>
                        <p>Empowering traders with knowledge and strategies.</p>
                    </div>
                    <div className="footer-links">
                        <div className="link-group">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/blogs">Blogs</Link></li>
                                <li><Link to="/deepreports">Deep Reports</Link></li>
                                <li><Link to="/videos">Videos</Link></li>
                                {/* <li><Link to="/membership">Join The Membership</Link></li> */}
                                <li><Link to="/contact">Contact Us</Link></li>
                            </ul>
                        </div>
                        <div className="link-group">
                            <h4>Legal</h4>
                            <ul>
                                <li><Link to="/privacy">Privacy Policy</Link></li>
                                <li><Link to="/terms">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 Share Vix. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
