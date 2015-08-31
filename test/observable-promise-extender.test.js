'use strict';

require('../test-env');

var ko = require('knockout');
var observable = ko.observable;
var extender = require('../lib/observable-promise-extender');
var PromiseState = require('../lib/internal/PromiseState');

function expectIsObservable(x) {
	expect(x).to.be.a('function');
	expect(x.subscribe).to.be.a('function');
}

function expectPSOIsPending(x) {
	expectIsObservable(x);
	var xValue = x();
	expect(xValue).is.instanceOf(PromiseState);
	expect(xValue).to.have.property('pending', true);
	expect(xValue).to.have.property('resolved', false);
	expect(xValue).to.have.property('rejected', false);
	expect(xValue).to.have.property('value', undefined);
}

function expectPSOIsResolved(x, value) {
	expectIsObservable(x);
	var xValue = x();
	expect(xValue).is.instanceOf(PromiseState);
	expect(xValue).to.have.property('resolved', true);
	expect(xValue).to.have.property('rejected', false);
	expect(xValue).to.have.property('value', value);
}

function expectPSOIsRejected(x, value) {
	expectIsObservable(x);
	var xValue = x();
	expect(xValue).is.instanceOf(PromiseState);
	expect(xValue).to.have.property('pending', false);
	expect(xValue).to.have.property('resolved', false);
	expect(xValue).to.have.property('rejected', true);
	expect(xValue).to.have.property('value', value);
}



describe('observable-promise-extender', function () {
	describe('interface', function () {
		it('is a function', function () {
			expect(extender).to.be.a('function');
		});
	});

	describe('implementation', function () {
		it('returns observable with PromiseState as value', function () {
			var initialValue = {};
			var observablePromise = observable(Promise.resolve(initialValue));
			var stateValue = extender(observablePromise);
			var value = stateValue();

			expect(value).is.instanceOf(PromiseState);
		});

		describe('if input value is not Promise instance', function () {
			describe('if input is undefined', function () {
				it('returns pending state', function () {
					var input = observable(undefined);
					var extenderObservable = extender(input);

					expectPSOIsPending(extenderObservable);
				});
			});

			describe('if input value is not undefined', function () {
				it('returns resolved state', function () {
					var initialValue = {};
					var input = observable(initialValue);
					var extenderObservable = extender(input);

					expectPSOIsResolved(extenderObservable, initialValue);
				});
			});
		});

		describe('input value is Promise instance', function () {
			describe('which is pending', function () {
				it('returns pending state', function () {
					var input = observable(new Promise(function () {}));
					var extenderObservable = extender(input);

					expectPSOIsPending(extenderObservable);
				});
			});

			describe('if input value is resolved Promise', function () {
				it('returns pending state', function () {
					var input = observable(Promise.resolve());
					var extenderObservable = extender(input);

					expectPSOIsPending(extenderObservable);
				});

				it('immediate becomes resolved', function (done) {
					var initialValue = {};
					var input = observable(Promise.resolve(initialValue));
					var extenderObservable = extender(input);

					expectPSOIsPending(extenderObservable);

					setImmediate(function () {
						expectPSOIsResolved(extenderObservable, initialValue);
						done();
					});
				});
			});

			describe('if input value is rejected Promise', function () {
				it('returns pending state', function () {
					var input = observable(Promise.resolve());
					var extenderObservable = extender(input);

					expectPSOIsPending(extenderObservable);
				});

				it('immediate becomes rejected', function (done) {
					var initialValue = {};
					var input = observable(Promise.reject(initialValue));
					var extenderObservable = extender(input);

					expectPSOIsPending(extenderObservable);

					setImmediate(function () {
						expectPSOIsRejected(extenderObservable, initialValue);
						done();
					});
				});
			});
		});

		describe('when input value changes', function () {
			describe('from undefined to undefined', function () {
				it('do not run callback', function (done) {
					var currentValue = undefined;
					var newValue = undefined;
					var input = observable(currentValue);
					var extenderObservable = extender(input);
					var spy = sinon.spy();

					extenderObservable.subscribe(spy);
					expect(spy).to.not.have.been.called;

					extenderObservable(newValue);

					setImmediate(function () {
						expectPSOIsPending(extenderObservable);
						expect(spy).to.not.have.been.called;
						done();
					});
				});
			});

			describe('from undefined to non-Promise', function () {
				it('runs callback once sync with new value', function () {
					var currentValue = undefined;
					var newValue = {};
					var input = observable(currentValue);
					var extenderObservable = extender(input);
					var spy = sinon.spy();

					expectPSOIsPending(extenderObservable);
					extenderObservable.subscribe(spy);
					expect(spy).to.not.have.been.called;

					extenderObservable(newValue);

					expect(spy).to.have.been.calledOnce;
					expectPSOIsResolved(extenderObservable, newValue);
				});
			});

			describe('from undefined to Promise', function () {
				it('runs callback once async immediately with promise value', function (done) {
					var currentValue = undefined;
					var newValue = {};
					var newValuePromise = Promise.resolve(newValue);
					var spy = sinon.spy();

					var input = observable(currentValue);
					var extenderObservable = extender(input);

					extenderObservable.subscribe(spy);
					expectPSOIsPending(extenderObservable);

					extenderObservable(newValuePromise);

					expectPSOIsPending(extenderObservable);

					expect(spy).to.have.not.been.called;

					setImmediate(function () {
						expectPSOIsResolved(extenderObservable, newValue);
						expect(spy).to.have.been.calledOnce;
						done();
					});
				});
			});

			describe('add here other combinations', function () {
				// TODO: add other combinations
			});
		});
	});
});
