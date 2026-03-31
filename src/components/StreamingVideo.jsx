import { useRef, useState, useEffect, useCallback } from 'react'

/**
 * StreamingVideo - Aggressive chunked loading
 * 
 * Strategy:
 * 1. Show poster INSTANTLY
 * 2. Load video with aggressive streaming (browser handles Range requests)
 * 3. Start playing as soon as ANY data is available
 * 4. Use 'loadstart' -> immediate feedback
 * 5. Prioritize visible videos with higher fetch priority
 */
const StreamingVideo = ({
    src,
    poster,
    className = '',
    autoPlay = true,
    muted = true,
    loop = true,
    playsInline = true,
    controls = false,
    rootMargin = '100px',
    priority = false, // Set true for above-the-fold videos
    ...props
}) => {
    const containerRef = useRef(null)
    const videoRef = useRef(null)
    const [isVisible, setIsVisible] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [hasError, setHasError] = useState(false)
    const playAttempted = useRef(false)

    // Intersection Observer - detect when video is visible
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                setIsVisible(entry.isIntersecting)
                
                // Pause when out of view to free up bandwidth for visible videos
                if (!entry.isIntersecting && videoRef.current) {
                    videoRef.current.pause()
                }
            },
            { rootMargin, threshold: 0.01 }
        )

        observer.observe(container)
        return () => observer.disconnect()
    }, [rootMargin])

    // Aggressive play - try to play as soon as possible
    const attemptPlay = useCallback(() => {
        const video = videoRef.current
        if (!video || !autoPlay || playAttempted.current) return

        playAttempted.current = true
        
        // Force play attempt
        const playPromise = video.play()
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    setIsPlaying(true)
                })
                .catch((err) => {
                    // Reset and retry on user interaction
                    playAttempted.current = false
                    // Try again after a tiny delay
                    setTimeout(() => {
                        if (videoRef.current && isVisible) {
                            videoRef.current.play()
                                .then(() => setIsPlaying(true))
                                .catch(() => {})
                        }
                    }, 50)
                })
        }
    }, [autoPlay, isVisible])

    // Setup video event listeners
    useEffect(() => {
        const video = videoRef.current
        if (!video || !isVisible) return

        playAttempted.current = false

        // Multiple events to catch the earliest possible moment to play
        const onLoadStart = () => {
            // Video started loading, prepare for playback
        }

        const onLoadedData = () => {
            // We have the first frame - TRY TO PLAY NOW
            attemptPlay()
        }

        const onCanPlay = () => {
            attemptPlay()
        }

        const onProgress = () => {
            // Data is being received - try to play if we haven't
            if (!isPlaying && video.readyState >= 2) {
                attemptPlay()
            }
        }

        const onPlaying = () => {
            setIsPlaying(true)
        }

        const onWaiting = () => {
            // Video is buffering - keep poster visible
            // Don't set isPlaying to false to avoid flicker
        }

        const onError = () => {
            setHasError(true)
        }

        video.addEventListener('loadstart', onLoadStart)
        video.addEventListener('loadeddata', onLoadedData)
        video.addEventListener('canplay', onCanPlay)
        video.addEventListener('progress', onProgress)
        video.addEventListener('playing', onPlaying)
        video.addEventListener('waiting', onWaiting)
        video.addEventListener('error', onError)

        // If video already has data, try to play
        if (video.readyState >= 2) {
            attemptPlay()
        }

        return () => {
            video.removeEventListener('loadstart', onLoadStart)
            video.removeEventListener('loadeddata', onLoadedData)
            video.removeEventListener('canplay', onCanPlay)
            video.removeEventListener('progress', onProgress)
            video.removeEventListener('playing', onPlaying)
            video.removeEventListener('waiting', onWaiting)
            video.removeEventListener('error', onError)
        }
    }, [isVisible, attemptPlay, isPlaying])

    // Resume play when coming back into view
    useEffect(() => {
        const video = videoRef.current
        if (!video || !isVisible || !autoPlay) return

        if (video.paused && video.readyState >= 2) {
            playAttempted.current = false
            attemptPlay()
        }
    }, [isVisible, autoPlay, attemptPlay])

    return (
        <div 
            ref={containerRef} 
            className={`relative overflow-hidden bg-[#0a0a0a] ${className}`}
        >
            {/* Poster - Shows INSTANTLY, fades when video plays */}
            {poster && (
                <img
                    src={poster}
                    alt=""
                    className={`absolute inset-0 w-full h-full object-cover z-[1] transition-opacity duration-200 ${
                        isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                    loading={priority ? "eager" : "lazy"}
                    decoding={priority ? "sync" : "async"}
                    fetchpriority={priority ? "high" : "auto"}
                />
            )}

            {/* Fallback gradient if no poster */}
            {!poster && !isPlaying && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] z-[1]" />
            )}

            {/* Error state */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] z-[2]">
                    <span className="text-gray-600 text-sm">Video unavailable</span>
                </div>
            )}

            {/* Video - Streams in chunks automatically via HTTP Range */}
            {isVisible && !hasError && (
                <video
                    ref={videoRef}
                    src={src}
                    muted={muted}
                    loop={loop}
                    playsInline={playsInline}
                    controls={controls}
                    preload="auto"
                    className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-200 ${
                        isPlaying ? 'opacity-100' : 'opacity-0'
                    }`}
                    {...props}
                />
            )}
        </div>
    )
}

export default StreamingVideo
