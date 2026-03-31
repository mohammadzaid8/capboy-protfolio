import { useRef, useState, useEffect } from 'react'

/**
 * OptimizedVideo - Super fast video loading
 * 
 * Strategy:
 * 1. Show poster image IMMEDIATELY
 * 2. Start video playback AS SOON AS POSSIBLE (don't wait for buffer)
 * 3. Fade from poster to video when video actually starts playing
 * 4. Browser handles buffering during playback
 */
const OptimizedVideo = ({
    src,
    poster,
    className = '',
    autoPlay = true,
    muted = true,
    loop = true,
    playsInline = true,
    controls = false,
    rootMargin = '50px',
    ...props
}) => {
    const containerRef = useRef(null)
    const videoRef = useRef(null)
    const [shouldLoad, setShouldLoad] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [hasError, setHasError] = useState(false)

    // Intersection Observer - load video when near viewport
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                if (entry.isIntersecting) {
                    setShouldLoad(true)
                } else if (videoRef.current && !videoRef.current.paused) {
                    videoRef.current.pause()
                }
            },
            { rootMargin, threshold: 0.1 }
        )

        observer.observe(container)
        return () => observer.disconnect()
    }, [rootMargin])

    // Auto-play when video element is ready
    useEffect(() => {
        const video = videoRef.current
        if (!video || !shouldLoad || !autoPlay) return

        // Try to play immediately
        const tryPlay = () => {
            video.play()
                .then(() => setIsPlaying(true))
                .catch(() => {
                    // Retry after a short delay if failed
                    setTimeout(() => {
                        video.play()
                            .then(() => setIsPlaying(true))
                            .catch(() => {})
                    }, 100)
                })
        }

        // Play as soon as we have any data
        video.addEventListener('loadeddata', tryPlay)
        
        // Also try on canplay as backup
        video.addEventListener('canplay', tryPlay)

        return () => {
            video.removeEventListener('loadeddata', tryPlay)
            video.removeEventListener('canplay', tryPlay)
        }
    }, [shouldLoad, autoPlay])

    // Resume playback when coming back into view
    useEffect(() => {
        if (!shouldLoad || !videoRef.current) return

        const observer = new IntersectionObserver(
            (entries) => {
                const video = videoRef.current
                if (!video) return
                
                if (entries[0].isIntersecting && autoPlay) {
                    video.play()
                        .then(() => setIsPlaying(true))
                        .catch(() => {})
                } else {
                    video.pause()
                }
            },
            { threshold: 0.2 }
        )

        observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [shouldLoad, autoPlay])

    return (
        <div 
            ref={containerRef} 
            className={`relative overflow-hidden bg-[#0a0a0a] ${className}`}
        >
            {/* Poster Image - Shows instantly, hides when video plays */}
            {poster && (
                <img
                    src={poster}
                    alt=""
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                        isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                    loading="eager"
                />
            )}

            {/* Gradient placeholder if no poster */}
            {!poster && !isPlaying && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
            )}

            {/* Error state */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] z-10">
                    <span className="text-gray-600 text-sm">Video unavailable</span>
                </div>
            )}

            {/* Video - Loads and plays ASAP */}
            {shouldLoad && !hasError && (
                <video
                    ref={videoRef}
                    src={src}
                    muted={muted}
                    loop={loop}
                    playsInline={playsInline}
                    controls={controls}
                    preload="auto"
                    onError={() => setHasError(true)}
                    onPlaying={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                        isPlaying ? 'opacity-100' : 'opacity-0'
                    }`}
                    {...props}
                />
            )}
        </div>
    )
}

export default OptimizedVideo
