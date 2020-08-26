import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { Card, Button } from 'semantic-ui-react';

import { Link } from '../routes'
import factory from '../ethereum/factory';
import Layout from '../components/Layout';

const MyContributions = dynamic(
  () => import('../components/ContributedStories'),
  { ssr: false }
);

class StoryIndex extends Component {
  static async getInitialProps() {
    const stories = await factory.methods.getDeployedStories().call();

    return { stories };
  }

  renderStories() {
    const stories = this.props.stories.map(addr => {
      return {
        header: addr,
        description: (
          <Link route={`/stories/${addr}`}>
            <a>View Story</a>
          </Link>
        ),
        fluid: true
      };
    });

    return <Card.Group items={stories} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Your Stories</h3>
          <MyContributions stories={this.props.stories} />
        </div>
        <div>
          <h3>Open Stories</h3>

          <Link route="/stories/new">
            <a>
              <Button 
                floated="right"
                content="Create Story"
                icon="add circle"
                primary
              />
            </a>
          </Link>

          {this.renderStories()}
        </div>
      </Layout>
    )
  }
}

export default StoryIndex;