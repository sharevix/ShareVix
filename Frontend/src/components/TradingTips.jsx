import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogAPI } from '../services/api';
import iconsPack from '../assets/icons.png';
import { Calendar, User, ChevronRight } from "lucide-react";
import "../styles/Blog.css";
import "../styles/TradingTips.css";

const TradingTips = () => {
    const [tips, setTips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTip, setSelectedTip] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const sliderRef = useRef(null);

    useEffect(() => {
        const fetchTips = async () => {
            try {
                const response = await blogAPI.getAll({ page: 1, limit: 100 });
                const allBlogs = response.data.blogs || [];
                // Filter for Daily Update category
                const tradingTips = allBlogs.filter(post =>
                    post.category === 'Daily Update' &&
                    (!post.tags ||
                        post.tags.length === 0 ||
                        (Array.isArray(post.tags) && post.tags.some(t => t.toLowerCase() === 'blogs')) ||
                        (typeof post.tags === 'string' && post.tags.toLowerCase() === 'blogs'))
                );

                setTips(tradingTips);
            } catch (error) {
                console.error("Error fetching Daily Update:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTips();
    }, []);

    const stripHtml = (html) => {
        if (!html) return "";
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        const text = tmp.textContent || tmp.innerText || "";
        return text.length > 100 ? text.substring(0, 100) + "..." : text;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const getAuthorName = (post) => {
        return post.author_name || post.users?.name || "Unknown";
    };

    if (loading || tips.length === 0) {
        return null;
    }

    // Filter by selected date
    const filteredTips = selectedDate
        ? tips.filter(t => new Date(t.created_at).toISOString().split('T')[0] === selectedDate)
        : tips;

    if (selectedTip) {
        return (
            <section className="learning section-padding tips-section">
                <div className="blog-page" style={{ padding: 0 }}>
                    <section className="single-post-hero" style={{ padding: '20px 0', minHeight: 'auto' }}>
                        <div className="container">
                            <button
                                className="back-btn"
                                onClick={() => setSelectedTip(null)}
                            >
                                <ChevronRight size={20} /> Back to Daily Update
                            </button>
                        </div>
                    </section>

                    <section className="single-post-section" style={{ paddingTop: '20px' }}>
                        <div className="container">
                            <article className="single-post">
                                <div className="post-header">
                                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{selectedTip.title}</h1>
                                    <div className="post-meta-single">
                                        <span className="meta-badge">
                                            <Calendar size={16} />
                                            {formatDate(selectedTip.created_at)}
                                        </span>
                                        <span className="meta-badge">
                                            <User size={16} />
                                            {getAuthorName(selectedTip)}
                                        </span>
                                    </div>
                                </div>

                                {selectedTip.featured_image_url && (
                                    <div className="featured-image-wrapper" style={{ height: '400px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <img
                                            src={selectedTip.featured_image_url}
                                            alt={selectedTip.title}
                                            className="featured-image"
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </div>
                                )}

                                <div className="post-content" dangerouslySetInnerHTML={{ __html: selectedTip.content }} />

                                <div className="post-footer">
                                    <button
                                        className="back-btn-bottom"
                                        onClick={() => setSelectedTip(null)}
                                    >
                                        <ChevronRight size={20} /> Back to Daily Update
                                    </button>
                                </div>
                            </article>
                        </div>
                    </section>
                </div>
            </section>
        );
    }

    return (
        <section className="learning section-padding tips-section">
            <div className="container">
                <div className="tips-header">
                    <h2 className="section-title">Daily <span>Update</span></h2>
                    <div className="date-filter">
                        <label>Date Filter: </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                        />
                        {selectedDate && <button onClick={() => setSelectedDate('')}>Clear</button>}
                    </div>
                </div>

                {filteredTips.length === 0 ? (
                    <p style={{ textAlign: 'center', margin: '40px 0' }}>No Daily Update available for this date.</p>
                ) : (
                    <div className="tips-slider-wrapper">
                        <div className="tips-slider" ref={sliderRef}>
                            {filteredTips.map((post) => (
                                <div
                                    className="tip-card"
                                    key={post.id}
                                    onClick={() => setSelectedTip(post)}
                                >
                                    <div className="tip-icon">
                                        <img
                                            src={post.featured_image_url || iconsPack}
                                            alt={post.title}
                                        />
                                    </div>
                                    <h3>{post.title}</h3>
                                    <p>{post.description ? stripHtml(post.description) : stripHtml(post.content)}</p>

                                    <button
                                        className="know-more-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedTip(post);
                                        }}
                                    >
                                        Know more
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="slider-dots">
                            {filteredTips.map((_, i) => (
                                <div key={i} className="dot" title={`Tip ${i + 1}`} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default TradingTips;
