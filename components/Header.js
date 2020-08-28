import React from 'react';
import styled from 'styled-components'

import { Link } from '../routes';

const NavBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  top: 0px;
  position: absolute;
  align-items: flex-start;
  padding: 2rem 2rem;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`

const LinksContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  & > *:not(:first-child) {
    margin-left: 0.5rem;
  }
`

const LinkText = styled.a`
  font-size: 1.25em;
  line-height: 150%;
  text-decoration: none;
  color: ${props => props.theme.colors.secondaryText};
`

const Header = () => {
  return (
    <NavBarContainer>
      <LogoContainer>
        <Link route='/'>
          <a>
            <img src="/logo-horizontal.svg" alt="app logo" />
          </a>
        </Link>
      </LogoContainer>

      <LinksContainer>
        <Link route="/" passHref>
          <LinkText>ongoing</LinkText>
        </Link>
        <Link route="/" passHref>
          <LinkText>voting</LinkText>
        </Link>
        <Link route="/" passHref>
          <LinkText>complete</LinkText>
        </Link>
        <Link route="/" passHref>
          <LinkText>+new</LinkText>
        </Link>
      </LinksContainer>
  </NavBarContainer>
  );
};

export default Header;
