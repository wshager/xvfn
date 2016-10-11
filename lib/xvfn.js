"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringLength = exports.replace = exports.matches = exports.codepointsToString = exports.stringToCodepoints = exports.substring = exports.tokenize = exports.analyzeString = exports.concat = exports.stringJoin = exports.error = exports.foldRight = exports.foldLeft = exports.filter = exports.forEach = exports.insertBefore = exports.reverse = exports.count = exports.tail = exports.head = exports.remove = exports.subsequence = exports.booleans = undefined;
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

var _xverr = require("xverr");

var _xvstring = require("xvstring");

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
  return (0, _xvtype.integer)($_._position + 1);
}

function last($_) {
  return (0, _xvtype.integer)($_._position);
}

function not($_) {
  // TODO test for nodeseq and add error handling
  return $_.map(function (_) {
    return !_;
  });
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

function round($a) {
  if ($a.size > 1) return (0, _xverr.error)("err:XPTY0004", "Cardinality doesn't match function signature");
  return (0, _xvtype.seqOf)((0, _xvtype._first)(a).round());
}

var booleans = exports.booleans = {
  true: function _true() {
    return (0, _xvtype.seqOf)(true);
  },
  false: function _false() {
    return (0, _xvtype.seqOf)(false);
  }
};

exports.subsequence = _xvtype.subsequence;
exports.remove = _xvtype.remove;
exports.head = _xvtype.head;
exports.tail = _xvtype.tail;
exports.count = _xvtype.count;
exports.reverse = _xvtype.reverse;
exports.insertBefore = _xvtype.insertBefore;
exports.forEach = _xvtype.forEach;
exports.filter = _xvtype.filter;
exports.foldLeft = _xvtype.foldLeft;
exports.foldRight = _xvtype.foldRight;
exports.error = _xverr.error;
exports.stringJoin = _xvstring.stringJoin;
exports.concat = _xvstring.concat;
exports.analyzeString = _xvstring.analyzeString;
exports.tokenize = _xvstring.tokenize;
exports.substring = _xvstring.substring;
exports.stringToCodepoints = _xvstring.stringToCodepoints;
exports.codepointsToString = _xvstring.codepointsToString;
exports.matches = _xvstring.matches;
exports.replace = _xvstring.replace;
exports.stringLength = _xvstring.stringLength;