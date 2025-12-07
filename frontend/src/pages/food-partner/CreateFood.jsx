import React, { useState } from 'react'
import './create-food.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../App'


const API = import.meta.env.API_URL

const CreateFood = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    video: null,
    videoPreview: null,
    name: '',
    description: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate video file
      if (!file.type.startsWith('video/')) {
        setError('Please upload a valid video file')
        return
      }
      if (file.size > 100 * 1024 * 1024) {
        setError('Video size must be less than 100MB')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          video: file,
          videoPreview: reader.result
        }))
        setError('')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.video) {
      setError('Please upload a video')
      return
    }
    if (!formData.name.trim()) {
      setError('Please enter a food name')
      return
    }
    if (!formData.description.trim()) {
      setError('Please enter a description')
      return
    }

    setLoading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('video', formData.video)
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)

      await axios.post(`${API_URL}/api/food`, formDataToSend, {withCredentials:true})
      
  
      setSuccess('Food created successfully!')
       navigate("/");
      // const response = await fetch('/api/food/create', {
      //   method: 'POST',
      //   body: formDataToSend
      // })
      
      // if (!response.ok) throw new Error('Failed to create food')
      
      
      setFormData({
        video: null,
        videoPreview: null,
        name: '',
        description: ''
      })
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleClearVideo = () => {
    setFormData(prev => ({
      ...prev,
      video: null,
      videoPreview: null
    }))
  }



  return (
    <div className="create-food-container">
      <div className="create-food-card">
        {/* Header */}
        <div className="create-food-header">
          <h1>Create Food</h1>
          <p>Share your delicious food with our community</p>
        </div>

        {/* Alert Messages */}
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="create-food-form">
          {/* Video Input */}
          <div className="form-group">
            <label htmlFor="video" className="form-label">
              Upload Video <span className="required">*</span>
            </label>
            <div className="video-upload-wrapper">
              {formData.videoPreview ? (
                <div className="video-preview">
                  <video controls>
                    <source src={formData.videoPreview} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <button
                    type="button"
                    className="btn-clear-video"
                    onClick={handleClearVideo}
                    title="Remove video"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label htmlFor="video" className="video-upload-label">
                  <div className="upload-icon">📹</div>
                  <p className="upload-text">Click to upload video</p>
                  <p className="upload-hint">or drag and drop</p>
                  <p className="upload-size">Max 100MB</p>
                </label>
              )}
              <input
                type="file"
                id="video"
                name="video"
                accept="video/*"
                onChange={handleVideoChange}
                className="video-input"
              />
            </div>
          </div>

          {/* Food Name Input */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Food Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter food name (e.g., Biryani, Butter Chicken)"
              className="form-input"
              maxLength="50"
            />
            <div className="char-count">
              {formData.name.length}/50
            </div>
          </div>

          {/* Description Input */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your food, ingredients, preparation method, taste, etc."
              className="form-textarea"
              rows="4"
              maxLength="300"
            />
            <div className="char-count">
              {formData.description.length}/300
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`submit-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Food'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateFood
