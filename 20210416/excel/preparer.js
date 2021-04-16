//CONVERTIR XLSX VERS JSON
const xlsx = require('xlsx')

const file = xlsx.readFile('peinaussteiger2018.xlsx')
const json = xlsx.utils.sheet_to_json(file.Sheets['data'])

//TRAITER LES DONNEES->les gares par rapport à leur trafic journalier du lundi au dimance, les 5 plus importantes
const resultat = json
    .filter(d => d.DTV_2018 != '<50')
    .map(d => ({Gare: d.Bahnhof_Haltestelle, Trafic_journalier: d.DTV_2018}))
    .sort((a, b) => a.Trafic_journalier < b.Trafic_journalier ? 1 : -1)
    .slice(0, 5);


//MONTRER LE RéSULTAT
// console.log(resultat);

//EXPORTER LE RéSULTAT
console.log(JSON.stringify(resultat))

//faire dans le terminal: node preparer, pour exécuter le script
//faire dans le terminal: node preparer > data.json, pour enregistrer le résultat dans un fichier distinct
