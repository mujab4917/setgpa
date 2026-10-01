"use client";

/**
 * HERO CANVAS
 *
 * The actual React Three Fiber scene: three floating, faceted shapes in the
 * site's own brand/terracotta palette, with a soft distort material so they
 * read as something between glass and liquid metal rather than flat
 * geometry. They drift on their own idle loop (drei's <Float>) and also
 * lean gently toward the pointer, so the scene has real, responsive depth -
 * not just a looping render.
 *
 * This file is never imported directly - see Hero3D.tsx, which decides
 * whether it should exist on the page at all before this (and the ~600KB of
 * three.js it pulls in) is ever requested from the network.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function ParallaxRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!group.current) return;
    // Pointer is in [-1, 1]; a small multiplier keeps the tilt subtle.
    const targetY = (state.pointer.x * viewport.width) / 24;
    const targetX = (-state.pointer.y * viewport.height) / 32;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.04;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
  });

  return <group ref={group}>{children}</group>;
}

/**
 * Placement deliberately avoids the centre of the frame, where the heading,
 * the search box and the mascot all already live - these three sit in the
 * corners/margins as ambient depth, small and translucent enough to read as
 * background atmosphere rather than objects competing with real content.
 */
function Shapes() {
  return (
    <ParallaxRig>
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.1}>
        <mesh position={[-4.6, 2.4, -2]} scale={0.15}>
          <icosahedronGeometry args={[1, 1]} />
          <MeshDistortMaterial
            color="#10b981"
            distort={0.12}
            speed={1.6}
            roughness={0.1}
            metalness={0.3}
            transparent
            opacity={0.7}
          />
        </mesh>
      </Float>

      <Float speed={1.1} rotationIntensity={0.4} floatIntensity={1.2}>
        <mesh position={[-3.6, -2.5, -1.6]} scale={0.13}>
          <torusGeometry args={[0.9, 0.32, 32, 96]} />
          <MeshDistortMaterial
            color="#c85f3d"
            distort={0.12}
            speed={1.2}
            roughness={0.15}
            metalness={0.35}
            transparent
            opacity={0.65}
          />
        </mesh>
      </Float>

      <Float speed={1.7} rotationIntensity={0.8} floatIntensity={0.8}>
        <mesh position={[4.8, -1.6, -1.8]} scale={0.1}>
          <octahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial
            color="#7245ff"
            distort={0.1}
            speed={2}
            roughness={0.1}
            metalness={0.2}
            transparent
            opacity={0.6}
          />
        </mesh>
      </Float>
    </ParallaxRig>
  );
}

export function HeroCanvas() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 7], fov: 36 }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#fff7ec" />
      <pointLight position={[-3, -2, 2]} intensity={0.6} color="#a794ff" />
      <Suspense fallback={null}>
        <Shapes />
      </Suspense>
    </Canvas>
  );
}

export default HeroCanvas;
