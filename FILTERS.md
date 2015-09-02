## Which LoDash methods should be added as filter?
I wanted to add this document because it is not clear why some methods are 
accepted as filter and why some are not. I am trying to define quidelines over here
and analyze all LoDash methods and point out why some method is or is not accepted.

#### Guidelines
First of all AngularJS [Filter developer guide](https://docs.angularjs.org/guide/filter) states that:
> A filter formats the value of an expression for display to the user. They can be used in view templates, controllers or services and it is easy to define your own filter.

Ok, now let's start discussion of the rulez!

1. Selected method **cannot** alter the original value. This means that it is not allowed to remove any values from original Array or Object. It also cannot change the original String or Number in anyways.
1. *They can be used in view templates, controllers or services...*, when we start to thinking about this, we should remember that `ropooy-angular-rdash` is providing service `_`, which can be injected in to Service, Controller, Directive and Filter.

	Example below shows the ways how you can currently use LoDash functions inside Service, Controller, Directive or Filter. If you ask from me, I would use service `_` instead of any other ways. (less writing)
	```javascript
	//simplified controller...
	function($scope, $filter, _) {
		// as util
		var way1 = $scope.uniq([1, 2, 1]);
		// as filter
		var way2 = $filter('uniq')([1, 2, 1]);
		// as DI service
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

Guideline summary:

1. It cannot alter the original value.
1. Its usage must be reasonable inside *view tempalte* (it returns Array, Object, String or Number)

### LoDash 3.10.1

## `Arrays`
#### Usable as $filter
* `chunk`, `compact`, `difference`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `flatten`, `flattenDeep`, `initial`, `intersection`, `rest and tail`, `slice`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `union`, `uniq and unique`, `unzip`, `unzipWith`, `without`, `xor`, `zip` and `zipWith` - returns Array, usable in `ng-repeat`.

#### Unusable as $filter
* `findIndex`, `findLastIndex`, `indexOf`, `lastIndexOf`, `sortedIndex`, `sortedLastIndex` - retuns index of the found element, else -1. Cannot see any valid use case in view template atm.
* `pull`, `pullAt` and `remove` - removes elements from the original array.
* `fill` - returns Array, but more usable as utility.
* `first and head`, `last`, `zipObject and object` - more usable as utility.

	```html
	<button ng-click="ziped = zipObject(['fred', 'barney'],[30, 40])">
	   {{ziped.fred || 'No value'}}
   	</button>
	```

## `Chaining`

#### Unusable as $filter
* --all--

## `Collections`

#### Usable as $filter
* `at`, `filter and select`, `map and collect`, `pluck`, `reject`, `sample`, `shuffle`, `sortBy`, `sortByAll`, `sortByOrder`, `where`, `invoke`, `partition`, `reduce, foldl and inject`, `reduceRight and foldr` - returns Array, usable in `ng-repeat`
* `find and detect`, `findLast`, `findWhere` - usable, depending what is the returned element.
* `countBy`, `groupBy`, `indexBy` - returns the composed aggregate object. This is more usable as utility instead of inside view assignment, but this could be used in filter chain.

#### Unusable as $filter
* `every and all`, `includes, contains and include`, `some and any` - retuns Boolean, more usable as utility.
* `size` - returns Number, more usable as utility.
* `forEach and each`, `forEachRight and `eachRight` - returns Array, but more usable as utility.

## `Date`

#### Usable as $filter
* --none--

#### Unusable as $filter
* `now` - usable as utility.

## `Functions`

#### Usable as $filter
* --none--

#### Unusable as $filter
* `after`, `bind`, `bindAll`, `bindKey`, `compose`, `curry`, `debounce`, `defer`, `delay`, `memoize`, `once`, `partial`, `partialRight`, `throttle`, `wrap` - cannot see any sensible use cases atm.

## `Lang`

#### Usable as $filter
* `toArray` - returns Array, usable in `ng-repeat`

#### Unusable as $filter
* `clone`, `cloneDeep`, `gt`, `gte`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`, `isEmpty`, `isEqual`, `isError`, `isFinite`, `isFunction`, `isNaN`, `isNative`, `isNull`, `isNumber`, `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isTypedArray`, `isUndefined`, `lg`, `lte` - returns Boolean, more usable as utility.
* `toPlainObject` - retuns the converted plain object, usable as utility.

## `Math`

#### Usable as $filter
* `add`, `ceil`, `floor`, `max`, `min`, `round`, `sum` - all work nicely as filter.

#### Unusable as $filter
* --none--

## `Number`

#### Usable as $filter
* --none--

#### Unusable as $filter
* `inRange` - returns Boolean, usable as utility.
* `random` - returns Number, usable as utility.

## `Objects`

#### Usable as $filter
* `functions and methods`, `keys`, `keysIn`, `merge`, `pairs`, `values`, `valuesIn` - usable in `ng-repeat`
* `get`, `result` - looks nice filter.
* `invert`, `mapKeys`, `mapValues`, `omit`, `pick` - Returns object.
* `transform` - return the accumulated value.

#### Unusable as $filter
* `assign and extend`, , `create`, `defaults`, `defaultsDeep`, `findKey`, `findLastKey`, `forIn`, `forInRight`, `forOwn`, `forOwnRight` - These are more like utility.
* `has` - returns Boolean, more usable as utility.
* `set` - adds property / value -> manipulates original.
* `transform` - returns the accumulated value. TODO: Need good use case, without utility possibility.

## `String`

#### Usable as $filter
* `camelCase`, `capitalize`, `deburr`, `escape`, `escapeRegExp`, `kebabCase`, `pad`, `padLeft`, `padRight`, `repeat`, `snakeCase`, `startCase`, `trim`, `trimLeft`, `trimRight`, `trunc`, `unescape` - returns String.
* `parseInt` - returns Number.
* `words` - returns Array, usable in `ng-repeat`.

#### Unusable as $filter
* `template` - usable as utility.
* `endsWith`, `startsWith` - returns Boolean, usable as utility.

## `Utilities`

#### Usable as $filter
* `uniqueId` - returns String.
* `result` - returns resolved value.
* `times` - returns Array.

#### Unusable as $filter
* `attempt`, `callback and iteratee`, `constant`, `identity`, `matches`, `matchesProperty`, `method`, `methodOf`, `mixin`, `noConflict`, `noop`, `property`, `propertyOf`, `range`, `runinContext` - these are utility.

## Notes
* Second iteration was a bit easier. Added more consistency to methods which returns Array or Object.
* I also got stronger feeling that are you benefitting at all if you are using filters and utilities? I think that you are using either filters or utils. Good filters would be some composition methods / mixins which you are creating specifically to filter data in your service. Plain LoDash methods work in the same way whether you are using filter or util.
* We should also have a list of the methods which work as utility inside view template. Example `forEach` is not very useful inside view template, but `isXYZ` methods are. Current 3.10.1 LoDash version has 219 methods, which are currently added into `$scope` if you are using utils.


