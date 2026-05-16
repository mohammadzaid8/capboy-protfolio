/**
 * Animate a numeric value over time (ease-out cubic).
 * Calls onUpdate with rounded integer; resolves when done.
 */
export function animateProgress(from, to, durationMs, onUpdate) {
    if (durationMs <= 0) {
        onUpdate(Math.round(to))
        return Promise.resolve()
    }

    const start = performance.now()

    return new Promise((resolve) => {
        const tick = (now) => {
            const elapsed = now - start
            const t = Math.min(1, elapsed / durationMs)
            const eased = 1 - (1 - t) ** 3
            const value = from + (to - from) * eased
            onUpdate(Math.round(value))

            if (t < 1) {
                requestAnimationFrame(tick)
            } else {
                resolve()
            }
        }
        requestAnimationFrame(tick)
    })
}

/**
 * Follow a moving target — display never drops, creeps toward target each frame.
 */
export function createProgressFollower(onUpdate, { maxStep = 0.6 } = {}) {
    let displayed = 0
    let target = 0
    let rafId = null

    const frame = () => {
        if (displayed < target) {
            displayed = Math.min(target, displayed + maxStep)
            onUpdate(Math.round(displayed))
        }
        rafId = requestAnimationFrame(frame)
    }

    return {
        start() {
            if (rafId == null) rafId = requestAnimationFrame(frame)
        },
        stop() {
            if (rafId != null) {
                cancelAnimationFrame(rafId)
                rafId = null
            }
        },
        setTarget(value) {
            target = Math.min(100, Math.max(0, value))
        },
        getDisplayed() {
            return displayed
        },
        setDisplayed(value) {
            displayed = Math.min(100, Math.max(0, value))
            onUpdate(Math.round(displayed))
        },
    }
}
