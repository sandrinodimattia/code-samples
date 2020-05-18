import React from 'react';
import { Stack, Button, Input, Icon } from '@chakra-ui/core';

import { Snippet } from '.';
import MongoClient from '../lib/mongo';

export default class MongoStitchExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recordName: 'Some random name'
    };
  }

  loadData = async () => {
    try {
      const collection = MongoClient.getCollection('things');
      const things = await collection.find({}, { limit: 20 }).asArray();

      this.setState({
        mongoResult: things,
        mongoError: null
      });
    } catch (error) {
      this.setState({
        mongoResult: null,
        mongoError: {
          errorTitle: 'MongoDB Stitch',
          error: error.message
        }
      });
    }
  };

  handleNameChange = (event) => {
    this.setState({ recordName: event.target.value });
  };

  callFunction = async () => {
    const recordName = this.state && this.state.recordName;

    try {
      const result = await MongoClient.getClient().callFunction('createThing', [
        {
          name: recordName,
          date: new Date()
        }
      ]);

      this.setState({
        mongoResult: {
          message: 'Record created',
          document: result
        },
        mongoError: null
      });
    } catch (error) {
      this.setState({
        mongoResult: null,
        mongoError: {
          errorTitle: 'MongoDB Stitch',
          error: error.message
        }
      });
    }
  };

  deleteRecord = async () => {
    try {
      const collection = MongoClient.getCollection('things');
      const things = await collection.find({}, { limit: 20 }).asArray();

      if (things.length === 0) {
        throw new Error('No data to delete');
      }

      const result = await collection.deleteOne({ _id: things[0]._id });

      this.setState({
        mongoResult: result,
        mongoError: null
      });
    } catch (error) {
      this.setState({
        mongoResult: null,
        mongoError: {
          errorTitle: 'MongoDB Stitch',
          error: error.message
        }
      });
    }
  };

  render() {
    return (
      <>
        <Stack mb={5} isInline spacing={4}>
          <Button
            mr={5}
            size="md"
            onClick={this.loadData}
            leftIcon={(props) => <Icon name="external-link" {...props} />}
          >
            Query
          </Button>
          <Button
            mr={5}
            size="md"
            onClick={this.deleteRecord}
            leftIcon={(props) => <Icon name="external-link" {...props} />}
          >
            Delete Record
          </Button>
          <Button
            size="md"
            onClick={this.callFunction}
            leftIcon={(props) => <Icon name="external-link" {...props} />}
          >
            Create Record (Call Function)
          </Button>
          <Input
            placeholder="Record name"
            size="md"
            value={this.state.recordName}
            onChange={this.handleNameChange}
            isFullWidth={false}
          />
        </Stack>
        <Snippet
          code={
            (this.state &&
              this.state.mongoError &&
              JSON.stringify(this.state.mongoError, null, 2)) ||
            (this.state &&
              this.state.mongoResult &&
              JSON.stringify(this.state.mongoResult, null, 2)) ||
            '// No data available'
          }
          language="json"
        />
      </>
    );
  }
}
