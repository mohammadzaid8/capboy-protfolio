import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Preloader = ({ onComplete }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setCount((prev) => {
                if (prev === 100) {
                    clearInterval(interval)
                    // Small delay at 100% before finishing
                    setTimeout(() => {
                        onComplete()
                    }, 500)
                    return 100
                }

                // Variable speed: slower as it gets higher
                const increment = prev < 50 ? Math.ceil(Math.random() * 5) : Math.ceil(Math.random() * 2)
                return Math.min(prev + increment, 100)
            })
        }, 30) // Update frequency

        return () => clearInterval(interval)
    }, [onComplete])

    return (
        <motion.div
            initial={{ y: 0 }}
            exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0a0a0a] text-white overflow-hidden"
        >
            <div className="flex flex-col items-center justify-center gap-4">
                {/* Large Counter */}
                <div className="relative overflow-hidden">
                    <motion.h1
                        className="text-9xl md:text-[12rem] font-bold font-mono tracking-tighter leading-none"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {count}%
                    </motion.h1>
                </div>

                {/* Loading Text / Status */}
                <div className="flex items-center gap-2 text-sm md:text-base font-mono uppercase tracking-widest text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span>System Initializing</span>
                </div>
            </div>

            {/* Background Grid Pattern for Tech Feel */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />
        </motion.div>
    )
}

export default Preloader
