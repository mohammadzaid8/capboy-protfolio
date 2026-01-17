import { useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const BASE_URL = "https://pub-22f00052526b4a6087e6351b8539a93d.r2.dev"

// Dummy Data Lookup (Ideally this comes from a CMS or separate data file)
const PROJECTS = {
    'art-of-speed': {
        title: 'ART OF SPEED',
        subtitle: 'Official nominee – International Motor Film Awards 2025',
        description: 'A cinematic showcase of the raw power, speed, and precision of the BMW M4 and M4 CSL. This concept film blends photoreal CGI and Unreal Engine visuals to capture the spirit of performance, aggression, and luxury — celebrating the untamed force behind the wheel.',
        role: '3D/Director/SFX/Animation/Music/Edit : capboy_creation',
        engine: 'Unreal Engine 5.4 (Path Tracing / Lumen) and blender',
        youtubeLink: '#',
        media: [
            { type: 'video', src: `${BASE_URL}/assets/works/01_BMW/main.mp4` },
            { type: 'image', src: `${BASE_URL}/assets/works/01_BMW/01.jpg` },
            { type: 'image', src: `${BASE_URL}/assets/works/01_BMW/02.jpg` },
            { type: 'image', src: `${BASE_URL}/assets/works/01_BMW/03.jpg` },
            { type: 'image', src: `${BASE_URL}/assets/works/01_BMW/04.jpg` },
            { type: 'image', src: `${BASE_URL}/assets/works/01_BMW/05.jpg` },
            { type: 'image', src: `${BASE_URL}/assets/works/01_BMW/06.jpg` }
        ]
    },
    'jet-plan': {
        title: 'Bombardier Challenger 350 jet',
        subtitle: 'A VISION OF LUXURY IN MOTION',
        description: `This project showcases a complete 3D animation of the Bombardier Challenger 350 jet , focusing on both the interior and exterior. I handled every aspect of the production, from modeling, texturing, and lighting to rendering and animation, ensuring an ultra-realistic result.
To create a high-quality animation for a client that highlights the luxury and performance of the jet, capturing its sleek design and premium interior.
Using Blender, I developed detailed models and textures for the jet's interior and exterior, combined with precise lighting and composition.`,
        role: '3D/Director/SFX/Animation/Music/Edit : capboy_creation',
        engine: 'Blender 4.4.1',
        youtubeLink: '#',
        media: [
            { type: 'image', src: `${BASE_URL}/assets/works/02_jet_plan/01.png` },
            { type: 'image', src: `${BASE_URL}/assets/works/02_jet_plan/02.png` },
            { type: 'image', src: `${BASE_URL}/assets/works/02_jet_plan/03.png` },
            { type: 'image', src: `${BASE_URL}/assets/works/02_jet_plan/04.png` },
            { type: 'image', src: `${BASE_URL}/assets/works/02_jet_plan/05.png` },
            { type: 'image', src: `${BASE_URL}/assets/works/02_jet_plan/06.png` },
            { type: 'image', src: `${BASE_URL}/assets/works/02_jet_plan/07.png` }
        ]
    },
    'mustang': {
        title: '1969 Apex Predator',
        subtitle: 'The beast has finally woken up',
        description: 'This cinematic short film was created entirely in Unreal Engine 5. It explores the connection between man and machine, featuring a 1969 Ford Mustang and the legend of John Bowe.This entire commercial was created using Unreal Engine 5 (CGI). The goal was to push the limits of automotive rendering, blending photorealistic lighting with an emotional story.',
        role: '3D/Director/SFX/Animation/Music/Edit : capboy_creation',
        engine: 'Unreal Engine 5.4 (Path Tracing / Lumen)',
        youtubeLink: '#',
        media: [
            { type: 'video', src: `${BASE_URL}/assets/works/03_mustang/main.mp4` },
            { type: 'image', src: `${BASE_URL}/assets/works/03_mustang/01.png` },
            { type: 'image', src: `${BASE_URL}/assets/works/03_mustang/02.png` },
            { type: 'image', src: `${BASE_URL}/assets/works/03_mustang/03.png` },
            { type: 'image', src: `${BASE_URL}/assets/works/03_mustang/04.png` },
            { type: 'image', src: `${BASE_URL}/assets/works/03_mustang/05.jpg` },
            { type: 'image', src: `${BASE_URL}/assets/works/03_mustang/06.png` }
        ]
    },
    'yacht': {
        title: 'YACHT',
        subtitle: 'WATER SIMULATION',
        description: 'This project highlights a 3D yacht render featuring dynamic water simulation, achieving a lifelike and immersive visual experience. The entire production was crafted using Blender, from modeling to final rendering.I utilized advanced water simulation techniques to replicate realistic ocean waves, combined with precise texturing and lighting to bring the yacht and its surroundings to life. The composition and rendering focused on capturing the elegance of the yacht with photorealistic detail.',
        role: 'water simulation/Animation/Edit : capboy_creation',
        engine: 'Blender water simulation',
        youtubeLink: '#',
        media: [
            { type: 'video', src: `${BASE_URL}/assets/works/04_yatch/main.mp4` },
            { type: 'image', src: `${BASE_URL}/assets/works/04_yatch/01.jpg` },
            { type: 'image', src: `${BASE_URL}/assets/works/04_yatch/02.jpg` },
            { type: 'image', src: `${BASE_URL}/assets/works/04_yatch/03.jpg` },
            { type: 'image', src: `${BASE_URL}/assets/works/04_yatch/04.jpg` },
            { type: 'image', src: `${BASE_URL}/assets/works/04_yatch/05.jpg` },
            { type: 'image', src: `${BASE_URL}/assets/works/04_yatch/06.jpg` }
        ]
    },
    'porsche': {
        title: 'Porsche',
        subtitle: 'coming soon....',
        description: 'work in progress',
        role: '3D/Director/SFX/Animation/Music/Edit : capboy_creation',
        engine: 'Unreal Engine 5.4 (Path Tracing / Lumen)',
        youtubeLink: '#',
        media: [
            { type: 'video', src: `${BASE_URL}/assets/works/05_porche/main.mp4` },
            { type: 'image', src: `${BASE_URL}/assets/works/05_porche/01.jpg` },
            { type: 'image', src: `${BASE_URL}/assets/works/05_porche/02.jpg` },
            { type: 'image', src: `${BASE_URL}/assets/works/05_porche/03.jpg` },
            { type: 'image', src: `${BASE_URL}/assets/works/05_porche/04.jpg` },
            { type: 'image', src: `${BASE_URL}/assets/works/05_porche/05.jpg` },
            { type: 'image', src: `${BASE_URL}/assets/works/05_porche/06.jpg` }
        ]
    },
    'game-environment': {
        title: 'GAME ENVIRONMENT',
        subtitle: '3D ENVIRONMENTS',
        description: `Immerse yourself in a stunning CGI animation featuring Ironman like never before! Created using the cutting-edge Blender software, this project transports you into a lush forest world where Ironman's character comes to life through mesmerizing animation. Crafted over just 8 weeks, this visually captivating journey blends technology and storytelling seamlessly, offering a truly immersive experience for fans of Ironman and animation enthusiasts alike`,
        role: '3D/Director/SFX/Animation/Edit : capboy_creation',
        engine: 'Blender 4.4.1',
        youtubeLink: '#',
        media: [
            { type: 'video', src: `${BASE_URL}/assets/works/06_game_env/main.mp4` },
            { type: 'image', src: `${BASE_URL}/assets/works/06_game_env/01.jpg` },
            { type: 'image', src: `${BASE_URL}/assets/works/06_game_env/02.jpg` },
            { type: 'image', src: `${BASE_URL}/assets/works/06_game_env/03.jpg` },
            { type: 'image', src: `${BASE_URL}/assets/works/06_game_env/04.jpg` },
            { type: 'image', src: `${BASE_URL}/assets/works/06_game_env/05.jpg` },
            { type: 'image', src: `${BASE_URL}/assets/works/06_game_env/06.jpg` }
        ]
    }
}

const ProjectDetail = () => {
    const { slug } = useParams()
    const project = PROJECTS[slug] || PROJECTS['art-of-speed'] // Fallback for demo

    const containerRef = useRef(null)
    const leftColRef = useRef(null)
    const rightColRef = useRef(null)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [slug])

    useGSAP(() => {
        const tl = gsap.timeline()

        // Animate Left Column Content (Text)
        tl.from(leftColRef.current.children, {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.2
        })

        // Animate Right Column Content (Media)
        tl.from(rightColRef.current.children, {
            y: 100,
            opacity: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: "power2.out"
        }, "-=0.8") // Overlap slightly with text animation

    }, { scope: containerRef })

    if (!project) return <div className="text-white">Project not found</div>

    return (
        <div ref={containerRef} className="w-full min-h-screen bg-[#0a0a0a] text-white mb-24">



            <div className="flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto pt-32 lg:pt-48 px-4 lg:px-12 pb-32">

                {/* Left Column - Sticky Content */}
                <div className="w-full lg:w-1/3 mb-12 lg:mb-0 relative">
                    <div ref={leftColRef} className="lg:sticky lg:top-48 flex flex-col items-start gap-8">
                        <div className="text-gray-400 font-mono text-sm tracking-widest uppercase">
                            [ {project.subtitle} ]
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            {project.title}
                        </h1>

                        <p className="text-gray-400 leading-relaxed text-sm md:text-base max-w-md">
                            {project.description}
                        </p>

                        <div className="w-full max-w-md border-t border-white/10 pt-6 mt-2 flex flex-col gap-4">
                            <div>
                                <h4 className="text-xs text-white/50 font-mono uppercase tracking-wider mb-1">Role / Credits</h4>
                                <p className="text-sm text-gray-300 font-medium">{project.role}</p>
                            </div>
                            <div>
                                <h4 className="text-xs text-white/50 font-mono uppercase tracking-wider mb-1">Engine / Tech</h4>
                                <p className="text-sm text-gray-300 font-medium">{project.engine}</p>
                            </div>
                        </div>

                        <a
                            href={project.youtubeLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-white border-b border-white/30 pb-1 hover:border-white transition-colors"
                        >
                            Watch on YouTube
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 11L11 1M11 1H1M11 1V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Right Column - Scrollable Media */}
                <div ref={rightColRef} className="w-full lg:w-2/3 flex flex-col gap-4 lg:gap-8 lg:pl-12">
                    {project.media.map((item, index) => (
                        <div key={index} className="w-full rounded-none overflow-hidden border border-white/5 bg-[#111] relative border-trace">
                            {/* 4 Spans for the Moving Border Animation */}
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>

                            {item.type === 'video' ? (
                                <video
                                    src={item.src}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="w-full h-auto object-cover"
                                    controls
                                />
                            ) : (
                                <img
                                    src={item.src}
                                    alt={`${project.title} detailed shot ${index}`}
                                    className="w-full h-auto object-cover"
                                />
                            )}
                        </div>
                    ))}
                </div>

            </div>

        </div>
    )
}

export default ProjectDetail

