import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const NavWrapper = styled.nav`
    display: flex;
    position: absolute;
    width: 100%;
    justify-content: space-between;
    padding: 1em;
    color: cadetblue;
`;
const NavItems = styled.ul`
    display: inline;
    list-style: none;

`;

const NavItemWrapper = styled.li`
    display: inline;
    padding: 1em;
`;

const NavItem = ({href, children}) => (
    <NavItemWrapper>
        <Link href={href} passHref>{children}</Link>
    </NavItemWrapper>
);

const Nav = () => (
    <NavWrapper>
        <NavItems>
            <NavItem href="/">Home</NavItem>
            <NavItem href="/1">1</NavItem>
            <NavItem href="/2">2</NavItem>
            <NavItem href="/3">3</NavItem>
            <NavItem href="/4">4</NavItem>
        </NavItems>
    </NavWrapper>
)

export default Nav