# VisualDon

##SVG
----------------------------
`<svg width="200" height="100">
  <rect x="0" y="0" width="100" height="100" fill="steelblue" />
  <circle cx="100" cy="50" r="40" fill="indianred" />
</svg>`
Le width et height dans la balise svg Défini les dimensions dans lesquelles on va travailler. (ce ne sont pas des pixels)

OU

`<svg viewBox="0 0 200 100"> -->
  <rect x="0" y="0" width="100" height="100" fill="steelblue" />
  <circle cx="100" cy="50" r="40" fill="indianred" />
</svg>`
ViewBox défini l'origine et aussi les dimensions, mais les formes prendront toute la place disponible contrairement à la première option.
