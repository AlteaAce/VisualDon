# Exercice 3

## Comment fonctionnent les transitions en D3 et en svelte?

Dans D3, nous précisions que nous allons faire une transition avec ``.transition`` et ensuite nous pouvons modifier tous les attributs que l'on souhaite, comme: la taille, la couleur, la position, la durée de la transition, etc.

Mais D3 n'est pas forcément la manière la plus optimale pour faire des transitions animées. Pour cela on peut se tourner, par exemple, vers svelte. Svelte permet de faire, en beaucoup moins de lignes, le même type de transition. On y précise alors des variables réactive dans la déclaration de nos éléments en HTML.

Exemple:
```
<svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
  <g transform={`translate(${MARGIN / 2}, 0)`}>
    {#each DATA as d, i}
      <Baton d={d} i={i} key={key} />
    {/each}
  </g>
</svg>
```
