"use client";

import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// ── Model ────────────────────────────────────────────────────────────────────

function AlgaeModel({ autoRotateSpeed = 0.4 }: { autoRotateSpeed?: number }) {
  const { scene } = useGLTF("/model3d/machine.glb");
  const groupRef = useRef<THREE.Group>(null);

  // Apply brand tint to all meshes — teal-ice palette matching the hero bg
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            // Shift the base color toward ice-teal instead of pure white
            mat.color.set("#B8D8E4");       // light teal-ice — visible against dark bg
            mat.roughness = 0.28;
            mat.metalness = 0.35;
            mat.envMapIntensity = 1.2;
            mat.needsUpdate = true;
          }
        });
      }
    });
  }, [scene]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * autoRotateSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1} position={[0, -0.5, 0]} />
    </group>
  );
}

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
    <div
      className={className}
      style={style}
      aria-label="3D model of the Alga.e sargassum processing unit"
    >
      <Canvas
        camera={{ position: [0, 1.8, 5], fov: 36 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        {/* Ambient — enough to lift shadows without flattening */}
        <ambientLight intensity={0.55} color="#CCE6EA" />

        {/* Key light — bright, slightly cool, from upper-right front */}
        <directionalLight position={[4, 7, 5]} intensity={2.0} color="#DDEEF5" />

        {/* Fill light — warm left side so it's not pitch black */}
        <directionalLight position={[-5, 3, 2]} intensity={0.9} color="#C8E4ED" />

        {/* Rim light — teal from behind for edge definition */}
        <directionalLight position={[0, 4, -5]} intensity={0.6} color="#47AECC" />

        {/* Contact shadow */}
        <ContactShadows
          position={[0, -1.3, 0]}
          opacity={0.5}
          scale={6}
          blur={2.5}
          color="#031F2D"
        />

        <Suspense fallback={<Fallback />}>
          <AlgaeModel autoRotateSpeed={autoRotateSpeed} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
