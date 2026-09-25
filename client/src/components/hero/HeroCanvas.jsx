import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// 800 Amber/Gold Particles Drifting Upward
function ParticleField({ count = 750 }) {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const goldColor = new THREE.Color('#f59e0b');
    const emeraldColor = new THREE.Color('#10b981');
    const lightGold = new THREE.Color('#fde68a');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;

      const rand = Math.random();
      const chosenColor = rand > 0.85 ? emeraldColor : rand > 0.4 ? goldColor : lightGold;
      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const positionsAttr = pointsRef.current.geometry.attributes.position;
    const array = positionsAttr.array;

    for (let i = 0; i < count; i++) {
      array[i * 3 + 1] += delta * 0.45; // Drift upward
      if (array[i * 3 + 1] > 8) {
        array[i * 3 + 1] = -8;
      }
    }
    positionsAttr.needsUpdate = true;
    pointsRef.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// 3D Floating Gold Coin
function FloatingCoin({ position = [0, 0, 0], scale = 1, speed = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime() * speed;
    meshRef.current.rotation.y = t * 0.7;
    meshRef.current.rotation.x = Math.sin(t * 0.4) * 0.25;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.2}>
      <group position={position} scale={scale}>
        <mesh ref={meshRef}>
          <cylinderGeometry args={[1.3, 1.3, 0.2, 32]} />
          <meshStandardMaterial
            color="#f59e0b"
            metalness={0.88}
            roughness={0.18}
            emissive="#78350f"
            emissiveIntensity={0.15}
          />
        </mesh>
        {/* Inner rim relief */}
        <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 1.1, 32]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, -0.11, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 1.1, 32]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>
    </Float>
  );
}

// 3D Floating Discount Tag / Rounded Cube
function FloatingCube({ position = [0, 0, 0], scale = 1, color = '#f59e0b' }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.35;
    meshRef.current.rotation.z = t * 0.25;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.22}
          emissive="#451a03"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

// 3D Emerald Gem (representing Cashback rewards)
function FloatingGem({ position = [0, 0, 0], scale = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.5;
    meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.3;
  });

  return (
    <Float speed={1.8} rotationIntensity={1.2} floatIntensity={1.3}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color="#10b981"
          metalness={0.75}
          roughness={0.15}
          emissive="#064e3b"
          emissiveIntensity={0.25}
        />
      </mesh>
    </Float>
  );
}

// 3D Torus Ring (Percentage badge ring)
function FloatingRing({ position = [0, 0, 0], scale = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.4;
    meshRef.current.rotation.y = t * 0.6;
  });

  return (
    <Float speed={2.2} rotationIntensity={1.5} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusGeometry args={[1.1, 0.28, 16, 40]} />
        <meshStandardMaterial
          color="#fbbf24"
          metalness={0.9}
          roughness={0.16}
        />
      </mesh>
    </Float>
  );
}

// Main Scene with Parallax mouse camera
function Scene() {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    // Parallax: camera or group tilts smoothly with cursor (range -0.08 to +0.08 rad)
    const targetX = (state.pointer.x * Math.PI) / 28;
    const targetY = -(state.pointer.y * Math.PI) / 36;
    groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.04;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 8]} intensity={1.8} color="#fffbeb" />
      <directionalLight position={[-10, -5, -4]} intensity={0.6} color="#10b981" />
      <pointLight position={[0, 4, 3]} intensity={2.2} color="#f59e0b" distance={15} />

      {/* Upward Drifting Gold/Emerald Particles */}
      <ParticleField count={800} />

      {/* Floating 3D Elements positioned around the hero text zone */}
      {/* Left side */}
      <FloatingCoin position={[-5.8, 1.2, -1]} scale={0.9} speed={1.1} />
      <FloatingGem position={[-4.5, -2.4, 0.5]} scale={0.75} />
      <FloatingRing position={[-6.2, -1.2, -2]} scale={0.7} />

      {/* Right side */}
      <FloatingCube position={[5.6, 1.8, -0.5]} scale={0.8} color="#f59e0b" />
      <FloatingCoin position={[4.9, -1.8, 0.5]} scale={0.85} speed={0.9} />
      <FloatingGem position={[6.5, -0.8, -1.5]} scale={0.8} />

      {/* Subtle background depths */}
      <FloatingRing position={[3.2, 3.4, -4]} scale={0.6} />
      <FloatingCube position={[-3.5, 3.2, -3.5]} scale={0.55} color="#10b981" />
    </group>
  );
}

const HeroCanvas = () => {
  const [isClient, setIsClient] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const checkWidth = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  if (!isClient || !isDesktop) {
    // Graceful mobile/fallback static dark radial gradient
    return (
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 20%, rgba(245, 158, 11, 0.15) 0%, rgba(15, 17, 23, 0) 70%)',
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 7.5], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className="w-full h-full pointer-events-auto"
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default HeroCanvas;
