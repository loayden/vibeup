import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const COLORS = {
  sea: "#0b6e85",
  seaDeep: "#083b51",
  foam: "#d9f9ff",
  sand: "#d5ad6f",
  sandDark: "#a87941",
  gold: "#e6b95d",
  amber: "#ffb342",
  red: "#8d2f2b",
  blueLed: "#16c8ff",
  vipLed: "#ffcc6b",
  ink: "#08070a",
  metal: "#8895a3",
  fabric: "#6a3d2a",
  ivory: "#f2dba0",
};

type Vec3 = [number, number, number];

type Instance = {
  position: Vec3;
  scale: Vec3;
  rotation?: Vec3;
  color?: string;
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const seconds = (value: number, fps: number) => value * fps;

const seeded = (seed: number) => {
  const value = Math.sin(seed * 999.371) * 10000;
  return value - Math.floor(value);
};

const applyInstances = (
  mesh: THREE.InstancedMesh | null,
  instances: Instance[],
) => {
  if (!mesh) {
    return;
  }

  const dummy = new THREE.Object3D();
  instances.forEach((item, index) => {
    dummy.position.set(...item.position);
    dummy.rotation.set(...(item.rotation ?? [0, 0, 0]));
    dummy.scale.set(...item.scale);
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);

    if (item.color) {
      mesh.setColorAt(index, new THREE.Color(item.color));
    }
  });

  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) {
    mesh.instanceColor.needsUpdate = true;
  }
};

function InstancedBoxes({
  instances,
  color,
  emissive,
  emissiveIntensity = 0,
  roughness = 0.75,
  metalness = 0,
}: {
  instances: Instance[];
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  roughness?: number;
  metalness?: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    applyInstances(ref.current, instances);
  }, [instances]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, instances.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive ?? "#000000"}
        emissiveIntensity={emissiveIntensity}
        metalness={metalness}
        roughness={roughness}
        vertexColors={instances.some((item) => item.color)}
      />
    </instancedMesh>
  );
}

function InstancedSpheres({
  instances,
  color,
  roughness = 0.75,
}: {
  instances: Instance[];
  color: string;
  roughness?: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    applyInstances(ref.current, instances);
  }, [instances]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, instances.length]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        vertexColors={instances.some((item) => item.color)}
      />
    </instancedMesh>
  );
}

function InstancedCylinders({
  instances,
  color,
  roughness = 0.75,
}: {
  instances: Instance[];
  color: string;
  roughness?: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    applyInstances(ref.current, instances);
  }, [instances]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, instances.length]}>
      <cylinderGeometry args={[1, 1, 1, 8]} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        vertexColors={instances.some((item) => item.color)}
      />
    </instancedMesh>
  );
}

function InstancedTentRoofs({ instances }: { instances: Instance[] }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    applyInstances(ref.current, instances);
  }, [instances]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, instances.length]}>
      <coneGeometry args={[1, 1, 4]} />
      <meshStandardMaterial color={COLORS.fabric} roughness={0.82} />
    </instancedMesh>
  );
}

function CameraPath() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const { camera } = useThree();
  const progress = frame / Math.max(1, durationInFrames - 1);
  const angle = interpolate(progress, [0, 0.32, 0.62, 0.82, 1], [-0.88, -0.34, -0.08, 0.18, 0.42], clamp);
  const radius = interpolate(progress, [0, 0.32, 0.62, 0.82, 1], [158, 145, 112, 92, 78], clamp);
  const height = interpolate(progress, [0, 0.34, 0.62, 0.82, 1], [78, 66, 54, 42, 46], clamp);
  const targetZ = interpolate(progress, [0, 0.34, 0.62, 0.82, 1], [34, 44, 74, 86, 118], clamp);
  const targetX = interpolate(progress, [0, 0.45, 0.72, 1], [0, 0, -2, 0], clamp);

  camera.position.set(
    targetX + Math.sin(angle) * radius,
    height,
    targetZ - Math.cos(angle) * radius,
  );

  camera.lookAt(new THREE.Vector3(targetX, 1.5, targetZ));

  if (camera instanceof THREE.PerspectiveCamera) {
    camera.fov = interpolate(progress, [0, 0.55, 1], [44, 38, 32], clamp);
    camera.updateProjectionMatrix();
  }

  return null;
}

function SeaFront() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const waveShift = (frame / fps) * 2.2;

  return (
    <group>
      <mesh position={[0, -0.06, -48]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[128, 58, 32, 8]} />
        <meshStandardMaterial
          color={COLORS.sea}
          emissive={COLORS.seaDeep}
          emissiveIntensity={0.28}
          metalness={0.58}
          roughness={0.18}
        />
      </mesh>
      {Array.from({ length: 11 }).map((_, index) => {
        const z = -18 - index * 3.7 + Math.sin(waveShift + index) * 0.9;
        const opacity = interpolate(index, [0, 10], [0.72, 0.18], clamp);

        return (
          <mesh
            key={index}
            position={[Math.sin(waveShift * 0.7 + index) * 1.5, 0.04, z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[108 - index * 4.2, 0.38]} />
            <meshBasicMaterial
              color={COLORS.foam}
              transparent
              opacity={opacity}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
      <mesh position={[0, 0.02, -18.8]}>
        <boxGeometry args={[104, 0.05, 0.25]} />
        <meshStandardMaterial
          color="#ffe4a4"
          emissive={COLORS.gold}
          emissiveIntensity={0.22}
        />
      </mesh>
    </group>
  );
}

function LedFloor({
  position,
  size,
  color,
  seed,
}: {
  position: Vec3;
  size: [number, number];
  color: string;
  seed: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 2 + seed),
    [-1, 1],
    [0.7, 1.5],
  );
  const gridLines = useMemo(() => {
    const lines: Instance[] = [];
    const [width, depth] = size;
    for (let x = -width / 2; x <= width / 2; x += 2) {
      lines.push({
        position: [position[0] + x, position[1] + 0.035, position[2]],
        scale: [0.05, 0.03, depth],
      });
    }
    for (let z = -depth / 2; z <= depth / 2; z += 2) {
      lines.push({
        position: [position[0], position[1] + 0.04, position[2] + z],
        scale: [width, 0.03, 0.05],
      });
    }
    return lines;
  }, [position, size]);

  return (
    <group>
      <mesh position={position}>
        <boxGeometry args={[size[0], 0.08, size[1]]} />
        <meshStandardMaterial
          color="#111725"
          emissive={color}
          emissiveIntensity={pulse}
          metalness={0.28}
          roughness={0.18}
        />
      </mesh>
      <InstancedBoxes
        instances={gridLines}
        color={color}
        emissive={color}
        emissiveIntensity={1.8}
        roughness={0.2}
      />
    </group>
  );
}

function Ground() {
  const zoneBands = useMemo<Instance[]>(
    () => [
      { position: [0, -0.08, 52], scale: [112, 0.06, 158], color: COLORS.sand },
      { position: [0, -0.04, 18], scale: [100, 0.05, 66], color: "#d9b579" },
      { position: [0, -0.035, 83], scale: [100, 0.05, 54], color: "#c69a62" },
      { position: [0, -0.03, 125], scale: [102, 0.05, 20], color: "#866343" },
    ],
    [],
  );
  const aisles = useMemo<Instance[]>(
    () => [
      { position: [0, 0.005, 16], scale: [5.2, 0.035, 58], color: "#f0c985" },
      { position: [-51.4, 0.005, 52], scale: [2, 0.035, 132], color: "#e2bd79" },
      { position: [51.4, 0.005, 52], scale: [2, 0.035, 132], color: "#e2bd79" },
      { position: [0, 0.01, 54], scale: [104, 0.035, 3.2], color: "#b99562" },
      { position: [0, 0.01, 111], scale: [104, 0.035, 3.2], color: "#b99562" },
    ],
    [],
  );

  return (
    <group>
      <InstancedBoxes instances={zoneBands} color={COLORS.sand} roughness={0.95} />
      <InstancedBoxes instances={aisles} color="#e4bd7a" roughness={0.9} />
    </group>
  );
}

function NormalZone() {
  const data = useMemo(() => {
    const carpets: Instance[] = [];
    const tables: Instance[] = [];
    const cushions: Instance[] = [];
    const bodies: Instance[] = [];
    const heads: Instance[] = [];

    const guestOffsets: [number, number][] = [
      [-1.2, -0.72],
      [-0.6, -0.72],
      [0, -0.72],
      [0.6, -0.72],
      [1.2, -0.72],
      [-1.2, 0.72],
      [-0.6, 0.72],
      [0, 0.72],
      [0.6, 0.72],
      [1.2, 0.72],
    ];

    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 20; col++) {
        const x = -45.5 + col * 4.78;
        const z = -9.5 + row * 4.25;
        const id = row * 20 + col;
        const carpetColor = id % 3 === 0 ? COLORS.red : id % 3 === 1 ? "#ad6a38" : "#7d3b36";

        carpets.push({
          position: [x, 0.04, z],
          scale: [3.28, 0.055, 2.18],
          color: carpetColor,
        });
        tables.push({
          position: [x, 0.18, z],
          scale: [0.9, 0.16, 0.46],
          color: "#7b4c2b",
        });

        guestOffsets.forEach(([guestX, guestZ], guestIndex) => {
          const jitterX = (seeded(id * 13 + guestIndex) - 0.5) * 0.14;
          const jitterZ = (seeded(id * 17 + guestIndex) - 0.5) * 0.12;
          const color = guestIndex % 2 === 0 ? "#1a1714" : "#273037";

          cushions.push({
            position: [x + guestX + jitterX, 0.1, z + guestZ + jitterZ],
            scale: [0.42, 0.08, 0.34],
            color: guestIndex % 3 === 0 ? "#d7b16b" : "#c4473c",
          });
          bodies.push({
            position: [x + guestX + jitterX, 0.34, z + guestZ + jitterZ],
            scale: [0.17, 0.42, 0.17],
            color,
          });
          heads.push({
            position: [x + guestX + jitterX, 0.66, z + guestZ + jitterZ],
            scale: [0.16, 0.16, 0.16],
            color: "#c89464",
          });
        });
      }
    }

    return { bodies, carpets, cushions, heads, tables };
  }, []);

  const amenities = useMemo<Instance[]>(
    () => [
      { position: [-57, 0.6, 11], scale: [6.5, 1.2, 17], color: "#b96a35" },
      { position: [57, 0.6, 11], scale: [6.5, 1.2, 17], color: "#b96a35" },
      { position: [-56.5, 0.55, 36], scale: [5.4, 1.1, 4.2], color: "#dcd2c1" },
      { position: [56.5, 0.55, 36], scale: [5.4, 1.1, 4.2], color: "#dcd2c1" },
      { position: [-56.5, 0.55, -13], scale: [5.4, 1.1, 4.2], color: "#dcd2c1" },
      { position: [56.5, 0.55, -13], scale: [5.4, 1.1, 4.2], color: "#dcd2c1" },
    ],
    [],
  );
  const canopyRoofs = useMemo<Instance[]>(
    () => [
      { position: [-57, 1.45, 11], scale: [8.2, 0.18, 19], color: COLORS.ivory },
      { position: [57, 1.45, 11], scale: [8.2, 0.18, 19], color: COLORS.ivory },
    ],
    [],
  );

  return (
    <group>
      <InstancedBoxes instances={data.carpets} color={COLORS.red} roughness={0.86} />
      <InstancedBoxes instances={data.cushions} color="#d1a357" roughness={0.75} />
      <InstancedBoxes instances={data.tables} color="#70492b" roughness={0.72} />
      <InstancedCylinders instances={data.bodies} color="#202022" roughness={0.82} />
      <InstancedSpheres instances={data.heads} color="#c89464" roughness={0.78} />
      <LedFloor position={[0, 0.13, 42]} size={[24, 13.5]} color={COLORS.blueLed} seed={0.3} />
      <StandingCrowd count={140} area={[-10, 10, 36.5, 47.5]} seed={810} color="#273447" />
      <InstancedBoxes instances={amenities} color="#bc773f" roughness={0.8} />
      <InstancedBoxes instances={canopyRoofs} color={COLORS.ivory} roughness={0.55} />
      <LightPoles rows={6} zStart={-15} zStep={11} />
    </group>
  );
}

function StandingCrowd({
  count,
  area,
  seed,
  color,
}: {
  count: number;
  area: [number, number, number, number];
  seed: number;
  color: string;
}) {
  const data = useMemo(() => {
    const bodies: Instance[] = [];
    const heads: Instance[] = [];
    const [minX, maxX, minZ, maxZ] = area;

    for (let index = 0; index < count; index++) {
      const x = minX + seeded(seed + index * 3) * (maxX - minX);
      const z = minZ + seeded(seed + index * 7) * (maxZ - minZ);
      const y = 0.38 + seeded(seed + index * 11) * 0.08;
      bodies.push({
        position: [x, y, z],
        scale: [0.16, 0.62, 0.16],
        color: index % 3 === 0 ? color : "#101116",
        rotation: [0, seeded(seed + index) * Math.PI, 0],
      });
      heads.push({
        position: [x, y + 0.46, z],
        scale: [0.15, 0.15, 0.15],
        color: "#ca9365",
      });
    }

    return { bodies, heads };
  }, [area, color, count, seed]);

  return (
    <group>
      <InstancedCylinders instances={data.bodies} color={color} roughness={0.8} />
      <InstancedSpheres instances={data.heads} color="#ca9365" roughness={0.8} />
    </group>
  );
}

function LightPoles({
  rows,
  zStart,
  zStep,
}: {
  rows: number;
  zStart: number;
  zStep: number;
}) {
  const frame = useCurrentFrame();
  const glow = interpolate(Math.sin(frame / 18), [-1, 1], [0.7, 1.2]);
  const poles = useMemo<Instance[]>(() => {
    const items: Instance[] = [];
    for (let row = 0; row < rows; row++) {
      const z = zStart + row * zStep;
      items.push({ position: [-49, 1.75, z], scale: [0.16, 3.5, 0.16] });
      items.push({ position: [49, 1.75, z], scale: [0.16, 3.5, 0.16] });
    }
    return items;
  }, [rows, zStart, zStep]);
  const bulbs = useMemo<Instance[]>(() => {
    const items: Instance[] = [];
    for (let row = 0; row < rows; row++) {
      const z = zStart + row * zStep;
      items.push({ position: [-49, 3.65, z], scale: [0.42, 0.42, 0.42] });
      items.push({ position: [49, 3.65, z], scale: [0.42, 0.42, 0.42] });
    }
    return items;
  }, [rows, zStart, zStep]);

  return (
    <group>
      <InstancedBoxes instances={poles} color="#2b2e33" roughness={0.65} metalness={0.2} />
      <InstancedSpheres instances={bulbs} color={COLORS.amber} roughness={0.2} />
      {bulbs.map((bulb, index) => (
        <pointLight
          key={index}
          position={bulb.position}
          color={COLORS.amber}
          intensity={5 * glow}
          distance={16}
        />
      ))}
    </group>
  );
}

function SecurityBuffer() {
  const panels = useMemo<Instance[]>(() => {
    const items: Instance[] = [];
    for (let x = -49; x <= 49; x += 4.8) {
      if (Math.abs(x) > 8) {
        items.push({ position: [x, 1.1, 54.2], scale: [3.8, 1.6, 0.12] });
      }
      items.push({ position: [x, 1.15, 54.2], scale: [0.12, 2.3, 0.18] });
    }
    items.push({ position: [-11, 1, 51.7], scale: [4, 1.4, 2.2], color: "#151920" });
    items.push({ position: [11, 1, 51.7], scale: [4, 1.4, 2.2], color: "#151920" });
    return items;
  }, []);

  return (
    <group>
      <InstancedBoxes
        instances={panels}
        color={COLORS.metal}
        roughness={0.38}
        metalness={0.55}
      />
      <mesh position={[0, 1.65, 54.2]}>
        <boxGeometry args={[16, 0.25, 0.32]} />
        <meshStandardMaterial
          color={COLORS.gold}
          emissive={COLORS.gold}
          emissiveIntensity={0.25}
          metalness={0.5}
          roughness={0.35}
        />
      </mesh>
    </group>
  );
}

function VipZone() {
  const data = useMemo(() => {
    const roofs: Instance[] = [];
    const bases: Instance[] = [];
    const tables: Instance[] = [];
    const bodies: Instance[] = [];
    const heads: Instance[] = [];
    const carpets: Instance[] = [];

    const guestOffsets: [number, number][] = [
      [-0.95, -0.62],
      [-0.45, -0.78],
      [0.25, -0.78],
      [0.95, -0.62],
      [-1.08, 0.05],
      [1.08, 0.05],
      [-0.95, 0.68],
      [-0.28, 0.82],
      [0.45, 0.82],
      [1.05, 0.68],
    ];

    const addTent = (x: number, z: number, id: number) => {
      carpets.push({ position: [x, 0.06, z], scale: [4.45, 0.05, 3.25], color: "#7a342e" });
      bases.push({ position: [x, 0.62, z], scale: [3.8, 0.9, 2.6], color: "#56311f" });
      roofs.push({
        position: [x, 1.62, z],
        scale: [2.65, 1.95, 2.65],
        rotation: [0, Math.PI / 4, 0],
      });
      tables.push({
        position: [x, 0.38, z],
        scale: [1.18, 0.16, 0.52],
        color: "#a47742",
      });

      guestOffsets.forEach(([guestX, guestZ], guestIndex) => {
        const jitterX = (seeded(id * 41 + guestIndex) - 0.5) * 0.16;
        const jitterZ = (seeded(id * 53 + guestIndex) - 0.5) * 0.14;
        bodies.push({
          position: [x + guestX + jitterX, 0.45, z + guestZ + jitterZ],
          scale: [0.17, 0.48, 0.17],
          color: guestIndex % 2 === 0 ? "#11100f" : "#3a271f",
        });
        heads.push({
          position: [x + guestX + jitterX, 0.82, z + guestZ + jitterZ],
          scale: [0.16, 0.16, 0.16],
          color: "#d0a16d",
        });
      });
    };

    let id = 0;
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        addTent(-43 + col * 7.6, 62 + row * 6.1, id++);
        addTent(12.6 + col * 7.6, 62 + row * 6.1, id++);
      }
    }

    return { bases, bodies, carpets, heads, roofs, tables };
  }, []);

  const barsAndService = useMemo<Instance[]>(
    () => [
      { position: [-57, 0.9, 82], scale: [7.5, 1.8, 14], color: "#7d4d28" },
      { position: [57, 0.9, 82], scale: [7.5, 1.8, 14], color: "#7d4d28" },
      { position: [-34, 0.72, 106], scale: [15, 1.45, 4], color: "#9f6b36" },
      { position: [0, 0.72, 106], scale: [15, 1.45, 4], color: "#9f6b36" },
      { position: [34, 0.72, 106], scale: [15, 1.45, 4], color: "#9f6b36" },
      { position: [-50, 0.75, 101], scale: [7, 1.5, 3.5], color: "#d8d4c8" },
      { position: [-41, 0.75, 101], scale: [7, 1.5, 3.5], color: "#d8d4c8" },
      { position: [41, 0.75, 101], scale: [7, 1.5, 3.5], color: "#d8d4c8" },
      { position: [50, 0.75, 101], scale: [7, 1.5, 3.5], color: "#d8d4c8" },
    ],
    [],
  );
  const goldTrim = useMemo<Instance[]>(
    () => [
      { position: [-57, 1.85, 82], scale: [8.2, 0.22, 14.8] },
      { position: [57, 1.85, 82], scale: [8.2, 0.22, 14.8] },
      { position: [-34, 1.5, 106], scale: [15.5, 0.18, 4.5] },
      { position: [0, 1.5, 106], scale: [15.5, 0.18, 4.5] },
      { position: [34, 1.5, 106], scale: [15.5, 0.18, 4.5] },
    ],
    [],
  );

  return (
    <group>
      <InstancedBoxes instances={data.carpets} color="#7a342e" roughness={0.8} />
      <InstancedBoxes instances={data.bases} color="#56311f" roughness={0.82} />
      <InstancedTentRoofs instances={data.roofs} />
      <InstancedBoxes instances={data.tables} color="#a47742" roughness={0.7} />
      <InstancedCylinders instances={data.bodies} color="#17110f" roughness={0.82} />
      <InstancedSpheres instances={data.heads} color="#d0a16d" roughness={0.78} />
      <LedFloor position={[0, 0.15, 82]} size={[18, 32]} color={COLORS.vipLed} seed={1.2} />
      <StandingCrowd count={110} area={[-7.6, 7.6, 68.5, 95.5]} seed={1140} color="#2d2435" />
      <InstancedBoxes instances={barsAndService} color="#8a542b" roughness={0.65} />
      <InstancedBoxes
        instances={goldTrim}
        color={COLORS.gold}
        emissive={COLORS.gold}
        emissiveIntensity={0.45}
        roughness={0.35}
        metalness={0.45}
      />
      <LightPoles rows={5} zStart={60} zStep={10.5} />
    </group>
  );
}

function Stage() {
  const frame = useCurrentFrame();
  const sweep = Math.sin(frame / 42) * 0.32;
  const pulse = interpolate(Math.sin(frame / 10), [-1, 1], [0.7, 1.35]);
  const truss = useMemo<Instance[]>(
    () => [
      { position: [0, 0.8, 121], scale: [64, 1.6, 9.2], color: "#151515" },
      { position: [0, 8.8, 125.2], scale: [37, 13.5, 0.36], color: "#101014" },
      { position: [-27, 7.6, 124.8], scale: [12.5, 9.8, 0.36], color: "#101014" },
      { position: [27, 7.6, 124.8], scale: [12.5, 9.8, 0.36], color: "#101014" },
      { position: [-33, 6.8, 121.7], scale: [0.45, 13.5, 0.45], color: "#2a2a2f" },
      { position: [33, 6.8, 121.7], scale: [0.45, 13.5, 0.45], color: "#2a2a2f" },
      { position: [0, 13.8, 121.7], scale: [67, 0.45, 0.45], color: "#2a2a2f" },
      { position: [0, 1, 135], scale: [42, 2, 7.5], color: "#3a3230" },
      { position: [-24, 1, 134.2], scale: [10, 2, 5], color: "#413632" },
      { position: [24, 1, 134.2], scale: [10, 2, 5], color: "#413632" },
    ],
    [],
  );

  return (
    <group>
      <InstancedBoxes instances={truss} color="#17171a" roughness={0.48} metalness={0.45} />
      <mesh position={[0, 8.9, 124.95]}>
        <planeGeometry args={[34.5, 12.6]} />
        <meshBasicMaterial color="#1b78ff" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 8.9, 124.72]}>
        <planeGeometry args={[32, 10.6]} />
        <meshBasicMaterial color="#ffb14a" transparent opacity={0.75 * pulse} side={THREE.DoubleSide} />
      </mesh>
      {[-24, -14, 0, 14, 24].map((x, index) => (
        <spotLight
          key={x}
          position={[x, 12.5, 120]}
          target-position={[x * 0.2, 0, 78]}
          color={index % 2 === 0 ? COLORS.blueLed : COLORS.gold}
          intensity={145}
          distance={85}
          angle={0.22}
          penumbra={0.7}
        />
      ))}
      {Array.from({ length: 10 }).map((_, index) => {
        const x = -28 + index * 6.2;
        const yaw = -0.62 + index * 0.135 + sweep;
        const color = index % 2 === 0 ? COLORS.blueLed : COLORS.gold;

        return (
          <mesh
            key={index}
            position={[x * 0.42, 6.7, 94]}
            rotation={[0.18, yaw, 0]}
          >
            <boxGeometry args={[0.18, 0.06, 74]} />
            <meshBasicMaterial color={color} transparent opacity={0.28} />
          </mesh>
        );
      })}
      {Array.from({ length: 9 }).map((_, index) => (
        <mesh key={index} position={[-28 + index * 7, 2.35, 116.7]}>
          <sphereGeometry args={[0.8 + seeded(index) * 0.7, 10, 10]} />
          <meshBasicMaterial color="#e7edf3" transparent opacity={0.12} />
        </mesh>
      ))}
    </group>
  );
}

function SiteScene() {
  return (
    <>
      <color attach="background" args={["#251719"]} />
      <fog attach="fog" args={["#2b201d", 118, 275]} />
      <ambientLight intensity={0.58} />
      <hemisphereLight args={["#ffc978", "#17354b", 2.35]} />
      <directionalLight position={[-56, 58, -62]} color="#ffc277" intensity={4} />
      <pointLight position={[0, 26, 122]} color={COLORS.gold} intensity={220} distance={135} />
      <CameraPath />
      <SeaFront />
      <Ground />
      <NormalZone />
      <SecurityBuffer />
      <VipZone />
      <Stage />
    </>
  );
}

function CinematicOverlay() {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const time = frame / fps;
  const progress = frame / durationInFrames;
  const intro = interpolate(frame, [0, seconds(2, fps)], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const titleExit = interpolate(frame, [seconds(4.5, fps), seconds(6.2, fps)], [1, 0], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const phase =
    time < 7
      ? "FULL SITE ORBIT"
      : time < 13
        ? "NORMAL ZONE / 2,000 GUESTS"
        : time < 20
          ? "VIP ZONE / 70 BEDOUIN TENTS"
          : "MAIN STAGE / SEA-FACING PRODUCTION";

  return (
    <AbsoluteFill>
      <div className="vignette" />
      <div
        className="title-block"
        style={{
          opacity: intro * titleExit,
          transform: `translateY(${interpolate(intro, [0, 1], [28, 0], clamp)}px)`,
        }}
      >
        <div className="eyebrow">EGYPT BEACHFRONT FESTIVAL MASTERPLAN</div>
        <div className="headline">Sea to Stage Drone Orbit</div>
      </div>
      <div className="phase-panel">
        <div className="phase-label">CAMERA PASS</div>
        <div className="phase-value">{phase}</div>
      </div>
      <div className="zoning-bar">
        <div className="zone-item">SEA FRONT</div>
        <div className="zone-item">NORMAL 2000</div>
        <div className="zone-item">VIP 700</div>
        <div className="zone-item">MAIN STAGE</div>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
      </div>
    </AbsoluteFill>
  );
}

export const MasterplanDrone = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill className="composition">
      <ThreeCanvas
        width={width}
        height={height}
        camera={{
          fov: 42,
          near: 0.1,
          far: 320,
          position: [0, 72, -120],
        }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <SiteScene />
      </ThreeCanvas>
      <CinematicOverlay />
    </AbsoluteFill>
  );
};
