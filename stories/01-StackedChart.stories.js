import React from 'react';

import StackedChart from '../src/components/StackedChart';

export default {title: 'StackedChart'};

export const toStorybook = () => {

  const props = {
    height: 400,
    width: 900,
    colors: {
      other: '#006d2c',
      hydro: '#9ecae1',
      solar: '#c7e9c0'
    },
    data: [
      { other: 20, solar: 30, hydro: 50, date: undefined },
      { other: 30, solar: 30, hydro: 40, date: undefined },
      { other: 50, solar: 25, hydro: 25, date: undefined },
      { other: 60, solar: 30, hydro: 10, date: undefined },
      { other: 40, solar: 30, hydro: 30, date: undefined },
      { other: 30, solar: 40, hydro: 30, date: undefined },
      { other: 10, solar: 70, hydro: 20, date: undefined },
      { other: 30, solar: 40, hydro: 30, date: undefined },
      { other: 30, solar: 10, hydro: 60, date: undefined },
      { other: 20, solar: 50, hydro: 30, date: undefined },
      { other: 30, solar: 30, hydro: 40, date: undefined },
    ],
    currValueX: value => console.log(`currValueX`, value),
  };

  // make sure data is relevant to today
  props.data.forEach((dataPoint, idx) => {

    const time = new Date();
    time.setHours(0, 0, 0, 0);
    time.setHours(idx * 2);
    dataPoint.date = time;
  });

  return (
    <StackedChart {...props} />
  );
}
