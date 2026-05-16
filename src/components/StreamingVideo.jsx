import { useRef, useState, useEffect, useCallback } from 'react'
import { useAssetQueue } from '../context/AssetQueueContext'
import { hasAsset } from '../lib/assetCache'

/**
 * StreamingVideo — poster-first, queue-limited video loading.
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
    rootMargin = '0px',
    priority = false,
    enabled = true,
    ...props
}) => {
    const containerRef = useRef(null)
    const videoRef = useRef(null)
    const { requestVideoSlot, releaseVideoSlot } = useAssetQueue()
    const [isVisible, setIsVisible] = useState(false)
    const [hasSlot, setHasSlot] = useState(() => hasAsset(src))
    const slotAcquiredRef = useRef(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [hasError, setHasError] = useState(false)
    const playAttempted = useRef(false)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                setIsVisible(entry.isIntersecting)

                if (!entry.isIntersecting && videoRef.current) {
                    videoRef.current.pause()
                }
            },
            { rootMargin, threshold: 0.01 }
        )

        observer.observe(container)
        return () => observer.disconnect()
    }, [rootMargin])

    useEffect(() => {
        if (!enabled || !isVisible || hasSlot || hasError) return

        let cancelled = false

        requestVideoSlot(src).then(() => {
            if (!cancelled) {
                slotAcquiredRef.current = true
                setHasSlot(true)
            }
        })

        return () => {
            cancelled = true
        }
    }, [enabled, isVisible, hasSlot, hasError, src, requestVideoSlot])

    useEffect(() => {
        return () => {
            if (slotAcquiredRef.current) {
                releaseVideoSlot(src)
                slotAcquiredRef.current = false
            }
        }
    }, [src, releaseVideoSlot])

    const attemptPlay = useCallback(() => {
        const video = videoRef.current
        if (!video || !autoPlay || playAttempted.current) return

        playAttempted.current = true
        const playPromise = video.play()
        if (playPromise !== undefined) {
            playPromise
                .then(() => setIsPlaying(true))
                .catch(() => {
                    playAttempted.current = false
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

    useEffect(() => {
        const video = videoRef.current
        if (!video || !isVisible || !hasSlot) return

        playAttempted.current = false

        const onLoadedData = () => attemptPlay()
        const onCanPlay = () => attemptPlay()
        const onProgress = () => {
            if (!isPlaying && video.readyState >= 2) attemptPlay()
        }
        const onPlaying = () => setIsPlaying(true)
        const onError = () => setHasError(true)

        video.addEventListener('loadeddata', onLoadedData)
        video.addEventListener('canplay', onCanPlay)
        video.addEventListener('progress', onProgress)
        video.addEventListener('playing', onPlaying)
        video.addEventListener('error', onError)

        if (video.readyState >= 2) attemptPlay()

        return () => {
            video.removeEventListener('loadeddata', onLoadedData)
            video.removeEventListener('canplay', onCanPlay)
            video.removeEventListener('progress', onProgress)
            video.removeEventListener('playing', onPlaying)
            video.removeEventListener('error', onError)
        }
    }, [isVisible, hasSlot, attemptPlay, isPlaying])

    useEffect(() => {
        const video = videoRef.current
        if (!video || !isVisible || !autoPlay || !hasSlot) return

        if (video.paused && video.readyState >= 2) {
            playAttempted.current = false
            attemptPlay()
        }
    }, [isVisible, autoPlay, hasSlot, attemptPlay])

    const shouldMountVideo = enabled && isVisible && hasSlot && !hasError

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden bg-[#0a0a0a] ${className}`}
        >
            {poster && (
                <img
                    src={poster}
                    alt=""
                    className={`absolute inset-0 w-full h-full object-cover z-[1] transition-opacity duration-200 ${
                        isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                    loading={priority ? 'eager' : 'lazy'}
                    decoding={priority ? 'sync' : 'async'}
                    fetchpriority={priority ? 'high' : 'auto'}
                />
            )}

            {!poster && !isPlaying && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] z-[1]" />
            )}

            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] z-[2]">
                    <span className="text-gray-600 text-sm">Video unavailable</span>
                </div>
            )}

            {shouldMountVideo && (
                <video
                    ref={videoRef}
                    src={src}
                    muted={muted}
                    loop={loop}
                    playsInline={playsInline}
                    controls={controls}
                    preload="none"
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
