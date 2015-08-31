'use strict';

require('../test-env');

var PromiseState = require('../lib/internal/PromiseState');


describe('PromiseState', function () {
	describe('Constructor', function () {
		it('is a function', function () {
			expect(PromiseState).to.be.a('function');
		});

		['STATE_PENDING', 'STATE_RESOLVED', 'STATE_REJECTED'].forEach(function (prop) {
			it('have static property ' + prop, function () {
				expect(PromiseState).to.have.property(prop);
			});
		});

		['pending', 'resolved', 'rejected', 'equals'].forEach(function (prop) {
			it('have static method ' + prop + '()', function () {
				expect(PromiseState[prop]).to.be.a('function');
			});
		});

		it('creates instance', function () {
			var instance = new PromiseState();
			expect(instance).to.be.instanceOf(PromiseState);
		});

		describe('pending()', function () {
			it('returns new PromiseState(STATE_PENDING)', function () {
				var result = PromiseState.pending();

				expect(result).to.be.instanceOf(PromiseState);
				expect(result).to.have.property('pending', true);
				expect(result).to.have.property('resolved', false);
				expect(result).to.have.property('rejected', false);
				expect(result).to.have.property('value', undefined);
			});

			it('returns same value for every call', function () {
				var r1 = PromiseState.pending();
				var r2 = PromiseState.pending();

				expect(r1).to.be.eq(r2);
			});
		});

		describe('resolved(value)', function () {
			it('returns new PromiseState(STATE_PENDING, value)', function () {
				var value = {};
				var result = PromiseState.resolved(value);

				expect(result).to.be.instanceOf(PromiseState);
				expect(result).to.have.property('pending', false);
				expect(result).to.have.property('resolved', true);
				expect(result).to.have.property('rejected', false);
				expect(result).to.have.property('value', value);
			});
		});

		describe('rejected(value)', function () {
			it('returns new PromiseState(STATE_REJECTED, value)', function () {
				var value = {};
				var result = PromiseState.rejected(value);

				expect(result).to.be.instanceOf(PromiseState);
				expect(result).to.have.property('pending', false);
				expect(result).to.have.property('resolved', false);
				expect(result).to.have.property('rejected', true);
				expect(result).to.have.property('value', value);
			});
		});

		describe('equals(a, b)', function () {
			it('throws error if arguments are not PromiseState', function () {
				expect(function () {
					var x = {};
					PromiseState.equals(x, x);
				}).to.throws;
			});

			it('returns true for identical values', function () {
				var a = new PromiseState(PromiseState.STATE_RESOLVED, {});
				expect(PromiseState.equals(a, a)).to.be.true;
			});

			it('returns true for STATE_PENDING states with any values', function () {
				var a = new PromiseState(PromiseState.STATE_PENDING, {});
				var b = new PromiseState(PromiseState.STATE_PENDING, {});

				expect(PromiseState.equals(a, b)).to.be.true;
			});

			it('returns true for STATE_RESOLVED states with identical values', function () {
				var v = {};
				var a = new PromiseState(PromiseState.STATE_RESOLVED, v);
				var b = new PromiseState(PromiseState.STATE_RESOLVED, v);

				expect(PromiseState.equals(a, b)).to.be.true;
			});

			it('returns true for STATE_REJECTED states with identical values', function () {
				var v = {};
				var a = new PromiseState(PromiseState.STATE_REJECTED, v);
				var b = new PromiseState(PromiseState.STATE_REJECTED, v);

				expect(PromiseState.equals(a, b)).to.be.true;
			});

			it('returns false for states with different values and different states', function () {
				var a = new PromiseState(PromiseState.STATE_RESOLVED, {});
				var b = new PromiseState(PromiseState.STATE_REJECTED, {});

				expect(PromiseState.equals(a, b)).to.be.false;
			});

			it('returns false for states with same value but different state', function () {
				var v = {};
				var a = new PromiseState(PromiseState.STATE_RESOLVED, v);
				var b = new PromiseState(PromiseState.STATE_REJECTED, v);

				expect(PromiseState.equals(a, b)).to.be.false;
			});

			it('returns false for STATE_RESOLVED states with different value', function () {
				var a = new PromiseState(PromiseState.STATE_RESOLVED, {});
				var b = new PromiseState(PromiseState.STATE_RESOLVED, {});

				expect(PromiseState.equals(a, b)).to.be.false;
			});

			it('returns false for STATE_REJECTED states with different value', function () {
				var a = new PromiseState(PromiseState.STATE_REJECTED, {});
				var b = new PromiseState(PromiseState.STATE_REJECTED, {});

				expect(PromiseState.equals(a, b)).to.be.false;
			});
		});
	});

	describe('instance', function () {
		describe('new PromiseState(PromiseState.STATE_PENDING, value)', function () {
			var instance, value;

			beforeEach(function () {
				value = {};
				instance = new PromiseState(PromiseState.STATE_PENDING, value);
			});

			it('have state=STATE_PENDING', function () {
				expect(instance).to.have.property('state', PromiseState.STATE_PENDING);
			});

			it('have value=undefined', function () {
				expect(instance).to.have.property('value', undefined);
			});

			it('have pending=true', function () {
				expect(instance).to.have.property('pending', true);
			});

			it('have resolved=false', function () {
				expect(instance).to.have.property('resolved', false);
			});

			it('have rejected=false', function () {
				expect(instance).to.have.property('rejected', false);
			});
		});

		describe('new PromiseState(PromiseState.STATE_RESOLVED, value)', function () {
			var instance, value;

			beforeEach(function () {
				value = {};
				instance = new PromiseState(PromiseState.STATE_RESOLVED, value);
			});

			it('have state=STATE_RESOLVED', function () {
				expect(instance).to.have.property('state', PromiseState.STATE_RESOLVED);
			});

			it('have value', function () {
				expect(instance).to.have.property('value', value);
			});

			it('have pending=false', function () {
				expect(instance).to.have.property('pending', false);
			});

			it('have resolved=true', function () {
				expect(instance).to.have.property('resolved', true);
			});

			it('have rejected=false', function () {
				expect(instance).to.have.property('rejected', false);
			});
		});

		describe('new PromiseState(PromiseState.STATE_REJECTED, value)', function () {
			var instance, value;

			beforeEach(function () {
				value = {};
				instance = new PromiseState(PromiseState.STATE_REJECTED, value);
			});

			it('have state=STATE_REJECTED', function () {
				expect(instance).to.have.property('state', PromiseState.STATE_REJECTED);
			});

			it('have value', function () {
				expect(instance).to.have.property('value', value);
			});

			it('have pending=false', function () {
				expect(instance).to.have.property('pending', false);
			});

			it('have resolved=false', function () {
				expect(instance).to.have.property('resolved', false);
			});

			it('have rejected=true', function () {
				expect(instance).to.have.property('rejected', true);
			});
		});

		describe('equals(a)', function () {
			it('calls PromiseState.equals(this, a)', function () {
				var spy = sinon.spy(PromiseState, 'equals');

				afterEach(function () {
					spy.restore();
				});

				var s1 = new PromiseState(PromiseState.STATE_RESOLVED, {});
				var s2 = new PromiseState(PromiseState.STATE_REJECTED, {});

				s1.equals(s2);

				expect(spy).to.have.been.calledOnce;
				expect(spy.args[0]).to.be.deep.eq([s1, s2]);
			});

			it('returns PromiseState.equals(this, a)', function () {
				var testValue = {};

				var stub = sinon.stub(PromiseState, 'equals');
				stub.returns(testValue);

				afterEach(function () {
					stub.restore();
				});

				var s1 = new PromiseState(PromiseState.STATE_RESOLVED, {});
				var s2 = new PromiseState(PromiseState.STATE_REJECTED, {});

				var returnValue = s1.equals(s2);

				expect(returnValue).to.be.eq(testValue);
			});
		});
	});
});
