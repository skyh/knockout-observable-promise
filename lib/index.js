'use strict';

var observable = require('knockout').observable;
var pureComputed = require('knockout').pureComputed;
var PromiseState = require('./internal/PromiseState');
var isPromise = require('./internal/isPromise');


/**
 * Converts promise state and value into public properties. If target value is not undefined
 * and not a promise - handles it like already resolved promise. If value is undefined -
 * handles it like pending promise.
 *
 * @function knockout-promise-extender
 * @param {observable<Promise|*>} target
 * @return {observable<PromiseState>}
 */
module.exports = function (target) {
	var trigger = observable().extend({notify: 'always'});
	var promiseReady = false;
	var state;
	var input;

	function outAsync(value) {
		if (!value) {
			value = PromiseState.pending();
		}

		promiseReady = true;

		if (!state || !state.equals(value)) {
			state = value;
			trigger(null);
		}
	}

	function outSync(value) {
		if (!value) {
			value = PromiseState.pending();
		}

		if (!state || !state.equals(value)) {
			state = value;
		}

		return state;
	}

	function read() {
		trigger();
		input = target();

		if (promiseReady) {
			promiseReady = false;
			return state;
		}

		if (!isPromise(input)) {
			if (input === undefined) {
				return outSync(PromiseState.pending());
			} else {
				return outSync(PromiseState.resolved(input));
			}
		} else {
			var promise = input;

			promise.then(function (value) {
				if (promise !== input) {
					return;
				}

				outAsync(PromiseState.resolved(value));
			}, function (value) {
				if (promise !== input) {
					return;
				}

				outAsync(PromiseState.rejected(value));
			});

			return outSync(PromiseState.pending());
		}
	}

	return pureComputed({
		read: read,
		write: target
	});
};
