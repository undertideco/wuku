import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

import { Link } from '../routes';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import Feed from '../components/Feed/Stories';

const MyContributions = dynamic(
  () => import('../components/Feed/ContributedStories'),
  { ssr: false }
);

const StoriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0rem 2rem;
`;

const SectionHeading = styled.h1`
  font-family: ${props => props.theme.sansSerifFontStack[0]};
  flex-grow: 1;
  font-size: 2em;
`;

class StoryIndex extends Component {
  static async getInitialProps() {
    const stories = await factory.methods.getDeployedStories().call();

    return { stories };
  }

  render() {
    console.log(this.props.stories);
    return (
      <Layout>
        <StoriesContainer>
          <SectionHeading>Ongoing Haikus</SectionHeading>
          <Feed stories={this.props.stories} />
        </StoriesContainer>
      </Layout>
    );
  }
}

export default StoryIndex;
