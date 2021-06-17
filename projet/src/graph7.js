var chart = bb.generate({
    data: {
        columns: [
            ["Femmes", 0],
            ["Hommes", 0],
            ["Autres", 0]
        ],
        type: "donut", // for ESM specify as: donut()
        colors: {
            Femmes: "#fe4543",
            Hommes: "#121563",
            Autres: "#057F0C"
        },
    },
    donut: {
      title: "Répartition des genres"
    },
    bindto: "#graph7"
  });
  
  setTimeout(function() {
      chart.load({
          columns: [
            ["Femmes", 44],
            ["Hommes", 51],
            ["Autres", 5]
          ]
      });
  }, 1500);
  
//pas trouvé de data par rapport au genre