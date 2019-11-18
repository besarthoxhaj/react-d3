import React from 'react';
import * as R from 'ramda';
import * as d3 from 'd3';
import memoizeOne from 'memoize-one';

const PADDING = 40;

export default class LineChart extends React.Component {

  static defaultProps = {
    width: 900,
    height: 400,
  }

  constructor(props) {

    super(props);
    this.mySvgRef = React.createRef();
    this.mySvgGroupRef = React.createRef();
    this.myLinePathRef = React.createRef();

    this.state = {
      hasAxis: false,
      lineX: 0,
      lineY: 0,
      data: [],
      showLine: false,
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  componentDidMount = async () => {

    const stockSymbol = 'FB';
    const outputSize = 'compact';
    const apiKey = 'UITG6BS40ZFN5K7X';

    const url = [
      'https://www.alphavantage.co/query?',
      'function=TIME_SERIES_DAILY',
      '&symbol=' + stockSymbol,
      '&outputsize=' + outputSize,
      '&apikey=' + apiKey
    ].join('');

    try {
      const response = await fetch(url);
      var data = await response.json();
    } catch (errorFetchStockData) {
      return console.log(`errorFetchStockData`, errorFetchStockData);
    }

    const dailySeries = data['Time Series (Daily)'];

    this.setState({
      data: this.convert(dailySeries),
    });
  }

  componentDidUpdate = () => {

    if(!this.state.hasAxis && this.state.data.length > 0) {
      this.createAxis();
    }
  }

  render() {

    const linePath = this.createLine();

    return (
      <svg
        width={this.props.width + PADDING}
        height={this.props.height}
        ref={this.mySvgRef}
        onMouseEnter={this.onMouseEnter}
        onMouseMove={this.onMouseMove}
        onMouseLeave={this.onMouseLeave}
      >
        <g
          transform={`translate(${PADDING}, ${PADDING})`}
          ref={this.mySvgGroupRef}
        >
          <path
            ref={this.myLinePathRef}
            stroke={'steelblue'}
            fill={'none'}
            d={linePath}
          />
          {this.state.showLine && (
            <g>
              <line
                stroke={'red'}
                strokeWidth={'.5'}
                y2={this.props.height - (2 * PADDING)}
                x1={this.state.lineX - PADDING}
                x2={this.state.lineX - PADDING}
              />
              <line
                stroke={'red'}
                strokeWidth={'.5'}
                y1={this.state.lineY}
                y2={this.state.lineY}
                x2={this.props.width - PADDING}
              />
            </g>
          )}
        </g>
      </svg>
    );
  }

  onMouseEnter = () => {

    this.setState({
      showLine: true
    });
  }

  onMouseMove = (syntheticEvent) => {

    const { xScale, yScale } = this.createScales();
    const [ xPos ] = d3.clientPoint(
      this.mySvgRef.current,
      syntheticEvent
    );

    const xDate = xScale.invert(xPos - PADDING);
    const idxPrice = this.bisect.right(
      this.getReversedData(),
      (new Date(xDate)).getTime(),
    );

    const yValue = (this.state.data[idxPrice] || {})['close'];
    const yPos = yScale(yValue);

    this.setState({
      lineX: xPos,
      lineY: yPos,
    });
  }

  onMouseLeave = () => {

    this.setState({
      showLine: false
    });
  }

  bisect = (() => {
    return d3.bisector(data => {
      return (new Date(data.date)).getTime();
    });
  })()

  createLine = () => {

    if (this.state.data.length === 0) return '';

    const { xScale, yScale } = this.createScales();

    return d3.line()
      .x(dataPoint => {
        const pointDate = new Date(dataPoint['date']);
        const xPointScaled = xScale(pointDate);
        return xPointScaled;
      })
      .y(dataPoint => {
        const pointPrice = dataPoint['close'];
        const yPointScaled = yScale(dataPoint['close']);
        return yPointScaled;
      })
    (this.state.data);
  }

  convert = (data) => {

    const convertedData = Object.keys(data).map(keyDate => {
      const elm = {};
      elm['date'] = keyDate;
      elm['close'] = parseInt(data[keyDate]['4. close']);
      return elm;
    });

    return convertedData;
  }

  createAxis = () => {

    const elmRef = this.mySvgRef.current;

    const { xScale, yScale } = this.createScales();

    var xAxis = d3.axisBottom()
      .scale(xScale)
      .ticks(15);

    var yAxis = d3.axisLeft()
      .scale(yScale)
      .ticks(5)
      .tickFormat(d => '$' + d);

    d3.select(elmRef).append('g')
      .attr('transform', `translate(${PADDING}, ${PADDING})`)
      .call(yAxis);

    d3.select(elmRef).append('g')
      .attr('transform', `translate(${PADDING}, ${this.props.height - PADDING})`)
      .call(xAxis);

    this.setState({
      hasAxis: true
    });
  }

  getReversedData = memoizeOne(() => {
    return this.state.data.reverse();
  })

  createScales = memoizeOne(() => {

    const datesList = this.state.data.map(point => point['date']);
    const priceList = this.state.data.map(point => point['close']);

    const xDomain = [
      new Date(d3.min(datesList)),
      new Date(d3.max(datesList)),
    ];

    const margin = 0;
    const yDomain = [
      d3.min(priceList) - margin,
      d3.max(priceList) + margin,
    ];

    var xScale = d3.scaleTime()
      .domain(xDomain)
      .range([0, this.props.width - PADDING]);

    var yScale = d3.scaleLinear()
      .domain(yDomain)
      .range([this.props.height - 2 * PADDING, 0]);

    return {
      xScale,
      yScale
    };
  })
}
