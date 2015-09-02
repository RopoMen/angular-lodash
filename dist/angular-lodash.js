/**
 * ropooy-angular-lodash - LoDash adapter for AngularJS.
 * @build time 2015-09-29 12:09
 * @author Markku Roponen <ropooy@gmail.com>
 * @version v1.0.0
 * @license MIT
 */
(function (angular, _) {
  'use strict';

  var ngDashModule = angular.module('ropooy-angular-rdash', []);
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

      this.$get = [function() {
          return {
            initFilters: initializeFilters,
            initUtils: initializeUtils,
            filterProvider: FilterProvider
          };
      }];
  })
  .factory('_', ['$window', function($window) {
    return $window._;
  }])
  .config(['ngDashConfigProvider', '$filterProvider', function(ngDashConfigProvider, $filterProvider) {
    /* keep reference to filter provider so we can register filters inside run block */
    ngDashConfigProvider._setFilterProvider($filterProvider);
  }])
  .run(['$rootScope', 'ngDashConfig', function($rootScope, ngDashConfig) {
    /* create filters */
    if(ngDashConfig.initFilters) {
      FilterMethodList = _.flatten(FilterMethodList);

      _.each(FilterMethodList, function(filterName) {
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
        var ScopeProto = _.isFunction(Object.getPrototypeOf) ? Object.getPrototypeOf($rootScope) : $rootScope;
        //bind methods to Scope prototype or $rootScope if getPrototypeOf is not defined.
        ScopeProto[methodName] = _.bind(_[methodName], _);
      });
    }
  }]);

}(angular, _));
