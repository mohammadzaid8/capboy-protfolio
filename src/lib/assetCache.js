/** Shared in-memory cache for preloaded assets (images as blob URLs, videos as ready flags) */
const cache = new Map()

export function hasAsset(url) {
    return cache.has(url)
}

export function getAsset(url) {
    return cache.get(url)
}

export function setAsset(url, value) {
    cache.set(url, value)
}

export function getImageObjectUrl(url) {
    const entry = cache.get(url)
    if (entry?.kind === 'image' && entry.blob) {
        return URL.createObjectURL(entry.blob)
    }
    if (entry?.kind === 'image' && entry.ready) {
        return url
    }
    return null
}

export function markImageReady(url) {
    cache.set(url, { kind: 'image', ready: true })
}

export function isImageReady(url) {
    const entry = cache.get(url)
    return entry?.kind === 'image' && (entry.ready || !!entry.blob)
}

export function markVideoReady(url) {
    cache.set(url, { kind: 'video', ready: true })
}

export function isVideoReady(url) {
    const entry = cache.get(url)
    return entry?.kind === 'video' && entry.ready === true
}
