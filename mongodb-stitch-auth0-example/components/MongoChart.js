import React from 'react';
import { Button, Icon } from '@chakra-ui/core';
import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom';

import { Snippet } from '.';
import MongoClient from '../lib/mongo';

export default class MongoChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      height: 0
    };
  }

  onClickBtn = async (e) => {
    e.preventDefault();

    try {
      this.setState({
        height: 500
      });

      const sdk = new ChartsEmbedSDK({
        baseUrl: process.env.MONGO_CHARTS_BASE_URL,
        getUserToken: () => MongoClient.getAccessToken()
      });

      const chart = sdk.createChart({
        chartId: process.env.MONGO_CHART_ID
      });

      // render the chart into a container
      await chart.render(document.querySelector('#chart'));
    } catch (error) {
      this.setState({
        error: {
          message: error.message
        }
      });
    }
  };

  render() {
    return (
      <>
        <Button
          mb={5}
          size="md"
          onClick={this.onClickBtn}
          leftIcon={(props) => <Icon name="external-link" {...props} />}
        >
          Render chart
        </Button>

        <div id="chart" style={{ height: `${this.state.height}px` }} />
        {this.state.error && (
          <Snippet
            code={JSON.stringify(this.state.error, null, 2)}
            language="json"
          />
        )}
      </>
    );
  }
}
