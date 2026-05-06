import React from 'react';
import { User, TrendingUp, BookOpen, Target } from 'lucide-react';
import devanandImg from '../assets/devanand.jpg';

const AboutOwner = () => {
    return (
        <section className="about-owner section-padding" style={{ backgroundColor: '#ffffff' }}>
            <div className="container">
                <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '3rem' }}>Meet the <span>Founder</span></h2>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4rem',
                    maxWidth: '1100px',
                    margin: '0 auto',
                    padding: '3rem',
                    backgroundColor: '#fff',
                    borderRadius: '20px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
                    border: '1px solid #f0f0f0'
                }}>
                    {/* Left Column: Image */}
                    <div style={{
                        flexShrink: 0,
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            width: '280px',
                            height: '280px',
                            borderRadius: '50%',
                            padding: '6px',
                            background: 'linear-gradient(135deg, #007bff, #8a2be2, #ff007f)',
                            boxShadow: '0 15px 35px rgba(0,123,255,0.2)'
                        }}>
                            <img
                                src={devanandImg}
                                alt="Devanand Gautre"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '6px solid #fff'
                                }}
                            />
                        </div>
                    </div>

                    {/* Right Column: Text */}
                    <div style={{ flex: '1 1 500px', textAlign: 'left' }}>
                        <h3 style={{ fontSize: '2.5rem', color: '#1a1a1a', marginBottom: '0.5rem', fontWeight: '800' }}>Devanand Gautre</h3>
                        <p style={{ fontSize: '1.1rem', color: '#007bff', fontWeight: '700', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Full-Time Options Trader & Founder of ShareVix
                        </p>

                        <div style={{
                            color: '#555',
                            lineHeight: '1.8',
                            fontSize: '1.1rem',
                            marginBottom: '2.5rem'
                        }}>
                            <p style={{ marginBottom: '1rem' }}>
                                Devanand Gautre holds an M.Tech in Mechanical Engineering and has over 10 years of experience mentoring IES and GATE aspirants.
                            </p>
                            <p style={{ marginBottom: '1rem' }}>
                                He specializes in options trading using quantitative models like Black-Scholes and Put-Call Parity to identify pricing inefficiencies and arbitrage opportunities in the stock market.
                            </p>
                            <p>
                                Through ShareVix, Devanand aims to simplify complex option strategies and help traders build a disciplined, data-driven approach to consistent trading success.
                            </p>
                        </div>

                        {/* Highlights */}
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '2.5rem',
                            borderTop: '1px solid #eee',
                            paddingTop: '2rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: '#f0f7ff', padding: '0.8rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <BookOpen size={26} color="#007bff" />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.1rem', color: '#1a1a1a', fontWeight: '700' }}>10+ Years</h4>
                                    <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Mentoring Exp.</p>

                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: '#f0f7ff', padding: '0.8rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <TrendingUp size={26} color="#007bff" />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.1rem', color: '#1a1a1a', fontWeight: '700' }}>Quant Models</h4>
                                    <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Options Specialist</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: '#f0f7ff', padding: '0.8rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Target size={26} color="#007bff" />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.1rem', color: '#1a1a1a', fontWeight: '700' }}>Data-Driven</h4>
                                    <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Trading Success</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutOwner;
