import { getAsset, hasAsset, setAsset, markVideoReady, markImageReady, isImageReady } from './assetCache'

const DEFAULT_MAX_CONCURRENT = 2

function fetchContentLength(url) {
    return fetch(url, { method: 'HEAD', mode: 'cors' })
        .then((res) => {
            const len = res.headers.get('Content-Length')
            return len ? parseInt(len, 10) : null
        })
        .catch(() => null)
}

/**
 * Load images via <img> (no CORS required). Byte progress needs CORS on R2;
 * we report stepped progress instead so preloader still works on your CDN.
 */
function loadImageWithProgress(url, onBytes) {
    if (isImageReady(url)) {
        onBytes?.(1, 1)
        return Promise.resolve(getAsset(url))
    }

    return new Promise((resolve, reject) => {
        const started = performance.now()
        let tickId = null

        const report = (fraction) => onBytes?.(Math.min(1, fraction), 1)

        report(0.05)

        tickId = setInterval(() => {
            const elapsed = performance.now() - started
            const timeFrac = Math.min(0.85, 0.05 + (elapsed / 1200) * 0.8)
            report(timeFrac)
        }, 80)

        const img = new Image()
        img.decoding = 'async'

        img.onload = () => {
            clearInterval(tickId)
            markImageReady(url)
            report(1)
            resolve(getAsset(url))
        }

        img.onerror = () => {
            clearInterval(tickId)
            reject(new Error(`Failed to load image: ${url}`))
        }
        img.src = url
    })
}

function loadVideoUntilCanPlay(url, onBytes, totalBytesHint) {
    if (hasAsset(url) && getAsset(url)?.ready) {
        onBytes?.(totalBytesHint ?? 1, totalBytesHint ?? 1)
        return Promise.resolve(getAsset(url))
    }

    return fetchContentLength(url).then((contentLength) => {
        const total = contentLength ?? totalBytesHint ?? null

        return new Promise((resolve, reject) => {
            const video = document.createElement('video')
            video.muted = true
            video.playsInline = true
            video.preload = 'auto'
            video.src = url

            let resolved = false
            const started = performance.now()
            let tickId = null

            const cleanup = () => {
                if (tickId) clearInterval(tickId)
                video.removeEventListener('progress', onProgress)
                video.removeEventListener('canplay', onCanPlay)
                video.removeEventListener('loadeddata', onCanPlay)
                video.removeEventListener('error', onError)
            }

            const reportFraction = () => {
                let bufferedFrac = 0
                if (total && video.buffered.length) {
                    try {
                        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
                        bufferedFrac = Math.min(1, bufferedEnd / total)
                    } catch {
                        /* ignore */
                    }
                }
                const elapsed = performance.now() - started
                const timeFrac = Math.min(0.88, 0.08 + (elapsed / 12000) * 0.8)
                const fraction = Math.max(bufferedFrac, timeFrac)
                onBytes?.(fraction, 1)
            }

            tickId = setInterval(reportFraction, 120)
            onBytes?.(0.08, 1)

            const onProgress = () => reportFraction()

            const finish = () => {
                if (resolved) return
                resolved = true
                cleanup()
                markVideoReady(url)
                setAsset(url, { kind: 'video', ready: true })
                video.src = ''
                onBytes?.(1, 1)
                resolve(getAsset(url))
            }

            const onCanPlay = () => finish()

            const onError = () => {
                if (resolved) return
                resolved = true
                cleanup()
                video.src = ''
                reject(new Error(`Failed to load video: ${url}`))
            }

            video.addEventListener('progress', onProgress)
            video.addEventListener('canplay', onCanPlay)
            video.addEventListener('loadeddata', onCanPlay)
            video.addEventListener('error', onError)

            if (video.readyState >= 3) {
                finish()
            }
        })
    })
}

/**
 * Load a list of weighted assets with bounded concurrency and aggregate byte progress.
 */
export async function loadAssets(assets, { maxConcurrent = DEFAULT_MAX_CONCURRENT, onProgress } = {}) {
    if (!assets.length) {
        onProgress?.({ percent: 100, statusText: 'Almost there', currentLabel: '', bytesLoaded: 0, bytesTotal: 0 })
        return
    }

    const totalWeight = assets.reduce((sum, a) => sum + (a.weight ?? 1), 0)
    const assetProgress = new Map(assets.map((a) => [a.id, 0]))

    const emitProgress = (currentLabel = '') => {
        let weightedSum = 0
        for (const asset of assets) {
            weightedSum += (assetProgress.get(asset.id) ?? 0) * (asset.weight ?? 1)
        }
        const percent = Math.min(100, Math.round((weightedSum / totalWeight) * 100))
        let bytesLoaded = 0
        let bytesTotal = 0
        for (const asset of assets) {
            const p = assetProgress.get(asset.id) ?? 0
            bytesLoaded += p
            bytesTotal += 1
        }
        onProgress?.({
            percent,
            statusText: '',
            currentLabel,
            bytesLoaded: Math.round(weightedSum),
            bytesTotal: totalWeight,
        })
    }

    const loadOne = async (asset) => {
        const setAssetProgress = (fraction) => {
            assetProgress.set(asset.id, Math.min(1, Math.max(0, fraction)))
            emitProgress(asset.label)
        }

        if (asset.type === 'image') {
            await loadImageWithProgress(asset.url, (loaded, total) => {
                setAssetProgress(total ? loaded / total : 0.5)
            })
            setAssetProgress(1)
            return
        }

        if (asset.type === 'video') {
            await loadVideoUntilCanPlay(
                asset.url,
                (loaded, total) => {
                    setAssetProgress(total ? loaded / total : 0.5)
                },
                asset.estimatedBytes ?? 49 * 1024 * 1024
            )
            setAssetProgress(1)
            return
        }

        setAssetProgress(1)
    }

    const queue = [...assets]
    const workers = Array.from({ length: Math.min(maxConcurrent, queue.length) }, async () => {
        while (queue.length) {
            const asset = queue.shift()
            await loadOne(asset)
        }
    })

    await Promise.all(workers)
    emitProgress('')
}

/** Fire-and-forget background load (deferred banners) */
export function loadAssetsInBackground(assets, maxConcurrent = 2) {
    if (!assets.length) return
    loadAssets(assets, { maxConcurrent }).catch((err) => {
        console.warn('[AssetLoader] Background load failed:', err)
    })
}
