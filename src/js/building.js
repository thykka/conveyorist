(function(){
  var Building = function (options) {
    var b = this;
    b.game = options.game || Game;
    b.type = options.type || "generic";
    b.input = new Input(options);
    b.output = new Output(options);
    b.step = options.step || function(t) {};
    b.connectedFrom = options.connectedFrom || null;
    b.connectedTo = options.connectedTo || null;
    b.uid = Array(10).fill(0).map(function(){
      return String.fromCharCode(Math.random() * 26 + 97 >> 0);
    }).join("");

    b.connectFrom = function(building) {
      b.connectedFrom = building;
      return b;
    };
    b.connectTo = function(building) {
      b.connectedTo = building;
      return b;
    };
    b.connect = function(from, to) {
      b.connectFrom(from);
      b.connectTo(to);
      return b;
    };

    b.transferItem = function(item, from, to) {
      if(from.items.length > 0 &&
         to.getEmptyVolume() > 0) {
        itemType = item.type;
        itemsThrough = Math.min(
          from.getItem(itemType).amount,
          to.maxVolume
        );
        tempItem = new Item({
          type: itemType,
          amount: itemsThrough
        });
        to.addItem(tempItem);
        from.removeItem(tempItem);
      }
    };

    return b;
  };

  var Buildings = {};

  Buildings.conveyor = function(options) {
    options = options || {};
    options.type = "conveyor";
    options.maxInputVolume = options.maxInputVolume || 4;
    options.maxOutputVolume = options.maxOutputVolume || 4;

    options.step = function(time) {
      var itemType, itemsThroughput, tempItem;

      // move conveyor's output items to connected building's input
      if(this.output.items.length > 0 &&
         this.connectedTo.input.getEmptyVolume() > 0) {
        this.transferItem(this.output.items[0], this.output, this.connectedTo.input);
      }

      // transfer conveyor's input items to it's output
      if(this.input.items.length > 0 &&
         this.output.getEmptyVolume() > 0) {
        this.transferItem(this.input.items[0], this.input, this.output);
      }

      // move connected building's output items to conveyor's input
      if(this.connectedFrom.output.items.length > 0 &&
         this.input.getEmptyVolume() > 0) {
        this.transferItem(this.connectedFrom.output.items[0], this.connectedFrom.output, this.input);
      }
    };
    var b = new Building(options);
    return b;
  };

  Buildings.warehouse = function(options) {
    options.type = "warehouse";
    options.maxInputVolume = options.maxInputVolume || 9000;
    options.maxOutputVolume = options.maxOutputVolume || 8;

    var b = new Building(options);
    return b;
  };

  Buildings.ironBuyer = function(options) {
    options.type = "ironBuyer";
    options.maxInputVolume = options.maxInputVolume || 2;
    options.maxOutputVolume = options.maxOutputVolume || 8;
    var moneyNeeded = options.moneyNeeded || 1;
    var outputProduced = options.outputProduced || 2;

    options.step = function(time) {
      if(this.input.items.length > 0 &&
         this.output.getEmptyVolume() > 0) {
        this.transferItem(this.input.items[0], this.input, this.output);
      }

      var canBuild = true;
      if(this.game.money < moneyNeeded ) { canBuild = false; }
      if(this.input.getEmptyVolume() < outputProduced){ canBuild = false; }
      if(canBuild){
        this.game.setMoney(-moneyNeeded);
        this.input.addItem(new Item({
          type: "ironOre",
          amount: outputProduced
        }));
      }
    };

    var b = new Building(options);
    return b;
  };

  Buildings.ironSmelter = function(options) {
    options.type = "ironSmelter";
    options.maxInputVolume = options.maxInputVolume || 16;
    options.maxOutputVolume = options.maxOutputVolume || 8;
    var inputNeeded = options.inputNeeded || 2;
    var outputProduced = options.outputProduced || 1;

    options.step = function(time) {
      var canBuild = true;
      if(!this.input.getItem("ironOre")){
        canBuild = false;
      } else if(this.input.getItem("ironOre").amount < inputNeeded){
        canBuild = false;
      } else if(this.output.getEmptyVolume() < outputProduced){
        canBuild = false;
      }

      if(canBuild) {
        this.input.removeItem(new Item({
          type: "ironOre", amount: inputNeeded }));
        this.output.addItem(new Item({
          type: "ironIngot", amount: outputProduced }));
      }
    };
    var b = new Building(options);
    return b;
  };

  if (typeof module !== 'undefined' &&
      typeof module.exports !== 'undefined') {
    module.exports = Building;
    module.exports = Buildings;
  } else {
    window.Building = Building;
    window.Buildings = Buildings;
  }
})();
