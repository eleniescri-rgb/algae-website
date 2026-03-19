"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import type * as THREE from "three";

// ── Model ────────────────────────────────────────────────────────────────────

function AlgaeModel({ autoRotateSpeed = 0.4 }: { autoRotateSpeed?: number }) {
  const { scene } = useGLTF("/model3d/machine.glb");
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * autoRotateSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        scale={1}
        position={[0, -0.5, 0]}
      />
    </group>
  );
}

// Preload so it starts loading before mount
useGLTF.preload("/model3d/machine.glb");

// ── Fallback ─────────────────────────────────────────────────────────────────

function Fallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#0897B3" wireframe />
    </mesh>
  );
}

// ── Public component ─────────────────────────────────────────────────────────

interface ModelViewerProps {
  className?: string;
  style?: React.CSSProperties;
  autoRotateSpeed?: number;
}

export function ModelViewer({ className, style, autoRotateSpeed = 0.4 }: ModelViewerProps) {
  return (
    <div className={className} style={style} aria-label="3D model of the Alga.e sargassum processing unit">
      <Canvas
        camera={{ position: [0, 1.5, 4.5], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        {/* Lighting — clinical/industrial feel matching cleantech brand */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 3]} intensity={1.4} color="#CCE6EA" castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#0897B3" />
        <pointLight position={[0, -1, 2]} intensity={0.3} color="#FF751F" />

        {/* Environment — studio feel, no background */}
        <Environment preset="studio" />

        {/* Contact shadow on ground plane */}
        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.35}
          scale={5}
          blur={2}
          color="#063D57"
        />

        <Suspense fallback={<Fallback />}>
          <AlgaeModel autoRotateSpeed={autoRotateSpeed} />
        </Suspense>

        {/* User controls — orbit only, no pan, limited zoom */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate={false}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
