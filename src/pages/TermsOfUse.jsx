import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const TermsOfUse = () => {
    // Ensure scroll to top on mount
    const { pathname } = useLocation()
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return (
        <div className="w-full min-h-screen bg-[#0a0a0a] text-gray-300 pt-32 pb-24 px-6 md:px-12">
            <div className="max-w-[1000px] mx-auto flex flex-col gap-12">

                {/* Header */}
                <header className="flex flex-col gap-4 border-b border-white/10 pb-12">
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">Terms of Use</h1>
                    <p className="text-gray-500 font-mono">Last Updated: January 4, 2026</p>
                </header>

                {/* Content */}
                <div className="space-y-12 text-lg leading-relaxed">

                    {/* Section 1 */}
                    <section className="space-y-4">
                        <h2 className="text-2xl text-white font-medium">1. Acceptance of Terms</h2>
                        <p>
                            Welcome to Capboy Creation. By accessing our website (“Site”), viewing our showreels, or engaging with our content, you agree to be bound by these Terms & Conditions (“Terms”). If you do not agree to these Terms, please do not use our Site.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section className="space-y-4">
                        <h2 className="text-2xl text-white font-medium">2. Our Services</h2>
                        <p>Capboy Creation (Est. 2022) is a creative CGI studio providing high-fidelity visual services, including but not limited to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-400">
                            <li>3D Automotive Animation & Cinematography</li>
                            <li>CGI Mixed Reality (VFX)</li>
                            <li>Unreal Engine Real-Time Configurators</li>
                            <li>AI-Enhanced Creative Concepts</li>
                            <li>3D Game Environment Design</li>
                        </ul>
                        <p className="text-sm text-gray-500 italic mt-2">All content displayed on this Site is for portfolio and informational purposes.</p>
                    </section>

                    {/* Section 3 */}
                    <section className="space-y-4">
                        <h2 className="text-2xl text-white font-medium">3. Intellectual Property (Copyright)</h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-400">
                            <li><strong>Ownership:</strong> All visual content, including video showreels, 3D renders, "Apex Predator" assets, code snippets, branding, and text, are the exclusive intellectual property of Capboy Creation, unless otherwise noted (e.g., client-owned assets used with permission).</li>
                            <li><strong>No Unauthorized Use:</strong> You may not download, reproduce, distribute, modify, or use our renders for commercial purposes, AI training, or resale without prior written consent from Capboy Creation.</li>
                            <li><strong>Client Work:</strong> Intellectual property rights for paid client projects are governed by the specific Service Agreements signed at the start of the project.</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section className="space-y-4">
                        <h2 className="text-2xl text-white font-medium">4. User Conduct</h2>
                        <p>By using this Site, you agree not to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-400">
                            <li>Misuse our contact channels for spam or unsolicited marketing.</li>
                            <li>Attempt to reverse-engineer our interactive configurators or web code.</li>
                            <li>Falsely represent an affiliation with Capboy Creation.</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section className="space-y-4">
                        <h2 className="text-2xl text-white font-medium">5. Disclaimer of Warranties</h2>
                        <p>
                            The Site and its content are provided on an “as is” basis. While we strive for technical perfection in our CGI, we do not guarantee that the website functionality will be uninterrupted or error-free.
                        </p>
                    </section>

                    {/* Section 6 */}
                    <section className="space-y-4">
                        <h2 className="text-2xl text-white font-medium">6. Limitation of Liability</h2>
                        <p>
                            To the fullest extent permitted by law, Capboy Creation shall not be liable for any direct, indirect, or consequential damages arising from your use of this Site or reliance on any information provided herein.
                        </p>
                    </section>

                    {/* Section 7 */}
                    <section className="space-y-4">
                        <h2 className="text-2xl text-white font-medium">7. Governing Law</h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Ahmedabad, Gujarat.
                        </p>
                    </section>

                    {/* Section 8 */}
                    <section className="space-y-4 pt-8 border-t border-white/10">
                        <h2 className="text-2xl text-white font-medium">8. Contact Information</h2>
                        <p>For business inquiries, legal notices, or collaboration requests, please contact:</p>
                        <div className="text-white">
                            <p className="font-bold">CAPBOY CREATION</p>
                            <p>Email: <a href="mailto:workwithcapboy@gmail.com" className="hover:text-blue-400 underline transition-colors">workwithcapboy@gmail.com</a></p>
                            <p>Location: India</p>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    )
}

export default TermsOfUse
