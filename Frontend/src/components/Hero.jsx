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
                    <div className="hero-stats">
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
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
