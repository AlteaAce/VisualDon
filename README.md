# VisualDon

## SVG

`<svg width="200" height="100">
  <rect x="0" y="0" width="100" height="100" fill="steelblue" />
  <circle cx="100" cy="50" r="40" fill="indianred" stroke="red" />
</svg>`

Le width et height dans la balise svg défini les dimensions dans lesquelles on va travailler. (ce ne sont pas des pixels)

OU

`<svg viewBox="0 0 200 100"> -->
  <rect x="0" y="0" width="100" height="100" fill="steelblue" />
  <circle cx="100" cy="50" r="40" fill="indianred" stroke="red" />
</svg>`

ViewBox défini l'origine et aussi les dimensions pour définir la partie visible.Les formes prendront toute la place disponible contrairement à la première option qui prendra que la portion d'écran définie.

### Les formes

Il est possible d'utiliser les formes géométriques de base, mais aussi de dessiner ses propres formes comme nous le ferrions avec Illustrator. Les divers formes peuvent être groupées en entourant les balises concernées de la balise <g>. Il est aussi possible d'y ajouter des attributs qui seront appliqués à toutes les formes du groupe.

#### rect

Les rectangles sont positionnés selon une origine et on lui rajoute une taille.

`<rect x="0" y="0" width="100" height="100" fill="steelblue" />`

#### circle

Le cercle est placé par rapport à son centre et on lui ajoute un rayon.

`<circle cx="100" cy="50" r="40" fill="indianred" stroke="red" />`

#### ellipse

La position de l'ellipse est définie comme celle de circle. La différence est qu'elle a deux rayons, en x et y, pour donner une forme elliptique.

`<ellipse cx="50" cy="50" rx="30" ry="20" />`

#### line

La ligne prend un point de départ, x1 et y2, et un point d'arrivée, x2 et y2. Il ne faut pas oublier d'ajouter l'attribut stoke(contour) pour que la forme apparaîsse.

`<line x1="100" y1="0" x2="200" y2="100" stroke="red" />`

#### text

Il est possible d'ajouter, en svg, du texte qui sera donc vectoriel. Cet élément se défini comme l'élément rect, avec x et y. L'ancrage sur l'axe y peut être défini par l'attribut text-anchor ("start" par défaut).

`<text x="200" y="80" text-anchor="middle">Salut</text>`

#### path

Cet élément permet de dissner des formes plus complexes. L'attribut d est très important, il permet de donner des instruction, donc des coordonnées, à notre forme. M ordonne de bouger (move) à un endroit. L ordonne de tracer une ligne de l'endroit de départ jusqu'aux coordonnées inscrites. Pour dessiner une courbe, il faut utiliser la lettre C qui demande deux points de contrôle.
Une fois que nous avons fini de lui donner des coordonnées et que nous voulon revenir au point de départ pour fermer la forme, il faut utiliser la lettre Z.

`<path d="M 0 90 L 100 0 L 200 90 Z" fill="none" stroke="steelblue" />`

`<path d="M 20 20 C 40 50 160 50 180 20" fill="none" stroke="indianred" />`


Liste complète des éléments SVG: https://developer.mozilla.org/en-US/docs/Web/SVG/Element


### Les attributs

#### fill

Le remplissage de la forme.

`stroke="red"`

#### stroke

Le contour de la forme.

`fill="green"`

#### stroke-width

L'épaisseur du contour.

`stroke-width="5"`

#### opacity

L'opacité de la forme dans son ensemble. De 0 à 1.

`opacity="0.5"`

#### fill-opacity

L'opacité du remplissage de la forme, sans le contour. De 0 à 1.

`fill-opacity="0.5"`

#### stroke-opacity

L'opacité du contour de la forme, sans le remplissage. De 0 à 1.

`stroke-opacity="0.5"`

#### stroke-linecap

La manière dont se termine les extrémité d'une ligne. Soit la valeur par défaut, round, square

`stroke-linecap="round"`

#### stroke-dasharray

Permet de faire des ligne pointillées. Il faut spécifier un interval et une taille de trait.

`<line x1="0" y1="20" x2="200" y2="20" stroke="black" stroke-width="5" stroke-dasharray="10" />
 <line x1="0" y1="40" x2="200" y2="40" stroke="black" stroke-width="5" stroke-dasharray="10 2" />`
 
#### stroke-dashoffset

Défini le point de départ de stroke.dasharray. Il est souvent utilisé pour donner un effet d'élément qui se dessine en temps réel.

`<text x="100" y="80" font-size="60" text-anchor="middle" font-weight="bold" fill="none" stroke="black" stroke-dasharray="300" stroke-dashoffset=${offset}>Salut</text>`

#### transform

Cet attribut permet de modifier le positionnement d'un élément. Il prend pour données: translate, scale, rotate

##### translate

Il faut préciser les coordonnées x et y auxquelles nous voulons bouger la forme.
`transform="translate(-50, 20)"`

`<g fill="indianred" stroke="steelblue" stroke-width="2" transform="translate(-50, 20)">
    <circle cx="50" cy="50" r="30" />
    <rect x="40" y="40" width="60" height="30" />
    <text x="100" y="80" font-size="50">Salut</text>
  </g>`
  
##### scale

Permet d'agrandir une forme avec un facteur.

`<svg width="300" height="100">
  <g fill="indianred" stroke="steelblue" stroke-width="2" transform="scale(1.2)">
    <circle cx="50" cy="50" r="30" />
    <rect x="40" y="40" width="60" height="30" />
    <text x="100" y="80" font-size="50">Salut</text>
  </g>
</svg>`

##### rotate

Permet de tourner une forme. Le premier argument est les degrés et les deux autres précise le point autour duquel la rotation doit se faire. 

`<svg width="200" height="100">
  <g fill="indianred" stroke="steelblue" stroke-width="2" transform="rotate(20, 100, 50)">
    <circle cx="50" cy="50" r="30" />
    <rect x="40" y="40" width="60" height="30" />
    <text x="100" y="80" font-size="50">Salut</text>
  </g>
</svg>`

### CSS

Lorsque le SVG est intégré dans une page HTML, nous pouvons définir certains style avec CSS.

Liste des attributs modifiables en CSS: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation

### JavaScript

Lorsque le SVG est intégré à une page il fait parti du DOM. Il peut donc être manipulé en JavaScript. Par exemple, on peut écouter la valeur choisie par l'utilisateur pour l'appliquer en temps réel au rayon d'un cercle:

`<svg width="200" height="100">
  <circle cx="100" cy="50" r=${rValue} />
</svg>`

## JavaScript

### Types de données

#### Booléan

True ou False

#### Null / undefined

Les deux sont des valeurs qui signifie "rien".
La différence est que null est un objet et undefined est un type en lui même.

#### Nombre

Les nombres et chiffres, sans guillemets

`Number.isNan('regrg')` Vérifie si ce n'est pas un nombre
`Math.random()` Renvois un nombre entre 0 et 1
`Math.floor(1.223)` ou `Math.ceil(1.223)` ou `Math.round(1.223)` Arrondis à l'inférieur, au supérieur ou au plus proche

#### Chaînes de caractères (string)

Les chaînes de caractères doivent être renseignées entre guillement. Il est possible de concaténer ave un + `"Salut" + "!"`
Plusieurs fonnctions sont disponibles pour agire sur ces chaîne: `toUpperCase()` pour mettre en majuscule, `toLowerCase()` pour mettre en minusculte, `includes()` pour vérifier si la chaîne en contient une autre (entre parenthèse), `split()` permet de séparer une chaîne de caractère selon un caractère.

#### Objet

Il peut être utile de regrouper des données dans des objets: `const obj = Object {nom: "Machin", age: 22, aFaim: true}`
Retourner une partie de l'objet: `obj.nom`
Retourner les clefs de l'objet: `Object.keys(obj)`
Ajouter un élément à l'objet: `const obj2 ({ ...obj, autre: 'x' })`

#### Tableau (array)

Les tableaux se déclarent entre []. Dans ceux-ci nous pouvons mettre n'importe quel type de données.

`const tableau = [1, 2, 3]`

##### Méthodes sur un array

`const fruits = ([
  {name: 'Pomme', num: 5},
  {name: 'Pêche', num: 3},
  {name: 'Banane', num: 9}
])`

##### .map

La méthode .map() permet de créer une autre liste à partir de celle que nous avons.

La fonction à l'intérieur de .map() prends trois arguments:

1. L'élément de la liste
2. L'index de l'élément dans la liste
3. La liste entière

Nous pouvons quand même ignorer les arguments:
`fruits.map(() => "Rien à voir")`--> rempli un tableau à 3 emplacement de "Rien à voir"

On peut utiliser qu'un élément de la liste:
`fruits.map(fruit => "J'ai ${fruit.num} ${fruit.name}s")` --> reprendre chaque objet du tableau et écrit: J'ai 5 Pommes, J'ai 3 Pêches, J'ai 9 Bananes

##### .filter

La méthode .filter() permet de ne prendre que les éléments qui nous intéressent dans une liste.

La fonction à l'intérieur de .filter() (comme .map()) prends trois arguments:

1. L'élément de la liste
2. L'index de l'élément dans la liste
3. La liste entière

Si la fonction retourne true, l'élément est gardé et ignoré si elle retourne false.

Si on a une fonction qui permet de savoir si une chaîne de caractère commence par P:
`const commenceParP = fruit => fruit.name.startsWith("P")`

On peut l'appliquer avec filter pour filtrer notre tableau afin de retourner que ceux qui commencent par P:
`fruits.filter(commenceParP)`

Ou si on souhaite filtrer par l'index et gaarder que les 2 premiers éléments de la liste:
`fruits.filter((fruit, i) => i < 2)`

##### .find

La méthode .find() prends, comme .filter() une fonction qui retourne true ou false et retourne le premier objet sur lequel la fonction retourne true.

`fruits.find(commenceParP)` => on nous retourne que le premier fruit dont le nom commence par P

Si il n'y a pas de concordance/de résultat, la fonction retourne "undefined".

##### .reduce

Permet de réduire un ensemble d'éléments en 1 élément final.
La méthode prends une fonction avec quatre arguments:

1. Le résultat
2. L'élément de la liste
3. L'index de l'élément
4. La liste entière

et une valeur de départ.

`liste.reduce(FONCTION, VALEUR_DE_DEPART)`

Exemple:

`const sum = (valeurCourant, d) => valeurCourante + d.num`

`data.reduce(sum,0)` => 17

Fait la somme du nombre de fruits en partant de l'index 0 du tableau.

##### .reduce

Vérifie si une liste inclut une valeur et retourne true ou false:
`[1, 2, 3].includes(2)` => true

##### .sort()

Permet d'ordonner une liste.
sans argument, sort ordonne par ordre alphabétique, ce qui ne convient pas pour des chiffres.

Exemple:

`['c', 'd', 'b', 'a'].sort()` => a, b, c, d

`[12, 2, 1, 23].sort()` => 1, 12, 2, 23

`[12, 2, 1, 23].sort((a, b) => a > b ? 1 : -1)` => 1, 2, 12, 23 (si a est plus grand que b --> ça retourne 1 sinon -1)

##### .join()

Pour joindre une liste de chaînes de caractères, en une chaîne de caractères.

```fruits.map(d => d.name).join('----')``` => Pomme----Pêche----Banane

## Formats de données

### JSON

Le fichiers de type JSON, (JavaScript Object Notation), sont, comme le nom l'indique, déjà dans un format que javascript comprends.

Une fois les données téléchargées, il faut les préparer.

#### Préparer les données

Un script preparer.js:
```
const data = require('./noms.json')

const femmesAYverdon = d => d.plz === '1400' && d.sexcode === 'w'

const resultat = data
  .filter(femmesAYverdon)
  .map(d => ({ nom: d.nachname, nombre: d.anzahl }))
  .sort((a, b) => a.nombre > b.nombre ? -1 : 1)

console.log(resultat)
```
Nous chargeons les données JSON, avec require.

femmesAYverdon est une fonction qui prends un élément de data et retourne true s'il concerne le code postal 1400 et les femmes.

Nous utilisons cette fonction pour filtrer les éléments de data, .filter(femmesAYverdon).

Seul le nom et le nombre nous intéressent: .map(d => ({ nom: d.nachname, nombre: d.anzahl })).

Nous utilisons la méthode .sort pour ordonner la liste.

Pour finir nous envoyons le résultat à la console, console.log(result).

Quand nous lançons le scripte: `node preparer`

Nous voyons dans la console:

```
[
  { nom: 'Favre', nombre: 72 },
  { nom: 'Martin', nombre: 71 },
  { nom: 'Chevalley', nombre: 49 },
  { nom: 'Perret', nombre: 46 },
  { nom: 'Muminovic', nombre: 45 }
]
```

Si nous souhaitons sauver ces données dans un fichier, il nous faut convertir le résultat en chaîne de caractères. Pour cela, utilisons `JSON.stringify`.

`console.log(JSON.stringify(result))`

Pour sauver le résultat dans un fichier data.json:

`node preparer > data.json`

Comme lors du téléchargement, `>` sert à sauver le texte affiché dans la console dans un fichier.

### CSV

Le format CSV, Comma Separated Values. Comme son nom l'indique, il ressemble à ça:

A,B,C

1,2,3

4,5,6


C'est comme une feuille excel avec uniquement les données (sans les fonctions). Chaque cellule est séparée par une virgule.

A |	B |	C

1 |	2 |	3

4 |	5 |	6

#### Convertir en JSON

Un scripte toJSON.js:

```
const fs = require('fs')

const file = fs.readFileSync('data.csv', 'utf-8')
```

N'étant pas un format compréhensible par javascript en tant que tel, il nous faut l'ouvrir avec fs (File System), la librairie nodejs qui permet d'interagir avec les fichiers sur l'ordinateur. Cette librairie est installée en même temps que nodejs. Pas besoin de la télécharger.

`fs.readFileSync` nous permet d'ouvrir un fichier. Elle prends deux argument, le chemin vers le fichier à ouvrir, data.csv, et l'encodage, utf-8.

Si nous envoyons ce fichier à la console

`console.log(file.split('\n'))`

Nous avons maintenant un tableau de chaînes de caractères, chacun étant une ligne du fichier.

Divisons chaque ligne au niveau du point-virgule. Le format a beau s'appeler "comma separated values", le séparateur de cellules n'a pas besoin d'être une virgule.

```
console.log(
  file.split(`\n`)
    .map(line => line.split(';'))
)
```


Nous n'avons pas besoin de faire ce travail de diviser par ligne, puis par cellule. Nous l'avons fait ici pour montrer comment ça marche. Mais il existe plusieurs librairies javascript qui font le travail pour vous.

```
const fs = require('fs') //file system
const d3 = require('d3')

const file = fs.readFileSync('data.csv', 'utf-8')

const { parse } = d3.dsvFormat(';')

console.log(
  parse(file)
    .map(d => ({
      elus: Number(d.anzahl_gewaehlte),
      parti: d.partei_bezeichnung_fr,
      canton: d.kanton_bezeichnung,
    }))
)
```

## Fonctions Ramda

``const R = require('ramda')``

``import {R} from "@itacirgabral/ramda"``

Documentation: https://ramdajs.com/docs/

### .uniq

Sert à prendre que les éléments uniques dans un tableau

``
R.uniq([1,4,5,2,1,5,5,1,2,4,2,4])

//Array(4) [1, 4, 5, 2]
``

``
R.uniq([
  { name: 'A' },
  { name: 'C' },
  { name: 'A' },
  { name: 'A' },
  { name: 'B' },
  { name: 'B' },
  { name: 'C' },
  { name: 'A' },
  { name: 'B' },
  { name: 'A' },
])

    
//Array(3) [ 
//  0: Object {name: "A"}
//  1: Object {name: "C"}
//  2: Object {name: "B"}
//]
``

### .prop

Pour chercher une clef dans un objet

``
pomme = Object {name: "Pomme", num: 5}

R.prop('name', pomme)
//"Pomme"

R.prop('num', pomme)
// 5
``

Si nous avons une liste d'objet et souhaitons extraire une clé de chaque élément:

``
fruits = ([
  {name: 'Pomme', num: 5},
  {name: 'Pêche', num: 3 },
  {name: 'Banane', num: 6}
])

``

Sans ramda:

``
fruits.map(fruit => fruit.name)

//Array(3) ["Pomme", "Pêche", "Banane"]
``

Avec R.prop:

``
fruits.map(R.prop('name'))

//Array(3) ["Pomme", "Pêche", "Banane"]
``

Toutes les fonctions ramda sont "curry". Pour faire court, cela signifie que plutôt qu'utiliser tous les arguments, nous pouvons n'en utiliser qu'un seul et une nouvelle fonction est retournée.

.prop prends deux arguments: le nom de la clé que nous souhaitons extraire ('name') et l'objet duquel nous souhaitons l'extraire (fruit).

En n'utilisant que le premier argument, nous pouvons créer une fonction qui retourne la valeur de la clé name de n'importe quel objet.

``
getName = R.prop('name')

//getName = ƒ(a)

getName({ name: 'X' })
// "X"
``

C'est ce que nous faisons dans l'exemple avec les fruits:
``
fruits.map(R.prop('name'))

//Array(3) ["Pomme", "Pêche", "Banane"]
``

qui revient à écrire:
``
fruits.map(getName)
// Array(3) ["Pomme", "Pêche", "Banane"]
``

Utiliser R.prop a deux avantages:
1. Nous écrivons moins de code
2. Nous n'avons pas besoin d'inventer les noms pour la fonction getName et pour l'objet fruit.

### .map, .filter, .find, .reduce et .join

Les méthodes sur une liste ont également leur version ramda.

Par exemple:
``
R.map(R.prop('name'), fruits)

//Array(3) ["Pomme", "Pêche", "Banane"]
``

est une autre manière d'écrire
``
fruits.map(d => d.name)

//Array(3) ["Pomme", "Pêche", "Banane"]
``

ou, comme plus haut
``
fruits.map(R.prop('name'))
``

Avec ramda, plutôt qu'appliquer la méthode .map directement sur la liste, celle-ci est passée comme dernier argument.
Comme toutes les fonctions ramda, celles-ci sont également "curry".

Par exemple, si nous avons une fonction getNames:
``
getNames = R.map(R.prop('name'))

//getNames = ƒ(a)
``

Nous pouvons lui passer une liste
``
getNames(fruits)

//Array(3) ["Pomme", "Pêche", "Banane"]
``

Si notre liste de fruits est le résultat d'une promesse (Promise), si par exemple, elle doit être téléchargée avec fetch, nous pouvons appliquer la fonction getNames directement dans la méthode .then:
``
Promise.resolve(fruits)
  .then(getNames)
  
//Array(3) ["Pomme", "Pêche", "Banane"]
``

Si nous avons une liste de listes dont nous souhaitons extraire les clés x
``
listeDeListes = [
  [{x: 1}, {x: 3}, {x: 7}],
  [{x: 2}, {x: 8}, {x: 10}]
]

listeDeListes.map(liste => liste.map(d => d.x))

OU

listeDeListes.map(R.map(R.prop('x')))

OU

R.map(R.map(R.prop('x')))(listeDeListes)

//Array(2) [
//  0: Array(3) [1, 3, 7]
//  1: Array(3) [2, 8, 10]
//]
``

Les autres fonctions ramda qui répliquent les méthodes sur une liste fonctionnent de la même manière:
``
fruits.filter(d => d.name.startsWith('P'))

=

R.filter(d => d.name.startsWith('P'), fruits)


fruits.find(d => d.name === 'Pomme')

=

R.find(d => d.name === 'Pomme', fruits)



fruits.map(d => d.name).join('---')

=

R.join('---', fruits.map(R.prop('name')))


fruits.map(d => d.num).reduce((sum, num) => sum + num, 0)

=

R.reduce((sum, num) => sum + num, 0, R.map(R.prop('num'), fruits))
``

### .sum

Avec .sum(), nous n'avons pas besoin d'utiliser .reduce pour calculer la somme d'une liste de chiffres. Pour avoir le même résultat que dans l'exemple ci-dessus, nous pouvons écrire:
``
R.sum(R.map(R.prop('num'), fruits))
// 14

R.sum([1, 6, 2, 8])
//17
``

### .propEq

Utile pour voir si une clé est égale à quelque chose.
``
R.propEq('name', 'Poire', { name: 'Pomme' })
// false
``

Cette fonction prends trois arguments:
1. Le nom de la clé (name)
2. La valeur de la clé (Pomme ou Poire)
3. Un objet ({name: 'Pomme'})

Si la valeur de la clé de l'objet corresponds à la valeur définie, la fonction retourne true, sinon false.

Nous pouvons l'utiliser à l'intérieur de la méthode .find par exemple:
``
fruits.find(R.propEq('name', 'Pomme'))

OU sans ramda

fruits.find(fruit => fruit.name === 'Pomme')

//Object {name: "Pomme", num: 5}
``

### .path

Pour sortir une partie d'un objet JSON en définissant le chemin à parcourir.

Imaginons un objet person:
``
person = ({
  type: 'person',
  personalData: {
    lastName: 'Machine',
    gender: 'F',
    address: {
      street: 'Chemin Bidule',
      city: {
        postcode: 1234,
        name: 'Truc-sur-Mer',
      }
    }
  }
})
``

Pour prender que les données personnelles:
``
R.path(['personalData'], person)

//Object {
//  lastName: "Machine"
//  gender: "F"
//  address: Object {street: "Chemin Bidule", city: Object}
//}
``

La ville dans l'addresse dans les données personnelles:
``
R.path(['personalData', 'address', 'city'], person)

//Object {postcode: 1234, name: "Truc-sur-Mer"}
``

### .pathOr

Remplacer une valeur si elle n'existe pas
``
R.pathOr('Yverdon', ['data', 'address', 'city', 'name'], person)
// Yverdon
``

### .pipe

Pour enchaîner les fonctions.

### .head
``
R.head([3, 2, 6, 1])
// 3
``

### .last
``
R.last([3, 2, 6, 1])
//1
``
