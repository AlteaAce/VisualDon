import {
    geoOrthographic,
    geoPath,
    select,
    timer,
  } from 'd3'
  import collection from './data.json' 
  import lakes from './ne_110m_rivers_lake_centerlines.json'
  
  const WIDTH = 1000
  const HEIGHT = 400
  
  const svg = select('#map').append('svg')
    .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
  
  const g_country = svg.append('g')
   
  const paths = g_country.selectAll('path')
    .data(collection.features)
    .enter()
    .append('path')
    .attr('fill', 'indianred')
  
  const g_lakes = svg.append('g')

  const lakes_path = g_lakes.selectAll('path')
    .data(lakes.features)
    .enter()
    .append('path')
    .attr('stroke', 'aqua')
    .attr('fill-opacity', 0)

  paths.on('mouseover', e => {
    select(e.target).attr('fill', 'greenyellow')
  })
  
  paths.on('mouseout', e => {
    select(e.target).attr('fill', 'green')
  })
  
  let rotate = [0, 0, 0]
  
  const tick = () => {
    rotate = [rotate[0] + 0.2, -10, -15]
    const projection = geoOrthographic()
      .fitExtent([[0, 0], [WIDTH, HEIGHT]], collection)
      // .fitExtent([[0, 0], [WIDTH, HEIGHT]], lakes)
      .rotate(rotate)
    const pathCreator = geoPath().projection(projection)
    paths.attr('d', pathCreator)
    lakes_path.attr('d', pathCreator)
  }
  
  timer(tick)