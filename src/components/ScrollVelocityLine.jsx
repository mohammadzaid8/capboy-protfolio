import { useEffect, useRef } from 'react';
import { useScroll, useVelocity, useTransform, useSpring, motion } from 'framer-motion';

// We'll use Framer Motion for the physics-based velocity tracking
// But render to Canvas for the "sparks" performance

const ScrollVelocityLine = ({
    color = '#4f46e5',
    width = 2,
    maxSparks = 50
}) => {
    const canvasRef = useRef(null);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });

    const sparksRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. Get current velocity intensity (0 to 1 roughly)
            const velocity = smoothVelocity.get(); // can be pos or neg
            const speed = Math.abs(velocity);
            const intensity = Math.min(speed / 1000, 1); // Cap at 1 for max effect

            // 2. Draw the Main Line (Right or Center? Let's do Right side scrollbar area)
            // But user said "randomly coming". Maybe a line that traces the scroll?
            // "a line is follow our scroll" -> Usually means a progress bar or indicator.
            // Let's put a high-tech glowing line on the right.

            const lineX = canvas.width - 20;
            const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            const lineY = scrollPercent * canvas.height;
            const lineHeight = 100 + (intensity * 300); // Stretches with speed

            // Glow logic
            ctx.shadowBlur = 10 + (intensity * 30);
            ctx.shadowColor = color;
            ctx.strokeStyle = color;
            ctx.lineWidth = width + (intensity * 2);
            ctx.lineCap = 'round';

            // Draw the "Head" of the scroll
            ctx.beginPath();
            ctx.moveTo(lineX, lineY - (lineHeight / 2));
            ctx.lineTo(lineX, lineY + (lineHeight / 2));
            ctx.stroke();

            // 3. Generate Sparks/Physics Particles based on velocity
            // Only add sparks if moving fast enough
            if (intensity > 0.1) {
                // Randomly add sparks
                if (Math.random() < intensity) {
                    sparksRef.current.push({
                        x: lineX + (Math.random() - 0.5) * 10,
                        y: lineY + (Math.random() - 0.5) * lineHeight,
                        vx: (Math.random() - 0.5) * 4 - (velocity * 0.01), // Shoot opposite to motion? or scatter
                        vy: (Math.random() - 0.5) * 4,
                        life: 1.0,
                        size: Math.random() * 2 + 1
                    });
                }
            }

            // Render Sparks
            ctx.shadowBlur = 0; // efficiency
            for (let i = sparksRef.current.length - 1; i >= 0; i--) {
                const spark = sparksRef.current[i];

                spark.x += spark.vx;
                spark.y += spark.vy;
                spark.life -= 0.05;

                if (spark.life <= 0) {
                    sparksRef.current.splice(i, 1);
                    continue;
                }

                ctx.fillStyle = `rgba(255, 255, 255, ${spark.life})`;
                ctx.beginPath();
                ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [smoothVelocity]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]"
        />
    );
};

export default ScrollVelocityLine;
