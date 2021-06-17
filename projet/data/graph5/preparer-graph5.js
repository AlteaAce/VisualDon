const data = require('../data.json');
const fs = require('fs');
const { stringify } = require('querystring');
const { parse } = require('path');

//isoler les colonnes des équipes et hits
const teamHits = data.map(cells => ({
                team: cells[8],
                hits: parseInt(cells[6], 10)
}))



// tableau avec le nom de l'équipe et le nombre de hits

const Tableau = teamHits.reduce((accumulator, currentValue) => {
    const existe = accumulator.find(o => o.team === currentValue.team) //cherche si le nom existe
    return existe ? [...accumulator.filter(o => o.team !== currentValue.team), {...existe, hits:existe.hits + currentValue.hits}] : [...accumulator,{team: currentValue.team, hits: currentValue.hits}]
}, [])

const resultat = Tableau.sort((a, b) => a.hits < b.hits ? 1 : -1);

// console.log(resultat)

fs.writeFileSync('./data-graph5.json', JSON.stringify(resultat), 'utf-8');