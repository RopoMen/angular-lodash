(function (ng, _) {
  'use strict';

  var lodashModule = ng.module('ropooy-angular-lodash', ['ropooy-angular-lodash/service']),
    utilsModule = ng.module('ropooy-angular-lodash/utils', []),
    filtersModule = ng.module('ropooy-angular-lodash/filters', []),
    diModule = ng.module('ropooy-angular-lodash/service', []);

  // begin custom _

  function propGetterFactory(prop) {
    return function(obj) {return obj[prop];};
  }

  _._ = _;

  // Shiv "min", "max" ,"sortedIndex" to accept property predicate.
  _.each(['min', 'max', 'sortedIndex'], function(fnName) {
    _[fnName] = _.wrap(_[fnName], function(fn) {
      var args = _.toArray(arguments).slice(1);

      if(_.isString(args[2])) {
        // for "sortedIndex", transmuting str to property getter
        args[2] = propGetterFactory(args[2]);
      }
      else if(_.isString(args[1])) {
        // for "min" or "max", transmuting str to property getter
        args[1] = propGetterFactory(args[1]);
      }

      return fn.apply(_, args);
    });
  });

  // Shiv "filter", "reject" to angular's built-in,
  // and reserve lodash's feature(works on obj).
  ng.injector(['ng']).invoke(['$filter', function($filter) {
    _.filter = _.select = _.wrap($filter('filter'), function(filter, obj, exp) {
      if(!(_.isArray(obj))) {
        obj = _.toArray(obj);
      }

      return filter(obj, exp);
    });

    _.reject = function(obj, exp) {
      // use angular built-in negated predicate
      if(_.isString(exp)) {
        return _.filter(obj, '!' + exp);
      }

      var diff = _.bind(_.difference, _, obj);

      return diff(_.filter(obj, exp));
    };
  }]);

  // end custom _

  // begin ropooy-angular-lodash/service
  diModule.factory('_', ['$window', function($window) {
    return $window._;
  }]);
  // end ropooy-angular-lodash/service


  // begin register ropooy-angular-lodash/utils
  _.each(_.methods(_), function(methodName) {
    function register($rootScope) {
      var ScopeProto = _.isFunction(Object.getPrototypeOf) ? Object.getPrototypeOf($rootScope) : $rootScope;
      //bind methods to Scope prototype or $rootScope if getPrototypeOf is not defined.
      ScopeProto[methodName] = _.bind(_[methodName], _);
    }

    _.each([
      lodashModule,
      utilsModule,
      ng.module('ropooy-angular-lodash/utils/' + methodName, [])
      ], function(module) {
        module.run(['$rootScope', register]);
    });
  });

  // end register ropooy-angular-lodash/utils


  // begin register ropooy-angular-lodash/filters

  var filterList = [
      // Arrays
      'compact',
      'difference',
      ['rest', 'drop', 'tail'],
      ['first', 'head', 'take'],
      'flatten',
      'initial',
      'intersection',
      'last',
      'lastIndexOf',
      'union',
      ['uniq', 'unique'],
      ['zip', 'unzip'],
      'without',
      'xor',

      //Chaining, none

      //Collections
      'at',
      ['map', 'collect'],
      'countBy',
      ['find', 'detect', 'findWhere'],
      ['filter', 'select'],
      'findLast',
      'groupBy',
      'indexBy',
      'invoke',
      'max',
      'min',
      'pluck',
      'reject',
      'shuffle',
      'sortBy',
      'toArray',
      'where',

      //Functions, none

      //Objects
      ['functions', 'methods'],
      'invert',
      'keys',
      'mapValues',
      'omit',
      'pairs',
      'pick',
      'values',

      //Utilities
      'escape',
      'parseInt',
      'result',
      'unescape',
      'uniqueId'
    ];

  _.each(filterList, function(filterNames) {
    if(!(_.isArray(filterNames))) {
      filterNames = [filterNames];
    }

    var filter = _.bind(_[filterNames[0]], _),
      filterFactory = function() {return filter;};

    _.each(filterNames, function(filterName) {
      _.each([
        lodashModule,
        filtersModule,
        ng.module('ropooy-angular-lodash/filters/' + filterName, [])
        ], function(module) {
          module.filter(filterName, filterFactory);
      });
    });
  });

  // end register ropooy-angular-lodash/filters

}(angular, _));
