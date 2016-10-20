"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.error = undefined;
exports.doc = doc;
exports.collection = collection;
exports.parse = parse;
exports.name = name;
exports.position = position;
exports.last = last;
exports.not = not;
exports.apply = apply;
exports.sort = sort;
exports.round = round;

var _xvtype = require("xvtype");

Object.keys(_xvtype).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _xvtype[key];
    }
  });
});

var _xvstring = require("xvstring");

Object.keys(_xvstring).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _xvstring[key];
    }
  });
});

var _booleans = require("./booleans");

Object.keys(_booleans).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _booleans[key];
    }
  });
});

var _xverr = require("xverr");

var _xvtree = require("xvtree");

var _readfile = require("./readfile");

var parser = new _xvtree.Parser();

// TODO update when loader spec is solid
// TODO add easy access to a xhr / db module
function doc($file) {
  var file = (0, _xvtype._first)($file);
  return parse((0, _readfile.readFile)(file.valueOf()));
}

function collection($uri) {
  var uri = (0, _xvtype._first)($uri);
  return (0, _xvtype.toSeq)((0, _readfile.readDir)(uri)).map(function (file) {
    return doc(uri + "/" + file);
  }).flatten(true);
}

function parse($a) {
  return (0, _xvtype.string)($a).map(function (xml) {
    var result;
    parser.parseString(xml, function (err, ret) {
      if (err) console.log(err);
      result = ret;
    });
    return result;
  });
}

function name($a) {
  return $a.map(function (_) {
    if (!(0, _xvtype._isNode)(_)) throw new Error("This is not a node");
    return _.name();
  }).flatten(true);
}

function position($_) {
  return (0, _xvtype.integer)($_.position());
}

function last($_) {
  return (0, _xvtype.integer)($_.last());
}

function not($_) {
  // TODO test for nodeseq and add error handling
  return (0, _xvtype.seq)(!(0, _xvtype._boolean)($_));
}

function apply($fn, $a) {
  var a = (0, _xvtype._first)($a);
  if (!(a instanceof Array)) {
    if (typeof a.toArray != "function") return (0, _xverr.error)("");
  }
  return (0, _xvtype._first)($fn).apply(this, a);
}

// FIXME check if seq + apply data
function sort() {
  for (var _len = arguments.length, a = Array(_len), _key = 0; _key < _len; _key++) {
    a[_key] = arguments[_key];
  }

  var l = a.length;
  return a[0].sort(l > 1 ? (0, _xvtype._first)(a[1]) : function (a, b) {
    var gt = a.op(">", b).first();
    var lt = a.op("<", b).first();
    return gt ? 1 : lt ? -1 : 0;
  });
}

// TODO move back to xvtype
function round($a) {
  $a = (0, _xvtype.exactlyOne)($a);
  if ($a instanceof Error) return $a;
  var a = (0, _xvtype._first)($a);
  if (!a) return (0, _xvtype.seq)();
  return (0, _xvtype.seq)(typeof a.round === "function" ? a.round() : Math.round(a));
}

exports.error = _xverr.error;