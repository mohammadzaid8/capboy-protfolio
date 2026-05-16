import { useEffect, useState, useRef, useCallback } from 'react'
import { loadAssets, loadAssetsInBackground } from '../lib/AssetLoader'
import {
    getCriticalAssets,
    getDeferredHomeAssets,
    getStatusTextForProgress,
    INTRO_POSTER,
    INTRO_LOGO,
    MIN_PRELOADER_MS,
} from '../lib/assetManifest'
import { getImageObjectUrl, hasAsset } from '../lib/assetCache'
import { animateProgress, createProgressFollower } from '../lib/smoothProgress'

export function useAssetPreloader() {
    const [progress, setProgress] = useState(0)
    const [statusText, setStatusText] = useState('Initializing experience')
    const [currentLabel, setCurrentLabel] = useState('')
    const [previewUrls, setPreviewUrls] = useState([])
    const [isReady, setIsReady] = useState(false)
    const [error, setError] = useState(null)
    const deferredStarted = useRef(false)
    const followerRef = useRef(null)

    const applyProgress = useCallback((percent) => {
        setProgress(percent)
        setStatusText(getStatusTextForProgress(percent))
    }, [])

    const startDeferredLoad = useCallback(() => {
        if (deferredStarted.current) return
        deferredStarted.current = true
        loadAssetsInBackground(getDeferredHomeAssets(), 2)
    }, [])

    useEffect(() => {
        let cancelled = false

        const follower = createProgressFollower(applyProgress, { maxStep: 0.45 })
        followerRef.current = follower
        follower.start()

        const run = async () => {
            const startedAt = Date.now()

            try {
                await loadAssets(getCriticalAssets(), {
                    maxConcurrent: 2,
                    onProgress: ({ percent, currentLabel: label }) => {
                        if (cancelled) return
                        follower.setTarget(percent)
                        setCurrentLabel(label ?? '')

                        const urls = [INTRO_POSTER, INTRO_LOGO]
                            .filter((u) => hasAsset(u))
                            .map((u) => getImageObjectUrl(u) || u)
                        setPreviewUrls(urls)
                    },
                })

                if (cancelled) return

                follower.setTarget(92)
                await new Promise((r) => setTimeout(r, 300))
                if (cancelled) return

                follower.stop()

                const displayed = follower.getDisplayed()
                const elapsed = Date.now() - startedAt
                const minRemaining = Math.max(0, MIN_PRELOADER_MS - elapsed)

                if (minRemaining > 0) {
                    await animateProgress(displayed, 100, minRemaining, (p) => {
                        if (!cancelled) {
                            applyProgress(p)
                        }
                    })
                } else if (displayed < 100) {
                    await animateProgress(displayed, 100, 400, applyProgress)
                } else {
                    applyProgress(100)
                }

                if (cancelled) return
                setCurrentLabel('')
                await new Promise((r) => setTimeout(r, 400))
                if (cancelled) return
                setIsReady(true)
            } catch (err) {
                if (cancelled) return
                console.error('[useAssetPreloader]', err)
                setError(err)
                follower.stop()

                const displayed = follower.getDisplayed()
                const elapsed = Date.now() - startedAt
                const minRemaining = Math.max(0, MIN_PRELOADER_MS - elapsed)

                if (minRemaining > 0) {
                    await animateProgress(displayed, 100, minRemaining, (p) => {
                        if (!cancelled) applyProgress(p)
                    })
                } else {
                    applyProgress(100)
                }

                if (cancelled) return
                setIsReady(true)
            }
        }

        run()

        return () => {
            cancelled = true
            followerRef.current?.stop()
        }
    }, [applyProgress])

    useEffect(() => {
        if (!isReady) return
        startDeferredLoad()
    }, [isReady, startDeferredLoad])

    return {
        progress,
        statusText,
        currentLabel,
        previewUrls,
        isReady,
        error,
        startDeferredLoad,
    }
}
