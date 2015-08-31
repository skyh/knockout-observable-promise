'use strict';

module.exports = PromiseStateVariant;


function PromiseStateVariant(asString) {
	Object.defineProperties(this, {
		asString: {
			value: asString
		}
	});
}

Object.defineProperties(PromiseStateVariant.prototype, {
	toString: {
		value: function () {
			return this.asString;
		}
	}
});
