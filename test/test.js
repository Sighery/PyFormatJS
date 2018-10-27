var assert = require('assert');
require('../PyFormatJS.js');

describe('PyFormat', function() {
	it('formats simple format string with an automatic numbering field', function() {
		var formatted = "Test {}".pyformat("format");
		assert.equal(formatted, "Test format");
	});
});
