import React from 'react';
import { shallow, mount } from 'enzyme';
import { parse } from 'svgson';
import * as R from 'ramda';

import COLORS from '../colors';
import App from '../App';

describe('App', () => {

  it('App.getDataStackedChart() should map and filter out yesterday', () => {

    const todayDate = new Date();
    const todayHour = todayDate.getHours();
    const todayNum = todayDate.getDate();
    const todayMonth = todayDate.getMonth();
    const todayYear = todayDate.getFullYear();

    const yesterdayDate = new Date(
      todayYear,
      todayMonth,
      todayNum - 1,
      todayHour
    );

    const inst = new App();

    const rawData = [
      {
        from: yesterdayDate,
        to: yesterdayDate,
        generationmix: [
          {fuel: 'coal', perc: 10},
          {fuel: 'wind', perc: 20}
        ]
      },
      {
        from: todayDate,
        to: todayDate,
        generationmix: [
          {fuel: 'coal', perc: 50},
          {fuel: 'wind', perc: 50}
        ]
      }
    ];

    const newData = inst.getDataStackedChart(rawData);

    expect(newData).toEqual([
      { date: todayDate, coal: 50, wind: 50 },
    ]);
  });

  it('App.getRenewablesDonutChart() should group renewable sources', () => {

    const inst = new App();

    const rawData = [{
      generationmix: [
        {fuel: 'coal', perc: 10},
        {fuel: 'wind', perc: 20},
        {fuel: 'solar', perc: 10}
      ]
    }];

    const newData = inst.getRenewablesDonutChart(rawData);

    expect(newData).toEqual([
      { fuel: 'coal', perc: 10 },
      { fuel: 'renewables', perc: 30 },
    ]);
  });

  it('App.render() and App.onEnterArea()', async () => {

    const rawMix = [
      {fuel: 'nuclear', perc: 50},
      {fuel: 'wind', perc: 50}
    ];

    const rawData = {
      from: new Date(),
      to: new Date(),
      generationmix: rawMix
    };

    global.fetch = global.fetchOk({ data: [rawData] });
    const getFirstFill = R.path([
      'children', 0, 'children', 0, 'attributes', 'fill'
    ]);

    var wrapper = mount(<App />);
    await global.wait();
    var svgJsonStart = await parse(wrapper.find('#donut-all-data').html());
    var defaultColor = getFirstFill(svgJsonStart);

    expect(defaultColor).toEqual(COLORS['nuclear']);

    wrapper.find('DonutChart').first().props().onEnterArea({
      data: { fuel: 'nuclear' }
    });

    await global.wait();

    var svgJsonEnd = await parse(wrapper.find('#donut-all-data').html());
    var updateColor = getFirstFill(svgJsonEnd);

    expect(updateColor).toEqual('#FFFF99');
  });
});
