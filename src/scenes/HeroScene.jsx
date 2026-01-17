import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Environment, Float, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'

const AnimatedCube = () => {
    const meshRef = useRef()

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        // Slow constant rotation
        meshRef.current.rotation.x = time * 0.15
        meshRef.current.rotation.y = time * 0.2

        // Subtle Mouse Interaction
        const { mouse } = state
        const x = (mouse.x * window.innerWidth) / 2
        const y = (mouse.y * window.innerHeight) / 2

        // We can just use the normalized mouse coordinates directly for rotation influence
        meshRef.current.rotation.y += mouse.x * 0.05
        meshRef.current.rotation.x -= mouse.y * 0.05
    })

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef}>
                <boxGeometry args={[2.2, 2.2, 2.2]} />
                <meshPhysicalMaterial
                    color="#1a1a1a"
                    roughness={0.2}
                    metalness={0.9}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                />
            </mesh>
        </Float>
    )
}

const HeroScene = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#0a0a0a]">
            <Canvas dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 6]} />
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
                <pointLight position={[-10, -10, -5]} intensity={1} color="#4444ff" />
                <Environment preset="city" />
                <AnimatedCube />
                {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
            </Canvas>
        </div>
    )
}

export default HeroScene
