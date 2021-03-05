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

`fruits.map(d => d.name).join('----')` => Pomme----Pêche----Banane
