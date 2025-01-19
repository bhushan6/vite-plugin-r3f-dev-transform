export const Box = () => {
  return (
    <>
      <mesh name="box">
        <boxGeometry />
        <meshStandardMaterial color={"hotpink"} />
      </mesh>
      <mesh name="box2" >
        <boxGeometry />
        <meshStandardMaterial color={"yellow"} />
      </mesh>
      <group position={[0, 50, 0]} >
        <mesh name="box4" position={[0, 0, 5]} >
            <boxGeometry />
            <meshStandardMaterial color={"blue"} />
        </mesh>
        <mesh name="sphere5" position={[5, 0, 0]} >
            <sphereGeometry />
            <meshStandardMaterial color={"green"} />
        </mesh>
      </group>
    </>
  );
};