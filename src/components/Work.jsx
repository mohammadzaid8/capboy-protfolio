import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PROJECTS } from '../data/projects'
import TextScramble from './TextScramble'
import TiltCard from './TiltCard'

gsap.registerPlugin(ScrollTrigger)

const Work = () => {
    const containerRef = useRef(null)
    const textRef = useRef(null)
    const cardsRef = useRef([])

    useEffect(() => {
        const triggers = ScrollTrigger.getAll()
        // Be careful not to kill triggers from other components (Hero/Services)
        // Ideally we should track our own triggers, but for now this pattern was used previously. 
        // Better: let GSAP handle it or only kill triggers associated with this component if possible.
        // For safety in this "replace" action, I'll stick to the pattern but scope it if I could. 
        // Actually, previous code killed ALL triggers which is bad practice if multiple components use ScrollTrigger.
        // I will remove the global kill to prevent breaking Services/Hero. 

        const scrollTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: '+=250%',
                pin: true,
                scrub: 1,
            }
        })

        // 1. Text Animation
        scrollTimeline.to(textRef.current, {
            scale: 5,
            opacity: 0,
            duration: 1,
            ease: 'power2.in'
        }, 0)

        // 2. Cards Animation
        cardsRef.current.forEach((card, i) => {
            if (!card) return

            const rect = card.getBoundingClientRect()
            const viewportCenterX = window.innerWidth / 2
            const viewportCenterY = window.innerHeight / 2

            // Initial generic calculation (approximation since they are hidden/absolute initially)
            // We'll trust GSAP to handle the FLIP-like logic or absolute positioning
            const deltaX = viewportCenterX - (viewportCenterX) // simplified generic center
            const deltaY = viewportCenterY - (viewportCenterY)

            // We actually want them to start FROM center, so we set specific logic
            // The logic below assumes the card is ALREADY in its grid position in DOM flow or calculated? 
            // In the previous code, cards were mapped in a grid.
            // Let's rely on from() logic where we pull them TO center initially? 
            // Previous code used fromTo with calculated deltas. 
            // Let's allow a simpler "explode from center" by setting initial X/Y percent to center the viewport 
            // relative to the card's final position.

            // Actually, simplest "Explode" is:
            // State 1 (Start of scroll): All cards scale:0, opacity:0, positioned at center screen (fixed or absolute).
            // State 2 (End of scroll): Cards move to their transparent grid slots.

            // To do this robustly with responsive grid:
            // We use the "Flip" concept manually. The loop below calculates the "travel distance" 
            // from Center Screen to the Card's Rendered Position.

            // Since the container is pinned, window center is constant relative to container.

            // Note: Use a small delay/timeout to wait for layout? 
            // React useLayoutEffect is better but useEffect is here.

            const cardRect = card.getBoundingClientRect()
            const centerX = window.innerWidth / 2
            const centerY = window.innerHeight / 2

            const xDist = centerX - (cardRect.left + cardRect.width / 2)
            const yDist = centerY - (cardRect.top + cardRect.height / 2)

            scrollTimeline.fromTo(card,
                {
                    x: xDist,
                    y: yDist,
                    opacity: 0,
                    scale: 0.2,
                    rotation: gsap.utils.random(-15, 15)
                },
                {
                    x: 0,
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    duration: 1.5,
                    ease: 'power3.out'
                },
                0.2 + (i * 0.05)
            )
        })

        return () => {
            scrollTimeline.kill()
        }
    }, [])

    return (
        <section ref={containerRef} className="relative w-full min-h-screen lg:h-screen bg-transparent overflow-hidden flex items-center justify-center py-32 lg:py-0 z-10">

            {/* 1. Absolute Center Text */}
            <div className="absolute top-0 left-0 w-full h-screen flex flex-col items-center justify-center pointer-events-none z-20 px-6">
                <h2
                    ref={textRef}
                    className="text-4xl md:text-7xl lg:text-8xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 text-center"
                >
                    {/* Selected<br />Works */}
                    {/* Stacked Layout with Preserved Effects */}
                    <div className="flex flex-col items-center gap-2 md:gap-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                        <TextScramble
                            text="High Octane"
                            className="block"
                            scrambleSpeed={35}
                            trigger={true}
                        />
                        <div className="text-stroke-sm text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>
                            <TextScramble
                                text="Visuals For"
                                className="block"
                                scrambleSpeed={40}
                                trigger={true}
                            />
                        </div>
                        <TextScramble
                            text="High End Brands."
                            className="block"
                            scrambleSpeed={30}
                            trigger={true}
                        />
                    </div>
                </h2>
            </div>

            {/* 2. Responsive Grid Container (6 Cards) */}
            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PROJECTS.map((project, i) => {
                        const CardContent = (
                            <TiltCard className="w-full h-full">
                                <div
                                    className="group relative w-full h-full aspect-[16/10] rounded-none border border-white/10 bg-[#111] overflow-hidden shadow-2xl cursor-pointer"
                                >
                                    {/* Background Image */}
                                    <img
                                        src={project.home_page_card_banner ? project.home_page_card_banner : project.img}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* Dark Gradient Overlay (Bottom) */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Content (Bottom Left) */}
                                    <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-start transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <span className="font-tech text-gray-400 text-xs md:text-sm tracking-wider mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                            [ {project.description} ]
                                        </span>
                                        <h3 className="text-white text-xl md:text-3xl font-bold leading-none tracking-tight uppercase" style={{ fontFamily: "'Syne', sans-serif" }}>
                                            {project.title}
                                        </h3>
                                    </div>
                                </div>
                            </TiltCard>
                        )

                        return (
                            <div key={project.id} ref={el => cardsRef.current[i] = el}>
                                {project.link ? (
                                    <Link to={project.link} className="block w-full h-full">
                                        {CardContent}
                                    </Link>
                                ) : (
                                    CardContent
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

        </section>
    )
}

export default Work


