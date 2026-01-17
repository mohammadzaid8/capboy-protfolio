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

// ... imports
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Preloader from './components/Preloader'

function App() {
    const [isLoading, setIsLoading] = useState(true)

    return (
        <div className="grain-effect">
            <AnimatePresence mode="wait">
                {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
            </AnimatePresence>

            <MouseTrail color="#4f46e5" size={3} spacing={8} fadeDuration={0.8} />
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
        </div>
    )
}

export default App
