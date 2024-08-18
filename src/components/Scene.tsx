// src/components/Scene.tsx
import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import {
  Physics,
  usePlane,
  useBox,
  PlaneProps,
  BoxProps,
} from "@react-three/cannon";
import { Mesh } from "three";
import ThreeText from "./Text";
import { Orbit } from "next/font/google";

function Plane(props: PlaneProps) {
  const [ref] = usePlane<Mesh>(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <shadowMaterial color="#171717" transparent opacity={0.4} />
    </mesh>
  );
}

function Cube(props: BoxProps) {
  const [ref] = useBox<Mesh>(() => ({
    mass: 1,
    position: [0, 5, 0],
    rotation: [0.4, 0.2, 0.5],
    ...props,
  }));
  return (
    <mesh receiveShadow castShadow ref={ref}>
      <boxGeometry />
      <meshLambertMaterial color="hotpink" />
    </mesh>
  );
}

const Scene = () => {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ alpha: false }}
      camera={{ position: [-1, 5, 5], fov: 45 }}
    >
      <color attach="background" args={["lightblue"]} />
      <ambientLight />
      <directionalLight
        position={[10, 10, 10]}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <Physics>
        <Plane position={[0, -2.5, 0]} />
        <Cube position={[0.1, 5, 0]} />
        <Cube position={[0, 10, -1]} />
        <Cube position={[0, 20, -2]} />
      </Physics>
      <ThreeText
        text="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        position={[0, 5, 0]}
        maxWidth={100}
      />
      <ThreeText
        text="abcdefghijklmnopqrstuvwxyz"
        position={[0, 0, 0]}
        maxWidth={100}
      />
      <OrbitControls />
    </Canvas>
  );
};

export default Scene;
