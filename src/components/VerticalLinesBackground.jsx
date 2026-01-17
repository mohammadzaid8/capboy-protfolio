import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const VerticalLinesBackground = () => {
    const containerRef = useRef(null);
    const linesRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate pulses down the lines
            linesRef.current.forEach((line, i) => {
                if (!line) return;

                // Create a "pulse" element for each line dynamically or just animate bg position?
                // Better to simple animate a pseudo element or a child div.
                // Let's assume the line itself has a child "droplet"

                const droplet = line.querySelector('.pulse-droplet');

                // Randomize delay and duration for organic feel
                gsap.to(droplet, {
                    y: '100vh',
                    duration: gsap.utils.random(4, 8),
                    repeat: -1,
                    delay: gsap.utils.random(0, 5),
                    ease: 'none',
                    repeatDelay: gsap.utils.random(1, 3)
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-none z-0 flex justify-between px-6 md:px-24 max-w-[1920px] mx-auto">
            {/* We create 5 lines for a balanced grid */}
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    ref={el => linesRef.current[i] = el}
                    className="relative h-full w-[1px] bg-white/5"
                >
                    {/* The Energy Pulse */}
                    <div className="pulse-droplet absolute top-0 left-[-1px] w-[3px] h-[100px] bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-50 blur-[1px]"></div>
                </div>
            ))}
        </div>
    );
};

export default VerticalLinesBackground;
