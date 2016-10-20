"use strict";

var _xvtype = require("xvtype");

var booleans = {
	true: function _true() {
		return _xvtype.boolean(true);
	},
	false: function _false() {
		return _xvtype.boolean(false);
	}
};

exports.true = booleans.true;
exports.false = booleans.false;