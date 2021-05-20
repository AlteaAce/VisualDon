const data = require('../data.json');
const rewind = require('@mapbox/geojson-rewind');
const fs = require('fs');
const { stringify } = require('querystring');

//ces données vont servir à faire un map des pays où il y a des joueurs ainsi que la fréquence de redondance
//clef à garder --> nationality - colonne 2 de chaque entrée
// const clef = data.map(cells => ({
//                 pays: cells[2]
//             }))

const pays = data.map(cells => (cells[2]));

//créer un tableau avec le pays comme clef et le nombre d'occurrence comme valeur
// const resultat = pays.reduce((r, d) => r[d] ? {...r, [d]:r[d]+1} : {...r, [d]:1 }, {} );

const resultat2 = pays.reduce((r, d) => {
    const existe = r.find(o => o.nom === d ) //cherche si le nom existe déjà
    return existe ? [...r.filter(o => o.nom !== d), {...existe, valeur: existe.valeur+1}] : [...r, {nom: d,valeur: 1}] 
    // s'il existe (?), on l'écrase avec la nouvelle valeur, sinon (après les :) on le crée
    // ...existe = copie existe
}, []) // [] = retourne un tableau

const resultat3 = resultat2.sort((a, b) => a.valeur < b.valeur ? 1 : -1);

fs.writeFileSync('./data-graph2-listePaysTop5.json', JSON.stringify(resultat3), 'utf-8');
