'use strict';

describe('ropooy-angular-lodash: API', function () {
    beforeEach(module('ropooy-angular-lodash/utils'));

    var $window,
        $rootScope;

    beforeEach(inject(function (_$window_, _$rootScope_) {
        $window = _$window_;
        $rootScope = _$rootScope_;
    }));

    describe('Testing LoDash methods', function () {
        it('Should be a function ($window._)', inject(function () {
            expect(angular.isFunction($window._)).toBe(true);
        }));

        var testData = _.functions(_);

        angular.forEach(testData, function(fnName) {
            it('Should match LoDash ' + fnName + ' -method in to $rootScope', function() {
                expect(angular.isFunction($rootScope[fnName])).toBe(true);
            });
        });
    });
});