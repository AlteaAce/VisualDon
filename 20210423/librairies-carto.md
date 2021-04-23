# Ecercice 3

## Pourquoi doit-on projeter des données cartographiques?

Pour pouvoir montrer de manière plus claire ou plus résumé des données. Par exemple pour montrer le PIB par pays, il est plus facile et efficace de montrer ces informations sur une carte que sur un graphique en barre, le visionneur se repérera plus vite.

## Qu'est ce qu'Open street map?

C'est une carte (du genre Google Maps) qui est alimentée par des personnes lambdas et qui est open source.

## Quelles fonctions D3 sont spécifiques à la cartographie?

- geoPath()
- projection()
- gepMercator

## À quoi sert le format topojson? En quoi est-il différent du geojson?

Topojson permet de représenter des données géographiques de manière plus légère que geojson. C'est donc utile si notre jeu de données est trop gros et fait planter notre site/ordi.

## À quoi sert turf? Décrivez ce que font trois fonctions de cette libraire

- along: Prend un ou des points(selon ce qu'on paramètre) sur une ligne définie -> mettre un point tous les kilomètre sur notre trajet
- area: Retourne la superficie d'un polygone
- centerOfMass: Retourne le centre d'un polygone
