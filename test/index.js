var xvfn = require("../lib/xvfn");

var xvseq = require("xvseq");

console.log(xvfn.stringJoin(xvfn.parse(`<root><bla id="1">test</bla></root>`)));
