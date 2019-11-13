import React from 'react';
import * as d3 from 'd3';
import * as R from 'ramda';

import COLORS from './colors';

import DonutChart from './components/DonutChart';
import StackedChart from './components/StackedChart';
import Legend from './components/Legend';

const renList = ['biomass', 'wind', 'solar', 'hydro'];

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      donutData: undefined,
      colors: COLORS,
    };
  }

  componentDidMount = async () => {

    const currDateTime = new Date().toISOString();
    const url = [
      'https://api.carbonintensity.org.uk',
      '/generation/' + currDateTime + '/pt24h',
    ].join('');

    try {
      var response = await fetch(url);
      var { data } = await response.json();
    } catch(errGetData) {
      return this.handleErrorGetData(errGetData);
    }

    this.setState({
      data: data,
      donutData: this.getLastDataDonutChart(data),
    });
  }

  render() {

    return (
      <div className={'app-container'}>
        <h1 className={'app-title'}>
          Energy Mix
        </h1>
        <Legend
          colors={this.state.colors}
          onEnterArea={currData => this.onEnterArea(currData)}
          onLeaveArea={currData => this.onLeaveArea(currData)}
        />
        <div className={'app-inner-container'}>
          <DonutChart
            colors={this.state.colors}
            data={this.state.donutData}
            onEnterArea={currData => this.onEnterArea(currData)}
            onLeaveArea={currData => this.onLeaveArea(currData)}
            name={'donut-all-data'}
          />
          <StackedChart
            data={this.getDataStackedChart(this.state.data)}
            colors={this.state.colors}
            currValueX={({xValue}) => this.updateDonutChart(xValue)}
          />
        </div>
      </div>
    );
  }

  updateDonutChart(time) {

    const threshold = 60 * 15; // 15 mins
    const unixTimeSelection = (new Date(time)).getTime() / 1000;

    const nearTimeData = this.state.data.find(elm => {

      const elmTimeUnix = (new Date(elm.from)).getTime() / 1000;
      const difference = Math.abs(elmTimeUnix - unixTimeSelection);

      if (difference < threshold) return elm;
    });

    this.setState({
      donutData: nearTimeData['generationmix']
    });
  }

  getLastDataDonutChart(rawData) {

    return R.path([
      rawData.length - 1,
      'generationmix'
    ], rawData);
  }

  getRenewablesDonutChart(rawData) {

    const isRenewable = fuel => renList.indexOf(fuel) > -1;
    const lastData = this.getLastDataDonutChart(rawData);

    if(!lastData) return;

    const renSum = lastData.reduce((acc, elm) => {
      if(isRenewable(elm.fuel)) acc.perc += elm.perc;
      return acc;
    }, {fuel: 'renewables', perc: 0});

    const others = lastData.filter(elm => {
      return !isRenewable(elm.fuel);
    });

    return others.concat(renSum);
  }

  getDataStackedChart(rawData) {

    if (rawData.length === 0) return rawData;

    return rawData
      .filter(elm => this.isToday(elm.to))
      .map(dataPoint => {
        return dataPoint['generationmix'].reduce((acc, elm) => {
          acc[elm.fuel] = elm.perc;
          acc['date'] = dataPoint['from'];
          return acc;
        }, {});
      });
  }

  isToday(dateTime) {

    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);

    const startTodayUnix = startToday.getTime();
    const dateTimeUnix = (new Date(dateTime)).getTime();

    return dateTimeUnix > startTodayUnix;
  }

  onEnterArea(currArcData) {

    const colors =  COLORS;
    const currFuel = currArcData.data.fuel;
    const currColor = this.state.colors[currFuel];

    const nextColors = Object.keys(colors)
      .reduce((acc, name) => {

        acc[name] = colors[name];

        if (name === currFuel) {
          acc[name] = '#FFFF99';
        }

        if (currFuel === 'renewables' && renList.includes(name)) {
          acc[name] = '#FFFF99';
        }

        return acc;
      }, {});

    this.setState({
      colors: {
        ...nextColors
      }
    });
  }

  onLeaveArea(currArcData) {

    this.setState({
      colors: {
        ...COLORS
      }
    });
  }

  handleErrorGetData(errGetData) {

    alert(
      'Error while fetching data',
      JSON.stringify(errGetData)
    );
  }
}
