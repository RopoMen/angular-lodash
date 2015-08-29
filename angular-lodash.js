(function (angular, _) {
  'use strict';

  var ngDashModule = angular.module('ropooy-angular-lodash', []);
  var FilterMethodList = [
    // Arrays
    'compact',
    'difference',
    ['rest', 'drop', 'tail'],
    //'findIndex',
    //'findLastIndex',
    ['first', 'head', 'take'],
    'flatten',
    //'indexOf',
    'initial',
    'intersection',
    'last',
    'lastIndexOf',
    //'pull',
    //'range',
    //'remove',
    'sortedIndex',
    //['tail', 'rest'],
    'union',
    ['uniq', 'unique'],
    'without',
    'xor',
    ['zip', 'unzip'],
    //['zipObject', 'object'],

    //Chaining, none
    //'_',
    //'chain',
    //'tap',

    //Collections
    'at',
    //['contains', 'include'],
    'countBy',
    //['every', 'all'],
    ['find', 'detect', 'findWhere'],
    ['filter', 'select'],
    'findLast',
    //['forEach', 'each'],
    //['forEachRight', 'eachRight'],
    'groupBy',
    'indexBy',
    'invoke',
    ['map', 'collect'],
    'max',
    'min',
    'pluck',
    //['reduce', 'foldl', 'inject'],
    //['reduceRight', 'foldr'],
    'reject',
    //'sample',
    'shuffle',
    //'size',
    //['some', 'any'],
    'sortBy',
    'toArray',
    'where',

    //Functions, none
    //'after',
    //'bind',
    //'bindAll',
    //'bindKey',
    //'compose',
    //'curry',
    //'debounce',
    //'defer',
    //'delay',
    //'memoize',
    //'once',
    //'partial',
    //'partialRight',
    //'throttle',
    //'wrap',

    //Objects
    //['assign', 'extend'],
    //'clone',
    //'cloneDeep',
    //'create',
    //'defaults',
    //'findKey',
    //'findLastKey',
    //'forIn'
    //'forInRight',
    //'forOwn',
    ['functions', 'methods'],
    //'has',
    'invert',
    //'isArguments',
    //'isArray',
    //'isBoolean',
    //'isDate',
    //'isElement',
    //'isEmpty',
    //'isEqual',
    //'isFinite',
    //'isFunction',
    //'isNaN',
    //'isNull',
    //'isNumber',
    //'isObject',
    //'isPlainObject',
    //'isRegExp',
    //'isString',
    //'isUndefined',
    'keys',
    'mapValues',
    //'merge',
    'omit',
    'pairs',
    'pick',
    //'transform',
    'values',

    //Utilities
    //'now',
    //'constant',
    //'createCallback',
    'escape',
    //'identity',
    //'mixin',
    //'noConflict',
    //'noop',
    'parseInt',
    //'property',
    //'random',
    'result',
    //'runInContext',
    //'template',
    //'times'
    'unescape',
    'uniqueId'
  ];

  var UtilMethodList = null;

  /*** begin custom _ ***/

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
  angular.injector(['ng']).invoke(['$filter', function($filter) {
    _.filter = _.select = _.wrap($filter('filter'), function(filter, obj, exp) {
      if(!_.isArray(obj)) {
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

  /*** end custom _ ***/

  ngDashModule.provider('ngDashConfig', function() {
      var initializeFilters = true;
      var initializeUtils = true;
      var FilterProvider = {};
      var ServiceProvider = {};

      /* do not initialize filters that are defined in FilterMethodList */
      this.noFilters = function() {
        initializeFilters = false;
      };

      /* do not initialize utils that are defined in UtilMethodList */
      this.noUtils = function() {
        initializeUtils = false;
      };

      /* set whole filter method list, expecting filters to be an array */
      this.setFilters = function(filters) {
        FilterMethodList = filters;
      };

      /* add filters that you like to extend the FilterMethodList */
      this.addFilters = function(filters) {
        FilterMethodList = _.union(_.flatten(FilterMethodList), filters);
      };

      /* remove filters that you like to be removed from FilterMethodList */
      this.removeFilters = function(filters) {
        FilterMethodList = _.difference(_.flatten(FilterMethodList), filters);
      };

      /* set whole util method list, expectin utils to be an array, if no list is given all methods in _ will be used */
      this.setUtils = function(utils) {
        UtilMethodList = utils;
      };

      /* private */
      this._setFilterProvider = function(provider) {
        FilterProvider = provider;
      };

      this._setServiceProvider = function(provider) {
        ServiceProvider = provider;
      };

      this.$get = [function() {
          return {
            initFilters: initializeFilters,
            initUtils: initializeUtils,
            filterProvider: FilterProvider,
            serviceProvider: ServiceProvider
          };
      }];
  })
  .config(['ngDashConfigProvider', '$filterProvider', '$provide', function(ngDashConfigProvider, $filterProvider, $provide) {
    /* keep reference to filter provider so we can register filters inside run block */
    ngDashConfigProvider._setFilterProvider($filterProvider);

    /* keep reference to service provider so we can register _ service inside run block, IF no one has registered it before */
    ngDashConfigProvider._setServiceProvider($provide);
  }])
  .run(['$rootScope', '$injector', '$window', '$log', 'ngDashConfig', function($rootScope, $injector, $window, $log, ngDashConfig) {
    /* create service, but do not override existing! */
    if($injector.has('_')) {
      $log.error('ropooy-angular-lodash:: service "_" is already registered, please remove your own if you want to use it from here.');
    }
    else {
      ngDashConfig.serviceProvider.constant('_', $window._);
    }

    var _logMissingMethod = function(action, method) {
      $log.warn('ropooy-angular-lodash:: ' + action + ' registeration, _.' + method + ' is not a function. Cannot register it as ' + action + '!');
    };

    /* create filters */
    if(ngDashConfig.initFilters) {
      FilterMethodList = _.flatten(FilterMethodList);

      _.each(FilterMethodList, function(filterName) {
        if(!_.isFunction(_[filterName])) {
          _logMissingMethod('$filter', filterName);
          return;
        }

        ngDashConfig.filterProvider.register(filterName, function() {
          return _[filterName];
        });
      });
    }

    /* create utils */
    if(ngDashConfig.initUtils) {
      if(_.isNull(UtilMethodList)) {
        UtilMethodList = _.methods(_);
      }

      _.each(UtilMethodList, function(methodName) {
        if(!_.isFunction(_[methodName])) {
          _logMissingMethod('util', methodName);
          return;
        }

        var ScopeProto = _.isFunction(Object.getPrototypeOf) ? Object.getPrototypeOf($rootScope) : $rootScope;
        //bind methods to Scope prototype or $rootScope if getPrototypeOf is not defined.
        ScopeProto[methodName] = _.bind(_[methodName], _);
      });
    }
  }]);

}(angular, _));
