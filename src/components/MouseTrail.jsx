import { useEffect, useRef } from 'react';

const MouseTrail = ({
    color = '#ffffff',
    size = 4,
    spacing = 10,
    trailLength = 20, // Not strictly used if we fade by time, but good for limiting max dots if needed
    fadeDuration = 0.5, // seconds
    className = ''
}) => {
    const canvasRef = useRef(null);
    const fadeDurationMs = fadeDuration * 1000;

    // Mutable state references
    const dots = useRef([]);
    const mouse = useRef({ x: 0, y: 0 });
    const lastMouse = useRef({ x: 0, y: 0 });
    const requestRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const handleMouseMove = (e) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;

            // Calculate distance from last dot
            const dx = mouse.current.x - lastMouse.current.x;
            const dy = mouse.current.y - lastMouse.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist >= spacing) {
                // Add new dot
                dots.current.push({
                    x: mouse.current.x,
                    y: mouse.current.y,
                    timestamp: Date.now()
                });
                lastMouse.current.x = mouse.current.x;
                lastMouse.current.y = mouse.current.y;
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            const now = Date.now();

            // Filter dead dots first to avoid processing unnecessary ones
            // but for smooth fading we iterate and keep valid ones
            const activeDots = [];

            dots.current.forEach(dot => {
                const age = now - dot.timestamp;
                const progress = age / fadeDurationMs;

                if (progress < 1) {
                    const alpha = 1 - progress; // Fade out

                    ctx.beginPath();
                    ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
                    ctx.fillStyle = color;
                    ctx.globalAlpha = alpha; // Apply fade
                    ctx.fill();
                    ctx.globalAlpha = 1; // Reset

                    activeDots.push(dot);
                }
            });

            dots.current = activeDots;
            requestRef.current = requestAnimationFrame(animate);
        };

        // Initial setup
        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        requestRef.current = requestAnimationFrame(animate);

        // Set initial last mouse position to prevent jump on first move
        lastMouse.current = { x: width / 2, y: height / 2 };

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(requestRef.current);
        };
    }, [color, size, spacing, fadeDurationMs]);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed top-0 left-0 w-full h-full pointer-events-none z-[99999] ${className}`}
            style={{ mixBlendMode: 'screen' }} // Optional: nice blending with dark bg
        />
    );
};

export default MouseTrail;
