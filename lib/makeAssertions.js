var grunt = require('grunt');
var chalk = require('chalk');

module.exports = function makeAssertions (averages) {
    var assertions = this.assertions;

    return Object.keys(assertions).reduce(function (failed, assertion) {
        var wanted = assertions[assertion];
        var got = averages[assertion].average;

        if (got <= wanted) {
            grunt.log.ok('Assertion passed for', assertion);
            grunt.log.writeln(chalk.gray('Wanted:'), wanted, chalk.gray('Got:'), got);
        }

        if (got >= wanted) {
            grunt.log.error('Assertion failed for', assertion);
            grunt.log.writeln(chalk.gray('Wanted:'), wanted, chalk.gray('Got:'), got);
            failed = true;
        }

        return failed;
    }, false);
};
