import React, {useRef, useEffect} from 'react';
import * as THREE from 'three';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import styled from 'styled-components';
import dat from 'dat.gui';
import { OrbitControls } from 'three';
import Nav from '../components/nav';
import { DoubleSide } from 'three';

const Main = styled.main`
    background: #1f1f1f;
`;

const Content = styled.section`
    margin: 15vw;
    width: 30vw;
    z-index: 2;
    position: absolute;
    color: white;
    h1 {
        font-size: 5rem;
    }
`;

const Tutorial3 = () => {
    const canvasRef = useRef(null);
    useEffect(()=>{
        // Loading
    const textureLoader = new THREE.TextureLoader();
    const height = textureLoader.load('/textures/cursedcasnoise.png');
    const alpha = textureLoader.load('/textures/alpha.png');

    // Debug
    let active = true;
    console.log(dat);
    let gui = active ? new dat.GUI() : null;

    const pointLightDebugger = (light, name) => {
        if (active) {
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

    const galleryItemDebugger = (img, name) => {
        if (active) {
            let folder = gui.addFolder(`image ${name || 'nameless'}`);
            folder.add(img.position, 'x').min(-10).max(10).step(0.1);
            folder.add(img.position, 'y').min(-10).max(10).step(0.1);
        }
    }

    const transformControls = (element, name) => {
        if (active) {
            let folder = gui.addFolder(`${name || 'nameless'}`);
            let position = folder.addFolder('position');
            let rotation = folder.addFolder('rotation');
            let scale = folder.addFolder('scale');
            position.add(element.position, 'x').min(-5).max(5).step(0.01);
            position.add(element.position, 'y').min(-5).max(5).step(0.01);
            position.add(element.position, 'z').min(-5).max(5).step(0.01);
            rotation.add(element.rotation, 'x').min(-5).max(5).step(0.01);
            rotation.add(element.rotation, 'y').min(-5).max(5).step(0.01);
            rotation.add(element.rotation, 'z').min(-5).max(5).step(0.01);
            scale.add(element.scale, 'x').min(-10).max(10).step(0.01);
            scale.add(element.scale, 'y').min(-10).max(10).step(0.01);
        }
    }

    // Canvas
    const canvas = canvasRef.current;

    // Scene
    const scene = new THREE.Scene()

    // Objects

    // Materials
    let counter = 0;
    const Wall = (x, y, z, rotateX, rotateY, rotateZ, img, name) =>  {
        let geometry = new THREE.PlaneBufferGeometry(1,1);

        const material = new THREE.MeshStandardMaterial({
            map: img || height,
            doubleSide: true
        });
        
        const wall = new THREE.Mesh(geometry, material);
        wall.position.set(x||0,y||0,z||0);
        wall.rotation.x = rotateX || 0;
        wall.rotation.y = rotateY || 0;
        wall.rotation.z = rotateZ || 0;
        transformControls(wall, `wall ${counter++}`)
        scene.add(wall)
    }

   
    Wall(1)
    Wall(0.6, 0, -0.5, 0, -1.75)
    Wall(-0.6, 0, -0.5, 0, -1.75)


    // Mesh
    // Lights

    const pointLight = new THREE.PointLight(0xe4e4ff, 1)
    pointLight.position.set(0.28,1.46,0.28);
    pointLight.distance = 6;
    pointLight.intensity = 5;
    scene.add(pointLight)
    pointLightDebugger(pointLight, 'key');


    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    window.addEventListener('resize', () =>
    {

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
    camera.position.x = -0.1
    camera.position.y = 0
    camera.position.z = 1
    scene.add(camera)
    transformControls(camera, 'camera')
    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Mouse
    let vy = 0;
    window.addEventListener("wheel", (e) => {
        vy = e.deltaY * 0.0007;
        console.log(vy)
    })

    const mouse = new THREE.Vector2();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX / sizes.width * 2 - 1;
        mouse.y = - (e.clientY / sizes.width) * 2 + 1;
    })

    /**
     * Animate
     */
    const clock = new THREE.Clock()
    
    const tick = () =>
    {
        const elapsedTime = clock.getElapsedTime()
        

        
        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }

    tick()
    })

    return (
        <>
            <Nav/>
            <Main>
                
                <canvas ref={canvasRef} />
            </Main>
        </>
    )
};

export default Tutorial3