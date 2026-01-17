import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const TiltCard = ({ children, className = "" }) => {
    const cardRef = useRef(null);
    const contentRef = useRef(null);
    const shadowRef = useRef(null);

    useGSAP(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 10;

            // Animate Card Tilt
            gsap.to(contentRef.current, {
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto"
            });

            // Animate Shadow (Opposite direction for depth)
            gsap.to(shadowRef.current, {
                x: -rotateY * 2,
                y: -rotateX * 2,
                opacity: 0.6,
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto"
            });

            // Optional: Glare effect logic can go here
        };

        const handleMouseLeave = () => {
            // Reset
            gsap.to(contentRef.current, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.5)",
                overwrite: "auto"
            });

            gsap.to(shadowRef.current, {
                x: 0,
                y: 0,
                opacity: 0,
                duration: 0.7,
                ease: "power2.out",
                overwrite: "auto"
            });
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, { scope: cardRef });

    return (
        <div ref={cardRef} className={`relative perspective-1000 ${className}`} style={{ perspective: '1000px' }}>
            {/* Dynamic Shadow Element */}
            <div
                ref={shadowRef}
                className="absolute inset-4 bg-blue-500/30 rounded-xl blur-2xl opacity-0 transition-opacity pointer-events-none -z-10"
            />

            {/* Tilting Content */}
            <div ref={contentRef} className="w-full h-full transform-style-3d will-change-transform">
                {children}
            </div>
        </div>
    );
};

export default TiltCard;
