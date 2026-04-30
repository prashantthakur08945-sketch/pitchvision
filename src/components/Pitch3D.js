import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';

// Formation positions (normalized 0-1, we'll map to pitch size)
const FORMATIONS = {
  '4-3-3': {
    home: [
      { x: 0, z: 0 },           // GK
      { x: -3, z: -6 }, { x: -1, z: -7 }, { x: 1, z: -7 }, { x: 3, z: -6 }, // DEF
      { x: -2, z: -3 }, { x: 0, z: -4 }, { x: 2, z: -3 },  // MID
      { x: -2.5, z: 0 }, { x: 0, z: 1 }, { x: 2.5, z: 0 }, // FWD
    ],
    away: [
      { x: 0, z: 0 },
      { x: -3, z: 6 }, { x: -1, z: 7 }, { x: 1, z: 7 }, { x: 3, z: 6 },
      { x: -2, z: 3 }, { x: 0, z: 4 }, { x: 2, z: 3 },
      { x: -2.5, z: 0 }, { x: 0, z: -1 }, { x: 2.5, z: 0 },
    ]
  }
};

// Single player dot
const Player = ({ position, color }) => {
  const mesh = useRef();
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.position.y = 0.3 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[0.25, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
    </mesh>
  );
};

// Pitch lines
const PitchLines = () => {
  const W = 10, L = 15;
  return (
    <group>
      {/* Outer boundary */}
      <Line points={[[-W, 0, -L], [W, 0, -L], [W, 0, L], [-W, 0, L], [-W, 0, -L]]}
        color="#ffffff" lineWidth={1} opacity={0.3} transparent />
      {/* Centre line */}
      <Line points={[[-W, 0, 0], [W, 0, 0]]} color="#ffffff" lineWidth={1} opacity={0.3} transparent />
      {/* Centre circle */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.9, 3, 64]} />
        <meshStandardMaterial color="#ffffff" opacity={0.2} transparent />
      </mesh>
      {/* Home penalty box */}
      <Line points={[[-3.5, 0, -L], [-3.5, 0, -L + 5], [3.5, 0, -L + 5], [3.5, 0, -L]]}
        color="#ffffff" lineWidth={1} opacity={0.3} transparent />
      {/* Away penalty box */}
      <Line points={[[-3.5, 0, L], [-3.5, 0, L - 5], [3.5, 0, L - 5], [3.5, 0, L]]}
        color="#ffffff" lineWidth={1} opacity={0.3} transparent />
    </group>
  );
};

// Grass pitch surface
const PitchSurface = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
    <planeGeometry args={[20, 30, 10, 10]} />
    <meshStandardMaterial color="#1a5c2a" />
  </mesh>
);

// Stripes on grass
const GrassStripes = () => {
  return (
    <group>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, -12.5 + i * 5]}>
          <planeGeometry args={[20, 2.5]} />
          <meshStandardMaterial color="#1e6b30" opacity={0.5} transparent />
        </mesh>
      ))}
    </group>
  );
};

const Pitch3D = ({ match }) => {
  const homeColor = '#00ff87';
  const awayColor = '#ff4d6d';
  const formation = FORMATIONS['4-3-3'];

  return (
    <div style={{ width: '100%', height: '500px', borderRadius: '16px', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 18, 20], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={1} />
        <pointLight position={[0, 15, 0]} intensity={0.5} color="#ffffff" />

        <PitchSurface />
        <GrassStripes />
        <PitchLines />

        {/* Ambient Glow */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
          <planeGeometry args={[25, 35]} />
          <meshBasicMaterial color="#00ff87" transparent opacity={0.05} />
        </mesh>

        {/* Home players */}
        {formation.home.map((pos, i) => (
          <group key={`home-${i}`}>
            <Player position={[pos.x, 0.3, pos.z - 5]} color={homeColor} />
            <pointLight position={[pos.x, 0.5, pos.z - 5]} distance={2} intensity={0.5} color={homeColor} />
          </group>
        ))}

        {/* Away players */}
        {formation.away.map((pos, i) => (
          <group key={`away-${i}`}>
            <Player position={[pos.x, 0.3, pos.z + 5]} color={awayColor} />
            <pointLight position={[pos.x, 0.5, pos.z + 5]} distance={2} intensity={0.5} color={awayColor} />
          </group>
        ))}

        <OrbitControls enablePan={false} minDistance={10} maxDistance={35} />

      </Canvas>
    </div>
  );
};

export default Pitch3D;