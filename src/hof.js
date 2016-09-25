function wrap($fn,count){
	return function (_,i,$a){
		var $_ = item(_);
		var $i = Seq.of(i);
		$_._position = i;
		$_._count = count;
		var $v = $fn($_,$i,$a);
        //console.log(_,atomic($v));
		return atomic($v);
	};
}

function wrapReduce($fn,count){
	return function (pre,cur,i,$a){
		var $pre = Seq.of(pre);
		var $cur = Seq.of(cur);
		var $i = Seq.of(i);
		$cur._position = i;
		$cur._count = count;
		var $v = $fn($pre,$cur,$i,$a);
		return atomic($v);
	};
}

export function filter($seq,$fn) {
    let fn = atomic($fn);
    if(typeof fn != "function") {
        if(typeof fn != "function") {
    		return $seq.filter(function() {
    			return fn;
    		});
    	}
    }
	return $seq.filter(wrap(fn,$seq.count()));
}

export function forEach($seq,$fn){
	var fn = atomic($fn);
	if(typeof fn != "function") {
		return $seq.map(function() {
			return fn;
		});
	}
	return $seq.map(wrap(fn,$seq.count()));
}

export function foldLeft($seq,$init,$fn){
	return seqOf($seq.reduce(wrapReduce(atomic($fn),$seq.count()),atomic($init)));//;
}

export function foldRight($seq,$init,$fn){
	return seqOf($seq.reduceRight(wrapReduce(atomic($fn),$seq.count()),atomic($init)));//;
}
