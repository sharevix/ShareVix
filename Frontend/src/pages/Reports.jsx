import { useEffect, useState } from "react";
import { Calendar, User, Search, Loader, AlertCircle, ArrowRight, ChevronRight, FileText, Download } from "lucide-react";
import "../styles/Blog.css";
import { blogAPI } from "../services/api";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (!selectedPost) {
      setSelectedPdfUrl(null);
      return;
    }

    const firstDocument = selectedPost.media?.find((m) => m.asset_type === "document");
    setSelectedPdfUrl(firstDocument?.url || null);
  }, [selectedPost]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogAPI.getAll({ page: 1, limit: 100 });
      const allBlogs = response.data.blogs || [];
      // Filter by tags=Reports
      const reportsOnly = allBlogs.filter(post =>
        post.tags && (
          (Array.isArray(post.tags) && post.tags.some(t => t.toLowerCase() === 'reports')) ||
          (typeof post.tags === 'string' && post.tags.toLowerCase() === 'reports')
        )
      );
      setReports(reportsOnly);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const stripHtml = (html) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
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

  const filteredReports = reports.filter(post =>
    (post.title && typeof post.title === 'string' && post.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (post.description && typeof post.description === 'string' && post.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (post.content && typeof post.content === 'string' && stripHtml(post.content).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (selectedPost) {
    return (
      <div className="blog-page">
        <section className="single-post-hero">
          <div className="container">
            <button
              className="back-btn"
              onClick={() => setSelectedPost(null)}
            >
              <ChevronRight size={20} /> Back to All Reports
            </button>
          </div>
        </section>

        <section className="single-post-section">
          <div className="container">
            <article className="single-post">
              <div className="post-header">
                <h1>{selectedPost.title}</h1>
                <div className="post-meta-single">
                  <span className="meta-badge">
                    <Calendar size={16} />
                    {formatDate(selectedPost.created_at)}
                  </span>
                  <span className="meta-badge">
                    <User size={16} />
                    {getAuthorName(selectedPost)}
                  </span>
                </div>
              </div>

              {selectedPost.featured_image_url && (
                <div className="featured-image-wrapper">
                  <img
                    src={selectedPost.featured_image_url}
                    alt={selectedPost.title}
                    className="featured-image"
                  />
                </div>
              )}

              <div className="post-content" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />

              {selectedPost.media && selectedPost.media.length > 0 && selectedPost.media.some(m => m.asset_type === 'document') && (
                <div className="pdf-section">
                  <h3>📄 Attached Documents</h3>
                  <div className="pdf-list">
                    {selectedPost.media
                      .filter(m => m.asset_type === 'document')
                      .map((pdf, index) => (
                        <div key={index} className="pdf-item">
                          <div className="pdf-item-info">
                            <FileText size={24} className="pdf-icon" />
                            <div className="pdf-details">
                              <p className="pdf-name">
                                {pdf.url.split('/').pop() || `Document ${index + 1}`}
                              </p>
                              <button
                                type="button"
                                className="pdf-link"
                                onClick={() => setSelectedPdfUrl(pdf.url)}
                              >
                                View PDF
                              </button>
                            </div>
                          </div>
                          <a
                            href={pdf.url}
                            download
                            className="download-btn"
                            title="Download PDF"
                          >
                            <Download size={18} />
                          </a>
                        </div>
                      ))}
                  </div>
                  {selectedPdfUrl && (
                    <div className="pdf-viewer">
                      <div className="pdf-viewer-header">
                        <span>PDF Preview</span>
                        <button
                          type="button"
                          className="close-pdf-viewer"
                          onClick={() => setSelectedPdfUrl(null)}
                        >
                          Close
                        </button>
                      </div>
                      <iframe
                        src={selectedPdfUrl}
                        title="PDF preview"
                        className="pdf-viewer-iframe"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="post-footer">
                <button
                  className="back-btn-bottom"
                  onClick={() => setSelectedPost(null)}
                >
                  <ChevronRight size={20} /> Back to Reports
                </button>
              </div>
            </article>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="blog-page">
      {/* Hero Section */}
      {/* <section className="blog-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Market Reports & Analysis</h1>
            <p>In-depth research, market data, and expert reports to guide your trading decisions</p>
          </div>
        </div>
      </section> */}

      {/* Search Section */}
      <section className="blog-controls-section">
        <div className="container">
          <div className="controls-wrapper">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="results-count">
              {filteredReports.length} report{filteredReports.length !== 1 ? "s" : ""} found
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="blog-content-section">
        <div className="container">
          {error && (
            <div className="error-banner">
              <AlertCircle size={20} />
              <p>{error}</p>
              <button onClick={fetchReports} className="retry-btn">Retry</button>
            </div>
          )}

          {loading ? (
            <div className="loading-state">
              <Loader size={48} className="spinner" />
              <p>Loading reports...</p>
            </div>
          ) : filteredReports.length > 0 ? (
            <div className="blog-grid">
              {filteredReports.map(post => (
                <article key={post.id} className="blog-card">
                  <div className="blog-card-image">
                    {post.featured_image_url ? (
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                      />
                    ) : (
                      <div className="placeholder-image"></div>
                    )}
                    <div className="card-overlay"></div>
                  </div>

                  <div className="blog-card-content">
                    <div className="blog-card-meta">
                      <span className="meta-item">
                        <Calendar size={14} />
                        {formatDate(post.created_at)}
                      </span>
                      <span className="meta-item">
                        <User size={14} />
                        {getAuthorName(post)}
                      </span>
                    </div>

                    <h2>{post.title}</h2>

                    <p className="blog-card-excerpt">
                      {stripHtml(post.description || post.content).substring(0, 120)}...
                    </p>

                    <button
                      className="read-more-btn"
                      onClick={() => setSelectedPost(post)}
                    >
                      Read Report
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="no-results-state">
              <div className="no-results-icon">📊</div>
              <h3>No reports found</h3>
              <p>Try adjusting your search terms</p>
              <button
                className="clear-search-btn"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
