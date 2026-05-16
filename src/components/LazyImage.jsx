import { useRef, useState, useEffect, useMemo } from 'react'
import { getImageObjectUrl, hasAsset } from '../lib/assetCache'

/**
 * LazyImage - Optimized image component with:
 * - IntersectionObserver-based lazy loading
 * - Native lazy loading fallback
 * - Smooth fade-in transition
 * - Loading skeleton
 */
const LazyImage = ({
    src,
    alt = '',
    className = '',
    containerClassName = '',
    rootMargin = '150px',
    onLoad,
    onError,
    ...props
}) => {
    const containerRef = useRef(null)
    const [shouldLoad, setShouldLoad] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [hasError, setHasError] = useState(false)

    const resolvedSrc = useMemo(() => {
        if (hasAsset(src)) {
            return getImageObjectUrl(src) || src
        }
        return src
    }, [src])

    // Intersection Observer for lazy loading
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setShouldLoad(true)
                    observer.disconnect()
                }
            },
            {
                rootMargin,
                threshold: 0.01
            }
        )

        observer.observe(container)
        return () => observer.disconnect()
    }, [rootMargin])

    const handleLoad = (e) => {
        setIsLoaded(true)
        onLoad?.(e)
    }

    const handleError = (e) => {
        setHasError(true)
        onError?.(e)
    }

    return (
        <div ref={containerRef} className={`relative overflow-hidden bg-[#1a1a1a] ${containerClassName}`}>
            {/* Loading Skeleton */}
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#1a1a1a] via-[#252525] to-[#1a1a1a]" />
            )}

            {/* Error State */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-gray-500 text-sm">Failed to load</div>
                </div>
            )}

            {/* Image - Only renders when near viewport */}
            {shouldLoad && !hasError && (
                <img
                    src={resolvedSrc}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    onLoad={handleLoad}
                    onError={handleError}
                    className={`transition-opacity duration-300 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    } ${className}`}
                    {...props}
                />
            )}
        </div>
    )
}

export default LazyImage
