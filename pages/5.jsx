import React, {useRef, useState, useEffect} from 'react';
import styled from 'styled-components';
import Nav from '../components/nav';
import dynamic from 'next/dynamic';
import * as THREE from 'three'; 


class PopUp {
    constructor(){
        this.w = 3;
        this.h = 2;
        this.x = 3;
        this.y = 2;
        this.counter = 0;
        this.counterMax = 0;
        this.params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=200,height=200,left=${this.x},top=${this.y}`;
        this.windowInstance;
        return this.windowInstance;
    }

    display() {
        this.windowInstance = window.open('', 'Richard', this.params);
    }

    async controls(key) {
        if (key.code === 'ArrowUp') {
            await windowInstance.moveBy(0,-30);
        }
        if (key.code === 'ArrowDown') {
            await windowInstance.moveBy(0,30);
        }
        if (key.code === 'ArrowLeft') {
            await windowInstance.moveBy(-30, 0);
        }
        if (key.code === 'ArrowRight') {
            await windowInstance.moveBy(30, 0);
        }
    }

    async move() {
        if (this.counter < (this.counterMax/2)) {
            await this.windowInstance.resizeBy(1,1);
        } else {
            await this.windowInstance.resizeBy(-1,-1);
        }

        if (this.counter > this.counterMax) {
            this.counter = 0
        } else {
            this.counter++
        }
    }
}
const popUps = [];
const animation = () => {
    
    const count = 10;
    const setup = async () => {
        for(let i = 0; i <= count; i++){
            popUps.push(await new PopUp);
            await popUps[i].display();
        }
    }
    const loop = async () => {
        for(let i = 0; i <= count; i++) {
            if(popUps[i] !== 'undefined' || popUps[i] !== null) {
                await popUps[i].move();
            }
            
        }
        window.requestAnimationFrame(loop);
    }
    setup();
    loop();
    
}

const PopUps = () => {
    const handleClick = () => {
        if(typeof window !== 'undefined' || typeof window !== null) {
            animation();
        } else {
            console.log('this function only renders in the browser')
        }
    }
    return (
        <button onClick={handleClick}>Start</button>
    )
}

export default PopUps