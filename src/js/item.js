(function(){
  var Item = function(options) {
    var item = this;
    item.type = "generic";
    item.amount = 1;

    if(options && options.hasOwnProperty("type")) {
      item.type = options.type || "generic";
    }
    if(options && options.hasOwnProperty("amount")) {
      item.amount = options.amount || 1;
    }

    return item;
  };

  if (typeof module !== 'undefined' &&
      typeof module.exports !== 'undefined') {
    module.exports = Item;
  } else {
    window.Item = Item;
  }
})();
