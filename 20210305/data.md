# Préparation des données JSON

Pour cet exercice, j'ai récupéré les données proposées: http://www.uvek-gis.admin.ch/BFE/ogd/52/Solarenergiepotenziale_Gemeinden_Daecher_und_Fassaden.json

En les observant, je me suis dit qu'il serait intéressant de voir le classement des cantons selon leur potentiel énergétique le plus défavorable (soit le scénario 2).

J'ai donc sorti uniquement les colonnes qui m'intéressaient, soit: le canton, la commune (pour garder un sens logique aux données) et le potentiel en GWh selon le scénario 2.
Je les ai aussi classé du plus grand au plus petit.

```
const resultat = data
    .map(d => ({Canton: d.Canton, Commune : d.MunicipalityName, Potentiel_GWh: d.Scenario2_RoofsOnly_PotentialSolarElectricity_GWh}))
    .sort((a, b) => a.GWh > b.GWh ? -1 : 1);
```

Et finalement j'ai exporté ces données dans un fichier data.json en convertissant le résultat en chaîne de caractères.
