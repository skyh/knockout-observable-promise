'use strict';

module.exports = function (a) {
	return a instanceof Promise || a && typeof a === 'object' && 'then' in a && typeof a.then === 'function';
};
