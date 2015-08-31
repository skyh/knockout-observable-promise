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
	var currentInput,
		currentOutput;

	function writeTarget(x) {
		if (!currentOutput || currentOutput && !currentOutput.equals(x)) {
			currentOutput = x;
			target(x);
		}
	}

	function write(value) {
		currentInput = value;

		if (!isPromise(value)) {
			if (value === undefined) {
				writeTarget(PromiseState.pending());
			} else {
				writeTarget(PromiseState.resolved(value));
			}
		} else {
			var promise = value;

			promise.then(function (value) {
				if (promise !== currentInput) {
					return;
				}

				writeTarget(PromiseState.resolved(value));
			}, function (value) {
				if (promise !== currentInput) {
					return;
				}

				writeTarget(PromiseState.rejected(value));
			});

			writeTarget(PromiseState.pending());
		}
	}

	var output = pureComputed({
		read: target,
		write: write
	});

	output(target());

	return output;
};
