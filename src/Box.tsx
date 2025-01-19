export const Box = () => {
  return (
    <>
      <mesh name="box">
        <boxGeometry />
        <meshStandardMaterial color={"hotpink"} />
      </mesh>
      <mesh name="box2" >
        <boxGeometry />
        <meshStandardMaterial color={"hotpink"} />
      </mesh>
    </>
  );
};