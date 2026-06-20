import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

export const AssistenteAnimeFallback: React.FC = () => {
  const grupoRef = useRef<Group>(null);

  useFrame((estado) => {
    if (!grupoRef.current) return;

    grupoRef.current.position.y =
      -0.28 + Math.sin(estado.clock.elapsedTime * 1.25) * 0.045;

    grupoRef.current.rotation.y =
      Math.sin(estado.clock.elapsedTime * 0.75) * 0.12;
  });

  return (
    <group ref={grupoRef} position={[-1.25, -0.28, 0]}>
      <mesh position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.38, 40, 40]} />
        <meshStandardMaterial color="#f6c7a8" roughness={0.62} />
      </mesh>

      <mesh position={[0, 0.9, -0.02]}>
        <sphereGeometry args={[0.39, 40, 40]} />
        <meshStandardMaterial color="#172033" roughness={0.75} />
      </mesh>

      <mesh position={[-0.22, 0.83, 0.18]} rotation={[0.15, 0, 0.35]}>
        <coneGeometry args={[0.12, 0.36, 24]} />
        <meshStandardMaterial color="#172033" roughness={0.75} />
      </mesh>

      <mesh position={[0.05, 0.9, 0.22]} rotation={[0.1, 0, -0.08]}>
        <coneGeometry args={[0.14, 0.42, 24]} />
        <meshStandardMaterial color="#172033" roughness={0.75} />
      </mesh>

      <mesh position={[-0.13, 0.73, 0.34]}>
        <sphereGeometry args={[0.045, 20, 20]} />
        <meshBasicMaterial color="#5eead4" />
      </mesh>

      <mesh position={[0.13, 0.73, 0.34]}>
        <sphereGeometry args={[0.045, 20, 20]} />
        <meshBasicMaterial color="#5eead4" />
      </mesh>

      <mesh position={[0, 0.55, 0.35]}>
        <boxGeometry args={[0.18, 0.025, 0.025]} />
        <meshBasicMaterial color="#fb7185" />
      </mesh>

      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[0.72, 0.95, 0.34]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.52} />
      </mesh>

      <mesh position={[0, 0.1, 0.18]}>
        <boxGeometry args={[0.46, 0.68, 0.04]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>

      <mesh position={[-0.43, -0.05, 0]}>
        <boxGeometry args={[0.17, 0.65, 0.26]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
      </mesh>

      <mesh position={[0.43, -0.05, 0]}>
        <boxGeometry args={[0.17, 0.65, 0.26]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
      </mesh>

      <mesh position={[0, 0.25, 0.24]}>
        <torusGeometry args={[0.18, 0.012, 16, 48]} />
        <meshBasicMaterial color="#14b8a6" />
      </mesh>

      <mesh position={[0, -0.72, 0]}>
        <boxGeometry args={[0.5, 0.28, 0.28]} />
        <meshStandardMaterial color="#0f172a" roughness={0.55} />
      </mesh>
    </group>
  );
};