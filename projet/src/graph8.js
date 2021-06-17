const data_base = require('../data/graph8/data-graph8.json');

var chart = bb.generate({
    data: {
      columns: [
      ["Age", 17]
      ],
      type: "gauge", // for ESM specify as: gauge()
    },
    "legend": {
      "show": false
    },
    gauge: {
      label: {
        format: function (value, ratio) { return value + "\nans"; },
        // extents: function (value, isMax) { return (isMax ? "Max:" : "Min:") + value; }
      }
    },
    color: {
      pattern: [
        "#121563",
        // "#F97600",
        // "#F6C600",
        // "#60B044"
      ],
    //   threshold: {
    //     values: [
    //       30,
    //       60,
    //       90,
    //       100
    //     ]
    //   }
    },
    size: {
      height: 250
    },
    bindto: "#graph8",
    title: {
        text: "Âge moyen des utilisateurs"
    },
  });
  
  setTimeout(function() {
      chart.load({
          columns: [["Age", 43]]
      });
  }, 2000);
  
  setTimeout(function() {
      chart.load({
          columns: [["Age", 26]]
      });
  }, 4000);  