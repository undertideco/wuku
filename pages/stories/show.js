import React, { Component } from 'react';
import Story from '../../ethereum/story';
import Layout from '../../components/Layout';

class StoryShow extends Component {
  static async getInitialProps(props) {
    const story = Story(props.query.address);

    const summary = await story.methods.getSummary().call();
    const storySoFar = summary[0].map(story => story.description).join(' ');
    const minimumContribution = summary[1];
    const host = summary[2];

    return {
      address: props.query.address,
      storySoFar,
      host,
      minimumContribution
    };
  }

  render() {
    return (
      <Layout>
        <h2>{`Contract: ${this.props.address}`}</h2>
        <h3>{`Hosted By: ${this.props.host}`}</h3>
        <span>{`Contribution Price: ${this.props.minimumContribution}`}</span>
        <p>{this.props.storySoFar}</p>
      </Layout>  
    )
  }
}

export default StoryShow;
