'use strict';

var gulp = require('gulp');

gulp.task('default', ['build:example']);

gulp.task('build:example', function () {
	var webpack = require('webpack');

	return new Promise(function (resolve, reject) {
		webpack({
			entry: './examples/examples.js',
			output: {
				path: './examples',
				filename: 'examples.pack.js'
			}
		}, function (err, stats) {
			if (err) {
				return reject(err);
			}

			var errors = stats.compilation.errors;

			if (errors.length > 0) {
				return reject(errors[0]);
			}

			return resolve();
		})
	});
});
