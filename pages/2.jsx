import React, {useRef, useEffect} from 'react';
import * as THREE from 'three'
import dynamic from 'next/dynamic';
import styled from 'styled-components';

import Nav from '../components/nav';

const Main = styled.main`
    background-color: #1f1f1f;
`;

const Content = styled.section`
    margin: 15vw;
    z-index: 2;
    position: absolute;
    color: white;
    width: 30rem;
    h1 {
        font-size: 5rem;
    }
`;

const init = async () => {
    const dat = await import('dat.gui')
    // Loading
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('/textures/height.jpg');
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

        // Canvas
        const canvas = document.querySelector('#canvast-test2');

        // Scene
        const scene = new THREE.Scene()

        // Objects
        const geometry = new THREE.PlaneBufferGeometry(3, 3, 32, 32);

        // Materials
        const material = new THREE.MeshStandardMaterial({
            color: 'gray',
            map: texture,
            displacementMap: height,
            displacementScale: 0.5,
            alphaMap: alpha,
            transparent: true,
            depthTest: false
        });

        // Mesh
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -1;
        plane.position.set(0,0,0)
        scene.add(plane);
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
        camera.position.x = -1
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
        let lightVX = 0.05;

        const clock = new THREE.Clock()

        const tick = () =>
        {
            const elapsedTime = clock.getElapsedTime()
            // pointLight.position.x += lightVX;
            // // Update objects
            // if (pointLight.position.x > 7) {
            //     pointLight.position.x = -7; 
            // }
            plane.rotation.z = elapsedTime *0.25;
            // Update Orbital Controls
            // controls.update()

            // Render
            renderer.render(scene, camera)

            // Call tick again on the next frame
            window.requestAnimationFrame(tick)
        }

        tick()
}

const Tutorial2 = () => {
    useEffect(()=>{
        init();
    });
    return (
        <>
        <Nav/>
        <Main>
            <Content>
                <h1>Lorem Ipsum dolor</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </Content>
            <canvas id="canvast-test2"/><canvas id="canvast-test2"/>
        </Main>
        </>
        
    )
};

export default Tutorial2