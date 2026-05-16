import { useRef, useState, useEffect, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import {
    INTRO_POSTER,
    INTRO_LOGO,
    getIntroVideoUrl,
    shouldSkipVideoPreload,
} from '../lib/assetManifest'
import { getImageObjectUrl, isVideoReady } from '../lib/assetCache'

const INTRO_VIDEO_URL = getIntroVideoUrl()

const Intro = () => {
    const containerRef = useRef(null)
    const videoRef = useRef(null)
    const overlayRef = useRef(null)
    const logoRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [showVideo, setShowVideo] = useState(!shouldSkipVideoPreload())
    const playAttempted = useRef(false)

    const posterSrc = getImageObjectUrl(INTRO_POSTER) || INTRO_POSTER
    const logoSrc = getImageObjectUrl(INTRO_LOGO) || INTRO_LOGO
    const videoPreloaded = isVideoReady(INTRO_VIDEO_URL)

    const attemptPlay = useCallback(() => {
        const video = videoRef.current
        if (!video || playAttempted.current) return

        playAttempted.current = true
        video.play()
            .then(() => setIsPlaying(true))
            .catch(() => {
                playAttempted.current = false
                setTimeout(() => {
                    if (videoRef.current) {
                        videoRef.current.play()
                            .then(() => setIsPlaying(true))
                            .catch(() => {})
                    }
                }, 50)
            })
    }, [])

    useEffect(() => {
        const video = videoRef.current
        if (!video || !showVideo) return

        const onLoadedData = () => attemptPlay()
        const onCanPlay = () => attemptPlay()
        const onProgress = () => {
            if (video.readyState >= 2) attemptPlay()
        }
        const onPlaying = () => setIsPlaying(true)

        video.addEventListener('loadeddata', onLoadedData)
        video.addEventListener('canplay', onCanPlay)
        video.addEventListener('progress', onProgress)
        video.addEventListener('playing', onPlaying)

        if (videoPreloaded && video.readyState >= 2) {
            attemptPlay()
        }

        return () => {
            video.removeEventListener('loadeddata', onLoadedData)
            video.removeEventListener('canplay', onCanPlay)
            video.removeEventListener('progress', onProgress)
            video.removeEventListener('playing', onPlaying)
        }
    }, [attemptPlay, showVideo, videoPreloaded])

    useGSAP(() => {
        const tl = gsap.timeline()

        gsap.set(videoRef.current, { scale: 1.2 })
        gsap.set(overlayRef.current, { opacity: 0 })
        gsap.set(logoRef.current, {
            opacity: 0,
            y: 100,
            scale: 1.1,
            filter: 'blur(20px)',
        })

        tl.to(videoRef.current, {
            scale: 1,
            duration: 2.5,
            ease: 'power2.out',
        })
            .to(
                overlayRef.current,
                {
                    opacity: 1,
                    duration: 1.5,
                    ease: 'power2.out',
                },
                '-=2'
            )
            .to(
                logoRef.current,
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 1.8,
                    ease: 'power4.out',
                },
                '-=1.2'
            )
    }, { scope: containerRef })

    return (
        <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black">
            <div className="absolute inset-0 z-0">
                <img
                    src={posterSrc}
                    alt=""
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
                        isPlaying ? 'opacity-0' : 'opacity-100'
                    }`}
                    style={{ transform: 'scale(1.2)' }}
                    loading="eager"
                    decoding="sync"
                    fetchpriority="high"
                />

                {showVideo && (
                    <video
                        ref={videoRef}
                        muted
                        loop
                        playsInline
                        preload={videoPreloaded ? 'auto' : 'metadata'}
                        className={`w-full h-full object-cover transition-opacity duration-200 ${
                            isPlaying ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <source src={INTRO_VIDEO_URL} type="video/mp4" />
                    </video>
                )}

                {shouldSkipVideoPreload() && !showVideo && (
                    <button
                        type="button"
                        onClick={() => setShowVideo(true)}
                        className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 text-white font-mono text-sm uppercase tracking-widest"
                    >
                        Tap to play showreel
                    </button>
                )}
            </div>

            <div ref={overlayRef} className="absolute inset-0 z-0 bg-black/30" />

            <div className="absolute bottom-0 left-0 w-full h-[60vh] bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10 pointer-events-none" />

            <div className="absolute inset-0 z-10 flex items-end pb-24 md:pb-32 justify-center px-4">
                <div ref={logoRef} className="flex flex-col items-center w-full max-w-[1600px] gap-8">
                    <div className="w-full flex justify-center">
                        <div className="w-full">
                            <img
                                src={logoSrc}
                                alt="Artix Studios"
                                className="w-full h-auto object-contain"
                                loading="eager"
                                fetchpriority="high"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Intro
