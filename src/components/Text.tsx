import React, { useRef, useEffect } from "react";
import { extend } from "@react-three/fiber";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import * as THREE from "three";
import fnt from "../../public/fonts/Saira_Bold.json";
import { MeshPhongMaterial } from "three";

extend({ TextGeometry, MeshPhongMaterial });

interface ThreeTextProps {
  text: string;
  position: [number, number, number];
  maxWidth: number;
}

const ThreeText: React.FC<ThreeTextProps> = ({ text, position, maxWidth }) => {
  const font = new FontLoader().parse(fnt as any);
  const meshRef = useRef<THREE.Mesh>(null);

  const splitTextIntoLines = (text: string, maxWidth: number) => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + " " + word;
      const testGeometry = new TextGeometry(testLine, {
        font,
        size: 1,
        height: 0.5,
      });
      const testWidth = new THREE.Box3()
        .setFromObject(new THREE.Mesh(testGeometry))
        .getSize(new THREE.Vector3()).x;

      if (testWidth > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const lines = splitTextIntoLines(text, maxWidth);

  useEffect(() => {
    if (meshRef.current) {
      const geometry = meshRef.current.geometry as TextGeometry;
      geometry.computeBoundingBox();
      const boundingBox = geometry.boundingBox as THREE.Box3;
      const center = new THREE.Vector3();
      boundingBox.getCenter(center);
      geometry.translate(-center.x, -center.y, -center.z);
    }
  }, [text]);

  return (
    <group position={position}>
      {lines.map((line, index) => (
        <mesh key={index} position={[0, -index * 1.2, 0]}>
          <textGeometry
            args={[line, { font, size: 1, height: 0.5 }]}
            attach="geometry"
          />
          <meshPhongMaterial color="hotpink" attach="material" />
        </mesh>
      ))}
    </group>
  );
};

export default ThreeText;
