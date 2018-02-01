var CoreModule = require('module');
var Shield = function(spec) {
    var exceptions = [];
    var cache = new Map();
    var whitelist = spec.mode === 'white-list';
    var originals = {};
    originals.require = CoreModule.prototype.require;
    originals.load = CoreModule.prototype.constructor._load;
    var isAllowed = function(path, module) {
        var cached = cache.has(path);
        if(cached) return cache.get(path);
        var caught = exceptions.some(function(x) {
           var toRequirePattern = new RegExp(x.toRequire);
           var caughtToRequire = toRequirePattern.test(path);
           if(!x.fromModules || !caughtToRequire) {
               return caughtToRequire;
           }
           var fromModulesPattern = new RegExp(x.fromModules);
           var caughtFromModules = fromModulesPattern.test(module.filename);
           return caughtFromModules;
        });
        var allowed = caught?whitelist:!whitelist;
        cache.set(path, allowed);
        return allowed;
    };
    var localLoad = function(path, parent, isMain) {
        var allowed = isAllowed(path);
        if(allowed) {
            return originals.load(path, parent, isMain);
        } else {
            // TODO: The module object is wrong here 
            throw new Error(`Mode: ${spec.mode}. '${module.filename}' attempted to load('${path}')`);
        }
    };
    var localRequire = function(path) {
        var module = this;
        var allowed = isAllowed(path, module);
        if(allowed) {
            var required = originals.require(path);
            return required;
        } else {
            throw new Error(`Mode: ${spec.mode}. '${module.filename}' attempted to require('${path}')`);
        }
    };
    CoreModule.prototype.require = localRequire;
    CoreModule.prototype.constructor._load = localLoad;
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

