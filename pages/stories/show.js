import React, { Component } from 'react';
import Story from '../../ethereum/story';
import Layout from '../../components/Layout';

class StoryShow extends Component {
  static async getInitialProps(props) {
    const story = Story(props.query.address);
    const host = await story.methods.host().call();

    return {
      address: props.query.address,
      host
    };
  }

  render() {
    return (
      <Layout>
        <h3>{`Contract: ${this.props.address}`}</h3>
        <span>{`Hosted By: ${this.props.host}`}</span>
      </Layout>  
    )
  }
}

export default StoryShow;
