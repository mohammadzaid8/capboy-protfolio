import { useRef, useState, useEffect } from 'react'

/**
 * LazyVideo - Optimized video component with:
 * - Lazy loading via IntersectionObserver (only loads when near viewport)
 * - Chunked streaming (browser handles Range requests automatically)
 * - Auto pause when off-screen to save bandwidth
 * - Loading skeleton
 * - Mobile optimized (lower data usage)
 */
const LazyVideo = ({
    src,
    poster,
    className = '',
    autoPlay = true,
    muted = true,
    loop = true,
    playsInline = true,
    controls = false,
    rootMargin = '100px',
    ...props
}) => {
    const containerRef = useRef(null)
    const videoRef = useRef(null)
    const [shouldLoad, setShouldLoad] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [hasError, setHasError] = useState(false)

    // Intersection Observer - controls when to load AND when to play/pause
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                
                if (entry.isIntersecting) {
                    // Start loading when entering viewport area
                    setShouldLoad(true)
                    
                    // Play video if loaded
                    if (videoRef.current && isLoaded && autoPlay) {
                        videoRef.current.play().catch(() => {})
                    }
                } else {
                    // Pause when leaving viewport to save bandwidth
                    if (videoRef.current && !videoRef.current.paused) {
                        videoRef.current.pause()
                    }
                }
            },
            {
                rootMargin,
                threshold: 0.1
            }
        )

        observer.observe(container)
        return () => observer.disconnect()
    }, [rootMargin, isLoaded, autoPlay])

    // Handle video ready to play
    const handleCanPlay = () => {
        setIsLoaded(true)
        // Auto-play once loaded
        if (videoRef.current && autoPlay) {
            videoRef.current.play().catch(() => {})
        }
    }

    const handleError = () => {
        setHasError(true)
        console.error('Video failed to load:', src)
    }

    return (
        <div ref={containerRef} className={`relative overflow-hidden bg-[#1a1a1a] ${className}`}>
            {/* Loading Skeleton */}
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-10 h-10 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                </div>
            )}

            {/* Error State */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-gray-500 text-sm text-center px-4">
                        <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Video unavailable
                    </div>
                </div>
            )}

            {/* Video - Only renders when near viewport */}
            {shouldLoad && !hasError && (
                <video
                    ref={videoRef}
                    muted={muted}
                    loop={loop}
                    playsInline={playsInline}
                    controls={controls}
                    preload="metadata"
                    onCanPlay={handleCanPlay}
                    onError={handleError}
                    poster={poster}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    {...props}
                >
                    <source src={src} type="video/mp4" />
                </video>
            )}
        </div>
    )
}

export default LazyVideo
