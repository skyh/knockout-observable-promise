'use strict';

var ko = require('knockout');
ko.extenders.promise = require('../lib');

ko.extenders.logChange = function(target, option) {
	console.log(option + ": ", target.peek());
	target.subscribe(function(newValue) {
		console.log(option + ": ", newValue);
	});
	return target;
};

document.addEventListener('DOMContentLoaded', function () {
	var model1 = {
		text: ko.observable().extend({promise: true})
	};

	window.model1 = model1;

	ko.applyBindings(model1, document.getElementById('example-1'));

	// first, set text synchronously
	model1.text('Text as string. Wait 2 secs.');

	// wait fo 1 sec
	setTimeout(function () {
		// and set text via promise
		model1.text(new Promise(function (resolve, reject) {
			// now model1.text will be at pending state
			// wait 1 sec
			setTimeout(function () {
				// now it will be resolved with new text
				resolve('New text from Promise');
			}, 2000);
		}));
	}, 2000);
});
