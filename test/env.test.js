'use strict';

require('../test-env');


describe('environment check', function () {
	describe('setImmediate()', function () {
		it('should run async after promise resolve', function (done) {
			var immediateCallback = sinon.spy();
			var promiseCallback = sinon.spy();

			setImmediate(immediateCallback);
			Promise.resolve().then(promiseCallback);

			expect(immediateCallback).to.have.not.been.called;
			expect(promiseCallback).to.have.not.been.called;

			setImmediate(function () {
				expect(immediateCallback).to.be.calledAfter(promiseCallback);
				done();
			});
		});
	});
});
