import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'

const PrivacyPolicy = () => {
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
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">Privacy Policy</h1>
                    <p className="text-gray-500 font-mono">Last Updated: January 4, 2026</p>
                </header>

                {/* Content */}
                <div className="space-y-12 text-lg leading-relaxed">

                    {/* Section 1 */}
                    <section className="space-y-4">
                        <h2 className="text-2xl text-white font-medium">1. Introduction</h2>
                        <p>
                            Welcome to Capboy Creation (“we,” “our,” or “us”). Established in 2022, we are a premier CGI Production Studio and 3D Creative Brand based in India, specializing in high-end visual storytelling. Our services include: 3D Automotive Animation, CGI Mixed Reality, AI Creative Creations, Unreal Engine Configurators, and 3D Game Environments.
                        </p>
                        <p>
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website (the “Site”) or interact with our creative content. By using our Site or submitting inquiries via email, you consent to the terms of this Privacy Policy.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section className="space-y-4">
                        <h2 className="text-2xl text-white font-medium">2. Information We Collect</h2>

                        <div className="space-y-2">
                            <h3 className="text-white text-xl">2.1 Personal Information</h3>
                            <p>When you contact us directly via email or through our website forms, we may collect:</p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-400">
                                <li><strong>Identity Data:</strong> Your name or business name.</li>
                                <li><strong>Contact Data:</strong> Your email address (e.g., when you reach out to workwithcapboy@gmail.com) and phone number.</li>
                                <li><strong>Project Data:</strong> Details regarding your project requirements, budget, and creative briefs included in your messages.</li>
                            </ul>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-white text-xl">2.2 Non-Personal Information</h3>
                            <p>
                                We prioritize your privacy. We do not use aggressive tracking cookies. However, standard web server logs may collect minimal technical data (e.g., browser type, device type, and broad geographic location) solely for site security and performance optimization.
                            </p>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="space-y-4">
                        <h2 className="text-2xl text-white font-medium">3. How We Use Your Information</h2>
                        <p>We use the information collected for the following professional purposes:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-400">
                            <li><strong>Project Execution:</strong> To discuss, plan, and deliver services such as Automotive CGI, Configurator development, or VFX.</li>
                            <li><strong>Communication:</strong> To respond to your inquiries regarding rates, availability, and collaboration opportunities.</li>
                            <li><strong>Business Operations:</strong> For internal record-keeping, invoicing, and legal compliance.</li>
                            <li><strong>Portfolio Updates:</strong> To occasionally send you updates about our latest showreels or services (only if you have explicitly opted in).</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section className="space-y-4">
                        <h2 className="text-2xl text-white font-medium">4. Data Sharing and Disclosure</h2>
                        <p>
                            We do not sell, trade, or rent your personal data. We operate with strict confidentiality, especially regarding unreleased automotive models or client assets. We may share information only:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-400">
                            <li><strong>With Trusted Contractors:</strong> If a project requires specialized assistance (e.g., a sound designer), subject to strict Non-Disclosure Agreements (NDAs).</li>
                            <li><strong>For Legal Compliance:</strong> If required by law or to protect the intellectual property rights of Capboy Creation.</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section className="space-y-4">
                        <h2 className="text-2xl text-white font-medium">5. Data Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your data and project assets. However, please note that no method of transmission over the Internet is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
                        </p>
                    </section>

                    {/* Section 6 */}
                    <section className="space-y-4">
                        <h2 className="text-2xl text-white font-medium">6. Third-Party Links</h2>
                        <p>
                            Our portfolio may contain links to platforms such as YouTube, Instagram, ArtStation, or LinkedIn. We are not responsible for the privacy practices of these external sites.
                        </p>
                    </section>

                    {/* Section 7 */}
                    <section className="space-y-4 pt-8 border-t border-white/10">
                        <h2 className="text-2xl text-white font-medium">7. Contact Us</h2>
                        <p>If you have questions regarding this Privacy Policy, please contact us:</p>
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

export default PrivacyPolicy


