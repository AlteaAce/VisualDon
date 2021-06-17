const data = require('../pays-world.json');
const rewind = require('@mapbox/geojson-rewind')
const fs = require('fs');


const result = data.features
  .filter(d => (d.geometry.type === 'Polygon' || d.geometry.type === 'MultiPolygon') && d.properties.NAME_EN)
  .map(d => rewind(d, true))

fs.writeFileSync('./data-graph1-geoPays.json', JSON.stringify(result), 'utf-8')
// console.log(result);