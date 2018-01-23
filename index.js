var CoreModule = require('module');
var Shield = function() {
    var privateAllowed = [];
    var originals = {};
    originals.require = CoreModule.prototype.require;
    var localRequire = function(path) {
        var approved = privateAllowed.some(function(x) {
           var pattern = new RegExp(x);
           return pattern.test(path);
        });
        if(approved) {
            var required = originals.require(path);
            return required;
        }
        throw new Error(`Not allowed to require('${path}')`);
    };
    CoreModule.prototype.require = localRequire;
    return {
      get allowed() {
          return privateAllowed;
      },
      set allowed(value) {
        privateAllowed = value;
          
      },
      require: localRequire
    };
};

module.exports = function(allowed) {
    var result = new Shield();
    result.allowed = result.allowed.concat(allowed);
    return result;
};

