import React, { Component } from 'react';
import { Form, Button, Input, Message, TextArea } from 'semantic-ui-react';

import Story from '../../ethereum/story';
import Layout from '../../components/Layout';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class StoryShow extends Component {
  state = {
    contributionText: '',
    errorMessage: '',
    loading: false,
  };

  static async getInitialProps(props) {
    const story = Story(props.query.address);

    const summary = await story.methods.getSummary().call();
    const storySoFar = summary[0].map((story) => story.description).join(' ');
    const minimumContribution = summary[1];
    const host = summary[2];

    return {
      address: props.query.address,
      storySoFar,
      host,
      minimumContribution,
    };
  }

  submitContribution = async () => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      const payload = {
        from: accounts[0],
        gas: '2000000',
        value: this.props.minimumContribution,
      };

      await Story(this.props.address)
        .methods.createContribution(this.state.contributionText)
        .send(payload);

      Router.reload(window.location.pathname);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <div>
          <h2>{`Contract: ${this.props.address}`}</h2>
          <h3>{`Hosted By: ${this.props.host}`}</h3>
          <span>{`Contribution Price: ${this.props.minimumContribution}`}</span>
          <p>{this.props.storySoFar}</p>
        </div>

        <Form
          onSubmit={this.submitContribution}
          error={!!this.state.errorMessage}
        >
          <Form.Field
            label="Contribution"
            placeholder="This is my contribution"
            value={this.state.contributionText}
            control={TextArea}
            onChange={(event) =>
              this.setState({ contributionText: event.target.value })
            }
          />

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Add Contribution!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default StoryShow;
