var fn = require("../lib/xvfn");

var seq = require("xvseq").seq;

console.log(fn.stringJoin(fn.parse(`<root><bla id="1">test</bla></root>`)));

console.log(fn.round(seq(12.4)));

console.log(fn.functionLookup(fn.QName("http://www.w3.org/2005/xpath-functions","round"),1));
