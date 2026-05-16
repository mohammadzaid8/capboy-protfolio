import { motion } from 'framer-motion'
import { getStatusTextForProgress } from '../lib/assetManifest'

const Preloader = ({ progress = 0, statusText, currentLabel, previewUrls = [] }) => {
    const displayPercent = Math.min(100, Math.max(0, Math.round(progress)))
    const message = statusText || getStatusTextForProgress(displayPercent)

    return (
        <motion.div
            initial={{ y: 0 }}
            exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0a0a0a] text-white overflow-hidden"
        >
            {/* Resolved asset previews */}
            {previewUrls.length > 0 && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center gap-4 opacity-[0.12] pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.12 }}
                    transition={{ duration: 0.6 }}
                >
                    {previewUrls.map((url, i) => (
                        <img
                            key={url}
                            src={url}
                            alt=""
                            className="w-1/3 max-w-md h-auto object-cover rounded-sm blur-sm scale-110"
                            style={{ transform: `rotate(${i === 0 ? -2 : 2}deg)` }}
                        />
                    ))}
                </motion.div>
            )}

            <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/60 to-[#0a0a0a] pointer-events-none"
                style={{ zIndex: 1 }}
            />

            <motion.div
                className="relative z-10 flex flex-col items-center justify-center gap-6 px-6"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="relative overflow-hidden">
                    <motion.h1
                        className="text-9xl md:text-[12rem] font-bold font-mono tracking-tighter leading-none tabular-nums"
                        key={displayPercent}
                        initial={{ opacity: 0.6, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        {displayPercent}%
                    </motion.h1>
                </div>

                <motion.div
                    className="w-full max-w-md h-[2px] bg-white/10 rounded-full overflow-hidden"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <motion.div
                        className="h-full bg-blue-500 origin-left"
                        style={{ width: `${displayPercent}%` }}
                        transition={{ duration: 0.2 }}
                    />
                </motion.div>

                <div className="flex flex-col items-center gap-2 text-center">
                    <motion.div
                        className="flex items-center gap-2 text-sm md:text-base font-mono uppercase tracking-widest text-gray-300"
                        key={message}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <motion.div
                            className="w-2 h-2 rounded-full bg-blue-500"
                            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                        />
                        <span>{message}</span>
                    </motion.div>
                    {currentLabel && (
                        <p className="text-xs font-mono text-gray-500 tracking-wide">{currentLabel}</p>
                    )}
                </div>
            </motion.div>

            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage:
                        'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
            />
        </motion.div>
    )
}

export default Preloader
