const data = require('../data.json');
// const data2 = require('./liste-hits.json');
const data3 = require('./liste-hits-v2.json');
const fs = require('fs');
const { stringify } = require('querystring');

//garde colonne 6, où y a les hits
const hits = data.map(cells => (cells[6]));

//faire un tableau avec les hits sous forme de nombre au lieu de string
const parsedData = hits.map(function(item){
    return{
        value: parseInt(item, 10)
    };
});
// console.log(parsedData)

//EXPORTER liste des hits --> j'enlève à la mains la première et la dernière entrée (hits et null)
// fs.writeFileSync('./liste-hits-v2.json', JSON.stringify(parsedData), 'utf-8');


//calculer de la somme
let count= 0;
data3.forEach(element => {
    let hit = element.value
    count = count + hit;
    
});
// console.log(count)

//EXPORTER le résultat
fs.writeFileSync('./data-graph4.json', JSON.stringify(count), 'utf-8');