import {
    geoOrthographic,
    geoPath,
    select,
    timer,
  } from 'd3'
import collection from '../data/graph1-2/join.json' 
import pays from '../data/graph1-2/data-graph1-v1.json'
  
  const WIDTH = 1000
  const HEIGHT = 700
  
  const svg = select('#graph1').append('svg')
    .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)

  const svg_circle = svg.append('circle')
    .attr('cx', '500')
    .attr('cy', '350')
    .attr('r', '350')
    .attr('fill', '#121563')
    .attr('opacity', '0.2')
  
  const g_country = svg.append('g')
   
  const paths = g_country.selectAll('path')
    .data(collection.features)
    .enter()
    .append('path')
    .attr('fill', 'white')
    .attr('stroke', '#121563')
    .attr('fill-opacity', '0')

  const g_colored = svg.append('g')

  const pathsColored = g_colored.selectAll('path')
    .data(pays.features)
    .enter()
    .append('path')
    .attr('fill', '#121563')
    .attr('stroke', 'white')


  let rotate = [0, 0, 0]
  
  const tick = () => {
    rotate = [rotate[0] + 0.2, -10, -15]
    const projection = geoOrthographic()
      .fitExtent([[0, 0], [WIDTH, HEIGHT]], collection)
      .rotate(rotate)
    const pathCreator = geoPath().projection(projection)
    paths.attr('d', pathCreator)
    pathsColored.attr('d', pathCreator)
  }
  
  timer(tick)

//Je n'ai pas réussi à faire en sorte que seul les pays présents dans le second jeu de donnée se mettent en couleur et que cette couleur varie selon la valeur