import XRegExp from "xregexp";

import { seq, flatSeq, seqOf, toSeq, isSeq, atomic, subsequence, remove, head, tail, count, reverse, insertBefore } from "xvseq";

import { element, attribute, text, cdata, comment, processingInstruction, qname, isNode } from "xvnode";


export function analyzeString($str,$pat) {
	let pat = XRegExp.cache(atomic($pat),"g");
    return item($str).map(function(str){
    	var ret = Seq();
    	var index = 0;
    	XRegExp.replace(str,pat,function(... a){
    		var match = a.shift();
    		var str = a.pop();
    		var idx = a.pop();
    		// the rest is groups
    		if(idx > index) ret = ret.concat(element(seq("fn:non-match"),text(seq(str.substring(index,idx)))));
    		index = idx + match.length;
    		if(a.length > 0) {
    			var c = a.reduce(function(pre,_,i){
    				if(_ !== undefined) {
    					return pre.concat(element(seq("fn:group"),attribute(seq("nr"),seq(i+1+"")).concat(text(seq(_)))));
    				} else {
    					return pre;
    				}
    			},Seq());
    			var e = element(seq("fn:match"),c);
    			ret = ret.concat(e);
    		} else if(match) {
    			ret = ret.concat(element(seq("fn:match"),text(seq(match))));
    		}
    	});
    	if(index < str.length) ret = ret.concat(element(seq("fn:non-match"),text(seq(str.substr(index)))));
    	return  element(seq("fn:analyze-string-result"),ret);
    }).flatten(true);
}

export function tokenize($str,$pat) {
	let pat = XRegExp.cache(atomic($pat),"g");
    var ret = seq();
	item($str).forEach(function(str){
        if(str) {
            str.split(pat).forEach(s => {
                ret = ret.concat(String(s));
            });
        }
    });
    return ret;
}

export function substring($_,$a,$b) {
	return item($_).map(function(_) { return _.substring(atomic($a),atomic($b));});
}


export function concatenate($a,$b){
    return seqOf($a.concat($b).flatten(true).join(""));
}

export function stringToCodepoints($str){
	return Seq(atomic($str).split("")).map(a => a.codePointAt());
}

export function matches($str,$pat) {
    let pat = XRegExp.cache(atomic($pat),"g");
    var _cache;
    if(!matches._cache) matches._cache = new WeakMap();
    if(!matches._cache.has(pat)) {
        _cache = new Map();
        matches._cache.set(pat,_cache);
    } else {
        _cache = matches._cache.get(pat);
    }
	return $str.map(function(str){
    	str = isNode(str) ? str.data().toString() : convert(str,String);
    	if(str === undefined) return false;
        var ret;
        if(!_cache.has(str)){
            ret = str.match(pat) !== null;
            _cache.set(str,ret);
        } else {
            ret = _cache.get(str);
        }
        return ret;
    });
}

// TODO lazy
export function replace($str,$pat,$rep) {
    let pat = atomic($pat).valueOf();
    let rep = atomic($rep).valueOf();
    var rc = replace.repCache = replace.repCache ? replace.repCache : {};
    //var pc = replace.patCache = replace.patCache ? replace.patCache : {};
    if(!rc[rep]){
        rc[rep] = rep.replace(/(^|[^\\])\\\$/g,"$$$$").replace(/\\\\\$/g,"\\$$");
    }
    /*if(!pc[pat]){
        pc[pat] = XRegExp.cache(pat,"g");
    }*/
    var c = replace.cache ? replace.cache : new Map();
    replace.cache = c;
    var cc,cpc,ret;
	return $str.map(function(str){
        str = str.valueOf();
        if(!c.has(str)) {
            cc = new Map();
            c.set(str,cc);
        } else {
            cc = c.get(str);
        }
        if(!cc.has(pat)) {
            cpc = new Map();
            cc.set(pat,cpc);
        } else {
            cpc = cc.get(pat);
        }
        if(!cpc.has(rep)) {
            ret = XRegExp.replace(str,pat,rc[rep]);
            cpc.set(rep,ret);
        } else {
            ret = cpc.get(rep);
        }
        return ret;
    });
}


export function stringLength($_) {
	return item($_).map(function(_) {
        return _.length;
    });
}
