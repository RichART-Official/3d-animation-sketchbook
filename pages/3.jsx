import React, {useRef, useEffect} from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import * as THREE from 'three';
import gsap from 'gsap';
import Nav from '../components/nav';

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
    useEffect(async ()=>{
        const dat = await import('dat.gui')
        // Loading
    const textureLoader = new THREE.TextureLoader();
    const height = textureLoader.load('/textures/cursedcasnoise.png');
    const alpha = textureLoader.load('/textures/alpha.png');

    // Debug
    let active = true;
    let gui = active ? new dat.GUI() : null;

    const pointLightDebugger = (light, name) => {
        if (active) {
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

    const galleryItemDebugger = (img, name) => {
        if (active) {
            let folder = gui.addFolder(`image ${name || 'nameless'}`);
            folder.add(img.position, 'x').min(-10).max(10).step(0.1);
            folder.add(img.position, 'y').min(-10).max(10).step(0.1);
        }
    }

    const panner = (element, name) => {
        if (active) {
            let folder = gui.addFolder(`${name || 'nameless'}`);
            folder.add(element.position, 'x').min(-10).max(10).step(0.01);
            folder.add(element.position, 'y').min(-10).max(10).step(0.01);
            folder.add(element.position, 'z').min(-10).max(10).step(0.01);
        }
    }
    // Canvas
    const canvas = document.querySelector('#canvast-test3');

    // Scene
    const scene = new THREE.Scene()

    // Objects

    let geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
    let textureData;

    // Materials
    for (let i = 1; i <= 7; i++) {
        const material = new THREE.MeshBasicMaterial({
            map: textureLoader.load(`/images/work/${i}.jpg`)
        });
        const img = new THREE.Mesh(geometry, material);
        img.position.set(Math.random()-0.5, (i-1)*-1.8 );
        galleryItemDebugger(img, i);
        scene.add(img);
    }

    let objs = [];

    scene.traverse((object) => {
        if (object.isMesh) {
            objs.push(object);
        }
    })

    console.log(objs)
    // Mesh
    // Lights

    // const pointLight = new THREE.PointLight(0xe4e4ff, 1)
    // pointLight.position.set(0.28,1.46,0.28);
    // pointLight.distance = 6;
    // pointLight.intensity = 5;
    // scene.add(pointLight)
    // pointLightDebugger(pointLight, 'key');


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
    panner(camera, 'camera')
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

    const raycaster = new THREE.Raycaster()
    let lightVX = 0.05;

    const clock = new THREE.Clock()
    let yPos = 0;
    console.log(objs);
    const tick = () =>
    {
        const elapsedTime = clock.getElapsedTime()
        
        // Raycaster

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(objs);

        for( const intersect of intersects) {
            gsap.to(intersect.object.scale, {x: 1.35, y:1.35})
            gsap.to(intersect.object.rotation, {x: 0.0, y:-0.5})
            gsap.to(intersect.object.position, {z: 0.1})
        }

        for (const object of objs) {
            if (!intersects.find(intersect => intersect.object === object)) {
                gsap.to(object.scale, {x: 1, y:1})
                gsap.to(object.rotation, {x: 0, y:0})
                gsap.to(object.position, {z: 0})
            }
        }
        // Update Objects
        yPos += vy;
        vy *= 0.9;
        camera.position.y = yPos;

        
        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }

    tick()
    });

    return (
        <>
            <Nav/>
            <Main>
                <Content>
                    <h1>Lorem Ipsum</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </Content>
                <canvas id="canvast-test3"/>
            </Main>
        </>
    )
};

export default Tutorial3