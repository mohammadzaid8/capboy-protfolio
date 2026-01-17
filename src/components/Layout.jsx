import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Helper } from '@react-three/drei'

gsap.registerPlugin(ScrollTrigger)
import Footer from './Footer'
import CallToAction from './CallToAction'
import Header from './Header'

const Layout = ({ children }) => {
    const lenisRef = useRef()
    const { pathname } = useLocation()

    useEffect(() => {
        // Initialize Lenis with "super smooth" settings
        const lenis = new Lenis({
            duration: 2.5, // Much slower, smoother settle
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1.5, // Increased sensitivity for smoother control
            smoothTouch: false,
            touchMultiplier: 2,
        })

        lenisRef.current = lenis

        // Synchronize Lenis with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update)

        // Use GSAP ticker to drive Lenis for perfect synchronization
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000)
        })

        // Disable lag smoothing to prevent jumpiness during heavy load
        gsap.ticker.lagSmoothing(0)

        return () => {
            lenis.destroy()
            gsap.ticker.remove(lenis.raf)
        }
    }, [])

    // Scroll to top on route change
    useEffect(() => {
        lenisRef.current?.scrollTo(0, { immediate: true })
    }, [pathname])

    return (
        <main className="w-full min-h-screen">
            <Header />
            {children}
            <CallToAction />
            <Footer />
        </main>
    )
}

export default Layout
