import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group, Mesh, Points } from "three";
import { BrainCircuit, ImagePlus, ScanSearch, ShieldCheck } from "lucide-react";
import { AvatarAssistenteVRM } from "./AvatarAssistenteVRM";

function numeroDeterministico(indice: number) {
  const valor = Math.sin(indice * 928.17) * 43758.5453;
  return valor - Math.floor(valor);
}

function ParticulasClinicas() {
  const pontosRef = useRef<Points>(null);

  const posicoes = useMemo(() => {
    const quantidade = 170;
    const buffer = new Float32Array(quantidade * 3);

    for (let i = 0; i < quantidade; i += 1) {
      const indice = i * 3;

      buffer[indice] = (numeroDeterministico(i + 1) - 0.5) * 7.5;
      buffer[indice + 1] = (numeroDeterministico(i + 2) - 0.5) * 4.3;
      buffer[indice + 2] = (numeroDeterministico(i + 3) - 0.5) * 3.8;
    }

    return buffer;
  }, []);

  useFrame((_, delta) => {
    if (!pontosRef.current) return;

    pontosRef.current.rotation.y += delta * 0.025;
    pontosRef.current.rotation.x += delta * 0.008;
  });

  return (
    <points ref={pontosRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[posicoes, 3]} />
      </bufferGeometry>

      <pointsMaterial
        color="#5eead4"
        size={0.035}
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </points>
  );
}

function PainelClassificacaoDermatologica() {
  const grupoRef = useRef<Group>(null);
  const linhaVarreduraRef = useRef<Mesh>(null);
  const anelRef = useRef<Mesh>(null);

  useFrame((estado, delta) => {
    if (grupoRef.current) {
      grupoRef.current.rotation.y =
        Math.sin(estado.clock.elapsedTime * 0.55) * 0.08;
    }

    if (linhaVarreduraRef.current) {
      linhaVarreduraRef.current.position.y =
        Math.sin(estado.clock.elapsedTime * 1.9) * 0.62;
    }

    if (anelRef.current) {
      anelRef.current.rotation.z += delta * 0.65;
    }
  });

  return (
    <group ref={grupoRef} position={[1.35, -0.1, 0]}>
      <mesh>
        <boxGeometry args={[1.68, 1.9, 0.08]} />
        <meshStandardMaterial
          color="#020617"
          roughness={0.35}
          metalness={0.25}
          transparent
          opacity={0.9}
        />
      </mesh>

      <mesh position={[0, 0.05, 0.08]}>
        <circleGeometry args={[0.52, 64]} />
        <meshStandardMaterial color="#14b8a6" transparent opacity={0.22} />
      </mesh>

      <mesh position={[-0.14, 0.16, 0.13]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color="#fb7185" transparent opacity={0.82} />
      </mesh>

      <mesh position={[0.17, -0.08, 0.13]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="#f97316" transparent opacity={0.75} />
      </mesh>

      <mesh ref={anelRef} position={[0, 0.02, 0.17]}>
        <torusGeometry args={[0.68, 0.012, 16, 120]} />
        <meshBasicMaterial color="#5eead4" transparent opacity={0.72} />
      </mesh>

      <mesh ref={linhaVarreduraRef} position={[0, 0, 0.2]}>
        <boxGeometry args={[1.35, 0.035, 0.035]} />
        <meshBasicMaterial color="#5eead4" transparent opacity={0.88} />
      </mesh>

      <mesh position={[0, -1.14, 0.13]}>
        <boxGeometry args={[1.25, 0.18, 0.04]} />
        <meshStandardMaterial
          color="#0f766e"
          emissive="#14b8a6"
          emissiveIntensity={0.28}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

function FeixeAnalise() {
  const feixeRef = useRef<Mesh>(null);

  useFrame((estado) => {
    if (!feixeRef.current) return;

    feixeRef.current.scale.x =
      1 + Math.sin(estado.clock.elapsedTime * 2) * 0.08;

    feixeRef.current.rotation.z =
      Math.sin(estado.clock.elapsedTime * 1.4) * 0.03;
  });

  return (
    <mesh ref={feixeRef} position={[0.05, -0.05, -0.08]}>
      <boxGeometry args={[1.55, 0.025, 0.025]} />
      <meshBasicMaterial color="#38bdf8" transparent opacity={0.45} />
    </mesh>
  );
}

function Cena3D() {
  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.8} />
      <pointLight position={[-3, -2, 4]} intensity={1.2} color="#5eead4" />
      <pointLight position={[3, 2, 4]} intensity={0.8} color="#818cf8" />

      <ParticulasClinicas />

      <AvatarAssistenteVRM caminhoModelo="/models/1995935884174801438.vrm" />

      <PainelClassificacaoDermatologica />
      <FeixeAnalise />
    </>
  );
}

export const CenaClassificacaoIA: React.FC = () => {
  return (
    <div className="relative bg-slate-900/70 border border-white/10 rounded-[2rem] p-6 shadow-2xl shadow-black/30 backdrop-blur-md overflow-hidden min-h-[620px]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.08)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.14),transparent_58%)]" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-400/10 border border-teal-300/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-teal-300 font-mono">
            <BrainCircuit className="w-3.5 h-3.5" />
            Assistente IA
          </span>

          <h3 className="mt-4 max-w-sm text-2xl font-black leading-tight text-white">
            Classificação visual em tempo real
          </h3>

          <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
            Representação do processo de leitura da imagem, extração de padrões
            e estimativa de resultado.
          </p>
        </div>

        <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-teal-400/10 border border-teal-300/20 items-center justify-center text-teal-300">
          <ShieldCheck className="w-6 h-6" />
        </div>
      </div>

      <div className="absolute inset-x-0 top-24 bottom-24 z-10">
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <Cena3D />
        </Canvas>
      </div>

      <div className="absolute left-6 right-6 bottom-6 z-20 grid grid-cols-3 gap-3">
        <IndicadorCena
          titulo="Imagem"
          valor="Recebida"
          icone={<ImagePlus className="w-4 h-4" />}
        />

        <IndicadorCena
          titulo="Padrões"
          valor="Extraídos"
          icone={<BrainCircuit className="w-4 h-4" />}
        />

        <IndicadorCena
          titulo="Resultado"
          valor="Estimado"
          icone={<ScanSearch className="w-4 h-4" />}
        />
      </div>
    </div>
  );
};

interface IndicadorCenaProps {
  titulo: string;
  valor: string;
  icone: React.ReactNode;
}

const IndicadorCena: React.FC<IndicadorCenaProps> = ({
  titulo,
  valor,
  icone,
}) => {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-3 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-teal-300">
        {icone}

        <span className="text-[9px] uppercase tracking-widest font-black">
          {titulo}
        </span>
      </div>

      <p className="mt-2 text-sm font-black text-white">{valor}</p>
    </div>
  );
};
