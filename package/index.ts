// vite-plugin-r3f-transform.js
import { PluginOption, transformWithEsbuild } from "vite";
import fs from "fs";

export default function r3fTransformPlugin(): PluginOption {
  const virtualModuleId = "virtual:r3f-transform";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "vite-plugin-r3f-transform",

    configureServer(server) {
      server.ws.on("r3f-transform-save", (data) => {
        console.log("Plugin: Received transform data:", data);
        fs.writeFileSync("./public/transform-data.json", JSON.stringify(data));
        server.ws.send("r3f-transform-saved");
      });
      //check if it exists, only create if does not exist
      if (!fs.existsSync("./public/transform-data.json")) {
        fs.writeFileSync("./public/transform-data.json", JSON.stringify({}));
      }
    },

    enforce: "pre",

    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },

    async load(id) {
      if (id === resolvedVirtualModuleId) {
        const code = `
          import React, { useEffect, useState, useRef } from 'react';
          import { useThree } from '@react-three/fiber';
          import { TransformControls } from '@react-three/drei';

          export function DevTransformWrapper({ children }) {
            const [selected, setSelected] = useState(null);
            const [transforms, setTransforms] = useState({});

            const [refresh, setRefresh] = useState(0);

            const transformRef = useRef()

            useEffect(() => {
                const fetchdata = async () => {
                    const response = await fetch('/public/transform-data.json');
                    const data = await response.json();
                    if(data){
                        setTransforms(data);
                        setRefresh(r => r + 1);
                    }
                }
                    fetchdata();
            }, [])

            useEffect(() => {
              function handleKeyDown(e) {
                if (e.key === 'Escape') setSelected(null);
              }
              window.addEventListener('keydown', handleKeyDown);
              return () => window.removeEventListener('keydown', handleKeyDown);
            }, []);


            const [mode, setMode] = useState('translate');

            const container = useRef(document.createElement('div'));

            useEffect(() => {
                container.current.style.position = 'absolute';
                container.current.style.top = '10px';
                container.current.style.right = '10px';
                container.current.style.zIndex = '9000000000000000000000000000000';

                const selectElement = document.createElement('select');
                const translateOption = document.createElement('option');
                translateOption.value = 'translate';
                translateOption.textContent = 'Translate';
                selectElement.appendChild(translateOption);

                const rotateOption = document.createElement('option');
                rotateOption.value = 'rotate';
                rotateOption.textContent = 'Rotate';
                selectElement.appendChild(rotateOption);
                const scaleOption = document.createElement('option');
                scaleOption.value = 'scale';
                scaleOption.textContent = 'Scale';
                selectElement.appendChild(scaleOption);

                selectElement.value = mode;

                selectElement.addEventListener('change', (event) => {
                    setMode(event.target.value);
                });

         
                container.current.appendChild(selectElement);
                document.body.appendChild(container.current);

                return () => {
                    document.body.removeChild(container.current);
                }

            }, [])

            useEffect(() => {
              if(import.meta.hot){
                const onSaved = () => {
                 console.log('Plugin: Saved transform into transform-data.json');
                }
                import.meta.hot.on('r3f-transform-saved!!!!!!!!!!!!', onSaved)
                
                return () => {
                  import.meta.hot.off('r3f-transform-saved', onSaved);
                }
              }
            })
           
            
            function handleClick(e) {
              e.stopPropagation();
              const mesh = e.object;
              if(mesh.name){
                setSelected(mesh);
              }else{
                console.warn("No name on mesh", mesh);
              }
            }

            const timeoutId = useRef(null);
            
            function handleTransformChange(e) {
                timeoutId.current && clearTimeout(timeoutId.current);
              const { position, rotation, scale } = e.target.object;
              setTransforms(prev => ({
                ...prev,
                [selected.name]: {
                  position: position.toArray(),
                  rotation: rotation.toArray(),
                  scale: scale.toArray()
                }
              }));

              function handleSave() {
                if (import.meta.hot) {
                  import.meta.hot.send('r3f-transform-save', transforms);
                }
              }

              timeoutId.current = setTimeout(handleSave, 1000);
            }

            const visitedMeshes = []
             const traverse = (node) => {
                console.log(node.props, node.type);
                if (Array.isArray(node)) {
                return node.map((child) => traverse(child));
                } else if (React.isValidElement(node)) {
                //handle the custom component
                if (typeof node.type === "function") {
                    const element = node.type(node.props);
                    const children = element.props.children;
                    return children ? traverse(children) : null;
                }
                
                if(node.type === 'mesh'){
                    console.log("mesh", node.props.name);
                    const position = node.props.name ? transforms[node.props.name]?.position : null;
                    const rotation = node.props.name ? transforms[node.props.name]?.rotation : null;
                    const scale = node.props.name ? transforms[node.props.name]?.scale : null;
                    const newProps = position ? {
                        position: position,
                        rotation: rotation,
                        scale: scale
                    } : {}
                    if(node.props.name ){
                        if(visitedMeshes.includes(node.props.name)){
                            console.warn("Duplicate mesh name", node.props.name);
                        }else{
                            visitedMeshes.push(node.props.name);
                        }
                    }
                    return React.cloneElement(node, {
                    onClick: handleClick,
                    ...newProps,
                    })
                }else{
                    if(node.props.children){
                      const processedChildren = traverse(node.props.children)
                      return React.cloneElement(node, {
                        children: processedChildren
                      })
                    }
                    return node
                }
                } else {
                return node;
                }
            };

            const memoizedTraverse = React.useMemo(() => traverse(children), [children, refresh]);

            return (
              <>
                {memoizedTraverse}
                {selected && (
                  <TransformControls
                    ref={transformRef}
                    object={selected}
                    mode={mode}
                    onObjectChange={handleTransformChange}
                  />
                )}
                
              </>
            );
          }
        `;

        const result = await transformWithEsbuild(
          code,
          resolvedVirtualModuleId,
          {
            loader: "jsx",
            jsx: "automatic",
            jsxImportSource: "react",
          }
        );

        return result.code;
      }
    },
  };
}
