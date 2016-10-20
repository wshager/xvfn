var fn = require("../lib/xvfn");

var seq = require("xvseq").seq;

console.log(fn.stringJoin(fn.parse(`<root><bla id="1">test</bla></root>`)));

console.log(fn.round(seq(0.4)));
