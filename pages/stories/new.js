import React, { Component } from 'react';
import { Form, Button, Input, Message, TextArea } from 'semantic-ui-react';
import Web3 from 'web3';

import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class StoryNew extends Component {
  state = {
    startingPrizePool: '',
    contributionText: '',
    errorMessage: '',
    loading: false
  }

  submitForm = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      const payload = {
        from: accounts[0],
        gas: '2000000',
        value: Web3.utils.toWei(this.state.startingPrizePool, 'ether')
      }

      console.log(payload);
      await factory.methods.createStory(this.state.contributionText).send(payload);

      Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  }

  render() {
    return (
      <Layout>
        <h3>Create a Story</h3>

        <Form onSubmit={this.submitForm} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Starting Prize Pool</label>
            <Input 
              label="ether"
              labelPosition="right"
              value={this.state.startingPrizePool}
              onChange={event =>
                this.setState({ startingPrizePool: event.target.value })}
            />
          </Form.Field>
          <Form.Field
            label='Starting Text'
            placeholder='This is my story'
            value={this.state.contributionText}
            control={TextArea}
            onChange={event =>
              this.setState({ contributionText: event.target.value })}
          />

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Create!
          </Button>
        </Form>
      </Layout>
    )
  }
}

export default StoryNew;
