import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../components/Admin/AdminLayout'
import { blogAPI } from '../services/api'
import RichEditor from '../components/RichEditor'
import { Upload, X, Check, AlertCircle, ArrowLeft, Loader, FileText, Download, Trash2 } from 'lucide-react'
import '../styles/BlogUpload.css'

const BlogEdit = () => {
    const { id } = useParams()
    const { isAdmin } = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        blogTitle: '',
        blogCategory: '',
        blogDescription: '',
        blogContent: '',
        featuredImage: null,
        tags: 'Blogs'
    })

    const [existingFeaturedImage, setExistingFeaturedImage] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)
    const [removeFeaturedImage, setRemoveFeaturedImage] = useState(false)
    const [existingPDFs, setExistingPDFs] = useState([])
    const [pdfFilesToRemove, setPdfFilesToRemove] = useState([])
    const [newPdfFiles, setNewPdfFiles] = useState([])
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [isPublished, setIsPublished] = useState(false)

    // Fetch existing blog data
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setFetching(true)
                const response = await blogAPI.getById(id)
                const blog = response.data?.data || response.data

                setFormData({
                    blogTitle: blog.title || '',
                    blogCategory: blog.category || '',
                    blogDescription: blog.description || '',
                    blogContent: blog.content || '',
                    featuredImage: null,
                    tags: (blog.tags && blog.tags.length > 0) ? blog.tags[0] : 'Blogs'
                })

                setIsPublished(blog.is_published || false)

                if (blog.featured_image_url) {
                    setExistingFeaturedImage(blog.featured_image_url)
                    setPreviewImage(blog.featured_image_url)
                }

                // Fetch existing PDFs from media
                if (blog.media && Array.isArray(blog.media)) {
                    const pdfMedia = blog.media.filter(m => m.asset_type === 'document')
                    setExistingPDFs(pdfMedia)
                }
            } catch (err) {
                setError(err.message || 'Failed to load blog')
            } finally {
                setFetching(false)
            }
        }

        if (id) fetchBlog()
    }, [id])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        setError('')
    }

    const handleContentChange = (content) => {
        setFormData(prev => ({
            ...prev,
            blogContent: content
        }))
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setError('Image size should be less than 10MB')
                return
            }
            const reader = new FileReader()
            reader.onload = (event) => {
                setPreviewImage(event.target.result)
                setFormData(prev => ({
                    ...prev,
                    featuredImage: file
                }))
                setRemoveFeaturedImage(false)
            }
            reader.readAsDataURL(file)
            setError('')
        }
    }

    const handleRemoveImage = (e) => {
        e.stopPropagation()
        setPreviewImage(null)
        setFormData(prev => ({ ...prev, featuredImage: null }))
        setRemoveFeaturedImage(true)
        setExistingFeaturedImage(null)
    }

    const handlePdfUpload = (e) => {
        const files = Array.from(e.target.files || [])
        
        files.forEach(file => {
            if (file.type === 'application/pdf') {
                if (file.size > 50 * 1024 * 1024) { // 50MB limit for PDFs
                    setError('PDF size should be less than 50MB')
                    return
                }
                setNewPdfFiles(prev => [...prev, file])
                setError('')
            } else {
                setError('Please upload PDF files only')
            }
        })
    }

    const removeNewPdfFile = (index) => {
        setNewPdfFiles(prev => prev.filter((_, i) => i !== index))
    }

    const removeExistingPdfFile = (pdfId) => {
        setPdfFilesToRemove(prev => [...prev, pdfId])
        setExistingPDFs(prev => prev.filter(pdf => pdf.id !== pdfId))
    }

    const restoreExistingPdfFile = (pdfId) => {
        setPdfFilesToRemove(prev => prev.filter(id => id !== pdfId))
        const response = new Promise(resolve => {
            // Re-fetch to get the PDF back (this is a simple approach)
            const storedPDFs = JSON.parse(localStorage.getItem(`existingPDFs_${id}`) || '[]')
            const restored = storedPDFs.find(p => p.id === pdfId)
            if (restored) {
                setExistingPDFs(prev => [...prev, restored])
                resolve()
            }
        })
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess(false)

        try {
            if (!formData.blogTitle || !formData.blogDescription || !formData.blogContent) {
                setError('Please fill in all required fields')
                setLoading(false)
                return
            }

            if (formData.blogContent.replace(/<[^>]*>/g, '').trim().length < 50) {
                setError('Blog content should be at least 50 characters long')
                setLoading(false)
                return
            }

            // Build FormData for API call
            const apiFormData = new FormData()
            apiFormData.append('title', formData.blogTitle)
            apiFormData.append('content', formData.blogContent)
            apiFormData.append('description', formData.blogDescription)
            apiFormData.append('category', formData.blogCategory || '')
            apiFormData.append('tags', formData.tags)
            apiFormData.append('is_published', isPublished ? 'true' : 'false')

            if (formData.featuredImage) {
                apiFormData.append('featured_image', formData.featuredImage)
            }

            if (removeFeaturedImage) {
                apiFormData.append('remove_featured_image', 'true')
            }

            // Add new PDF files
            newPdfFiles.forEach((pdfFile) => {
                apiFormData.append('files', pdfFile)
            })

            // Add PDFs to remove
            if (pdfFilesToRemove.length > 0) {
                apiFormData.append('remove_media_ids', JSON.stringify(pdfFilesToRemove))
            }

            await blogAPI.updateWithMedia(id, apiFormData)

            setSuccess(true)
            setTimeout(() => {
                setSuccess(false)
                navigate('/admin/blog-management')
            }, 2000)
        } catch (err) {
            setError(err.message || 'Failed to update blog post')
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <AdminLayout pageTitle="Edit Blog Post" pageSubtitle="Loading...">
                <div className="admin-empty-state">
                    <Loader size={48} className="spin-animation" />
                    <h3>Loading blog data...</h3>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout pageTitle="Edit Blog Post" pageSubtitle="Update your article">
            <div style={{ marginBottom: 16 }}>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/admin/blog-management')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                >
                    <ArrowLeft size={16} /> Back to Blog Management
                </button>
            </div>

            {success && (
                <div className="alert alert-success">
                    <Check size={20} />
                    <span>Blog post updated successfully! Redirecting...</span>
                </div>
            )}

            {error && (
                <div className="alert alert-error">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="blog-form">
                <div className="form-section">
                    <h2>Blog Information</h2>

                    <div className="form-group">
                        <label htmlFor="blogTitle">Blog Title *</label>
                        <input
                            type="text"
                            id="blogTitle"
                            name="blogTitle"
                            value={formData.blogTitle}
                            onChange={handleInputChange}
                            placeholder="Enter a compelling blog title"
                            disabled={loading}
                            required
                        />
                        <p className="char-count">{formData.blogTitle.length}/100</p>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="blogCategory">Category</label>
                            <select
                                id="blogCategory"
                                name="blogCategory"
                                value={formData.blogCategory}
                                onChange={handleInputChange}
                                disabled={loading}
                            >
                                <option value="">Select a category</option>
                                <option value="Daily Update">Daily Update</option>
                                <option value="Market Analysis">Market Analysis</option>
                                <option value="Crypto News">Crypto News</option>
                                <option value="Education">Education</option>
                                <option value="Health & Fitness">Health & Fitness</option>
                                <option value="Medical">Medical</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="publishStatus">Status</label>
                            <select
                                id="publishStatus"
                                value={isPublished ? 'published' : 'draft'}
                                onChange={(e) => setIsPublished(e.target.value === 'published')}
                                disabled={loading}
                            >
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="blogDescription">Short Description *</label>
                        <textarea
                            id="blogDescription"
                            name="blogDescription"
                            value={formData.blogDescription}
                            onChange={handleInputChange}
                            placeholder="Write a brief description (will appear in blog list)"
                            rows="3"
                            disabled={loading}
                            required
                        ></textarea>
                        <p className="char-count">{formData.blogDescription.length}/500</p>
                    </div>

                    <div className="form-group">
                            <label htmlFor="tags">Content Type</label>
                            <select
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                disabled={loading}
                            >
                                <option value="Blogs">Blogs</option>
                                <option value="Reports">Reports</option>
                            </select>
                        </div>
                </div>

                <div className="form-section">
                    <h2>Featured Image</h2>
                    <div className="form-group">
                        <label htmlFor="featuredImage">Upload Featured Image</label>
                        <div className="file-upload-wrapper">
                            <input
                                type="file"
                                id="featuredImage"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={loading}
                            />
                            <div className="upload-area" onClick={() => document.getElementById('featuredImage').click()}>
                                {previewImage ? (
                                    <>
                                        <img src={previewImage} alt="Featured preview" className="image-preview" />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="remove-btn"
                                        >
                                            <X size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={32} />
                                        <p>Click to upload featured image</p>
                                        <span>PNG, JPG, GIF up to 10MB</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2>PDF Documents (Optional)</h2>
                    
                    {existingPDFs.length > 0 && (
                        <div className="form-group">
                            <label>Existing PDFs</label>
                            <div className="pdf-files-list">
                                <h3>Current Files ({existingPDFs.length})</h3>
                                <ul>
                                    {existingPDFs.map((pdf) => (
                                        <li key={pdf.id} className="pdf-file-item">
                                            <div className="pdf-file-info">
                                                <FileText size={20} />
                                                <div className="pdf-file-details">
                                                    <p className="pdf-file-name">{pdf.url.split('/').pop() || `Document`}</p>
                                                    <p className="pdf-file-size">Existing file</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeExistingPdfFile(pdf.id)}
                                                className="remove-pdf-btn"
                                                disabled={loading}
                                                title="Remove this PDF"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="pdfFile">Upload Additional PDF Files</label>
                        <p className="helper-text">Add more PDF documents or replace existing ones</p>
                        <div className="file-upload-wrapper">
                            <input
                                type="file"
                                id="pdfFile"
                                accept=".pdf"
                                onChange={handlePdfUpload}
                                disabled={loading}
                                multiple
                            />
                            <div className="upload-area" onClick={() => document.getElementById('pdfFile').click()}>
                                <Upload size={32} />
                                <p>Click to upload PDF files</p>
                                <span>PDF files up to 50MB each</span>
                            </div>
                        </div>

                        {newPdfFiles.length > 0 && (
                            <div className="pdf-files-list">
                                <h3>New Files to Upload ({newPdfFiles.length})</h3>
                                <ul>
                                    {newPdfFiles.map((file, index) => (
                                        <li key={index} className="pdf-file-item">
                                            <div className="pdf-file-info">
                                                <FileText size={20} />
                                                <div className="pdf-file-details">
                                                    <p className="pdf-file-name">{file.name}</p>
                                                    <p className="pdf-file-size">
                                                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeNewPdfFile(index)}
                                                className="remove-pdf-btn"
                                                disabled={loading}
                                            >
                                                <X size={16} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-section">
                    <div className="form-group">
                        <label>Content * (Similar to Word Document)</label>
                        <p className="helper-text">
                            Use the toolbar below to format your text, add images, videos, and create a professional blog post.
                        </p>
                        <RichEditor
                            content={formData.blogContent}
                            onChange={handleContentChange}
                            blogId={id}
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        disabled={loading}
                        onClick={() => navigate('/admin/blog-management')}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    )
}

export default BlogEdit
