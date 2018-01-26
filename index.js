var CoreModule = require('module');
var Shield = function(spec) {
    var exceptions = [];
    var whitelist = spec.mode === 'white-list';
    var originals = {};
    originals.require = CoreModule.prototype.require;
    var localRequire = function(path) {
        var caught = exceptions.some(function(x) {
           var toRequirePattern = new RegExp(x.toRequire);
           var caughtToRequire = toRequirePattern.test(path);
           if(!x.fromModules || !caughtToRequire) {
               return caughtToRequire;
           }
           var fromModulesPattern = new RegExp(x.fromModules);
           var caughtFromModules = fromModulesPattern.test(this.filename);
           return caughtFromModules;
        });
        if(caught?whitelist:!whitelist) {
            var required = originals.require(path);
            return required;
        } else {
            throw new Error(`Mode: ${spec.mode}. '${this.filename}' attempted to require('${path}')`);
        }
    };
    CoreModule.prototype.require = localRequire;
    var except = function(toRequire, fromModules) {
        exceptions.push({
            toRequire: toRequire,
            fromModules: fromModules
        });
    };
    return {
      require: localRequire,
      except: except
    };
};

module.exports = function(spec) {
    var result = new Shield(spec);
    return result;
};

