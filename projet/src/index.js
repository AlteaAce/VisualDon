import {
    geoOrthographic,
    geoPath,
    select,
    timer,
  } from 'd3'
import collection from '../data/graph1-2/data-graph1-geoPays.json' 
import pays from '../data/graph1-2/data-graph1-2.json'
  
  const WIDTH = 1000
  const HEIGHT = 400
  
  const svg = select('#graph1').append('svg')
    .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)

  const svg_circle = svg.append('circle')
    .attr('cx', '500')
    .attr('cy', '200')
    .attr('r', '200')
    .attr('stroke', '#121563')
    .attr('fill', 'white')
  
  const g_country = svg.append('g')
   
  const paths = g_country.selectAll('path')
    .data(collection.features)
    .enter()
    .append('path')
    .attr('fill', 'white')
    .attr('stroke', '#121563')


  let rotate = [0, 0, 0]
  
  const tick = () => {
    rotate = [rotate[0] + 0.1, -10, -15]
    const projection = geoOrthographic()
      .fitExtent([[0, 0], [WIDTH, HEIGHT]], collection)
      .rotate(rotate)
    const pathCreator = geoPath().projection(projection)
    paths.attr('d', pathCreator)
  }
  
  timer(tick)