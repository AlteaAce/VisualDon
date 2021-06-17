//Les "meilleurs équipes": 3 équipes qui on le plus de "hits" - bar chart vertical en mode podium
const DATA_start=[
    {"team":"2ème FC Barcelona","hits":0},
    {"team":"1er Manchester United","hits":0},
    {"team":"3ème Borussia Dortmund","hits":0}
]
const DATA=[
    {"team":"2ème Manchester United","hits":1497},
    {"team":"1er FC Barcelona","hits":1688},
    {"team":"3ème Borussia Dortmund","hits":1256}
]

var chart = bb.generate({
    bindto: "#graph5",
    title: {
        text: "Les meilleurs équipes du jeu"
    },
    "data": {
        "json" : {
            Joueurs_FIFA21 : DATA_start.map(({hits}) => hits), 
            // Joueurs_FIFA21 : DATA.map(({team}) => team)
        },
        "type": "bar",
        
        // {
        //     colors: "#f00",
        //     right: true,
        //     // format: function (x){
        //     //     return DATA.map(({team}) => team) + d3.format('$')(x);
        //     // }
        // },
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
              },
              show: false
        },
        x: {
            tick:{
                count: 3
            },
            type: 'category',
            categories: DATA.map(({team}) => team),
            // show: false
        },
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
        Joueurs_FIFA21 : DATA.map(({hits}) => hits), 
    },
  });
}, 1000);