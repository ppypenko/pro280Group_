"use strict";
var Decimal = require('decimal.js');

function factorial(n) {
    var i = 1,
        r = new Decimal(1);

    for (i = 1; i <= n; i += 1) {
        r = r.times(i);
    }
    return r;
}
exports.PI = function (digits) {
    Decimal.precision = digits + 2;

    // The number of decimal digits the algorithm generates per iteration.
    var digits_per_iteration = 14.1816474627254776555,
        iterations = (digits / digits_per_iteration) + 1,
        a = new Decimal(13591409),
        b = new Decimal(545140134),
        c = new Decimal(-640320),
        numerator,
        denominator,
        sum = new Decimal(0),
        k = 0;

    for (k = 0; k < iterations; k += 1) {

        // (6k)! * (13591409 + 545140134k)
        numerator = factorial(6 * k).times(a.plus(b.times(k)));

        // (3k)! * (k!)^3 * -640320^(3k)
        denominator = factorial(3 * k).times(factorial(k).pow(3)).times(c.pow(3 * k));

        sum = sum.plus(numerator.div(denominator));
    }

    // pi = ( sqrt(10005) * 426880 ) / sum
    return Decimal.sqrt(10005).times(426880).div(sum).toSD(digits);
};