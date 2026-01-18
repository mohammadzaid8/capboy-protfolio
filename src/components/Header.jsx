import { useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
const BASE_URL = "https://pub-22f00052526b4a6087e6351b8539a93d.r2.dev"

const Header = () => {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef()
    const menuRef = useRef()
    const location = useLocation()
    const isHome = location.pathname === '/'

    // Menu Animation
    useGSAP(() => {
        if (isOpen) {
            gsap.to(menuRef.current, {
                y: '0%',
                duration: 0.8,
                ease: "power3.inOut"
            })
            // Stagger animations for links
            gsap.fromTo('.menu-link',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.1, delay: 0.4, duration: 0.8, ease: "power3.out" }
            )
        } else {
            gsap.to(menuRef.current, {
                y: '-100%',
                duration: 0.8,
                ease: "power3.inOut"
            })
        }
    }, [isOpen])

    const toggleMenu = () => setIsOpen(!isOpen)

    // Handle Scroll Navigation for Hash Links
    const handleNav = (id) => {
        setIsOpen(false)
        if (isHome && id) {
            const element = document.getElementById(id)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
            }
        }
    }

    return (
        <header ref={containerRef} className="fixed top-0 left-0 w-full z-50 p-6 lg:p-12 pointer-events-none">
            <div className="w-full flex justify-between items-center">

                {/* LOGO (Left Side - Hidden on Home) */}
                <div className="pointer-events-auto min-w-[120px]">
                    {!isHome && (
                        <Link to="/" className="block w-32 md:w-48">
                            <img
                                src={`${BASE_URL}/assets/home_page/logo/logo.png`}
                                alt="Logo"
                                className={`w-full h-auto object-contain transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
                            />
                        </Link>
                    )}
                </div>

                {/* EXPLORE / CLOSE Button (Right Side) */}
                <div className="pointer-events-auto z-[60] relative">
                    <button
                        onClick={toggleMenu}
                        className={`group relative px-5 py-2.5 rounded-full border backdrop-blur-sm overflow-hidden transition-all duration-300 ${isOpen ? 'border-white bg-white text-black' : 'border-white/20 bg-black/20 text-white hover:border-white/50'}`}
                    >
                        {/* Hover Fill Effect (Only when Closed) */}
                        {!isOpen && (
                            <div className="absolute inset-0 bg-white transition-transform duration-500 ease-out translate-y-full group-hover:translate-y-0" />
                        )}

                        <div className="relative flex items-center gap-2">
                            <span className={`text-xs md:text-sm font-medium tracking-widest uppercase transition-colors duration-300 ${isOpen ? 'text-black' : 'text-white group-hover:text-black'}`}>
                                {isOpen ? 'Close' : 'Explore'}
                            </span>
                            {/* Simple Icon Change */}
                            {isOpen ? (
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 rotate-0 text-black">
                                    <path d="M1 11L11 1M11 11L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-colors duration-300 ${!isOpen && 'group-hover:text-black'}`}>
                                    <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                    </button>
                </div>

            </div>

            {/* Full Screen Menu Overlay */}
            <div
                ref={menuRef}
                className="fixed inset-0 w-full h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center translate-y-[-100%] pointer-events-auto"
                style={{ zIndex: 40 }}
            >
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />

                <nav className="flex flex-col gap-6 md:gap-8 w-full max-w-xl px-6">
                    <Link
                        to="/"
                        onClick={() => setIsOpen(false)}
                        className="menu-link group flex items-baseline gap-4 border-b border-white/10 pb-2 md:pb-4 hover:border-white transition-colors"
                    >
                        <span className="text-xs font-mono text-gray-500 group-hover:text-white transition-colors">01</span>
                        <span className="text-3xl md:text-5xl font-light tracking-tight group-hover:translate-x-2 transition-transform duration-300 ease-out">
                            Home
                        </span>
                    </Link>

                    {['About', 'Work', 'Services'].map((item, index) => {
                        // Define which items are full pages vs hash links
                        const isPage = ['About', 'Work', 'Contact'].includes(item)

                        let href = ''
                        if (item === 'About') href = '/about'
                        else if (item === 'Work') href = '/work' // Now goes to dedicated page
                        else if (item === 'Contact') href = '/about' // Redirects to about as requested
                        else href = `/#${item.toLowerCase()}` // Services stays hash

                        return (
                            <Link
                                key={item}
                                to={href}
                                onClick={() => isPage ? setIsOpen(false) : handleNav(item.toLowerCase())}
                                className="menu-link group flex items-baseline gap-4 border-b border-white/10 pb-2 md:pb-4 hover:border-white transition-colors"
                            >
                                <span className="text-xs font-mono text-gray-500 group-hover:text-white transition-colors">0{index + 2}</span>
                                <span className="text-3xl md:text-5xl font-light tracking-tight group-hover:translate-x-2 transition-transform duration-300 ease-out">
                                    {item}
                                </span>
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </header>
    )
}

export default Header


