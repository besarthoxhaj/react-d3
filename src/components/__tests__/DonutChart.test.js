import React from 'react';
import { shallow } from 'enzyme';

import DonutChart from '../DonutChart';

describe('DonutChart', () => {

  it('DonutChart.render() should update based on state', () => {

    const props = {
      colors: { coal: 'white', wind: 'black' },
      data: [{fuel: 'coal', perc: 50}, {fuel: 'wind', perc: 50}],
    };

    const wrapper = shallow(
      <DonutChart {...props} />
    );

    expect(
      wrapper.find('.donut-big-text').text()
    ).toEqual('100%');

    wrapper.setState({currFuelHover: 'coal'});

    expect(
      wrapper.find('.donut-big-text').text()
    ).toEqual('50.0%');
  });
});
