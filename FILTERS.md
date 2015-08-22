## Which LoDash methods should be added as filter?
I wanted to add this document because it is not clear why some methods are 
accepted as filter and why some are not. I am trying to define quidelines over here
and analyze all LoDash methods and point out why some method is or is not accepted.

#### Guidelines
First of all AngularJS [Filter developer guide](https://docs.angularjs.org/guide/filter) states that:
> A filter formats the value of an expression for display to the user. They can be used in view templates, controllers or services and it is easy to define your own filter.

Ok, now let's start discussion of the rulez!

1. Selected method **cannot** alter the original value. This means that it is not allowed to remove any values from original Array or Object. It also cannot change the original String or Number in anyways.
1. *They can be used in view templates, controllers or services...*, when we start to thinking about this, we should remember that 'ropooy-angular-lodash/service' is providing service '_', which can be injected in to Service, Controller, Directive and Filter.

	Example below shows the ways how you can currently use filter functions inside Service, Controller, Directive or Filter. If you ask from me, I would use service '_' instead of any other ways. (less writing)
	```javascript
	//simplified controller...
	function($scope, $filter, _) {
		//from 'ropooy-angular-lodash/utils'
		var way1 = $scope.uniq([1, 2, 1]);
		//from 'ropooy-angular-lodash/filters'
		var way2 = $filter('uniq')([1, 2, 1]);
		//from 'ropooy-angular-lodash/service'
		var way3 = _.uniq([1, 2, 1]);
	}
	```
	... and from that we should only think if some LoDash method is suitable as filter **inside view template.**

1. Now, what means *suitable as filter*? Next example demostrates one crazy way. Lets asume that we have added *isEmpty* as filter, it returns a Boolean value. We need to remember from last example that $scope contains also 'isEmpty()' -method.
	```javascript
	//simplified controller
	function myCtrl($scope) {
		$scope.foo = [];
	}
	```
	```html
	<div ng-controller="myCtrl">
		<!-- would you use isEmpty() as utility? -->
		<p ng-if="isEmpty(foo);">Foo is empty</p>

		<!-- or would you like to use it as filter? I doubt it.-->
		<p ng-if="'{{foo |isEmpty}}'">Foo is empty</p>
	</div>
	```
1. There is also a fourth rule, but I will write it later, that rule focuses around filter chaining and complexity, where better solution would be write your own filter which hides that complexity. Also for this I will create a way how you can register your own LoDash filters easily and make those available through utility, filter and service sections. This is done using _.mixins + registerin it as filter also.

	This rules intention is to block method as suitable filter if it could be used inside complex filter chains, but it would not make any sense separately.

Guideline summary:

1. It cannot alter the original value.
1. Its usage must be reasonable inside *view tempalte* (it returns Array, Object, String or Number)

### LoDash 2.4.1

## <a id="arrays"></a>`Arrays`
#### Usable as $filter
* `compact`, `difference`, `flatten`, `initial`, `intersection`, `rest, drop and tail`, `union`, `uniq and unique`, `without`, `xor`, `zip and unzip` - clearly usable in `ng-repeat`
* `first, head and take`, `last` - usable in `ng-repeat`, but remember to explicitly state how may elements should be taken. Example: [3, 1, 5] |first:1 <- this will return [3], but if you use [3, 1, 5] |first <- this will return 3.

#### Unusable as $filter
* `indexOf`, `findIndex`, `findLastIndex` and `lastIndexOf` - all retuns index of the found element, else -1. Cannot see any valid use case in view template atm. (could be something like, inside view assignment).
* `sortedIndex` - returns the index at which value should be inserted into array. Cannot see any valid use case in view template atm. (could be something like, inside view assignment).
* `pull` and `remove` - removes elements from the original array.
* `range`- creates an array of numbers. *use utility method range() instead*

	```html
	<span ng-repeat="val in range(0, 10)">{{val}}<span>
	```
* `zipObject and object` - this makes more sense if it is used as utility.

	```html
	<button ng-click="ziped = zipObject(['fred', 'barney'],[30, 40])">
	   {{ziped.fred || 'No value'}}
   	</button>
	```

## `Chaining`

#### Usable as $filter
--none--

#### Unusable as $filter
* `_`, `chain`, `tap`, `prototype.chain`, `prototype.toString`, `prototype.value and prototype.valueOf` - cannot see any sensible use cases atm.

## `Collections`

#### Usable as $filter
* `at`, `filter and select`, `map and collect`, `pluck`, `reject`, `sample`, `shuffle`, `sortBy`, `toArray`, `where` - clearly usable in `ng-repeat`
* `find, detect and findWhere`, `findLast`, `max`, `min` - usable, depending what is the returned element.
* `countBy`, `groupBy`, `indexBy` - returns the composed aggregate object. This is more usable as utility instead of inside view assignment, but this could be used in filter chain.

#### Unusable as $filter
* `contains and include`, `every and all`, `some and any` - retuns Boolean, more usable as utility.
* `size` - returns number, more usable as utility.
* `forEach and each`, `forEachRight and `eachRight`, `invoke` - returns array, but these seem more like utility.
* `reduce, foldl and inject`, `reduceRight and foldr` - returns the accumulated value. TODO: Need good use case, without utility possibility.


## `Functions`

#### Usable as $filter
--none--

#### Unusable as $filter
* `after`, `bind`, `bindAll`, `bindKey`, `compose`, `curry`, `debounce`, `defer`, `delay`, `memoize`, `once`, `partial`, `partialRight`, `throttle`, `wrap` - cannot see any sensible use cases atm.


## `Objects`

#### Usable as $filter
* `functions and methods`, `keys`, `pairs`, `values` - usable in `ng-repeat`
* `invert`, `mapValues`, `omit`, `pick` - Returns object.

#### Unusable as $filter
* `assign and extend`, `clone`, `cloneDeep`, `create`, `defaults`, `findKey`, `findLastKey`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `merge` - These are more like utility.
* `has`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`, `isEmpty`, `isEqual`, `isFinite`, `isFunction`, `isNaN`, `isNull`, `isNumber`, `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined` - returns Boolean, more usable as utility.
* `transform` - returns the accumulated value. TODO: Need good use case, without utility possibility.


## `Utilities`

#### Usable as $filter
* `escape`, `unescape`, `uniqueId` - returns string.
* `parseInt` - returns number.
* `result` - returns resolved value.

#### Unusable as $filter
* `now`, `constant`, `createCallback`, `identity`, `mixin`, `noConflict`, `noop`, `property`, `random`, `runinContext`, `template`, `times` - these are utility.



## Notes
* First iteration was pretty difficult in some parts, especially when LoDash method was returning Object, because then you had to think whether it was usable as filter or was it more like utility.
* I also noticed that if you are using `ropooy-angular-lodash/utils` are you benefiting at all from the
`ropooy-angular-lodash/filters`?
* And from that I realized that biggest question probably is do you want to bind all LoDash methods in to $scope or use only methods that work as $filter?


