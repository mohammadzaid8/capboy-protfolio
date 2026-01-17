import { useEffect, useRef } from 'react'

const TRAIL_LENGTH = 20
// Adjusted physics constants for smoother "snake" feel
const STIFFNESS = 0.4 // Higher stiffness for closer following
const DAMPING = 0.25 // Higher damping to prevent jitter/oscillation
const DRAG = 0.9 // Friction

const MouseTrail = ({ color = '#4f46e5' }) => {
    const trailRefs = useRef([])
    const mouseRef = useRef({ x: 0, y: 0 })
    // Use a fixed position for initialization to avoid flying in from 0,0
    const initialized = useRef(false)
    const fadeOpacity = useRef(0) // Global opacity for the whole trail
    const isMoving = useRef(false)
    const moveTimeout = useRef()

    // Physics state
    const trail = useRef(new Array(TRAIL_LENGTH).fill(0).map(() => ({
        x: 0, y: 0, vx: 0, vy: 0
    })))

    useEffect(() => {
        // Init to center
        const cx = window.innerWidth / 2
        const cy = window.innerHeight / 2
        mouseRef.current = { x: cx, y: cy }
        trail.current.forEach(p => { p.x = cx; p.y = cy })

        const handleMouseMove = (e) => {
            if (!initialized.current) {
                // Snap all points to mouse on first move to prevent trails from center
                trail.current.forEach(p => { p.x = e.clientX; p.y = e.clientY })
                initialized.current = true
            }

            mouseRef.current.x = e.clientX
            mouseRef.current.y = e.clientY

            isMoving.current = true
            // Reset fade
            fadeOpacity.current = 1

            if (moveTimeout.current) clearTimeout(moveTimeout.current)
            moveTimeout.current = setTimeout(() => {
                isMoving.current = false
            }, 100)
        }

        window.addEventListener('mousemove', handleMouseMove)

        let animationFrameId

        const update = () => {
            // physics loop

            // Head follows mouse
            // We use a slightly different "ease" approach for the head to be super tight
            // or we use the same spring physics. Let's use spring for consistency but tighter.

            let targetX = mouseRef.current.x
            let targetY = mouseRef.current.y

            // Global fade logic
            if (!isMoving.current) {
                fadeOpacity.current *= 0.9 // Fade out when stopped
            } else {
                fadeOpacity.current = 1
            }

            trail.current.forEach((point, i) => {
                // Determine target
                // If i=0, target is mouse. If >0, target is previous point.
                // However, for a "snake" that doesn't stretch infinitely, 
                // typically we want them to stay a certain distance or just spring to it.
                // Spring physics:

                const dx = targetX - point.x
                const dy = targetY - point.y

                // Physics calculation
                // F = -k * x (Hooke's law-ish with damping)
                point.vx += dx * STIFFNESS
                point.vy += dy * STIFFNESS

                // Damping / Friction
                point.vx *= DAMPING
                point.vy *= DAMPING

                point.x += point.vx
                point.y += point.vy

                // Update target for the next point to be this point's current pos
                targetX = point.x
                targetY = point.y

                // DOM Update
                const el = trailRefs.current[i]
                if (el) {
                    const scale = 1 - (i / TRAIL_LENGTH) // Shrink towards tail
                    // Base size 12px shrinking down
                    const size = 12 * scale

                    el.style.transform = `translate(${point.x - size / 2}px, ${point.y - size / 2}px)`
                    el.style.width = `${size}px`
                    el.style.height = `${size}px`
                    // Opacity: Global fade * Tail fade
                    el.style.opacity = (fadeOpacity.current * (scale * 0.8 + 0.2)).toFixed(2)
                }
            })

            animationFrameId = requestAnimationFrame(update)
        }

        update()

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            cancelAnimationFrame(animationFrameId)
            if (moveTimeout.current) clearTimeout(moveTimeout.current)
        }
    }, [color])

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {trail.current.map((_, i) => (
                <div
                    key={i}
                    ref={el => trailRefs.current[i] = el}
                    className="absolute bg-white will-change-transform shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                    style={{
                        backgroundColor: color,
                        // initial styles
                        width: '0px',
                        height: '0px',
                        opacity: 0
                    }}
                />
            ))}
        </div>
    )
}

export default MouseTrail
