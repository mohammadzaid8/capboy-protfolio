import { useEffect, useRef } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { PROJECTS } from '../data/projects'
import StreamingVideo from '../components/StreamingVideo'
import LazyImage from '../components/LazyImage'

import { INTRO_POSTER, getIntroVideoUrl } from '../lib/assetManifest'
import { isVideoReady } from '../lib/assetCache'

const SHOWREEL_VIDEO_URL = getIntroVideoUrl()
const SHOWREEL_POSTER = INTRO_POSTER

const WorkPage = () => {
    const { pathname } = useLocation()
    const containerRef = useRef(null)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    useGSAP(() => {
        const tl = gsap.timeline()

        tl.from('.work-title-char', {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.05,
            ease: "power3.out"
        })
            .from('.work-video-container', {
                scale: 0.9,
                opacity: 0,
                duration: 1.5,
                ease: "power2.out"
            }, "-=0.5")
            .from('.work-card', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out"
            }, "-=1")

    }, { scope: containerRef })

    return (
        <div ref={containerRef} className="w-full min-h-screen bg-transparent text-white pt-32 pb-24 px-6 md:px-12">
            <div className="max-w-[1400px] mx-auto flex flex-col gap-20">

                {/* Header */}
                <header className="flex flex-col items-center text-center gap-6">
                    <p className="text-blue-500 font-mono tracking-widest uppercase text-sm">
                        Portfolio
                    </p>
                    <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-none overflow-hidden">
                        <span className="inline-block work-title-char">S</span>
                        <span className="inline-block work-title-char">E</span>
                        <span className="inline-block work-title-char">L</span>
                        <span className="inline-block work-title-char">E</span>
                        <span className="inline-block work-title-char">C</span>
                        <span className="inline-block work-title-char">T</span>
                        <span className="inline-block work-title-char">E</span>
                        <span className="inline-block work-title-char">D</span>
                        <br className="md:hidden" />
                        <span className="inline-block work-title-char">&nbsp;</span>
                        <span className="inline-block work-title-char text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
                            WORKS
                        </span>
                    </h1>
                </header>

                {/* Showreel Video */}
                <div className="work-video-container w-full aspect-video rounded-none overflow-hidden relative shadow-2xl border border-white/10 border-trace">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>

                    <StreamingVideo
                        src={SHOWREEL_VIDEO_URL}
                        poster={SHOWREEL_POSTER}
                        className="w-full h-full"
                        rootMargin="0px"
                        priority={!isVideoReady(SHOWREEL_VIDEO_URL)}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 pointer-events-none">
                        <div className="text-center">
                            <h2 className="text-2xl md:text-4xl font-light tracking-wide">
                                Engineering The Impossible
                            </h2>
                            <p className="text-gray-400 mt-2 font-mono text-sm">
                                SHOWREEL 2025
                            </p>
                        </div>
                    </div>
                </div>

                {/* Project List */}
                <div className="flex flex-col">
                    {PROJECTS.map((project, index) => (
                        <div key={project.id} className="group-wrapper">
                            <div className="work-card group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                                {/* Media */}
                                <Link to={project.link} className="block w-full aspect-video rounded-none overflow-hidden border border-white/10 bg-[#111] relative border-trace group-hover:border-white/30 transition-colors">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>

                                    {project.video ? (
                                        <div className="w-full h-full relative">
                                            <StreamingVideo
                                                src={project.video}
                                                poster={project.home_page_card_banner || project.img}
                                                className="w-full h-full"
                                                rootMargin="0px"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 pointer-events-none z-10" />
                                        </div>
                                    ) : (
                                        <div className="w-full h-full relative">
                                            <LazyImage
                                                src={project.home_page_card_banner || project.img}
                                                alt={project.title}
                                                className="w-full h-full object-cover"
                                                containerClassName="w-full h-full"
                                                rootMargin="200px"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 pointer-events-none z-10" />
                                        </div>
                                    )}
                                </Link>

                                {/* Text */}
                                <div className="flex flex-col gap-6 items-start">
                                    <div className="space-y-2">
                                        <span className="text-blue-500 font-mono text-sm tracking-wider">
                                            [ 0{index + 1} ]
                                        </span>
                                        <h3 className="text-3xl md:text-5xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                                            <Link to={project.link}>{project.title}</Link>
                                        </h3>
                                    </div>

                                    <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                                        {project.longDescription || project.description}
                                    </p>

                                    <Link
                                        to={project.link}
                                        className="inline-flex items-center gap-2 text-white border-b border-white/30 pb-1 hover:border-white transition-colors mt-2"
                                    >
                                        <span className="text-sm uppercase tracking-widest">View Project</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </Link>
                                </div>
                            </div>

                            {/* Divider */}
                            {index !== PROJECTS.length - 1 && (
                                <div className="relative py-24 lg:py-32 flex items-center justify-center opacity-30">
                                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                                    <div className="absolute w-3 h-3 bg-[#0a0a0a] border border-blue-500 rotate-45 flex items-center justify-center">
                                        <div className="w-1 h-1 bg-blue-500 rounded-full" />
                                    </div>
                                </div>
                            )}
                            {index === PROJECTS.length - 1 && <div className="mb-24" />}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default WorkPage
