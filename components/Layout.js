import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';

import Theme from './Theme';
import Header from './Header';

const MainContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-flow: column;
`;

const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-flow: row nowrap;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 100px;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  flex: 1 1 0%;
`;

const Layout = (props) => {
  return (
    <Theme>
      <MainContainer>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;700&family=Inter:wght@700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <HeaderContainer>
          <Header />
        </HeaderContainer>
        <ContentContainer>{props.children}</ContentContainer>
      </MainContainer>
    </Theme>
  );
};

export default Layout;
