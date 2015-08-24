# An AngularJS module adapting lodash

A fork of [angular-lodash](https://github.com/cabrel/angular-lodash) which is a fork of [angular-underscore](https://github.com/floydsoft/angular-underscore)

This module exposes lodash's API into AngularJS app's $rootScope, which is then available in view templates. It also provides some LoDash methods as $filters.

```
WARNING: This is not a drop-in replacement for the original 'angular-lodash' anymore!!
See release history at the bottom of the page.
```

#### Why make another fork?
> I want to keep this wrapper _up_to_date_ and also be more active to posted issues and PR's.

#### Load the whole library

```javascript
angular.module('app', ['ropooy-angular-lodash']);
```
##### or just a some parts
* 'ropooy-angular-lodash' (all)
* 'ropooy-angular-lodash/utils' (API only)
* 'ropooy-angular-lodash/service' (LoDash as AngularJS DI service)
* 'ropooy-angular-lodash/filters' (Filters only)

### Use cases
Default stuff for these examples.
```html
<script type="text/javascript">
  angular.module('myApp', ['ropooy-angular-lodash']);
  app.controller('MyCtrl', function($scope, _) {
    $scope.cats = [];
    $scope.users = [{ 'user': 'barney', 'age': 36 },
                    { 'user': 'fred',   'age': 40 }];

    //For example 2 (requires 'ropooy-angular-lodash/utils')
    $scope.getUserNames = function() {
      return $scope.pluck($scope.users, 'user');
    };

    //For example 3 / (requires 'ropooy-angular-lodash/service')
    // Why? because '_'.length < '$scope'.length
    // and I hate to use globals inside AngularJS controllers / directives / etc.
    $scope.getNames = function() {
      return _.pluck($scope.users, 'user');
    };
  });
</script>
```

#### 1. Use filters module
LoDash methods listed in 'adapList' array can be used as [AngularJS filter](https://docs.angularjs.org/guide/filter)
```html
<body ng-app="myApp">
  <div ng-controller="MyCtrl">
    <!-- requires 'ropooy-angular-lodash/filters' -->
    <!-- output unique numbers from input.. [1, 2, 3, 4, 5, 6, 7, 8] -->
    <div ng-repeat="num in [1,1,2,3,4,5,5,6,6,7,7,7,8]|uniq">{{num}}</div>
  </div>
</body>
```

#### 2. Use utils module
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

#### 3. Use _ DI service module
Cleaner way to use LoDash inside angular directives, services, controllers or even inside filters.
```html
<body ng-app="myApp">
  <div ng-controller="MyCtrl">
    <span ng-repeat="name in getNames()">{{name}}</span>
  </div>
</body>
```
### History
* **v0.5 beta** - breaking changes
  * changed the filter method list, it does not match to the original 'angular-lodash' e07e836561c454ec3f2a325ea4da0233e8c44425
  * added DI service '_', which may break your own version b78a42bc45c820b79151ae4a5e2fbdfd733ca2f7
  * removed individual util method or filter method loading, meaning you cannot load anymore `ropooy-angular-lodash/utils/isEmpty` or `ropooy-angular-lodash/filters/escape` separately. Instead you need to load whole utility module and/or filters module.

### Note: not available through bower, yet.
