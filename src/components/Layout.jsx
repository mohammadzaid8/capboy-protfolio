import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { Helper } from '@react-three/drei'
import Footer from './Footer'
import CallToAction from './CallToAction'
import Header from './Header'

const Layout = ({ children }) => {
    const lenisRef = useRef()
    const { pathname } = useLocation()

    useEffect(() => {
        // Initialize Lenis
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        })

        lenisRef.current = lenis

        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => {
            lenis.destroy()
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
