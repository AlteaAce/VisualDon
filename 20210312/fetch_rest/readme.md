# Exercice1
Utilisez
1. les resources posts et users de https://jsonplaceholder.typicode.com/
2. fetch pour télécharger les données
3. ramda pour créer une liste qui ressemble à ça:


```
[

  {
  
    nom_utilisateur: 'Machin',
    
    ville: 'Truc',
    
    nom_companie: 'Bidule',
    
    titres_posts: [
    
      'Titre 1',
      
      'Titre 2',
      
    ]
    
  },
  
  // ...
  
]
```

## Mise en place

```
npx degit idris-maps/heig-datavis-2021/modules/exercice_rest fetch_rest

cd fetch_rest

npm install
```

Commencez avec les utilisateurs. Il faut extraire le ``nom_utilisateur`` (username), la ville (address.city) et le nom_companie (company.name).

Après pour chaque utilisateur, allez chercher les titres_posts (les title dans la ressource posts).
