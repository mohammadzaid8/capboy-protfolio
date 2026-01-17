import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm'

const StarField = (props) => {
    const ref = useRef();
    // Increase radius to ensure coverage
    const sphere = useMemo(() => random.inSphere(new Float32Array(5000), { radius: 5 }), []);

    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.015} // Slightly larger for better visibility
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
};

const CameraRig = () => {
    useFrame((state) => {
        const y = window.scrollY;
        // Infinite Scroll Effect:
        // Instead of moving position (which eventually leaves the stars),
        // we rotate the camera. This simulates infinite tumbling/turning through space.
        state.camera.rotation.x = y * 0.0005;
        state.camera.rotation.y = y * 0.0002;

        // Slight bobbing for organic feel, but staying within the cloud
        state.camera.position.x = Math.sin(y * 0.001) * 0.2;
    });
    return null;
};

const Scroll3DBackground = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none bg-black">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <StarField />
                <CameraRig />
            </Canvas>
        </div>
    );
};

export default Scroll3DBackground;
