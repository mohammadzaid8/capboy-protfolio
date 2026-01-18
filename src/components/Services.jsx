import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const BASE_URL = "https://pub-22f00052526b4a6087e6351b8539a93d.r2.dev"

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
    {
        id: 1,
        title: "3D Animation",
        description: "We craft high-fidelity 3D animations that blur the line between virtual and reality. Specializing in automotive cinematography, we use Unreal Engine 5 to deliver photorealistic lighting, physics-based driving dynamics, and emotional storytelling. Whether it's a commercial spot or a brand launch, we make sure the machine has a soul.",
        video: `${BASE_URL}/assets/home_page/service_cards/01_3d_animation.mp4`
    },
    {
        id: 2,
        title: "CGI & Mixed Reality",
        description: "Seamlessly blend live-action footage with computer-generated elements. We create viral-ready Mixed Reality content that puts virtual cars into real-world streets or transforms ordinary footage into a digital dreamscape. Perfect for high-impact social media content and VFX-heavy commercials that need to break the laws of physics.",
        video: `${BASE_URL}/assets/home_page/service_cards/02_cgi_mix_reality.mp4`
    },
    {
        id: 3,
        title: "AI Creative Concepts",
        description: "Accelerate your vision with cutting-edge AI workflows. We use advanced AI tools to generate unique mood boards, style frames, and livery concepts before a single polygon is modeled. This rapid prototyping ensures we nail the art direction and lighting style instantly, saving time while exploring limitless visual possibilities.",
        video: `${BASE_URL}/assets/home_page/service_cards/01_3d_animation.mp4`
    },
    {
        id: 4,
        title: "Unreal Engine Configurators",
        description: "Don't just show the car—let them drive it. We build fully interactive 3D Car Configurators using Unreal Engine (Pixel Streaming). Users can change paint colors, swap wheels, trigger animations, and explore detailed interiors in real-time 4K. It’s not just a video; it’s a digital showroom that runs anywhere.",
        video: `${BASE_URL}/assets/home_page/service_cards/01_3d_animation.mp4`
    },
    {
        id: 5,
        title: "3D Game Environments",
        description: "From hyper-realistic racetracks to stylized cyberpunk cities, we design immersive 3D environments optimized for performance. Whether for a racing simulator, a game level, or a Virtual Production LED volume, we build worlds with optimized topology, dynamic lighting (Lumen), and rich textures that tell a story of their own.",
        video: `${BASE_URL}/assets/home_page/service_cards/02_cgi_mix_reality.mp4`
    }
]

const Services = () => {
    const cardsRef = useRef([])

    useEffect(() => {
        // Animation for scaling down cards as they get covered
        cardsRef.current.forEach((card, i) => {
            if (!card || i === cardsRef.current.length - 1) return // Skip last card

            gsap.to(card, {
                scale: 0.9,
                filter: "blur(10px)",
                opacity: 1, // Keep opacity 1 to prevent bleed-through
                ease: "none",
                scrollTrigger: {
                    trigger: card,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                }
            })
        })

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill())
        }
    }, [])

    return (
        <section className="relative w-full bg-transparent pt-24 pb-48 px-4 md:px-12 flex flex-col items-center">
            <div className="w-full max-w-7xl mb-24">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">Our Expertise</h2>
                <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-transparent"></div>
            </div>

            <div className="w-full max-w-7xl flex flex-col gap-12 lg:gap-24">
                {SERVICES.map((service, i) => (
                    <div
                        key={service.id}
                        ref={el => cardsRef.current[i] = el}
                        style={{ zIndex: i + 1 }}
                        // Sticky Wrapper: Keeps full height for scrolling/stacking
                        className="sticky top-0 w-full min-h-screen flex items-center justify-center origin-top py-12"
                    >
                        <div
                            className="relative w-full max-w-7xl h-auto lg:h-[70vh] lg:min-h-[600px] bg-[#111]/80 backdrop-blur-md rounded-none border border-white/10 overflow-hidden shadow-2xl flex flex-col lg:flex-row z-10"
                        >
                            {/* Tech Corners */}
                            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-gray-500 z-20 pointer-events-none" />
                            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-gray-500 z-20 pointer-events-none" />
                            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-gray-500 z-20 pointer-events-none" />
                            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-gray-500 z-20 pointer-events-none" />

                            {/* Left Column: Content */}
                            <div className="w-full lg:w-1/2 flex flex-col justify-center items-start z-10 p-6 md:p-8 lg:p-12">
                                <span className="text-indigo-400 text-lg font-mono mb-4 tracking-wider">
                                    [ 0{i + 1} ]
                                </span>
                                <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
                                    {service.title}
                                </h3>
                                <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-sm mb-6">
                                    {service.description}
                                </p>
                                <button className="px-6 py-2 lg:px-8 lg:py-3 rounded-none border border-white/20 text-white text-sm font-medium hover:bg-white hover:text-black transition-all duration-300">
                                    Learn More
                                </button>
                            </div>

                            {/* Right Column: Image Container - Strict 16:9 Cinematic Ratio */}
                            <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#0f0f0f] p-4 lg:p-8">
                                <div className="w-full aspect-video relative overflow-hidden rounded-none border border-white/5 group border-trace">
                                    {/* 4 Spans for the Moving Border Animation */}
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>

                                    <video
                                        src={service.video}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="auto"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-0 animate-fade-in"
                                        onCanPlay={(e) => e.currentTarget.style.opacity = 1}
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Services

