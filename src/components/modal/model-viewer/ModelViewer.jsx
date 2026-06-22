import { Suspense, useCallback, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows, Center } from '@react-three/drei';
import * as THREE from 'three';
import './ModelViewer.css';

function Model({ url, onLoad }) {
  const { scene } = useGLTF(url);

  useEffect(() => {
    if (!scene) return;
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    onLoad?.(maxDim);
  }, [scene, onLoad]);

  return <primitive object={scene} />;
}

function Scene({ modelUrl, fov }) {
  const { camera } = useThree();
  const fittedRef = useRef(false);

  useEffect(() => {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [camera, fov]);

  const fitCamera = useCallback((maxDim) => {
    if (!maxDim || fittedRef.current) return;
    fittedRef.current = true;
    const dist = maxDim * 1.6;
    camera.position.set(0, dist * 0.3, dist);
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [camera, fov]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <Suspense fallback={null}>
        <Center>
          <Model url={modelUrl} onLoad={fitCamera} />
        </Center>
        <Environment preset="city" />
        <ContactShadows position={[0, -0.8, 0]} opacity={0.4} blur={2} />
      </Suspense>
      <OrbitControls
        autoRotate
        autoRotateSpeed={3}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.4}
        maxPolarAngle={Math.PI / 2.4}
      />
    </>
  );
}

const ModelViewer = ({ modelUrl, fov }) => {
  return (
    <div className="model-viewer-canvas">
      <Canvas camera={{ fov, far: 100 }}>
        <Scene modelUrl={modelUrl} fov={fov} />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
