import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="w-full bg-black/80 backdrop-blur-lg text-white py-24 px-6 md:px-12 border-t border-white/5">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

                {/* Column 1: Copyright & Credits */}
                <div className="flex flex-col gap-4">
                    <p className="text-gray-500 text-sm">
                        © 2025, CAPBOY STUDIOS. All Rights Reserved.
                    </p>
                    <p className="text-gray-600 text-sm hover:text-white transition-colors cursor-pointer">
                        Designed and Developed by Muhammadzaid Masi.
                    </p>
                </div>

                {/* Column 2: Navigation */}
                <div className="flex flex-col gap-2">
                    <Link to="/" className="text-gray-500 text-sm hover:text-white transition-colors">Home</Link>
                    <a href="/work" className="text-gray-500 text-sm hover:text-white transition-colors">Work</a>
                    <Link to="/about" className="text-gray-500 text-sm hover:text-white transition-colors">About</Link>
                    <a href="/#services" className="text-gray-500 text-sm hover:text-white transition-colors">Services</a>
                    {/* <a href="/#contact" className="text-white text-sm font-medium hover:text-gray-300 transition-colors mt-2">Contact</a> */}
                </div>

                {/* Column 3: Legal */}
                <div className="flex flex-col gap-2">
                    <Link to="/privacy-policy" className="text-gray-500 text-sm hover:text-white transition-colors">Privacy Policy</Link>
                    <Link to="/terms-of-use" className="text-gray-500 text-sm hover:text-white transition-colors">Terms of Use</Link>
                </div>

                {/* Column 4: Socials */}
                <div className="flex flex-col gap-2">
                    <a href="#" className="text-gray-500 text-sm hover:text-white transition-colors">LinkedIn</a>
                    <a href="#" className="text-gray-500 text-sm hover:text-white transition-colors">Instagram</a>
                </div>

            </div>
        </footer>
    )
}

export default Footer
