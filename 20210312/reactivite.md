# Exercice 1

## Décrivez ce qu'est la programmation réactivité?

Comme dans excel, il est possible de rendre notre code réactif. C'est à dire qu'il se met à jour à chaque fois qu'un données change.

----------

## Comment l'utiliser en javascript?

Javascript n'est pas à proprement parlé "réactif", le code s'exécute dans un ordre. Mais il est possible, grâce aux fonctions de "simuler" une réaction. Ce qui signifie, par exemple, qu'à chaque fois qu'une valeur dans un input change, nous allons appeler une fonctions qui refera le traitement.

----------

## Quelle est l'alternative?

La nouvelle version de Svvelte est une alternative qui permet de spécifier le code à exécuter si la données est changée. Et non pas d'écouter un évènement et ensuite de lui dire quoi faire.

```
<button on:click={handleClick}>
  Clicks: {count}
</button>
```

Devient

```
if(changed.count){
  text.data = "Clicks: ${current.count}";
}
```
