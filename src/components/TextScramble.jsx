import { useRef, useEffect, useState } from 'react';

const TextScramble = ({
    text,
    className = "",
    trigger = true,
    scrambleSpeed = 30, // ms per frame
    scrambleDuration = 1000 // Total time to resolve per character approx
}) => {
    const [displayText, setDisplayText] = useState('');
    const frameRef = useRef(0);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

    useEffect(() => {
        if (!trigger) return;

        let frame = 0;
        const length = text.length;

        const update = () => {
            let output = '';
            let complete = 0;

            for (let i = 0; i < length; i++) {
                const targetChar = text[i];
                // Resolve character based on progress
                // We want a wave effect or random resolve
                const offset = Math.floor(Math.random() * 5); // Random delay offset
                const progress = frame / (length * 3); // Adjust speed 

                // If we've passed the threshold for this index, show real char
                if (frame >= (i * 2 + 10)) {
                    output += targetChar;
                    complete++;
                } else {
                    // Otherwise show random char
                    output += chars[Math.floor(Math.random() * chars.length)];
                }
            }

            setDisplayText(output);

            if (complete === length) {
                cancelAnimationFrame(frameRef.current);
            } else {
                // Throttle speed
                setTimeout(() => {
                    frameRef.current = requestAnimationFrame(update);
                }, scrambleSpeed);
                frame++;
            }
        };

        update();

        return () => cancelAnimationFrame(frameRef.current);
    }, [text, trigger]);

    return (
        <span className={className}>
            {displayText}
        </span>
    );
};

export default TextScramble;
