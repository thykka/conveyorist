(function() {
  "use strict";
  document.addEventListener("DOMContentLoaded", init);

  function init() {

    var g = new Game({});

    var warehouse = g.addBuilding({
      type: "warehouse",
      maxInputVolume: 9001
    });

    var buyer = g.addBuilding({type:"ironBuyer"});
    var smelter = g.addBuilding({type:"ironSmelter"});
    var buyerConveyor = g.addBuilding({ type:"conveyor" });
    var smelterConveyor = g.addBuilding({ type: "conveyor" });
    var warehouseConveyor = g.addBuilding({ type: "conveyor" });
    console.log(smelter.input.addItem(new Item({type:"ironOre", amount: 9})));
    console.log(smelter.input.removeItem(new Item({type:"ironOre", amount: 5})));

    buyerConveyor.connect(buyer, smelterConveyor);
    smelterConveyor.connect(buyerConveyor, smelter);
    warehouseConveyor.connect(smelter, warehouse);

    g.buildings[0].input.addItem(new Item({type:"ironOre",amount: 20000}));

    for(var i = 0; i < 50; i++) {
      console.log("%c"+g.buildings.map(function(e) {
        return e.input.items.length>0 ? "in " + e.type + "(" + e.uid.substr(-4) + "): " + e.input.items.map(function(ee){
          return ee.type + " " + ee.amount;
        }).join(", ") : "";
      }).filter(function(i){return i !== "";}).join("\n"), "color: blue;");
      console.log("%c"+g.buildings.map(function(e) {
        return e.output.items.length>0 ? "out " + e.type + "(" + e.uid.substr(-4) + "): " + e.output.items.map(function(ee){
          return ee.type + " " + ee.amount;
        }).join(", ") : "";
      }).filter(function(i){return i !== "";}).join("\n"), "color: red;");
      g.step();
    }
  }

})();
