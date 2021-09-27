import React from 'react';
import styled from 'styled-components';
import Nav from '../components/nav';

const Layout = ({children}) => (
    <>
        <Nav/>
        <main>
            {children}
        </main>
    </>
)

export default Layout;
