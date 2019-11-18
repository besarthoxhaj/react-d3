import React from 'react';
import LineChart from '../src/components/LineChart';

export default {title: 'LineChart'};

export const toStorybook = () => {

  const data = {
    'Meta Data': {
      '1. Information': 'Daily Prices (open, high, low, close) and Volumes',
      '2. Symbol': 'MSFT',
      '3. Last Refreshed': '2019-11-15',
      '4. Output Size': 'Compact',
      '5. Time Zone': 'US/Eastern'
    },
    'Time Series (Daily)': {
      '2019-11-23': { '1. open': '148.9300', '4. close': '148.0700' },
      '2019-11-22': { '1. open': '148.9300', '4. close': '147.0700' },
      '2019-11-21': { '1. open': '148.9300', '4. close': '146.9700' },
      '2019-11-20': { '1. open': '148.9300', '4. close': '145.9700' },
      '2019-11-19': { '1. open': '148.9300', '4. close': '148.9700' },
      '2019-11-18': { '1. open': '148.9300', '4. close': '146.9700' },
      '2019-11-17': { '1. open': '148.9300', '4. close': '145.9700' },
      '2019-11-16': { '1. open': '148.9300', '4. close': '150.9700' },
      '2019-11-15': { '1. open': '148.9300', '4. close': '146.9700' },
      '2019-11-14': { '1. open': '147.0200', '4. close': '148.0600' },
      '2019-11-13': { '1. open': '146.7400', '4. close': '147.3100' },
      '2019-11-12': { '1. open': '146.2800', '4. close': '147.0700' },
      '2019-11-11': { '1. open': '145.3400', '4. close': '144.1100' },
      '2019-11-08': { '1. open': '143.9800', '4. close': '149.9600' },
      '2019-11-07': { '1. open': '143.8400', '4. close': '144.2600' },
      '2019-11-06': { '1. open': '144.3700', '4. close': '143.0600' },
      '2019-11-05': { '1. open': '144.9700', '4. close': '145.4600' },
      '2019-11-04': { '1. open': '144.8300', '4. close': '144.5500' },
      '2019-11-03': { '1. open': '144.8300', '4. close': '146.5500' },
    },
  };

  const props = {};

  // global.fetch = () => new Promise(okRes => {
  //   okRes({ json: () => new Promise(okJson => okJson(data))})
  // });

  return (
    <div style={{marginTop: 50, marginLeft: 50}}>
      <LineChart {...props} />
    </div>
  );
}
