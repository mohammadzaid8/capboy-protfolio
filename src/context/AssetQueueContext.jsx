import { createContext, useCallback, useContext, useRef } from 'react'
import { hasAsset } from '../lib/assetCache'

const AssetQueueContext = createContext(null)

const MAX_CONCURRENT_VIDEOS = 2

export function AssetQueueProvider({ children }) {
    const activeRef = useRef(0)
    const queueRef = useRef([])

    const pump = useCallback(() => {
        while (activeRef.current < MAX_CONCURRENT_VIDEOS && queueRef.current.length > 0) {
            const next = queueRef.current.shift()
            activeRef.current += 1
            next.granted = true
            next.resolve()
        }
    }, [])

    const requestVideoSlot = useCallback(
        (url) => {
            if (hasAsset(url)) {
                return Promise.resolve()
            }

            return new Promise((resolve) => {
                queueRef.current.push({ url, resolve, granted: false })
                pump()
            })
        },
        [pump]
    )

    const releaseVideoSlot = useCallback(
        (url) => {
            activeRef.current = Math.max(0, activeRef.current - 1)
            pump()
        },
        [pump]
    )

    return (
        <AssetQueueContext.Provider value={{ requestVideoSlot, releaseVideoSlot }}>
            {children}
        </AssetQueueContext.Provider>
    )
}

export function useAssetQueue() {
    const ctx = useContext(AssetQueueContext)
    if (!ctx) {
        return {
            requestVideoSlot: () => Promise.resolve(),
            releaseVideoSlot: () => {},
        }
    }
    return ctx
}
