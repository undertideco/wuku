import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';

import { Link } from '../../routes';
import Story from '../../ethereum/story';
import web3 from '../../ethereum/web3';

class ContributedStories extends Component {
  state = {
    storiesToRender: []
  };

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    const storiesPromises = await this.props.stories.map(async storyAddr => {
      return {
        addr: storyAddr,
        isContributor: await Story(storyAddr).methods.isContributor(accounts[0]).call()
      }
    });
  
    const contributorStories = await Promise.all(storiesPromises);
  
    const storiesToRender = contributorStories.filter(story => story.isContributor)

    this.setState({ storiesToRender });
  }

  renderStories() {
    const stories = this.state.storiesToRender.map(story => {
      return {
        header: story.addr,
        description: (
          <Link route={`/stories/${story.addr}`}>
            <a>View Story</a>
          </Link> 
        )
      }
    });
  
    return <Card.Group items={stories} />;
  }

  render() {
    return (
      <div>
        {this.renderStories()}
      </div>
    )
  }
}

export default ContributedStories;
