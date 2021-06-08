//top 5 des équipes qui ont le plus joué - bar chart horizontal
const DATA_start=[
    {"nom":"equipe1","valeur":0},
    {"nom":"equipe2","valeur":0},
    {"nom":"equipe3","valeur":0},
    {"nom":"equipe5","valeur":0},
    {"nom":"equipe6","valeur":0}
]
const DATA=[
    {"nom":"Free Agents","valeur":211},
    {"nom":"River Plate","valeur":35},
    {"nom":"Arsenal","valeur":33},
    {"nom":"Everton","valeur":33},
    {"nom":"Tottenham Hotspur","valeur":33},
]

var chart = bb.generate({
    bindto: "#graph3",
    title: {
        text: "Top 5 des équipes les plus jouées"
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
            label: "Nbr de joueurs FIFA21 jouant avec cette équipe",
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
        rotated: true
    },
    "legend": {
        "show": false
    },
    bar: {
        // padding: 1,
        radius: {
            ratio: 0.5
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