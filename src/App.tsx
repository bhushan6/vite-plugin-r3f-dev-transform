import { Canvas } from "@react-three/fiber";
import "./App.css";
import { OrbitControls } from "@react-three/drei";
//@ts-expect-error
import { DevTransformWrapper } from "virtual:r3f-transform";
import { Box } from "./Box";

function App() {
  return (
    <>
      <Canvas style={{ width: "100vw", height: "100vh" }}>
        <DevTransformWrapper>
          <Box />
          <mesh name="box3" position={[0, 0, 5]} >
            <boxGeometry />
            <meshStandardMaterial color={"red"} />
          </mesh>
          <ambientLight />
          <directionalLight position={[10, 10, 10]} />
        </DevTransformWrapper>
        <OrbitControls makeDefault />
      </Canvas>
    </>
  );
}

export default App;
