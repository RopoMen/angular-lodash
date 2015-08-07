# An AngularJS module adapting lodash

A fork of [angular-lodash](https://github.com/cabrel/angular-lodash) which is a fork of [angular-underscore](https://github.com/floydsoft/angular-underscore)

This module exposes lodash's API into angular app's root scope,
and provides some filters from lodash.

#### Why make another fork?
> I want to keep this wrapper _up_to_date_ and also be more active to posted issues and PR's.

#### Load the whole library

```javascript
angular.module('app', ['ropooy-angular-lodash']);
```
##### or just a some parts
* 'ropooy-angular-lodash' (all)
* 'ropooy-angular-lodash/utils' (API only)
* 'ropooy-angular-lodash/filters' (Filters only)
* 'ropooy-angular-lodash/filters/groupBy' (Just a specific filters)

### Usecase
Default stuff for these examples.
```html
<script type="text/javascript">
  angular.module('myApp', ['ropooy-angular-lodash']);
  app.controller('MyCtrl', function($scope) {
    $scope.cats = [];
    $scope.users = [{ 'user': 'barney', 'age': 36 },
                    { 'user': 'fred',   'age': 40 }];

    //For example 2
    $scope.getUserNames = function() {
      return $scope.pluck($scope.users, 'user');
    };
  });
</script>
```

#### 1. Use defined filters
LoDash methods listed in 'adapList' array can be used as [AngularJS filter](https://docs.angularjs.org/guide/filter)
```html
<body ng-app="myApp">
  <div ng-controller="MyCtrl">
    <!-- output unique numbers from input.. [1, 2, 3, 4, 5, 6, 7, 8] -->
    <div ng-repeat="num in [1,1,2,3,4,5,5,6,6,7,7,7,8]|uniq">{{num}}</div>
  </div>
</body>
```

#### 2. Use defined utils
All methods defined in LoDash API can be used inside view and controller as utilitity.
```html
<body ng-app="myApp">
  <div ng-controller="MyCtrl">
    <span ng-if="isEqual(size(cats), 0)">Size of cats is zero.</span>
    <span ng-show="isEmpty(cats)" class="ng-hide">Cats was empty.</span>
    <span ng-repeat="name in getUserNames()">{{name}}</span>
  </div>
</body>
```

### Note: not available through bower, yet.
