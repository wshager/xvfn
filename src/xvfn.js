import {
    seq, seqOf, toSeq,
    subsequence, remove, head, tail, count, reverse, insertBefore,
    filter, forEach, foldLeft, foldRight,
    item, string, number, boolean, integer, double, float, decimal, data,
    _isSeq, _first, _isNode
} from "xvtype";

import { error } from "xverr";

import { stringJoin, concat, analyzeString, tokenize, substring, stringToCodepoints, codepointsToString, matches, replace, stringLength } from "xvstring";

import { Parser } from "xvtree";

// TODO update when loader spec is solid
// TODO add easy access to a xhr / db module
import { readFile, readDir } from "./readfile";

const parser = new Parser();

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
	return integer($_._position + 1);
}

export function last($_){
	return integer($_._position);
}

export function not($_) {
	// TODO test for nodeseq and add error handling
	return $_.map(function(_){
        return !_;
    });
}

export function apply($fn,$a) {
	var a = _first($a);
	if(!(a instanceof Array)){
		if(typeof a.toArray != "function") return error("");
	}
	return _first($fn).apply(this,a);
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

export function round($a) {
	if($a.size>1) return error("err:XPTY0004","Cardinality doesn't match function signature");
	return seqOf(_first(a).round());
}

export const booleans = {
	true:function(){
		return seqOf(true);
	},
	false:function(){
		return seqOf(false);
	}
};

export {
    subsequence, remove, head, tail, count, reverse, insertBefore, forEach, filter, foldLeft, foldRight, error,
    stringJoin, concat, analyzeString, tokenize, substring, stringToCodepoints, codepointsToString, matches, replace, stringLength
};
