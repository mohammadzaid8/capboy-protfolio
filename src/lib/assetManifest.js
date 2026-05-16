import { PROJECTS } from '../data/projects'

export const BASE_URL = 'https://pub-22f00052526b4a6087e6351b8539a93d.r2.dev'

/** Minimum time the preloader stays visible (ms), even if assets load faster */
export const MIN_PRELOADER_MS = 2500

export const INTRO_POSTER = `${BASE_URL}/assets/works/01_BMW/banner.jpg`
export const INTRO_LOGO = `${BASE_URL}/assets/home_page/logo/intro_logo.png`
export const INTRO_VIDEO = `${BASE_URL}/assets/home_page/logo/intro_video_49mb.mp4`

/** When uploaded to R2, swap INTRO_VIDEO to this for faster loads */
export const INTRO_VIDEO_OPTIMIZED = `${BASE_URL}/assets/home_page/logo/intro_video_720p.mp4`

export function getIntroVideoUrl() {
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_INTRO_VIDEO_URL) {
        return import.meta.env.VITE_INTRO_VIDEO_URL
    }
    return INTRO_VIDEO
}

export function shouldSkipVideoPreload() {
    if (typeof navigator === 'undefined') return false
    const conn = navigator.connection ?? navigator.mozConnection ?? navigator.webkitConnection
    if (!conn) return false
    if (conn.saveData) return true
    const slow = ['slow-2g', '2g']
    return slow.includes(conn.effectiveType)
}

export function getCriticalAssets() {
    const assets = [
        { id: 'intro-poster', url: INTRO_POSTER, type: 'image', label: 'Hero poster', weight: 15 },
        { id: 'intro-logo', url: INTRO_LOGO, type: 'image', label: 'Studio logo', weight: 15 },
    ]

    if (!shouldSkipVideoPreload()) {
        assets.push({
            id: 'intro-video',
            url: getIntroVideoUrl(),
            type: 'video',
            label: 'Cinematic intro',
            weight: 70,
        })
    }

    return assets
}

export function getDeferredHomeAssets() {
    const seen = new Set()
    const assets = []

    for (const project of PROJECTS) {
        const url = project.home_page_card_banner || project.img
        if (!url || seen.has(url)) continue
        seen.add(url)
        assets.push({
            id: `banner-${project.id}`,
            url,
            type: 'image',
            label: project.title,
            weight: 1,
        })
    }

    return assets
}

export function getStatusTextForProgress(percent) {
    if (percent < 15) return 'Initializing experience'
    if (percent < 40) return 'Loading high quality assets'
    if (percent < 70) return 'Buffering cinematic intro'
    if (percent < 90) return 'Hold on a minute'
    return 'Almost there'
}
