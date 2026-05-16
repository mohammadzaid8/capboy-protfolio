import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfUse from './pages/TermsOfUse'
import About from './pages/About'
import WorkPage from './pages/WorkPage'

import MouseTrail from './components/MouseTrail'
import VerticalLinesBackground from './components/VerticalLinesBackground'
import { AnimatePresence } from 'framer-motion'
import Preloader from './components/Preloader'
import { AssetQueueProvider } from './context/AssetQueueContext'
import { useAssetPreloader } from './hooks/useAssetPreloader'
import { useMemo } from 'react'

function AppContent() {
    const { progress, statusText, currentLabel, previewUrls, isReady } = useAssetPreloader()

    const showMouseTrail = useMemo(() => {
        if (typeof window === 'undefined') return true
        return !window.matchMedia('(pointer: coarse)').matches
    }, [])

    return (
        <div className="grain-effect">
            <AnimatePresence mode="wait">
                {!isReady && (
                    <Preloader
                        progress={progress}
                        statusText={statusText}
                        currentLabel={currentLabel}
                        previewUrls={previewUrls}
                    />
                )}
            </AnimatePresence>

            {isReady && (
                <AssetQueueProvider>
                    {showMouseTrail && (
                        <MouseTrail color="#4f46e5" size={3} spacing={8} fadeDuration={0.8} />
                    )}
                    <VerticalLinesBackground />
                    <Router>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/work/:slug" element={<ProjectDetail />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/work" element={<WorkPage />} />
                                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                                <Route path="/terms-of-use" element={<TermsOfUse />} />
                            </Routes>
                        </Layout>
                    </Router>
                </AssetQueueProvider>
            )}
        </div>
    )
}

function App() {
    return <AppContent />
}

export default App
