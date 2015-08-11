'use strict';

describe('ropooy-angular-lodash: API', function () {
    beforeEach(module('ropooy-angular-lodash/service'));

    var DIDash;

    beforeEach(inject(function ($injector) {
        DIDash = $injector.get('_');
    }));

    describe('Testing LoDash DI service', function () {
    	it('Should be a function', inject(function () {
            expect(angular.isFunction(DIDash)).toBe(true);
        }));

    	var testData = _.functions(_);

        angular.forEach(testData, function(fnName) {
        	it('Should match LoDash ' + fnName + ' -method in to DIDash', function() {
				expect(angular.isFunction(DIDash[fnName])).toBe(true);
	    	});
        });
    });
});