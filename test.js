var assert = require('assert'),
    equal = require('deep-equal'),
    qsort = require('./'),
    d = describe;

var randomArray = [], randomObjectArray = [];
for (var i = 0; i < 10; i++) {
    var rand = (Math.random() * 1000) << 0;
    randomArray.push(rand);
    randomObjectArray.push(new Object({value: rand}));
}

var expectedArray = randomArray.slice(0);
expectedArray.sort(function(a,b) { return a-b; });

var expectedObjectArray = randomObjectArray.slice(0);
expectedObjectArray.sort(function(a,b) { return a.value-b.value; });

d('Sorting an array', function() {
    d('of random values', function() {
        var results = randomArray.slice(0);
        it('should be sorted correctly', function() {
            qsort(results);
            equal(results, expectedArray);
        });
    });
    d('of objects containing random values', function() {
        var results = randomObjectArray.slice(0);
        it('should be sorted correctly', function() {
            qsort(results, function(a,b) {
                return a.value-b.value;
            });
            equal(results, expectedObjectArray);
        });
    });
});

