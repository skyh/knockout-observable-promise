'use strict';

module.exports = PromiseState;
var PromiseStateVariant = require('./PromiseStateVariant');


var STATE_PENDING = new PromiseStateVariant('STATE_PENDING');
var STATE_RESOLVED = new PromiseStateVariant('STATE_RESOLVED');
var STATE_REJECTED = new PromiseStateVariant('STATE_REJECTED');
var TEST = global.TEST || false;

function PromiseState(state, value) {
	Object.defineProperties(this, {
		value: {
			enumerable: true,
			value: state === STATE_PENDING ? undefined : value
		},

		state: {
			enumerable: true,
			value: state
		},

		pending: {
			enumerable: true,
			value: state === STATE_PENDING || state === undefined
		},

		resolved: {
			enumerable: true,
			value: state === STATE_RESOLVED
		},

		rejected: {
			enumerable: true,
			value: state === STATE_REJECTED
		}
	});
}

Object.defineProperties(PromiseState.prototype, {
	equals: {
		value: function (a) {
			return this.constructor.equals(this, a);
		}
	}
});

function equalsPromiseState(a, b) {

}
Object.defineProperties(PromiseState, {
	STATE_PENDING: {
		value: STATE_PENDING
	},

	STATE_RESOLVED: {
		value: STATE_RESOLVED
	},

	STATE_REJECTED: {
		value: STATE_REJECTED
	},

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

PromiseState.pending = function () {
	return promisePendingSingleton;
};

PromiseState.resolved = function (value) {
	return new PromiseState(STATE_RESOLVED, value);
};

PromiseState.rejected = function (value) {
	return new PromiseState(STATE_REJECTED, value);
};
