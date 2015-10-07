'use strict';

var ko = require('knockout');
ko.extenders.promise = require('../lib')(ko);

ko.extenders.logChange = function(target, option) {
	console.log(option + ": ", target.peek());
	target.subscribe(function(newValue) {
		console.log(option + ": ", newValue);
	});
	return target;
};

document.addEventListener('DOMContentLoaded', function () {
	var model1 = {
		text: ko.observable(new Promise(function (resolve, reject) {
			setTimeout(resolve, 1000, 'resolved text');
		})).extend({promise: true})
	};

	// model1.text = ko.pureComputed(function () {
	// 	return model1.textPromise();
	// }).extend({promise: true});

	window.model1 = model1;

	// console.log(model1.text());
	model1.text.subscribe(console.log.bind(console, 'changed text'));
	model1.text(new Promise(function (resolve) {
		setTimeout(resolve, 2000, 'another text');
	}));

	ko.applyBindings(model1, document.getElementById('example-1'));
});
