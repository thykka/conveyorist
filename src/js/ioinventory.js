(function(){
  var IOInventory = function(options) {
    var io = this;

    io.maxVolume = 10;

    io.items = (options.hasOwnProperty("items")) ?
      options.items : [];

    io.addItem = function (item) {
      var itemIndex = io.itemIndex(item.type);
      item.amount = Math.min(io.getEmptyVolume(), item.amount);
      io.items.push(item);
      io.compressItems();
      return item.amount;
    };

    io.removeItem = function(item) {
      // returns amount of removed items if successful
      // false if not successful
      var itemIndex = io.itemIndex(item.type);
      if(itemIndex === false) {
        return false;
      } else {
        var removeAmount = Math.min(item.amount, io.items[itemIndex].amount);
        io.items[itemIndex].amount -= removeAmount;
        if(io.items[itemIndex].amount === 0) {
          io.items.splice(itemIndex, 1);
        } else if (io.items[itemIndex].amount < 0) {
          console.warn("removed more items than avail");
        }
        return removeAmount;
      }
    };

    io.itemIndex = function (itemType) {
      var itemIndex = io.items.map(function(e) {
        return e.type;
      }).indexOf(itemType);

      return itemIndex >= 0 ? itemIndex : false;
    };

    io.getItem = function (itemType) {
      var index = io.itemIndex(itemType);
      if(index >= 0) {
        return io.items[index];
      } else {
        return false;
      }
    };

    io.compressItems = function() {
      var items = io.items;
      var newItems = {};
      var newItemsArray = [];

      items.forEach(function(i) {
        if(newItems.hasOwnProperty(i.type)) {
          newItems[i.type].amount += i.amount;
        } else {
          newItems[i.type] = i;
        }
      });

      for(var each in newItems) {
        newItemsArray.push(newItems[each]);
      }

      io.items = newItemsArray;
      return items;
    };

    io.getEmptyVolume = function() {
      return io.maxVolume - io.getVolumeFilled();
    };

    io.getVolumeFilled = function() {
      var vol = 0;
      io.items.forEach(function(e) {
        if(e.amount > 0) {
          vol += e.amount;
        }
      });
      return vol;
    };

    return io;
  };

  var Input = function(options) {
    var input = new IOInventory(options);
    if(options.maxInputVolume >= 0) {
      input.maxVolume = options.maxInputVolume;
    }
    return input;
  };

  var Output = function(options) {
    var output = new IOInventory(options);
    if(options.maxOutputVolume >= 0) {
      output.maxVolume = options.maxOutputVolume;
    }
    return output;
  };

  if (typeof module !== 'undefined' &&
      typeof module.exports !== 'undefined') {
    module.exports = IOInventory;
    module.exports = Input;
    module.exports = Output;
  } else {
    window.IOInventory = IOInventory;
    window.Input = Input;
    window.Output = Output;
  }
})();
