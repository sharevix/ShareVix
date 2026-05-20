import React from 'react'
import sharevixBg from '../assets/sharevix.jpeg'

const Hero = () => {
    return (
        <section className="hero" style={{
            backgroundImage: `url(${sharevixBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}>
            {/* Dark gradient overlay */}
            <div className="hero-overlay"></div>

            <div className="container hero-content">
                <div className="hero-text">
                    {/* <p className="hero-tagline">Welcome to ShareVix</p> */}
                    <h1>
                        Let's Simplify<br />
                        <span className="hero-highlight">The Stock Market.</span>
                    </h1>
                    <p className="hero-desc">
                        Master the market with Hyderabad's expert trader. From basics to advanced institutional strategies — learn options trading the right way.
                    </p>
                    <div className="hero-actions">
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSdMwNdPa6otkDswxKKmqJoqzt9lCaCXZF_gY_-86H0o009Mkw/viewform" target="_blank" rel="noopener noreferrer" className="btn-demo-glow">
                            <div className="btn-demo-content" style={{ display: 'block', textAlign: 'left' }}>
                                <div className="btn-demo-title">Register for the FREE Live Demo Session 🚀</div>
                                <div className="btn-demo-date">25th May 2026 | Sunday</div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </a>
                    </div>
                    {/* <div className="hero-stats">
                        <div className="hero-stat">
                            <span className="hero-stat-number">10+</span>
                            <span className="hero-stat-label">Years Experience</span>
                        </div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat">
                            <span className="hero-stat-number">5K+</span>
                            <span className="hero-stat-label">Students Mentored</span>
                        </div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat">
                            <span className="hero-stat-number">95%</span>
                            <span className="hero-stat-label">Success Rate</span>
                        </div>
                    </div> */}
                </div>
            </div>
        </section>
    )
}

export default Hero
