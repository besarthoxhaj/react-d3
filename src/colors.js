import * as d3 from 'd3';

const fuelNames = [
  'biomass',
  'wind',
  'solar',
  'hydro',
  'renewables',
  'gas',
  'nuclear',
  'coal',
  'imports',
  'other'
];

const COLORS = fuelNames.reduce((acc, name, idx) => {

  // acc[name] = d3.schemeTableau10[idx];
  // acc[name] = d3.schemeRdBu[9][idx];
  // acc[name] = d3.schemeBlues[9][idx];
  acc[name] = d3.schemeGreens[9][idx];

  return acc;
}, {});

export default COLORS;
