'use strict';

module.exports = PromiseStateVariant;


/**
 * Promise state variant
 *
 * @constructor
 * @param {string} asString String representation
 */
function PromiseStateVariant(asString) {
	Object.defineProperties(this, {
		asString: {
			value: asString
		}
	});
}

Object.defineProperties(PromiseStateVariant.prototype, {
	/**
	 * @override
	 * @method PromiseStateVariant#toString
	 * @returns {string}
	 */
	toString: {
		value: function () {
			return this.asString;
		}
	}
});
