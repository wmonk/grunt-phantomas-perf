var grunt = require('grunt');
var chalk = require('chalk');

module.exports = function makeAssertions (averages) {
    grunt.log.writeln('');
    grunt.log.writeln('Analysing ' + chalk.bold(this.url));
    var assertions = this.assertions;

    return Object.keys(assertions).reduce(function (failed, assertion) {
        var wanted = assertions[assertion];
        var got = averages[assertion].average;
        var raw = averages[assertion].raw;

        if (got <= wanted) {
            grunt.log.writeln('');
            grunt.log.ok('\nAssertion passed for', assertion);
            grunt.log.writeln(chalk.gray('Wanted:'), wanted, chalk.gray('Got:'), got, chalk.gray('    Results:', raw.join(', ')));
        }

        if (got >= wanted) {
            grunt.log.writeln('');
            grunt.log.error('\nAssertion failed for', assertion);
            grunt.log.writeln(chalk.gray('Wanted:'), wanted, chalk.gray('Got:'), got, chalk.gray('    Results:', raw.join(', ')));
            failed = true;
        }

        return failed;
    }, false);
};
