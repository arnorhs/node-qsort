var qsort = require('./'),
    bnch = require('bnch');

var arr = [];
for (var i = 0; i < 10000; i++) {
    arr.push((Math.random() * 10000) << 0);
}

var suite = bnch();

suite.beforeEach(function() {
    return arr.slice(0);
});

suite.add("Normal sort", function(arr) {
    arr.sort(function(a,b) { return a-b; });
});

suite.add("qsort", function(arr) {
    qsort(arr, function(a,b) { return a-b; });
});

