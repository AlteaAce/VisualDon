# VisualDon

## SVG
----------------------------
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
