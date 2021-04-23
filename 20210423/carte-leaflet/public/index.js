import L from 'leaflet'
import arbres from './arbres.json'
import batiments from './batiments.json'
import telecabine from './export.json'

//monter la carte sur la div
const map = L.map('map').setView([46.4, 7.1], 10)

// const point_tele = telecabine.features.filter(d => d.geometry.type==="Point")

//Fond carte
L.tileLayer(
  'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}',
  {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png',
  })
    .addTo(map)


const icon = L.icon({
  iconUrl: 'arbre.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
})

arbres.map(d => {
  const [lon, lat] = d
  L.marker([lat, lon], { icon }).addTo(map)
})

// point_tele.map(d =>{
//   const [lon, lat] = d.geometry.coordinates
//   console.log(lon,lat);
//   L.marker([lat, lon], { icon }).addTo(map)
// })

L.geoJSON(
  telecabine,
  {
    // style: feature =>
    //   feature.properties['name'] === 'Centre Saint-Roch'
    //     ? { color: 'indianred' }
    //     : { color: 'steelblue' },
    // onEachFeature: (feature, layer) =>
    //   layer.bindPopup(feature.properties.name || feature.properties['addr:street'] || feature.properties.uid)
      
  },
).addTo(map)