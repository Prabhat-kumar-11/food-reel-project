import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import BottomNavigation from '../../components/BottomNavigation'
import '../../styles/saved.css'
import { API_URL } from '../../App'


const Saved = () => {
  const containerRef = useRef(null)
  const [savedVideos, setSavedVideos] = useState([])
  const [interactions, setInteractions] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize interactions state (handle saved entry shape: { food })
  useEffect(() => {
    const initialInteractions = {}
    savedVideos.forEach(entry => {
      const item = entry.food || entry
      if (!initialInteractions[item._id]) {
        initialInteractions[item._id] = {
          liked: item.isLiked || false,
          likes: item.likesCount || item.likes || 0,
          bookmarked: true,
          bookmarks: item.savesCount || item.bookmarks || 0,
          showComments: false
        }
      }
    })
    setInteractions(initialInteractions)
  }, [savedVideos])

  // Handle video autoplay
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const vids = Array.from(container.querySelectorAll('video'))

    vids.forEach((v) => {
      v.muted = true
      v.playsInline = true
      v.loop = true
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target.querySelector('video')
          if (!video) return

          if (entry.isIntersecting) {
            const playPromise = video.play()
            if (playPromise?.catch) playPromise.catch(() => {})
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.7 }
    )

    const reelBoxes = Array.from(container.querySelectorAll('.reel'))
    reelBoxes.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
      vids.forEach((v) => v.pause())
    }
  }, [savedVideos])

  // Fetch saved videos from backend
  useEffect(() => {
    const fetchSavedVideos = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await axios.get(`${API_URL}/food/save`, { withCredentials: true })
        setSavedVideos(response.data.savedFood || [])
      } catch (err) {
        console.error('Error fetching saved videos:', err)
        setError('Failed to load saved videos')
        setSavedVideos([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSavedVideos()
  }, [])

  // Toggle like
  const toggleLike = async (videoId) => {
    try {
      const currentState = interactions[videoId]?.liked

      // Optimistic update
      setInteractions(prev => ({
        ...prev,
        [videoId]: {
          ...prev[videoId],
          liked: !prev[videoId].liked,
          likes: prev[videoId].liked ? prev[videoId].likes - 1 : prev[videoId].likes + 1
        }
      }))

      // API call
      const response = await axios.post(`${API_URL}/food/like`, { foodId: videoId }, { withCredentials: true })

      // Update with actual data from backend
      if (response.data) {
        setInteractions(prev => ({
          ...prev,
          [videoId]: {
            ...prev[videoId],
            liked: response.data.isLiked !== undefined ? response.data.isLiked : !currentState,
            likes: response.data.likesCount || prev[videoId].likes
          }
        }))
      }
    } catch (err) {
      console.error('Error toggling like:', err)
      // Revert optimistic update on error
      setInteractions(prev => ({
        ...prev,
        [videoId]: {
          ...prev[videoId],
          liked: interactions[videoId]?.liked,
          likes: interactions[videoId]?.likes || 0
        }
      }))
    }
  }

  // Toggle bookmark (remove from saved)
  const toggleBookmark = async (videoId) => {
    try {
      // Optimistic update - remove from list (saved entry may be { food })
      setSavedVideos(prev => prev.filter(video => {
        const id = video.food ? video.food._id : video._id
        return id !== videoId
      }))

      // API call - toggle save
      const res = await axios.post(`${API_URL}/food/save`, { foodId: videoId }, { withCredentials: true })
      // If backend responds that it's still saved, re-fetch to be consistent
      if (res && res.data && res.data.isSaved) {
        try {
          const response = await axios.get(`${API_URL}/food/save`, { withCredentials: true })
          setSavedVideos(response.data.savedFood || [])
        } catch (fetchErr) {
          console.error('Error refetching saved videos:', fetchErr)
        }
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err)
      // Revert optimistic update on error - refetch list
      try {
        const response = await axios.get(`${API_URL}/food/save`, { withCredentials: true })
        setSavedVideos(response.data.savedFood || [])
      } catch (fetchErr) {
        console.error('Error refetching saved videos:', fetchErr)
      }
    }
  }

  // Toggle comments visibility
  const toggleComments = (videoId) => {
    setInteractions(prev => ({
      ...prev,
      [videoId]: {
        ...prev[videoId],
        showComments: !prev[videoId].showComments
      }
    }))
  }

  if (isLoading) {
    return (
      <div className="saved-page-container">
        <div className="saved-loading">
          <p>Loading saved items...</p>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  if (error) {
    return (
      <div className="saved-page-container">
        <div className="saved-empty">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/" className="back-to-home-btn">
            Go to Home
          </Link>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  if (savedVideos.length === 0) {
    return (
      <div className="saved-page-container">
        <div className="saved-empty">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 3H5c-1.11 0-2 .9-2 2v16l7-3 7 3V5c0-1.1.89-2 2-2z" />
            </svg>
          </div>
          <h2>No Saved Items</h2>
          <p>Videos you bookmark will appear here</p>
          <Link to="/" className="back-to-home-btn">
            Go to Home
          </Link>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="saved-page-container">
      <div className="saved-page">
        <div className="saved-header">
          <h1>Saved</h1>
          <p className="saved-count">{savedVideos.length} items</p>
        </div>

        <div className="saved-container" ref={containerRef}>
          {savedVideos.map((r) => (
            <div className="reel" key={r._id}>
              <video
                src={r.video}
                className="reel-video"
                preload="metadata"
                playsInline
                autoPlay
                muted
              />

              {/* Right side interaction bar */}
              <div className="reel-interactions">
                {/* Like Button */}
                <button
                  className={`interaction-btn like-btn ${interactions[r._id]?.liked ? 'active' : ''}`}
                  onClick={() => toggleLike(r._id)}
                  title="Like"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="interaction-count">{interactions[r._id]?.likes || 0}</span>
                </button>

                {/* Comment Button */}
                <button
                  className="interaction-btn comment-btn"
                  onClick={() => toggleComments(r._id)}
                  title="Comments"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                  </svg>
                  <span className="interaction-count">23</span>
                </button>

                {/* Bookmark/Save Button */}
                <button
                  className={`interaction-btn bookmark-btn ${interactions[r._id]?.bookmarked ? 'active' : ''}`}
                  onClick={() => toggleBookmark(r._id)}
                  title="Remove from saved"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 3H5c-1.11 0-2 .9-2 2v16l7-3 7 3V5c0-1.1.89-2 2-2z" />
                  </svg>
                  <span className="interaction-count">{interactions[r._id]?.bookmarks || 0}</span>
                </button>
              </div>

              {/* Overlay content at bottom */}
              <div className="reel-overlay">
                <div className="reel-top">
                  <p className="reel-desc">{r.description}</p>

                  <Link className="visit-btn" to={`/food-partner/${r.foodPartner}`}>
                    Visit store
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}

export default Saved
