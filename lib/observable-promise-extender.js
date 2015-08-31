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
 * @param {observable<Promise>} target
 * @return {observable<PromiseState>}
 */
module.exports = function (target) {
	var currentInput = undefined,
		currentOutput = PromiseState.pending();

	function targetDeduplicated(x) {
		if (!currentOutput.equals(x)) {
			currentOutput = x;
			target(x);
		}
	}

	var output = pureComputed({
		read: target,
		write: function (value) {
			currentInput = value;

			if (!isPromise(value)) {
				if (value === undefined) {
					targetDeduplicated(PromiseState.pending());
				} else {
					targetDeduplicated(PromiseState.resolved(value));
				}
			} else {
				var promise = value;

				promise.then(function (value) {
					if (promise !== currentInput) {
						return;
					}

					targetDeduplicated(PromiseState.resolved(value));
				}, function (value) {
					if (promise !== currentInput) {
						return;
					}

					targetDeduplicated(PromiseState.rejected(value));
				});

				targetDeduplicated(PromiseState.pending());
			}
		}
	});

	output(target());

	return output;
};
