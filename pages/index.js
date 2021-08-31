import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import styled from 'styled-components';

import Nav from '../components/nav';

const Main = styled.main`
  text-align: center;
  display: flex;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #FFE5E5;
`;

const Icon = styled.p`
  font-size: 5rem;
  margin: 0;
`;

export default function Home() {
  return (
    <>
    <Nav/>
    <Main>
      <Icon>📕</Icon>
      <h1>3D animation sketchbook</h1>
      <h3>This is Richard&apos;s 3D animation sketchbook. A place where he can experiment with 3d in the browser.</h3>
      <p><i>Use the menu above to view the experiments</i></p>
    </Main>
    </>
    
  )
}
