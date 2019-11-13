import React from 'react';
import * as d3 from 'd3';

export default class DonutChart extends React.Component {

  static defaultProps = {
    width: 300,
    height: 300,
    radius: 150,
    data: [],
    onEnterArea: () => {},
    onLeaveArea: () => {},
    onClickArea: () => {},
  }

  constructor(props) {
    super(props);

    this.state = {
      currFuelHover: undefined
    };
  }

  render() {

    const { width, height } = this.props;

    const pieData = this.createPieData();
    const arcFun = this.createArcFun();

    return (
      <svg id={this.props.name} width={width} height={height}>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {pieData.map(currArcData => (
            <path
              key={currArcData.index}
              fill={this.props.colors[currArcData.data.fuel]}
              d={arcFun(currArcData)}
              onMouseEnter={() => {
                this.setState({ currFuelHover: currArcData.data.fuel });
                this.props.onEnterArea(currArcData);
              }}
              onMouseLeave={() => {
                this.setState({ currFuelHover: undefined });
                this.props.onLeaveArea(currArcData);
              }}
            />
          ))}
        </g>
        <g transform={`translate(${width / 2}, ${(height / 2) + 10})`}>
          {this.getTextElm()}
        </g>
      </svg>
    );
  }

  createArcFun() {

    const arc = d3.arc()
      .innerRadius(this.props.radius - 50)
      .outerRadius(this.props.radius)
      .padAngle(0.02);

    return arc;
  }

  createPieData() {

    return d3.pie()
      .value(function(d) {
        return d.perc;
      })(this.props.data);
  }

  getTextElm() {

    if(this.props.data.length === 0) {
      return null;
    }

    const { currFuelHover } = this.state;

    const currFuel = this.props.data.find(elm => {
      return elm['fuel'] === currFuelHover;
    });

    const currPerc = currFuel
      ? currFuel['perc'].toFixed(1)
      : '100';

    const showText = currFuelHover
      ? currFuelHover.charAt(0).toUpperCase() + currFuelHover.slice(1)
      : 'Total contracts';

    return (
      <React.Fragment>
        <text className={'donut-big-text'}>
          {currPerc}
          <tspan className={'donut-small-text'}>
            %
          </tspan>
        </text>
        <text y={30} className={'donut-under-text'}>
          {showText}
        </text>
      </React.Fragment>
    );
  }
}
