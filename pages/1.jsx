import React, {useRef, useEffect} from 'react';
import * as THREE from 'three'
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import Nav from '../components/nav';


const Main = styled.main`
    background: #1f1f1f;
    position: relative;
    display: flex;
    justify-content: center;
    canvas {
        z-index: 1;
    }
`;

const Canvas = styled.canvas`
    z-index: 1;
    position: absolute;
`;

const Big = styled.h1`
    font-size: 20vw;
    font-family: serif;
    color:lightpink;
    position: absolute;
`;

const init = async () => {
    // Loading
    const dat = await import('dat.gui');
    console.log(dat);
    const textureLoader = new THREE.TextureLoader();
    const normalTexture = textureLoader.load('/textures/S01F00_NM.png');

    // Debug
    let debugIsActive = true;
    let gui = debugIsActive ? new dat.GUI() : null;

    const pointLightDebugger = (light, name) => {
        if (debugIsActive) {
            console.log(light.color);
            let folder = gui.addFolder(`${name || 'nameless'} point light`);
            folder.add(light.position, 'x').min(-4).max(3).step(0.01);
            folder.add(light.position, 'y').min(-6).max(6).step(0.01);
            folder.add(light.position, 'z').min(-4).max(3).step(0.01);
            folder.add(light, 'distance').min(0).max(100).step(0.01)
            folder.add(light, 'intensity').min(0).step(0.01);
            const LightColor = {color: 0x000000};
            folder.addColor(LightColor, 'color').onChange(()=> {
                light.color.set(LightColor.color)
            })
            const pointlightHelper = new THREE.PointLightHelper(light, 0.2);
            scene.add(pointlightHelper);
        }
    }

    // Canvas
    const canvas = document.querySelector('#canvas-ref');

    // Scene
    const scene = new THREE.Scene()

    // Objects

    const geometry = new THREE.SphereBufferGeometry(.5, 64, 64);

    // Materials

    const material = new THREE.MeshStandardMaterial()
    material.color = new THREE.Color(0xffffff)
    material.roughness = 0.1;
    material.metalness = 0.3;
    material.normalMap = normalTexture;
    // Mesh
    const sphere = new THREE.Mesh(geometry,material)
    scene.add(sphere)

    // Lights

    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(2,3,4);
    scene.add(pointLight)
    pointLightDebugger(pointLight, 'key');

    const pointLight2 = new THREE.PointLight(0xff0000, 0.93)
    // pointLight.position.x = 2
    // pointLight.position.y = 3
    // pointLight.position.z = 4
    pointLight2.position.set(-1,.21, 0.74, 0.4);
    scene.add(pointLight2)

    pointLightDebugger(pointLight2, 'red');

    const pointLight3 = new THREE.PointLight(0x0000ff, 0.93);
    pointLight3.position.set(1,.21, 0.74, 0.4);
    pointLightDebugger(pointLight3, 'blue');
    scene.add(pointLight3)
    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    window.addEventListener('resize', () =>
    {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 2
    scene.add(camera)

    // Controls
    // const controls = new OrbitControls(camera, canvas)
    // controls.enableDamping = true

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    /**
     * Animate
     */



    let mouseX = 0;
    let mouseY = 0;

    let targetX = 0;
    let targetY = 0;

    const windowCenter = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    }

    const onDocumentMouseMove = (event) => {
        mouseX = (event.clientX - windowCenter.x);
        mouseY = (event.clientY - windowCenter.y);
    }

    document.addEventListener('mousemove', onDocumentMouseMove);

    document.addEventListener('scroll', (event) => {
        sphere.position.y = window.scrollY * 0.01;
    })

    const clock = new THREE.Clock()

    const tick = () =>
    {
        targetX = mouseX * .001;
        targetY = mouseY * .001;
        const elapsedTime = clock.getElapsedTime()

        // Update objects
        sphere.rotation.y = 0.5 * elapsedTime
        sphere.rotation.x += .5 * (targetY - sphere.rotation.x);
        sphere.rotation.y += .5 * (targetX - sphere.rotation.y);
        sphere.position.z += -.5 * (targetY - sphere.rotation.x);

        // Update Orbital Controls
        // controls.update()

        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }

    tick()
}; 

const Tutorial1 = () => {
   useEffect(()=>{
       init();
   })
    return (
        <>
            <Nav/>
            <Main>
                <Big>Spheeeear</Big>
                <Canvas id='canvas-ref' />
            </Main>
        </>
        
    )
};

export default Tutorial1