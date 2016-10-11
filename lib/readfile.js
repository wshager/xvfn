'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.readFile = readFile;
exports.readDir = readDir;

var _fs = require('fs');

function readFile(file) {
	return (0, _fs.readFileSync)(file, 'utf-8', function (err, doc) {
		if (err) throw new Error(err);
		return doc;
	});
}

function readDir(uri) {
	return (0, _fs.readdirSync)(uri, 'utf-8', function (err, data) {
		if (err) console.error(err);
	});
}