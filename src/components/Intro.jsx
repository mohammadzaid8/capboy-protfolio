import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'


const Intro = () => {
    const containerRef = useRef(null)
    const videoRef = useRef(null)
    const overlayRef = useRef(null)
    const logoRef = useRef(null)

    useGSAP(() => {
        const tl = gsap.timeline()

        // Initial State
        // Initial State
        gsap.set(videoRef.current, { scale: 1.2 })
        gsap.set(overlayRef.current, { opacity: 0 })
        gsap.set(logoRef.current, {
            opacity: 0,
            y: 100,
            scale: 1.1,
            filter: 'blur(20px)'
        })

        // Animation Sequence
        tl.to(videoRef.current, {
            scale: 1,
            duration: 2.5,
            ease: "power2.out"
        })
            .to(overlayRef.current, {
                opacity: 1,
                duration: 1.5,
                ease: "power2.out"
            }, "-=2") // Overlap with video scale
            .to(logoRef.current, {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px)',
                duration: 1.8,
                ease: "power4.out"
            }, "-=1.2") // Dramatic reveal overlap

    }, { scope: containerRef })

    return (
        <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black">

            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="https://pub-22f00052526b4a6087e6351b8539a93d.r2.dev/assets/home_page/logo/intro_video_49mb.mp4" type="video/mp4" />
                    {/* <source src="/assets/home_page/logo/intro_video.mp4" type="video/mp4" /> */}

                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Dark Overlay */}
            <div
                ref={overlayRef}
                className="absolute inset-0 z-0 bg-black/30" // Slightly lighter overlay for better visibility
            ></div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 w-full h-[60vh] bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10 pointer-events-none"></div>

            {/* Content / Logo Reveal */}
            <div className="absolute inset-0 z-10 flex items-end pb-24 md:pb-32 justify-center px-4">
                <div ref={logoRef} className="flex flex-col items-center w-full max-w-[1600px] gap-8">

                    {/* Main Logo Container */}
                    <div className="w-full flex justify-center">
                        <div className="w-full">
                            <img
                                src="https://pub-22f00052526b4a6087e6351b8539a93d.r2.dev/assets/home_page/logo/intro_logo.png"
                                alt="Artix Studios"
                                className="w-full h-auto object-contain"
                            />
                        </div>
                    </div>



                </div>
            </div>



        </section>
    )
}

export default Intro