import React from 'react'
import { BookOpen, Activity, ArrowRightLeft, Target } from 'lucide-react'

const Learning = () => {
    const topics = [
        { 
            title: 'Basics of Stock Market', 
            desc: 'Master stock market basic terms and key principles for a solid foundation.',
            icon: <BookOpen size={64} strokeWidth={1.5} color="#2563EB" /> 
        },
        { 
            title: 'Technicals of Option', 
            desc: 'Explore basics, Greeks, volatility, and strategies for successful trading.',
            icon: <Activity size={64} strokeWidth={1.5} color="#10B981" /> 
        },
        { 
            title: 'Option Trading', 
            desc: 'Master option basics and key strategies for confident trading.',
            icon: <ArrowRightLeft size={64} strokeWidth={1.5} color="#F59E0B" /> 
        },
        { 
            title: 'Technical Analysis Mastery', 
            desc: 'Gain in-depth knowledge of charts, patterns, and indicators to enhance your market understanding.',
            icon: <Target size={64} strokeWidth={1.5} color="#EF4444" /> 
        }
    ]

    return (
        <section className="learning section-padding">
            <div className="container">
                <h2 className="section-title">What you will Learn <span>Here</span></h2>

                <div className="learning-grid">
                    {topics.map((topic, index) => (
                        <div className="learning-card" key={index}>
                            <div className="card-icon">
                                {topic.icon}
                            </div>
                            <h3>{topic.title}</h3>
                            <p>{topic.desc}</p>
                        </div>
                    ))}
                </div>

                {/* <div className="trust-bubble">
                    <div className="avatar-pile">
                        <span>+500 students trust Hyderabad Traders Trading</span>
                    </div>
                </div> */}
            </div>
        </section>
    )
}

export default Learning
