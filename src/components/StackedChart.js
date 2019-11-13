import React from 'react';
import * as R from 'ramda';
import * as d3 from 'd3';

const PADDING = 40;

export default class StackedChart extends React.Component {

  static defaultProps = {
    width: 900,
    height: 400,
  }

  constructor(props) {

    super(props);
    this.mySvgRef = React.createRef();
    this.mySvgGroupRef = React.createRef();

    this.state = {
      hasAxis: false,
      showLine: false,
      lineX: 0
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  componentDidMount() {
    this.createAxis();
  }

  componentDidUpdate() {

    if(!this.state.hasAxis) {
      this.createAxis();
    }
  }

  render() {

    const stack = this.createStack();
    const areaFun = this.createArea();

    return (
      <svg
        style={{backgroundColor:'#f4a582'}}
        width={this.props.width}
        height={this.props.height}
        ref={this.mySvgRef}
      >
        <g
          transform={`translate(${PADDING}, ${PADDING})`}
          ref={this.mySvgGroupRef}
          onMouseEnter={this.onMouseEnter}
          onMouseMove={this.onMouseMove}
          onMouseLeave={this.onMouseLeave}
        >
          {stack.map(currStackData => (
            <path
              key={currStackData.key}
              fill={this.props.colors[currStackData.key]}
              d={areaFun(currStackData)}
            />
          ))}
          {this.state.showLine && (
            <line
              stroke="yellow"
              strokeWidth="1"
              y2={this.props.height - (PADDING * 2)}
              x1={this.state.lineX}
              x2={this.state.lineX}
            />
          )}
        </g>
      </svg>
    );
  }

  onMouseEnter() {
    this.setState({
      showLine: true
    });
  }

  onMouseMove(syntheticEvent) {

    const [ xPos ] = d3.clientPoint(
      this.mySvgGroupRef.current,
      syntheticEvent
    );

    this.setState({
      lineX: xPos
    });
  }

  onMouseLeave() {
    this.setState({
      showLine: false
    });
  }

  createAxis() {

    const elmRef = this.mySvgRef.current;

    const { xScale, yScale } = this.createScales();

    var xAxis = d3.axisBottom()
      .scale(xScale)
      .ticks(24);

    var yAxis = d3.axisLeft()
      .scale(yScale)
      .ticks(5)
      .tickFormat(d => d + '%');

    d3.select(elmRef).append('g')
      .attr('transform', `translate(${PADDING}, ${PADDING})`)
      .call(yAxis);

    d3.select(elmRef).append('g')
      .attr('transform', `translate(${PADDING}, ${this.props.height - PADDING})`)
      .call(xAxis);

    this.setState({ hasAxis: true });
  }

  createStack() {

    const names = R.without(
      ['renewables'],
      Object.keys(this.props.colors)
    );

    return d3.stack()
      .keys(names)
      .order(d3.stackOrderDescending)
    (this.props.data);
  }

  createArea() {

    const { xScale, yScale } = this.createScales();

    return d3.area()
      .x(({ data }) => xScale(new Date(data.date)))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]));
  }

  createScales() {

    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);

    const endToday = new Date();
    endToday.setHours(23, 59, 59, 999);

    var xScale = d3.scaleTime()
      .domain([startToday, endToday])
      .range([0, this.props.width - PADDING]);

    var yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([this.props.height - 2 * PADDING, 0]);

    return {
      xScale,
      yScale
    };
  }
}
