/* eslint-env node, mocha */
var assert = require('assert');
require.main.require('PyFormatJS.js');

describe('PyFormatJS', function() {
	describe('Replacing', function() {
		it('Test simple automatic field numbering', function() {
			assert.strictEqual("Test {}".pyformat('format'), "Test format");
		});
		it('Test simple manual field specification', function() {
			assert.strictEqual(
				"Test {1} {0}".pyformat('format', 'PyFormatJS'),
				"Test PyFormatJS format"
			);
		});
		it('Test multiple replacement of same argument', function() {
			assert.strictEqual(
				"Test {0} {0}".pyformat('format'),
				"Test format format"
			);
		});
		it('Test escaped brackets', function() {
			assert.strictEqual("Test {{0}}".pyformat('format'), "Test {0}");
		});
		it('Test conversion of types', function() {
			assert.strictEqual("Test {0} {1}".pyformat(1, 1.5), "Test 1 1.5");
		});
		it('Test named arguments', function() {
			assert.strictEqual(
				"This is {script}".pyformat({script: "PyFormatJS"}),
				"This is PyFormatJS"
			);
		});
		it('Test mixing all types of arguments', function() {
			assert.strictEqual(
				"{team2} ({1} : {0}) {team1}".pyformat(20, 15, {
					team1: "Atlanta Hawks",
					team2: "Boston Celtics"
				}),
				"Boston Celtics (15 : 20) Atlanta Hawks"
			);
		});
	});
	describe('Exceptions', function() {
		it('Test mixed specifications throw ValueError', function() {
			assert.throws(
				() => "Test {} {0}".pyformat('PyFormatJS', 'format'),
				(err) => {
					let expected_msg = "Cannot switch between automatic " +
						"field numbering and manual field specification";

					if (
						err.name === "ValueError" &&
						err.message === expected_msg
					) {
						return true;
					}
				}
			);
		});
		it('Test invalid escaping throws ValueError', function() {
			assert.throws(
				() => "Test {{}".pyformat('format'),
				(err) => {
					let expected_msg = "Single '}' encountered in format string";

					if (
						err.name === "ValueError" &&
						err.message === expected_msg
					) {
						return true;
					}
				}
			);
		});
		it('Test missing index argument throws IndexError', function() {
			assert.throws(
				() => "Test {}".pyformat(),
				(err) => {
					let expected_msg = "Missing argument for replacement field 0";

					if (
						err.name === "IndexError" &&
						err.message === expected_msg
					) {
						return true;
					}
				}
			);
		});
		it('Test missing key argument throws KeyError', function() {
			assert.throws(
				() => "Test {script}".pyformat(),
				(err) => {
					let expected_msg = "Missing key 'script'";

					if (
						err.name === "KeyError" &&
						err.message === expected_msg
					) {
						return true;
					}
				}
			);
		});
	});
});
