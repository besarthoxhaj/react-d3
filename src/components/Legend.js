import React from 'react';

export default class Legend extends React.Component {

  render() {

    return (
      <div className={'legends-container'}>
        {Object.keys(this.props.colors)
          .map((colorElm) => this.getTextElm(colorElm))
        }
      </div>
    );
  }

  getTextElm(fuelType) {

    const color = this.props.colors[fuelType];

    const currData = {
      data: { fuel: fuelType }
    };

    return (
      <div key={fuelType} className={'legend-container'}>
        <div
          className={'legend-square'}
          style={{ backgroundColor: color }}
          onMouseEnter={() => this.props.onEnterArea(currData)}
          onMouseLeave={() => this.props.onLeaveArea(currData)}
        />
        <p className={'legend-text'}>
          {fuelType}
        </p>
      </div>
    );
  }
}
