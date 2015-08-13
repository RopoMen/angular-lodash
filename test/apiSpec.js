'use strict';

describe('ropooy-angular-lodash: API', function () {
    beforeEach(module('ropooy-angular-lodash/utils'));

    var $window,
        $rootScope,
        IsolatedScope,
        testData = _.functions(_);

    beforeEach(inject(function (_$window_, _$rootScope_) {
        $window = _$window_;
        $rootScope = _$rootScope_;
    }));

    describe('Testing LoDash methods', function () {
        it('Should be a function ($window._)', inject(function () {
            expect(angular.isFunction($window._)).toBe(true);
        }));

        angular.forEach(testData, function(fnName) {
            it('Should match LoDash ' + fnName + ' -method in to $rootScope', inject(function() {
                expect(angular.isFunction($rootScope[fnName])).toBe(true);
            }));
        });
    });

    describe('Testing isolated scope', function() {
        it('$rootScope should have method "foo" defined', inject(function() {
            $rootScope.foo = function() {};
            expect(angular.isFunction($rootScope.foo)).toBe(true);
        }));

        it('IsolatedScope should NOT have method "foo" defined', inject(function() {
            $rootScope.foo = function() {};
            IsolatedScope = $rootScope.$new(true);
            expect(angular.isFunction(IsolatedScope.foo)).not.toBe(true);
        }));

        angular.forEach(testData, function(fnName) {
            it('Should match LoDash ' + fnName + ' -method in to IsolatedScope', inject(function() {
                IsolatedScope = $rootScope.$new(true);
                expect(angular.isFunction(IsolatedScope[fnName])).toBe(true);
            }));
        });
    });
});