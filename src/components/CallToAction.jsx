const CallToAction = () => {
    // TODO: Replace this URL with your actual Calendly booking link
    const CALENDLY_URL = "https://calendly.com/workwithcapboy/30min"

    return (
        <section className="w-full px-4 lg:px-12 pb-12 bg-transparent">
            {/* 
                Gradient Card Container
                - Uses a radial gradient for that "Unreal Engine" deep glow effect
                - Adds a subtle overlay pattern (optional, kept clean for now with just colors)
            */}
            <div className="relative w-full max-w-[1600px] mx-auto rounded-none overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center gap-8 p-12 border border-white/10">

                {/* Background Gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-[#0a0a0a] to-[#0a0a0a] z-0" />

                {/* Subtle Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-20 z-0 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
                </div>

                {/* Corner Accents (The "Viewfinder" look) - Updated to Gray & Sharp */}
                <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-gray-500 z-10" />
                <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-gray-500 z-10" />
                <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-gray-500 z-10" />
                <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-gray-500 z-10" />

                {/* Content */}
                <div className="relative z-10 max-w-2xl px-4">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
                        Ready to Create <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Something Unreal?</span>
                    </h2>

                    <p className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed">
                        From idea to screen — we'll guide the journey. <br className="hidden md:block" />
                        Let's discuss how to bring your vision to life.
                    </p>

                    <a
                        href={CALENDLY_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white transition-all duration-300 bg-white/5 border border-white/10 rounded-none hover:bg-white/10 hover:border-white/30 hover:scale-105 active:scale-95 backdrop-blur-sm group"
                    >
                        Schedule Your Intro Call
                        <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>

            </div>
        </section>
    )
}

export default CallToAction
