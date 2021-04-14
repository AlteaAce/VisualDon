import {
  axisLeft,
  select,
  scaleLinear,
  max,
} from 'd3'
import json from '@rollup/plugin-json'

const DATA = [
  { nom: 'Lausanne', population: 138905, superficie: 41.38 },
  { nom: 'Yverdon-les-Bains', population: 30143, superficie: 11.28 },
  { nom: 'Montreux', population: 26574, superficie: 33.37 },
  { nom: 'Renens', population: 21036, superficie: 6.79 },
  { nom: 'Nyon', population: 20533, superficie: 2.96 },
  { nom: 'Vevey', population: 19827, superficie: 2.38 },
]

const WIDTH = 1000
const HEIGHT = 500
const MARGIN = 5
const MARGIN_LEFT = 50
const MARGIN_BOTTOM = 50
const BAR_WIDTH = (WIDTH - MARGIN_LEFT) / DATA.length

const div = select('div#graph');

const svg = div.append('svg')
  .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)

const g = svg.append('g')
  .attr('transform', `translate(${MARGIN_LEFT}, 0)`)

const rect = g.selectAll('rect')
  .data(DATA)
  .enter()
  .append('rect')
  .attr('x', (d, i) =>  i * BAR_WIDTH)
  .attr('width', BAR_WIDTH - MARGIN)
  .attr('y', HEIGHT - MARGIN_BOTTOM)
  .attr('height', 0)
  .attr('fill', 'steelblue')

g.selectAll('text')
  .data(DATA)
  .enter()
  .append('text')
  .text(d => d.nom)
  .attr('x', (d, i) =>  i * BAR_WIDTH + BAR_WIDTH / 2)
  .attr('y', HEIGHT - MARGIN_BOTTOM / 2)
  .attr('text-anchor', 'middle')

const axis = svg.append('g')
  .attr('transform', `translate(${MARGIN_LEFT - 3})`)

const onChange = key => {
  const yScale = scaleLinear()
    .domain([0, max(DATA, d => d[key])])
    .range([HEIGHT - MARGIN_BOTTOM, 0])

  const axisY = axisLeft().scale(yScale)
    .tickFormat(d => key === 'superficie' ? d : `${d / 1000}k`)
    .ticks(5)

  rect
    .transition()
    .duration(1000)
    .attr('y', d => yScale(d[key]))
    .attr('height', d => HEIGHT - MARGIN_BOTTOM - yScale(d[key]))

  axis
    .transition()
    .duration(1000)
    .call(axisY)
}

select('select').on('change', e => onChange(e.target.value))

window.onload = () => onChange('population')