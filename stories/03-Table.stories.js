import React from 'react';
import Table from '../src/components/Table';

export default { title: 'Table' };

export const toStorybook = () => {

  return (
    <div style={{marginTop: 50, marginLeft: 50}}>
      <Table />
    </div>
  );
};
