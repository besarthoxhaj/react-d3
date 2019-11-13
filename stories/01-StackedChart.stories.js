import React from 'react';

import StackedChart from '../src/components/StackedChart';

export default {title: 'StackedChart'};

export const toStorybook = () => {

  const props = {
    colors: {
      other: '#006d2c',
      hydro: '#9ecae1',
      solar: '#c7e9c0'
    },
    data: [
      { other: 20, solar: 30, hydro: 50, date: '2019-11-13T00:00Z' },
      { other: 30, solar: 30, hydro: 40, date: '2019-11-13T02:00Z' },
      { other: 50, solar: 25, hydro: 25, date: '2019-11-13T04:00Z' },
      { other: 60, solar: 30, hydro: 10, date: '2019-11-13T06:00Z' },
      { other: 40, solar: 30, hydro: 30, date: '2019-11-13T08:00Z' },
      { other: 30, solar: 40, hydro: 30, date: '2019-11-13T10:00Z' },
      { other: 10, solar: 70, hydro: 20, date: '2019-11-13T12:00Z' },
      { other: 30, solar: 40, hydro: 30, date: '2019-11-13T14:00Z' },
      { other: 30, solar: 10, hydro: 60, date: '2019-11-13T16:00Z' },
      { other: 20, solar: 50, hydro: 30, date: '2019-11-13T18:00Z' },
      { other: 30, solar: 30, hydro: 40, date: '2019-11-13T20:00Z' },
    ],
    currValueX: value => console.log(`currValueX`, value),
  };

  return (
    <StackedChart {...props} />
  );
}
