import React from 'react';

const COLOR = 'rgba(117, 174, 222, 0.6)';

export default class Table extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    const containerStyle = {
      maxWidth: 500,
      height: 50,
      backgroundColor: COLOR,
    };

    return (
      <div style={containerStyle}>
        {this.getHeaders()}
      </div>
    );
  }

  getHeaders = () => {
    return (
      <div style={{}}>
      </div>
    );
  }
}
