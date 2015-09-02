# An AngularJS module adapting LoDash

A fork of [angular-lodash](https://github.com/cabrel/angular-lodash) which is a fork of [angular-underscore](https://github.com/floydsoft/angular-underscore)

This module exposes LoDash API into AngularJS app's $scope, which is then available in view templates. It also provides LoDash methods as $filters and `_` as DI service.

```
WARNING: This is not a drop-in replacement for the original 'angular-lodash' anymore!!
See release history at the bottom of the page.
```

#### Why make another fork?
> I want to keep this wrapper _up_to_date_ and also be more active to posted issues and PR's.

#### Installation
```bash
bower install ropooy-angular-rdash --save-dev
```

#### Load the whole library and configure it as you like!

```javascript
angular.module('app', ['ropooy-angular-rdash'])
.config(['ngDashConfigProvider', function(ngDashConfigProvider) {
  // do not load / register filters
  ngDashConfigProvider.noFilters();

  // do not load all LoDash methods as utility, just load what you need.
  ngDashConfigProvider.setUtils(['isEmpty', 'isNull', 'range']);
}]);
```

### Launch example
Project has a small example that you can use to play with the module. Just copy-paste this to bash. ( server will run in http://localhost:8080 )
```bash
npm install && npm run example
```

### Configuration
As mentioned above this is not a drop-in replacement for original `angular-lodash` anymore, but this can be configured to work just like it does (and more). Configuration is done through `ngDashConfigProvider`.

#### `noFilters()`
If you don't like to use any LoDash method as filter just call this method.
```js
ngDashConfigProvider.noFilters();
```

#### `setFilters(array)`
Replace default filter methods with your own list.
```js
ngDashConfigProvider.setFilters(['escape', 'max']);
```

#### `addFilters(array)`
If default filter list is not enough for your app, then just add missing filters.
```js
ngDashConfigProvider.addFilters(['forEach', 'indexOf']);
```

#### `removeFilters(array)`
If default filter list is almost what you need, you can just remove some.
```js
ngDashConfigProvider.removeFilters(['max', 'min']);
```

#### `registerCustomFilter(string, function)`
Register custom LoDash mixin and register it as $filter.
```js
ngDashConfigProvider.registerCustomFilter('customUniq', function(arr) {
  return this.uniq(this.filter(arr, function(n) {
    return n <= 5;
  }));
});
```

#### `noUtils()`
If you don't like to add LoDash methods available through `$scope` just call this method.
```js
ngDashConfigProvider.noUtils();
```

#### `setUtils(array)`
If you don't want to bind all LoDash methods in to `$scope`, just add what you need.
```js
ngDashConfigProvider.setUtils(['isEmpty', 'isNull', 'isArray', 'range']);
```

### Use cases
Default stuff for these examples.
```html
<script type="text/javascript">
  angular.module('myApp', ['ropooy-angular-rdash'])
  .config(function(ngDashConfigProvider) {
    ngDashConfigProvider.registerCustomFilter('customUniq', function(arr) {
      return this.uniq(this.filter(arr, function(n) {
        return n <= 5;
      }));
    });
  })
  .controller('MyCtrl', function($scope, _) {
    $scope.cats = [];
    $scope.users = [{ 'user': 'barney', 'age': 36 },
                    { 'user': 'fred',   'age': 40 }];

    //For example 2
    $scope.getUserNames = function() {
      return $scope.pluck($scope.users, 'user');
    };

    //For example 3
    // Why? because '_'.length < '$scope'.length
    // and I hate to use globals inside AngularJS controllers / directives / etc.
    $scope.getNames = function() {
      return _.pluck($scope.users, 'user');
    };
  });
</script>
```

#### 1. Use as filters
LoDash methods listed in 'FilterMethodList' array can be used as [AngularJS filter](https://docs.angularjs.org/guide/filter)
```html
<body ng-app="myApp">
  <div ng-controller="MyCtrl">
    <!-- output unique numbers from input.. [1, 2, 3, 4, 5, 6, 7, 8] -->
    <div ng-repeat="num in [1,1,2,3,4,5,5,6,6,7,7,7,8]|uniq">{{num}}</div>
  </div>
</body>
```

#### 2. Use as utils
All methods defined in LoDash API can be used inside view template, controller and directive, because those are bind to $scope. (or in filters and services through $rootScope, but prefer using DI service!)
```html
<body ng-app="myApp">
  <div ng-controller="MyCtrl">
    <span ng-if="isEqual(size(cats), 0)">Size of cats is zero.</span>
    <span ng-show="isEmpty(cats)" class="ng-hide">Cats was empty.</span>
    <span ng-repeat="name in getUserNames()">{{name}}</span>
  </div>
</body>
```

#### 3. Use _ as DI service
Cleaner way to use LoDash inside angular directives, services, controllers or even inside filters.
```html
<body ng-app="myApp">
  <div ng-controller="MyCtrl">
    <span ng-repeat="name in getNames()">{{name}}</span>
  </div>
</body>
```

#### 4. Use custom mixin as filter
```html
<body ng-app="myApp">
  <div ng-controller="MyCtrl">
    <!-- output unique numbers from input.. [1, 2, 3, 4, 5] -->
    <span ng-repeat="num in [1,10,1,2,3,4,5,5,6,6,7,7,7,8]|customUniq">{{num}}</span>
  </div>
</body>
```

### History
* **v1.5** - breaking changes, renamed the whole repository and re-registered in to Bower.
* **v1.4** - support for LoDash v3.10.1. Fixed examples and unit tests to match new filter list.
* **v1.3** - ability to add your own LoDash mixins as $filter. This can be done either in .config() phase or for example .directive() pre compile phase as lazy load.
* **v1.0** - first version available through Bower, supports LoDash v2.4.1
* **v0.6 beta** - breaking changes
  * completely rewritten module structure. Added ngLoDashProvider which is used to configure filter methods and utility methods.
* **v0.5 beta** - breaking changes
  * changed the filter method list, it does not match to the original 'angular-lodash' [e07e8365](https://github.com/RopoMen/ropooy-angular-rdash/commit/e07e836561c454ec3f2a325ea4da0233e8c44425)
  * added DI service '_', which may break your own version [b78a42bc](https://github.com/RopoMen/ropooy-angular-rdash/commit/b78a42bc45c820b79151ae4a5e2fbdfd733ca2f7)
  * removed individual util method or filter method loading, meaning you cannot load anymore `ropooy-angular-rdash/utils/isEmpty` or `ropooy-angular-rdash/filters/escape` separately. Instead you need to load whole utility module and/or filters module. [4f317c68](https://github.com/RopoMen/ropooy-angular-rdash/commit/4f317c686d8c05d94825371fa0c7472b4a6ce62c)
