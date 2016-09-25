import { seq, flatSeq, seqOf, toSeq, isSeq, atomic, subsequence, remove, head, tail, count, reverse, insertBefore } from "xvseq";

import { isArray, isMap } from "xvtype";

import { analyzeString, tokenize, substring, concatenate, stringToCodepoints, matches, replace, stringLength } from "./strings";

import { forEach, filter, foldLeft, foldRight } from "./hof";

import { Parser } from "xvtree";

// TODO update when loader spec is solid
// TODO add easy access to a xhr / db module
import { readFile, readDir } from "./readfile";

const parser = new Parser();

export function error(type){
	throw new type();
}

export function doc($file){
    var file = atomic($file);
    return parse(readFile(file.valueOf()));
}

export function collection($uri) {
    var uri = atomic($uri);
    return Seq(readDir(uri)).map(file => doc(uri+"/"+file)).flatten(true);
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
        if(!isNode(_)) throw new Error("This is not a node");
        return _.name();
	}).flatten(true);
}


export function stringJoin($seq,$sep) {
	let sep = atomic($sep);
	return seqOf($seq.join(sep !== undefined ? sep : ""));
}

export function concat(... a){
    return seqOf(Seq(a).flatten(true).join(""));
}

Seq.prototype.getTextNode = function(){
	if(!this._isNode || this._type != 1) return seq();
	return this.filter(function(_){
		if(!isNode(_)) throw new TypeError("Sequence cannot be converted into a node set.");
		return _._type === 3;
	});
};

Seq.prototype.data = function(){
	let t = this._type;
	var r;
	if(t===1) {
		let n = this.getTextNode();
		r = n.get(0);
	} else if(t===2) {
		r = this.get(0);
	} else if(t===3) {
		r = this.get(0);
	}
    //console.log(r)
	return r;
};

var deepEqual = Seq.prototype.equals;

Seq.prototype.equals = function(other) {
	if(!this._isNode) return deepEqual.call(this,other);
	return this.data().equals(other);
};

export function data($a){
	return $a.map(function(n){
		return n.data();
	});
}

function strFromNode(node,fltr) {
    if(node._string) {
        return node._string;
    }
    var ret;
	let type = node._type;
	if(fltr && type === fltr) return undefined;
	if(type===3) {
		ret = node.get(0);
	} else if(type===2) {
		ret = node.get(1);
	} else if(type===1){
		ret = node.map(function(_){
			return strFromNode(_,2);
		}).flatten(true).filter(function(_){
			return _ !== undefined;
		}).join("");
	}
    node._string = ret;
    return ret;
}

export function string($a){
	return item($a).map(function(_){
		if(isNode(_)){
			return strFromNode(_);
		} else {
			return _.toString();
		}
	}).flatten(true);
}

export function text($a){
	return $a.map(n => n.getTextNode());
}

export function position($_){
	return integer($_._position + 1);
}

export function last($_){
	return integer($_._count);
}

export function not($_) {
	// TODO test for nodeseq and add error handling
	return $_.map(function(_){
        return !_;
    });
}

export function apply($fn,$a) {
	var a = atomic($a);
	if(!(a instanceof Array)){
		if(typeof a.toArray != "function") return error("")
	}
	return atomic($fn).apply(this,a);
}

// FIXME check if seq + apply data
export function sort(...a){
    var l = a.length;
	return a[0].sort(l>1 ? atomic(a[1]) : function(a,b){
        var gt = a.op(">",b).first();
        var lt = a.op("<",b).first();
		return gt ? 1 : lt ? -1 : 0;
	});
}

export function boolean($a) {
	var a = $a.first();
	if(isNode(a)){
		return seqOf(true);
	} else {
		if($a.count() > 1){
			return error("err:FORG0006");
		} else {
			return seqOf(!!a);
		}
	}
}

export function round($a) {
	if($a.count()>1) return error("err:XPTY0004","Cardinality doesn't match function signature");
	return seqOf(atomic(a).round());
}

export const booleans = {
	true:function(){
		return seqOf(true);
	},
	false:function(){
		return seqOf(false);
	}
};

export { subsequence, remove, head, tail, count, reverse, insertBefore, forEach, filter, foldLeft, foldRight };
