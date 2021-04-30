# Exemple wikipédia

https://fr.wikipedia.org/wiki/Canton_(Suisse)#Donn%C3%A9es_cantonales

1. Dans la console, répérer le `<tbody>` qui englobe tout ce que l'on souhaite avoir. Faire un clic droite et ouvrire dans la console. On est alors log en tant que `temp0`.
2. Toujours dans la console, on défini notre variable:
``
var cl = (el, tag) => Array.from(el.getElementsByTagName(tag))
``
3. Petite fonction cl pour récupérer tous les sous éléments de la table:
``

cl(temp0, 'tr')
  .map(tr => {
    var th = cl(tr, 'th')
    var td = cl(tr, 'td')

    return {
      abbrev: th[0].textContent.trim(),
      page: td[0].getElementsByTagName('a')[0].getAttribute('href'),
      nom: td[0].getElementsByTagName('a')[0].textContent,
    }
  })
  ``
  
  # Exercice 1
  
  J'ai décider de récupérer les données en manipulant le DOM dans la console du navigateur. Cette solution est la plus simple à mettre en oeuvre pour moi. De plus toutes les données sont présente dans le HTML de la page, donc c'est l'idéal.
  
  ## 1. définir la variable de récupération
  
  var cl = (el, tagClass) => Array.from(el.GetElementByClassName(tagClass))
  
  ## 2. récupérer les titres
  
  ``
  cl(temp0, 'thumbnail')
.map (thumbnail => {
var caption = cl(thumbnail, 'caption')
var rating = cl(thumbnail, 'ratings')

return{
produit: caption[0].getElementsByTagName('a')[0].getAttribute('title')
}
})
``

## 3. récuprer les prix

``
cl(temp0, 'thumbnail')
.map (thumbnail => {
var caption = cl(thumbnail, 'caption')
var rating = cl(thumbnail, 'ratings')

return{
produit: caption[0].getElementsByTagName('a')[0].getAttribute('title'),
prix: caption[0].getElementsByTagName('h4')[0].textContent
}
})
``

## 4. récupérer les ratings

``
cl(temp0, 'thumbnail')
.map (thumbnail => {
var caption = cl(thumbnail, 'caption')
var rating = cl(thumbnail, 'ratings')

return{
produit: caption[0].getElementsByTagName('a')[0].getAttribute('title'),
prix: caption[0].getElementsByTagName('h4')[0].textContent,
etoiles: rating[0].getElementsByTagName('p')[1].getAttribute('data-rating'),
}
})
``

Et voilà plus qu'à transformer en tableau JSON:

``
JSON.stringify(
  cl(temp0, 'thumbnail')
    .map (thumbnail => {
      var caption = cl(thumbnail, 'caption')
      var rating = cl(thumbnail, 'ratings')

      return{
        produit: caption[0].getElementsByTagName('a')[0].getAttribute('title'),
        prix: caption[0].getElementsByTagName('h4')[0].textContent,
        etoiles: rating[0].getElementsByTagName('p')[1].getAttribute('data-rating'),
      }
    }))
``
