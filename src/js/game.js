(function(){
  var Game = function(options) {
    var g = this;
    g.buildings = [];
    g.actions = [];
    g.time = 0;
    g.money = 9001;

    g.step = function () {
      g.time += 1;
      if(g.buildings.length > 0) {
        g.buildings.forEach(function(e, i, a){
          e.step(g.time);
        });
      }
      return g.time;
    };

    g.addBuilding = function(options) {
      options.game = this;

      switch(options.type) {
        case "warehouse":
          g.buildings.push(new Buildings.warehouse(options));
          break;
        case "conveyor":
          g.buildings.push(new Buildings.conveyor(options));
          break;
        case "ironBuyer":
          g.buildings.push(new Buildings.ironBuyer(options));
          break;
        case "ironSmelter":
          g.buildings.push(new Buildings.ironSmelter(options));
          break;
        default:
          g.buildings.push(new Building(options));
      }
      return g.buildings[g.buildings.length - 1];
    };



    g.setMoney = function(amount) {
      g.money += amount;
    };

    return g;
  };

  if (typeof module !== 'undefined' &&
      typeof module.exports !== 'undefined') {
    module.exports = Game;
  } else {
    window.Game = Game;
  }
})();
