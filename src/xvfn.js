import {
    seq, toSeq,
    item, string, number, boolean, integer, double, float, decimal, data, QName,
    exactlyOne,
    _isSeq, _first, _isNode, _boolean
} from "xvtype";

import { error } from "xverr";

import { Parser } from "xvtree";

// TODO update when loader spec is solid
// TODO add easy access to a xhr / db module
import { readFile, readDir } from "./readfile";

const parser = new Parser();
const modules = {
    "http://www.w3.org/2005/xpath-functions":exports
};

export function module(location) {
    // conflict?
    //if (module.uri in modules) return;
    var module = require(location);
    modules[module.$uri] = module;
    return module;
}

function camelCase(str) {
    return str.split(/-/g).map((_,i) => i > 0 ? _.charAt(0).toUpperCase() + _.substr(1) : _).join("");
}

export function camelCase(str) {
    return str.split(/-/g).map((_,i) => i > 0 ? _.charAt(0).toUpperCase() + _.substr(1) : _).join("");
}

function functionLookup($name,$arity){
    var qname = _first($name);
    var arity = _first($arity);
    var uri = _first(qname._uri).toString();
    var name = camelCase(_first(qname._name).toString().split(/:/).pop());
    var fn = modules[uri][name+"$"+arity];
    if(!fn) fn = modules[uri][name+"$"];
    return !!fn ? seq(fn) : seq();
}

export function doc($file){
    var file = _first($file);
    return parse(readFile(file.valueOf()));
}

export function collection($uri) {
    var uri = _first($uri);
    return toSeq(readDir(uri)).map(file => doc(uri+"/"+file)).flatten(true);
}

export function parse($a){
    return string($a).map(function(xml){
        var result;
        parser.parseString(xml,function(err,ret){
            if(err) console.log(err);
            result = ret;
        });
        return result;
    });
}

export function name($a) {
	return $a.map(function(_){
        if(!_isNode(_)) throw new Error("This is not a node");
        return _.name();
	}).flatten(true);
}

export function position($_){
	return integer($_.position());
}

export function last($_){
	return integer($_.last());
}

export function not($_) {
	// TODO test for nodeseq and add error handling
	return seq(!_boolean($_));
}

export function apply($fn,$a) {
	var a = _first($a);
	if(!(a instanceof Array)){
		if(typeof a.toArray != "function") return error("");
	}
	return _first($fn).apply(this,a.toArray());
}

// FIXME check if seq + apply data
export function sort(...a){
    var l = a.length;
	return a[0].sort(l>1 ? _first(a[1]) : function(a,b){
        var gt = a.op(">",b).first();
        var lt = a.op("<",b).first();
		return gt ? 1 : lt ? -1 : 0;
	});
}

// TODO move back to xvtype
export function round($a) {
    let a = _first($a);
    if(!a) return integer(0);
	return integer(typeof a.round === "function" ? a.round() : Math.round(a));
}

export { error };

export * from "xvtype";
export * from "xvstring";
export * from "./booleans";
