import React, { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Sun Component with Texture
 */
const Sun = () => {
  const sunRef = useRef();
  const sunTexture = useLoader(THREE.TextureLoader, '/images/sun.jpg');

  useFrame((state, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.004 * delta;
    }
  });

  return (
    <group>
      {/* Sun */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[12, 50, 50]} />
        <meshBasicMaterial map={sunTexture} />
      </mesh>
      
      {/* Sun Light */}
      <pointLight position={[0, 0, 0]} intensity={4} distance={500} color={0xffffff} />
    </group>
  );
};

/**
 * Planet Component with Textures
 */
const Planet = ({ 
  size, 
  textureUrl,
  orbitRadius, 
  orbitSpeed, 
  rotationSpeed,
  rings = null
}) => {
  const planetRef = useRef();
  const orbitRef = useRef();
  
  // Load texture (hooks must be called unconditionally)
  const planetTexture = useLoader(THREE.TextureLoader, textureUrl);
  
  useFrame((state, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += orbitSpeed * delta;
    }
    if (planetRef.current) {
      planetRef.current.rotation.y += rotationSpeed * delta;
    }
  });

  return (
    <group ref={orbitRef}>
      <group position={[orbitRadius, 0, 0]}>
        {/* Planet */}
        <mesh ref={planetRef}>
          <sphereGeometry args={[size, 50, 50]} />
          <meshLambertMaterial map={planetTexture} />
        </mesh>
        
        {/* Rings */}
        {rings && (
          <PlanetRings rings={rings} />
        )}
      </group>
    </group>
  );
};

/**
 * Planet Rings Component
 */
const PlanetRings = ({ rings }) => {
  const ringTexture = useLoader(THREE.TextureLoader, rings.textureUrl);
  
  return (
    <mesh rotation={[-0.5 * Math.PI, 0, 0]}>
      <ringGeometry args={[rings.innerRadius, rings.outerRadius, 32]} />
      <meshBasicMaterial 
        map={ringTexture} 
        side={THREE.DoubleSide}
        transparent
      />
    </mesh>
  );
};

/**
 * Orbital Path Component
 */
const OrbitPath = ({ radius }) => {
  const points = [];
  const numSegments = 100;
  for (let i = 0; i <= numSegments; i++) {
    const angle = (i / numSegments) * Math.PI * 2;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    points.push(x, 0, z);
  }

  return (
    <lineLoop>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={new Float32Array(points)}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={0xffffff} linewidth={3} />
    </lineLoop>
  );
};

/**
 * Procedural Star Field
 */
const ProceduralStars = () => {
  const starsRef = useRef();
  
  const starPositions = useMemo(() => {
    const positions = [];
    const starCount = 8000;
    
    for (let i = 0; i < starCount; i++) {
      // Random positions in a sphere
      const radius = 400 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions.push(x, y, z);
    }
    
    return new Float32Array(positions);
  }, []);
  
  const starSizes = useMemo(() => {
    const sizes = [];
    const starCount = 8000;
    
    for (let i = 0; i < starCount; i++) {
      sizes.push(Math.random() * 3 + 1); // Star sizes between 1-4
    }
    
    return new Float32Array(sizes);
  }, []);

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0002; // Very slow rotation
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starPositions.length / 3}
          array={starPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={starSizes.length}
          array={starSizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        sizeAttenuation={true}
        color="#ffffff"
        transparent
        opacity={0.8}
      />
    </points>
  );
};

/**
 * Color Graded Space Background
 */
const SpaceBackground = () => {
  return (
    <mesh>
      <sphereGeometry args={[600, 32, 32]} />
      <shaderMaterial
        side={THREE.BackSide}
        uniforms={{
          topColor: { value: new THREE.Color(0x000033) },    // Deep space blue
          bottomColor: { value: new THREE.Color(0x000000) }, // Pure black
          offset: { value: 33 },
          exponent: { value: 0.6 }
        }}
        vertexShader={`
          varying vec3 vWorldPosition;
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 topColor;
          uniform vec3 bottomColor;
          uniform float offset;
          uniform float exponent;
          varying vec3 vWorldPosition;
          void main() {
            float h = normalize(vWorldPosition + offset).y;
            gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
          }
        `}
      />
    </mesh>
  );
};

/**
 * Solar System Scene - Matching Reference Code
 */
const SolarSystemScene = () => {
  // Planet data scaled up to fill screen borders
  const planets = [
    {
      size: 2.5,
      textureUrl: '/images/mercury.jpg',
      orbitRadius: 35,
      orbitSpeed: 0.004,
      rotationSpeed: 0.004,
    },
    {
      size: 3.5,
      textureUrl: '/images/venus.jpg',
      orbitRadius: 50,
      orbitSpeed: 0.015,
      rotationSpeed: 0.002,
    },
    {
      size: 4.0,
      textureUrl: '/images/earth.jpg',
      orbitRadius: 65,
      orbitSpeed: 0.01,
      rotationSpeed: 0.02,
    },
    {
      size: 3.0,
      textureUrl: '/images/mars.jpg',
      orbitRadius: 80,
      orbitSpeed: 0.008,
      rotationSpeed: 0.018,
    },
    {
      size: 8.5,
      textureUrl: '/images/jupiter.jpg',
      orbitRadius: 110,
      orbitSpeed: 0.002,
      rotationSpeed: 0.04,
    },
    {
      size: 7.5,
      textureUrl: '/images/saturn.jpg',
      orbitRadius: 140,
      orbitSpeed: 0.0009,
      rotationSpeed: 0.038,
      rings: {
        innerRadius: 8.0,
        outerRadius: 15.0,
        textureUrl: '/images/saturn_ring.png',
      },
    },
    {
      size: 5.5,
      textureUrl: '/images/uranus.jpg',
      orbitRadius: 170,
      orbitSpeed: 0.0004,
      rotationSpeed: 0.03,
      rings: {
        innerRadius: 6.0,
        outerRadius: 10.0,
        textureUrl: '/images/uranus_ring.png',
      },
    },
    {
      size: 5.2,
      textureUrl: '/images/neptune.jpg',
      orbitRadius: 200,
      orbitSpeed: 0.0001,
      rotationSpeed: 0.032,
    },
    {
      size: 2.0,
      textureUrl: '/images/pluto.jpg',
      orbitRadius: 230,
      orbitSpeed: 0.0007,
      rotationSpeed: 0.008,
    },
  ];

  return (
    <>
      {/* Lighting - increase ambient to see planet textures */}
      <ambientLight intensity={0.3} color={0xffffff} />
      <directionalLight position={[50, 50, 25]} intensity={0.5} />
      
      {/* Color Graded Space Background */}
      <SpaceBackground />
      
      {/* Procedural Stars */}
      <ProceduralStars />
      
      {/* Sun */}
      <Sun />
      
      {/* Orbital Paths */}
      {planets.map((planet, index) => (
        <OrbitPath key={`path-${index}`} radius={planet.orbitRadius} />
      ))}
      
      {/* Planets */}
      {planets.map((planet, index) => (
        <Planet key={index} {...planet} />
      ))}
    </>
  );
};

/**
 * Loading Fallback
 */
const LoadingFallback = () => (
  <mesh>
    <sphereGeometry args={[5, 16, 16]} />
    <meshBasicMaterial color="#ffffff" />
  </mesh>
);

/**
 * Solar System Background Component
 */
const SolarSystemBackground = ({ isBlurred = false }) => {
  return (
    <div className={`fixed inset-0 w-full h-full z-0 bg-black transition-all duration-500 ${isBlurred ? 'blur-sm' : ''}`}>
      <Canvas
        camera={{ 
          position: [50, 90, 100], // Better view of the whole solar system
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        className="w-full h-full fixed z-0 bg-black"
      >
        <Suspense fallback={<LoadingFallback />}>
          <SolarSystemScene />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={80}
            maxDistance={600}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SolarSystemBackground; 