const DATA_start=[
    {"nom":"England","valeur":0},
    {"nom":"Germany","valeur":0},
    {"nom":"Spain","valeur":0},
    {"nom":"Argentina","valeur":0},
    {"nom":"France","valeur":0}
]
const DATA=[
    {"nom":"England","valeur":1496},
    {"nom":"Germany","valeur":1138},
    {"nom":"Spain","valeur":1055},
    {"nom":"Argentina","valeur":970},
    {"nom":"France","valeur":948}
]
// //Joueurs_FIFA21 : DATA.map(({valeur}) => valeur),  

//   bb.generate({
//     title: {
//         text: "Les 5 pays les plus représentés sur FIFA21"
//     },
//     bindto: "#graph2",
//     size: {
//         // width: 500,
//         heigth: 200
//     },
//     data: {
//         "columns": [
//             ["data1", 0],
//             ["data2", 0]
//         ],
//       type: 'bar',
//       labels: {
//         colors: "#121563",
//         right: true
//       },
//     },
//     bar: {
//         // padding: 1,
//         radius: {
//             ratio: 0.5
//         },
//         width: {
//             ratio: 0.7,
//             max: 80
//         }
//     },
//     axis: {
//         y: {
//             label: "Nbr de joueurs FIFA21"
//         },
//         x: {
            // type: 'category',
            // categories: DATA.map(({nom}) => nom),
//         },
//         rotated: true
//     },
//     legend:{
//       show: false
//     },
//     color:{
//         pattern: ["#121563"]
//     },
// });

// setTimeout(() => {
//     chart.load({
//           json:  {
//             Joueurs_FIFA21 : DATA.map(({valeur}) => valeur),  
//           }
//     });
//   }, 1000);


var chart = bb.generate({
    bindto: "#graph2",
    title: {
        text: "Les 5 pays les plus représentés sur FIFA21"
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
            label: "Nbr de joueurs FIFA21",
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