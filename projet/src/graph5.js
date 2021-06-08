//Les "meilleurs équipes": 3 équipes qui on le plus de "hits" - bar chart vertical en mode podium
const DATA_start=[
    {"nom":"equipe1","valeur":0},
    {"nom":"equipe2","valeur":0},
    {"nom":"equipe3","valeur":0},
]
const DATA=[
    {"nom":"equipe1","valeur":0},
    {"nom":"equipe2","valeur":0},
    {"nom":"equipe3","valeur":0},
]

var chart = bb.generate({
    bindto: "#graph5",
    title: {
        text: "Les meilleurs équipes du jeu"
    },
    "data": {
        "json" : {
            Joueurs_FIFA21 : DATA_start.map(({valeur}) => valeur), 
        },
        "type": "bar",
        labels: {
            colors: "#121563",
            right: true
        },
    },
    color: {
        pattern: ['#121563'],
        onover: ['#fe4543'],
    },
    axis: {
        y: {
            tick: {
                show: false,
                text: {
                  show: false
                }
              }
        },
        x: {
            type: 'category',
            categories: DATA.map(({nom}) => nom),
        },
    },
    "legend": {
        "show": false
    },
    bar: {
        // padding: 1,
        radius: {
            // ratio: 0.5
        },
        width: {
            ratio: 0.7,
            max: 80
        }
    },
    
});

setTimeout(() => {
  chart.load({
    "json" : {
        Joueurs_FIFA21 : DATA.map(({valeur}) => valeur), 
    },
  });
}, 1000);