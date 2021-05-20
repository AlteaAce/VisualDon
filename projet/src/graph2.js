const DATA=[
    {"nom":"England","valeur":1496},
    {"nom":"Germany","valeur":1138},
    {"nom":"Spain","valeur":1055},
    {"nom":"Argentina","valeur":970},
    {"nom":"France","valeur":948}
]

  bb.generate({
    title: {
        text: "Les 5 pays les plus représentés sur FIFA21"
    },
    bindto: "#graph2",
    size: {
        // width: 500,
        heigth: 200
    },
    data: {
      json: {
          Joueurs_FIFA21 : DATA.map(({valeur}) => valeur),
      },
      type: 'bar',
      labels: {
        colors: "#121563",
        right: true
      },
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
    axis: {
        y: {
            label: "Nbr de joueurs FIFA21"
        },
        x: {
            type: 'category',
            categories: DATA.map(({nom}) => nom),
        },
        rotated: true
    },
    legend:{
      show: false
    },
    color:{
        pattern: ["#121563"]
    },
})