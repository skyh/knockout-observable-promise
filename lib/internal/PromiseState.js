'use strict';

module.exports = PromiseState;
var PromiseStateVariant = require('./PromiseStateVariant');


var STATE_PENDING = new PromiseStateVariant('STATE_PENDING');
var STATE_RESOLVED = new PromiseStateVariant('STATE_RESOLVED');
var STATE_REJECTED = new PromiseStateVariant('STATE_REJECTED');
var TEST = global.TEST || false;

/**
 * Promise state representation
 *
 * @constructor
 * @param {PromiseStateVariant} state Promise public state
 * @param {any} value Promise value
 */
function PromiseState(state, value) {
	Object.defineProperties(this, {
		value: {
			enumerable: true,
			value: state === STATE_PENDING ? undefined : value
		},

		/**
		 * Indicates Promise raw state
		 *
		 * @type {PromiseStateVariant}
		 * @memberOf PromiseState#
		 */
		state: {
			enumerable: true,
			value: state
		},

		/**
		 * Indicates Promise is pending
		 *
		 * @type {Boolean}
		 * @memberOf PromiseState#
		 */
		pending: {
			enumerable: true,
			value: state === STATE_PENDING || state === undefined
		},

		/**
		 * Indicates Promise is resolved
		 *
		 * @type {Boolean}
		 * @memberOf PromiseState#
		 */
		resolved: {
			enumerable: true,
			value: state === STATE_RESOLVED
		},

		/**
		 * Indicates Promise is rejected
		 *
		 * @type {Boolean}
		 * @memberOf PromiseState#
		 */
		rejected: {
			enumerable: true,
			value: state === STATE_REJECTED
		}
	});
}

Object.defineProperties(PromiseState.prototype, {
	/**
	 * @method PromiseState#equals
	 * @param {PromiseState} a
	 * @returns {Boolean}
	 */
	equals: {
		value: function (a) {
			return this.constructor.equals(this, a);
		}
	}
});

function equalsPromiseState(a, b) {

}
Object.defineProperties(PromiseState, {
	/**
	 * @const
	 * @type {PromiseStateVariant}
	 * @memberOf PromiseState
	 */
	STATE_PENDING: {
		value: STATE_PENDING
	},

	/**
	 * @const
	 * @type {PromiseStateVariant}
	 * @memberOf PromiseState
	 */
	STATE_RESOLVED: {
		value: STATE_RESOLVED
	},

	/**
	 * @const
	 * @type {PromiseStateVariant}
	 * @memberOf PromiseState
	 */
	STATE_REJECTED: {
		value: STATE_REJECTED
	},

	/**
	 * @method
	 * @memberOf PromiseState
	 * @param {PromiseState} a
	 * @param {PromiseState} b
	 * @returns {Boolean}
	 */
	equals: {
		writable: TEST,
		value: function (a, b) {
			if (!(a instanceof this) || !(b instanceof this)) {
				throw new Error('Can not check equality for unknown types.');
			}

			if (a === b) {
				return true;
			}

			var aState = a.state,
				bState = b.state;

			if (aState === b.state) {
				if (aState === STATE_PENDING) {
					return true;
				} else {
					return a.value === b.value;
				}
			} else {
				return false;
			}
		}
	}
});

var promisePendingSingleton = new PromiseState(STATE_PENDING);

/**
 * Creates PromiseStateVariant with pending state
 *
 * @method
 * @memberOf PromiseState
 * @returns {PromiseStateVariant}
 */
PromiseState.pending = function () {
	return promisePendingSingleton;
};

/**
 * Creates PromiseStateVariant with resolved state and value
 *
 * @method
 * @memberOf PromiseState
 * @param {*} value Promised value
 * @returns {PromiseStateVariant}
 */
PromiseState.resolved = function (value) {
	return new PromiseState(STATE_RESOLVED, value);
};

/**
 * Creates PromiseStateVariant with rejected state
 *
 * @method
 * @memberOf PromiseState
 * @param {*} value Promised value
 * @returns {PromiseStateVariant}
 */
PromiseState.rejected = function (value) {
	return new PromiseState(STATE_REJECTED, value);
};
