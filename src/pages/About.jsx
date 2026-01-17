import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const About = () => {
    const { pathname } = useLocation()
    const containerRef = useRef(null)
    const textRef = useRef(null)

    // Scroll to top
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    // Animations
    useGSAP(() => {
        const tl = gsap.timeline()

        tl.from('.about-title-char', {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.05,
            ease: "power3.out"
        })
            .from('.about-content', {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power2.out"
            }, "-=0.5")

    }, { scope: containerRef })

    return (
        <div ref={containerRef} className="w-full min-h-screen bg-[#0a0a0a] text-white pt-32 pb-24 mb-24 px-6 md:px-12">
            <div className="max-w-[1400px] mx-auto flex flex-col gap-24">

                {/* Hero / Title Section */}
                <header className="flex flex-col gap-6">
                    <p className="about-content text-blue-400 font-mono tracking-widest uppercase text-sm">
                        About The Studio
                    </p>
                    <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-none overflow-hidden">
                        <span className="inline-block about-title-char">WE</span>
                        <span className="inline-block about-title-char">&nbsp; &nbsp;</span>
                        <span className="inline-block about-title-char">CRAFT</span>
                        <span className="inline-block about-title-char md:hidden">&nbsp;</span>
                        <br className="hidden md:block" />
                        <span className="inline-block about-title-char">DIGITAL</span>
                        <span className="inline-block about-title-char">&nbsp; &nbsp;</span>
                        <span className="inline-block about-title-char text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                            REALITY
                        </span>
                    </h1>
                </header>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

                    {/* Left Column: Visual */}
                    <div className="about-content w-full aspect-[4/5] md:aspect-square lg:aspect-[3/4] rounded-2xl overflow-hidden relative">
                        {/* Using a high-quality asset from existing files as a feature image */}
                        <img
                            src="https://pub-22f00052526b4a6087e6351b8539a93d.r2.dev/assets/self/me.jpg"
                            alt="Founder"
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 md:scale-110 hover:scale-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                        <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12">
                            <p className="text-white text-lg font-mono">EST. 2022</p>
                        </div>
                    </div>

                    {/* Right Column: Text & Capabilities */}
                    <div className="flex flex-col gap-16 justify-center">

                        {/* Narrative */}
                        <div className="about-content space-y-6">
                            <h2 className="text-3xl md:text-4xl font-light leading-snug">
                                Capboy Creation is a premier CGI Production Studio specializing in high-end visual storytelling.
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Born from a passion for the impossible, we bridge the gap between imagination and screen.
                                We don't just build 3D assets; we engineer experiences. From hyper-realistic automotive cinematography
                                to immersive Unreal Engine environments, our mission is to push the boundaries of what's visually possible.
                            </p>
                        </div>

                        {/* Capabilities List */}
                        <div className="about-content space-y-6 border-t border-white/10 pt-12">
                            <h3 className="text-sm font-mono tracking-widest uppercase text-gray-500">
                                Core Capabilities
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    "CGI Automotive Animation",
                                    "Unreal Engine Real-Time Config",
                                    "VFX & Mixed Reality",
                                    "3D Game Environments",
                                    "AI-Enhanced Concept Art"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-xl md:text-2xl text-white group cursor-default">
                                        <span className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-150 transition-transform duration-300" />
                                        <span className="group-hover:translate-x-2 transition-transform duration-300">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Social / Connect Section */}
                        <div className="about-content space-y-6 border-t border-white/10 pt-12">
                            <h3 className="text-sm font-mono tracking-widest uppercase text-gray-500">
                                Connect
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {/* UPDATE THESE LINKS WITH REAL CREDENTIALS */}
                                <a href="mailto:workwithcapboy@gmail.com" className="px-6 py-3 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all duration-300">
                                    Email
                                </a>
                                <a href="https://www.instagram.com/capboy_creation?igsh=aTEwZGdpM2d3bnU2" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all duration-300">
                                    Instagram
                                </a>
                                <a href="https://www.linkedin.com/in/sami-matadar-104a85300/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all duration-300">
                                    LinkedIn
                                </a>
                                <a href="https://www.behance.net/capboymtdcsami" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all duration-300">
                                    Behance
                                </a>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default About
