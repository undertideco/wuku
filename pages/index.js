import React, { Component } from 'react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';

class StoryIndex extends Component {
  static async getInitialProps() {
    const stories = await factory.methods.getDeployedStories().call();

    return { stories };
  }

  render() {
    return (
      <Layout>
        <h1>Hello World</h1>
      </Layout>
    )
  }
}

export default StoryIndex;