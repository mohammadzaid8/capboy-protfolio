import { useRef } from 'react'
import Intro from '../components/Intro'
import Work from '../components/Work'
import Services from '../components/Services'

const Home = () => {
    return (
        <div className="relative w-full text-white">
            {/* Cinematic Intro */}
            <Intro />

            {/* Work Showcase Section */}
            <Work />

            {/* Services Section */}
            <Services />

        </div>
    )
}

export default Home
