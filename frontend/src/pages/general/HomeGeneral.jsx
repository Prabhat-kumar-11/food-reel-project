import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import BottomNavigation from '../../components/BottomNavigation'
import '../../styles/reels.css'
import { API_URL } from '../../App'


const HomeGeneral = () => {
  const containerRef = useRef(null)
  const [videos, setVideos] = useState([])
  const [interactions, setInteractions] = useState({})
  const [loading, setLoading] = useState(true)

  // Initialize interactions state
  useEffect(() => {
    const initialInteractions = {}
    videos.forEach(video => {
      if (!initialInteractions[video._id]) {
        initialInteractions[video._id] = {
          liked: video.isLiked || false,
          likes: video.likes || 0,
          bookmarked: video.isBookmarked || false,
          bookmarks: video.bookmarks || 0,
          showComments: false
        }
      }
    })
    setInteractions(initialInteractions)
  }, [videos])

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
  }, [videos])

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_URL}/api/food`, { 
          withCredentials: true 
        })
        setVideos(response.data.foodItems || [])
      } catch (err) {
        console.error('Error fetching videos:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
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

      // API call - adjust endpoint based on your backend structure
      const response = await axios.post(
        `${API_URL}/api/food/${videoId}/like`,
        { liked: !currentState },
        { withCredentials: true }
      )

      // Update with actual data from backend
      if (response.data) {
        setInteractions(prev => ({
          ...prev,
          [videoId]: {
            ...prev[videoId],
            liked: response.data.isLiked !== undefined ? response.data.isLiked : !currentState,
            likes: response.data.likes || prev[videoId].likes
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

  // Toggle bookmark (saved)
  const toggleBookmark = async (videoId) => {
    try {
      const currentState = interactions[videoId]?.bookmarked
      
      // Optimistic update
      setInteractions(prev => ({
        ...prev,
        [videoId]: {
          ...prev[videoId],
          bookmarked: !prev[videoId].bookmarked,
          bookmarks: prev[videoId].bookmarked ? prev[videoId].bookmarks - 1 : prev[videoId].bookmarks + 1
        }
      }))

      // API call - adjust endpoint based on your backend structure
      const response = await axios.post(
        `${API_URL}/api/food/${videoId}/bookmark`,
        { bookmarked: !currentState },
        { withCredentials: true }
      )

      // Update with actual data from backend
      if (response.data) {
        setInteractions(prev => ({
          ...prev,
          [videoId]: {
            ...prev[videoId],
            bookmarked: response.data.isBookmarked !== undefined ? response.data.isBookmarked : !currentState,
            bookmarks: response.data.bookmarks || prev[videoId].bookmarks
          }
        }))
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err)
      // Revert optimistic update on error
      setInteractions(prev => ({
        ...prev,
        [videoId]: {
          ...prev[videoId],
          bookmarked: interactions[videoId]?.bookmarked,
          bookmarks: interactions[videoId]?.bookmarks || 0
        }
      }))
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
  
  if (loading) {
    return (
      <div className="reels-page-container">
        <div className="reels-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <p>Loading videos...</p>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="reels-page-container">
      <div className="reels-page">
        <div className="reels-container" ref={containerRef}>
          {videos.map((r) => (
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
                  title="Save"
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

export default HomeGeneral
