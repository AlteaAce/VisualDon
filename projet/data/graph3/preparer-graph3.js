const data = require('../data.json');
const fs = require('fs');
const { stringify } = require('querystring');

//isoler la colonne des équipes
const team = data.map(cells => (cells[8]));

//créer un tableau avec l'équipe comme clef et le nombre d'occurrence comme valeur
const resultat = team.reduce((r, d) => {
    const existe = r.find(o => o.nom === d ) //cherche si le nom existe déjà
    return existe ? [...r.filter(o => o.nom !== d), {...existe, valeur: existe.valeur+1}] : [...r, {nom: d,valeur: 1}] 
    // s'il existe (?), on l'écrase avec la nouvelle valeur, sinon (après les :) on le crée
    // ...existe = copie existe
}, []) // [] = retourne un tableau

const resultat2 = resultat.sort((a, b) => a.valeur < b.valeur ? 1 : -1);

fs.writeFileSync('./data-graph3.json', JSON.stringify(resultat2), 'utf-8');
// console.log(resultat2)